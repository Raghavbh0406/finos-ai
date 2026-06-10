document.addEventListener("DOMContentLoaded", loadExpenses);
let editingId = null;

async function loadExpenses() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    try {
        const expenses = await fetch("/api/expenses", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
        const tbody = document.querySelector("#expenseTable tbody");
        tbody.innerHTML = "";
        if (!expenses.length) { tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748b;padding:24px;">No expenses yet. Add one above!</td></tr>'; return; }
        expenses.forEach(e => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${e.title}</strong></td>
                <td style="color:#dc2626;font-weight:600;">₹${Number(e.amount).toLocaleString("en-IN")}</td>
                <td><span class="badge badge-blue">${e.category}</span></td>
                <td style="color:#64748b;">${e.date || "—"}</td>
                <td style="display:flex;gap:6px;">
                    <button class="btn btn-warning" onclick="editExpense(${e.id})">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="deleteExpense(${e.id})">🗑 Delete</button>
                </td>`;
            tbody.appendChild(row);
        });
    } catch (err) { console.error(err); }
}

async function addExpense() {
    const token = localStorage.getItem("token");
    const expense = {
        title: document.getElementById("title").value,
        amount: Number(document.getElementById("amount").value),
        category: document.getElementById("category").value,
        date: new Date().toISOString().split("T")[0]
    };
    if (!expense.title || !expense.amount) { alert("Please fill in title and amount."); return; }
    try {
        const url = editingId ? "/api/expenses/" + editingId : "/api/expenses";
        const method = editingId ? "PUT" : "POST";
        await fetch(url, { method, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify(expense) });
        editingId = null;
        document.getElementById("title").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("category").value = "";
        loadExpenses();
    } catch (err) { alert("Failed to save expense."); }
}

async function editExpense(id) {
    const token = localStorage.getItem("token");
    const expense = await fetch("/api/expenses/" + id, { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
    editingId = id;
    document.getElementById("title").value = expense.title;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("category").value = expense.category;
    document.getElementById("title").focus();
}

async function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return;
    const token = localStorage.getItem("token");
    await fetch("/api/expenses/" + id, { method: "DELETE", headers: { "Authorization": "Bearer " + token } });
    loadExpenses();
}