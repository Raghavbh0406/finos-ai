document.addEventListener("DOMContentLoaded", () => { if (checkTokenExpiry()) loadIncome(); });
let editingId = null;

async function loadIncome() {
    const token = localStorage.getItem("token");
    const tbody = document.querySelector("#incomeTable tbody");
    tbody.innerHTML = skeletonRows(3, 4);
    try {
        const list = await fetch("/api/income", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
        tbody.innerHTML = "";
        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="4">${emptyState("💰", "No income recorded", "Add your salary, freelance or other income sources.", "➕ Add Income", "#")}</td></tr>`;
            return;
        }
        list.forEach(i => {
            tbody.innerHTML += `<tr>
                <td><strong>${i.source}</strong></td>
                <td style="color:#16a34a;font-weight:600;">₹${Number(i.amount).toLocaleString("en-IN")}</td>
                <td style="color:#64748b;">${i.date || "—"}</td>
                <td style="display:flex;gap:6px;">
                    <button class="btn btn-warning" onclick="editIncome(${i.id})">✏️ Edit</button>
                    <button class="btn btn-danger"  onclick="confirmDelete(${i.id})">🗑 Delete</button>
                </td></tr>`;
        });
    } catch { tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#dc2626;padding:20px;">Failed to load income.</td></tr>`; }
}

async function addIncome() {
    const token  = localStorage.getItem("token");
    const source = document.getElementById("source").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const date   = document.getElementById("date").value;
    if (!source || !amount || !date) { showToast("Please fill in all fields.", "warning"); return; }
    try {
        const url    = editingId ? "/api/income/" + editingId : "/api/income";
        const method = editingId ? "PUT" : "POST";
        await fetch(url, { method, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify({ source, amount, date }) });
        showToast(editingId ? "Income updated!" : "Income added!", "success");
        editingId = null;
        document.getElementById("source").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("date").value   = "";
        document.querySelector(".btn-primary").textContent = "💾 Save Income";
        loadIncome();
    } catch { showToast("Failed to save income.", "error"); }
}

async function editIncome(id) {
    const token = localStorage.getItem("token");
    const list  = await fetch("/api/income", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
    const income = list.find(i => i.id === id);
    editingId = id;
    document.getElementById("source").value = income.source;
    document.getElementById("amount").value = income.amount;
    document.getElementById("date").value   = income.date;
    document.querySelector(".btn-primary").textContent = "💾 Update Income";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function confirmDelete(id) { showConfirm("This income record will be permanently deleted.", () => deleteIncome(id)); }

async function deleteIncome(id) {
    const token = localStorage.getItem("token");
    try {
        await fetch("/api/income/" + id, { method: "DELETE", headers: { "Authorization": "Bearer " + token } });
        showToast("Income deleted.", "success");
        loadIncome();
    } catch { showToast("Failed to delete income.", "error"); }
}