document.addEventListener("DOMContentLoaded", () => { if (checkTokenExpiry()) loadBudgets(); });
let editingId = null;

async function loadBudgets() {
    const token = localStorage.getItem("token");
    const tbody = document.querySelector("#budgetTable tbody");
    tbody.innerHTML = skeletonRows(3, 3);
    try {
        const budgets = await fetch("/api/budgets", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
        tbody.innerHTML = "";
        if (!budgets.length) {
            tbody.innerHTML = `<tr><td colspan="3">${emptyState("📋", "No budgets set", "Set spending limits by category to stay on track.", "➕ Add Budget", "#")}</td></tr>`;
            return;
        }
        budgets.forEach(b => {
            tbody.innerHTML += `<tr>
                <td><span class="badge badge-purple">${b.category}</span></td>
                <td style="font-weight:600;">₹${Number(b.limitAmount).toLocaleString("en-IN")}</td>
                <td style="display:flex;gap:6px;">
                    <button class="btn btn-warning" onclick="editBudget(${b.id})">✏️ Edit</button>
                    <button class="btn btn-danger"  onclick="confirmDelete(${b.id})">🗑 Delete</button>
                </td></tr>`;
        });
    } catch { tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#dc2626;padding:20px;">Failed to load budgets.</td></tr>`; }
}

async function saveBudget() {
    const token    = localStorage.getItem("token");
    const category = document.getElementById("category").value.trim();
    const limit    = Number(document.getElementById("limitAmount").value);
    if (!category || !limit) { showToast("Please fill in category and limit.", "warning"); return; }
    try {
        const url    = editingId ? "/api/budgets/" + editingId : "/api/budgets";
        const method = editingId ? "PUT" : "POST";
        await fetch(url, { method, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify({ category, limitAmount: limit }) });
        showToast(editingId ? "Budget updated!" : "Budget saved!", "success");
        editingId = null;
        document.getElementById("category").value   = "";
        document.getElementById("limitAmount").value = "";
        document.querySelector(".btn-primary").textContent = "💾 Save Budget";
        loadBudgets();
    } catch { showToast("Failed to save budget.", "error"); }
}

async function editBudget(id) {
    const token  = localStorage.getItem("token");
    const budget = await fetch("/api/budgets/" + id, { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
    editingId = id;
    document.getElementById("category").value    = budget.category;
    document.getElementById("limitAmount").value = budget.limitAmount;
    document.querySelector(".btn-primary").textContent = "💾 Update Budget";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function confirmDelete(id) { showConfirm("This budget will be permanently deleted.", () => deleteBudget(id)); }

async function deleteBudget(id) {
    const token = localStorage.getItem("token");
    try {
        await fetch("/api/budgets/" + id, { method: "DELETE", headers: { "Authorization": "Bearer " + token } });
        showToast("Budget deleted.", "success");
        loadBudgets();
    } catch { showToast("Failed to delete budget.", "error"); }
}