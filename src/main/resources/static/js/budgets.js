document.addEventListener("DOMContentLoaded", loadBudgets);
let editingId = null;

async function loadBudgets() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    const budgets = await fetch("/api/budgets", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
    const tbody = document.querySelector("#budgetTable tbody");
    tbody.innerHTML = "";
    if (!budgets.length) { tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#64748b;padding:24px;">No budgets yet. Add one above!</td></tr>'; return; }
    budgets.forEach(b => {
        tbody.innerHTML += `<tr>
            <td><span class="badge badge-purple">${b.category}</span></td>
            <td style="font-weight:600;">₹${Number(b.limitAmount).toLocaleString("en-IN")}</td>
            <td style="display:flex;gap:6px;">
                <button class="btn btn-warning" onclick="editBudget(${b.id})">✏️ Edit</button>
                <button class="btn btn-danger" onclick="deleteBudget(${b.id})">🗑 Delete</button>
            </td></tr>`;
    });
}

async function saveBudget() {
    const token = localStorage.getItem("token");
    const budget = {
        category: document.getElementById("category").value,
        limitAmount: Number(document.getElementById("limitAmount").value)
    };
    if (!budget.category || !budget.limitAmount) { alert("Please fill in category and limit."); return; }
    const url = editingId ? "/api/budgets/" + editingId : "/api/budgets";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify(budget) });
    editingId = null;
    document.getElementById("category").value = "";
    document.getElementById("limitAmount").value = "";
    loadBudgets();
}

async function editBudget(id) {
    const token = localStorage.getItem("token");
    const budget = await fetch("/api/budgets/" + id, { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
    editingId = id;
    document.getElementById("category").value = budget.category;
    document.getElementById("limitAmount").value = budget.limitAmount;
    document.getElementById("category").focus();
}

async function deleteBudget(id) {
    if (!confirm("Delete this budget?")) return;
    const token = localStorage.getItem("token");
    await fetch("/api/budgets/" + id, { method: "DELETE", headers: { "Authorization": "Bearer " + token } });
    loadBudgets();
}