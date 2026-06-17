document.addEventListener("DOMContentLoaded", () => { if (checkTokenExpiry()) loadExpenses(); });
let editingId = null;

async function loadExpenses() {
    const token = localStorage.getItem("token");
    const tbody = document.querySelector("#expenseTable tbody");
    tbody.innerHTML = skeletonRows(3, 5);
    try {
        const expenses = await fetch("/api/expenses", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
        tbody.innerHTML = "";
        if (!expenses.length) {
            tbody.innerHTML = `<tr><td colspan="5">${emptyState("💸", "No expenses yet", "Start tracking your spending by adding your first expense.", "➕ Add Expense", "#")}</td></tr>`;
            return;
        }
        expenses.forEach(e => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${e.title}</strong></td>
                <td style="color:#dc2626;font-weight:600;">₹${Number(e.amount).toLocaleString("en-IN")}</td>
                <td><span class="badge badge-blue">${e.category}</span></td>
                <td style="color:#64748b;">${e.date || "—"}</td>
                <td style="display:flex;gap:6px;">
                    <button class="btn btn-warning" onclick="editExpense(${e.id})">✏️ Edit</button>
                    <button class="btn btn-danger"  onclick="confirmDelete(${e.id})">🗑 Delete</button>
                </td>`;
            tbody.appendChild(row);
        });
    } catch(err) { tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#dc2626;padding:20px;">Failed to load expenses.</td></tr>`; }
}

async function addExpense() {
    const token    = localStorage.getItem("token");
    const title    = document.getElementById("title").value.trim();
    const amount   = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value.trim();
    if (!title || !amount || !category) { showToast("Please fill in all fields.", "warning"); return; }
    const expense  = { title, amount, category, date: new Date().toISOString().split("T")[0] };
    try {
        const url    = editingId ? "/api/expenses/" + editingId : "/api/expenses";
        const method = editingId ? "PUT" : "POST";
        const res    = await fetch(url, { method, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify(expense) });
        if (!res.ok) throw new Error();
        showToast(editingId ? "Expense updated!" : "Expense added!", "success");
        editingId = null;
        document.getElementById("title").value    = "";
        document.getElementById("amount").value   = "";
        document.getElementById("category").value = "";
        document.querySelector(".btn-primary").textContent = "💾 Save Expense";
        loadExpenses();
    } catch { showToast("Failed to save expense.", "error"); }
}

async function editExpense(id) {
    const token = localStorage.getItem("token");
    const expense = await fetch("/api/expenses/" + id, { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
    editingId = id;
    document.getElementById("title").value    = expense.title;
    document.getElementById("amount").value   = expense.amount;
    document.getElementById("category").value = expense.category;
    document.querySelector(".btn-primary").textContent = "💾 Update Expense";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function confirmDelete(id) {
    showConfirm("This expense will be permanently deleted.", () => deleteExpense(id));
}

async function deleteExpense(id) {
    const token = localStorage.getItem("token");
    try {
        await fetch("/api/expenses/" + id, { method: "DELETE", headers: { "Authorization": "Bearer " + token } });
        showToast("Expense deleted.", "success");
        loadExpenses();
    } catch { showToast("Failed to delete expense.", "error"); }
}