document.addEventListener("DOMContentLoaded", () => { if (checkTokenExpiry()) loadGoals(); });
let editingId = null;

async function loadGoals() {
    const token = localStorage.getItem("token");
    const tbody = document.querySelector("#goalTable tbody");
    tbody.innerHTML = skeletonRows(3, 5);
    try {
        const goals = await fetch("/api/savings-goals", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
        tbody.innerHTML = "";
        if (!goals.length) {
            tbody.innerHTML = `<tr><td colspan="5">${emptyState("🎯", "No savings goals yet", "Set a target — emergency fund, vacation, gadget — and track progress.", "➕ Add Goal", "#")}</td></tr>`;
            return;
        }
        goals.forEach(g => {
            const pct = g.targetAmount > 0 ? Math.min((g.savedAmount / g.targetAmount) * 100, 100) : 0;
            const col = pct >= 75 ? "#16a34a" : pct >= 40 ? "#f59e0b" : "#2563eb";
            tbody.innerHTML += `<tr>
                <td><strong>${g.goalName}</strong></td>
                <td>₹${Number(g.targetAmount).toLocaleString("en-IN")}</td>
                <td style="color:#16a34a;font-weight:600;">₹${Number(g.savedAmount).toLocaleString("en-IN")}</td>
                <td style="min-width:140px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <div class="progress-bar" style="flex:1;"><div class="progress-fill" style="width:${pct}%;background:${col};"></div></div>
                        <span style="font-size:12px;font-weight:600;color:${col};width:36px;">${pct.toFixed(0)}%</span>
                    </div>
                </td>
                <td style="display:flex;gap:6px;">
                    <button class="btn btn-warning" onclick="editGoal(${g.id})">✏️ Edit</button>
                    <button class="btn btn-danger"  onclick="confirmDelete(${g.id})">🗑 Delete</button>
                </td></tr>`;
        });
    } catch { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#dc2626;padding:20px;">Failed to load goals.</td></tr>`; }
}

async function saveGoal() {
    const token  = localStorage.getItem("token");
    const goal   = {
        goalName:     document.getElementById("goalName").value.trim(),
        targetAmount: Number(document.getElementById("targetAmount").value),
        savedAmount:  Number(document.getElementById("savedAmount").value)
    };
    if (!goal.goalName || !goal.targetAmount) { showToast("Please fill in goal name and target.", "warning"); return; }
    try {
        const url    = editingId ? "/api/savings-goals/" + editingId : "/api/savings-goals";
        const method = editingId ? "PUT" : "POST";
        await fetch(url, { method, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify(goal) });
        showToast(editingId ? "Goal updated!" : "Goal saved!", "success");
        editingId = null;
        document.getElementById("goalName").value     = "";
        document.getElementById("targetAmount").value = "";
        document.getElementById("savedAmount").value  = "";
        document.querySelector(".btn-primary").textContent = "💾 Save Goal";
        loadGoals();
    } catch { showToast("Failed to save goal.", "error"); }
}

async function editGoal(id) {
    const token = localStorage.getItem("token");
    const goal  = await fetch("/api/savings-goals/" + id, { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
    editingId = id;
    document.getElementById("goalName").value     = goal.goalName;
    document.getElementById("targetAmount").value = goal.targetAmount;
    document.getElementById("savedAmount").value  = goal.savedAmount;
    document.querySelector(".btn-primary").textContent = "💾 Update Goal";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function confirmDelete(id) { showConfirm("This savings goal will be permanently deleted.", () => deleteGoal(id)); }

async function deleteGoal(id) {
    const token = localStorage.getItem("token");
    try {
        await fetch("/api/savings-goals/" + id, { method: "DELETE", headers: { "Authorization": "Bearer " + token } });
        showToast("Goal deleted.", "success");
        loadGoals();
    } catch { showToast("Failed to delete goal.", "error"); }
}