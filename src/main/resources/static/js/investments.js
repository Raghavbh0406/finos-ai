document.addEventListener("DOMContentLoaded", () => { if (checkTokenExpiry()) loadInvestments(); });
let editingId = null;

async function loadInvestments() {
    const token = localStorage.getItem("token");
    const tbody = document.querySelector("#investmentTable tbody");
    tbody.innerHTML = skeletonRows(3, 6);
    try {
        const investments = await fetch("/api/investments", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
        tbody.innerHTML = "";
        if (!investments.length) {
            tbody.innerHTML = `<tr><td colspan="6">${emptyState("📈", "No investments yet", "Start tracking your portfolio — mutual funds, stocks, FDs and more.", "➕ Add Investment", "#")}</td></tr>`;
            return;
        }
        investments.forEach(i => {
            const gain    = i.currentValue - i.investedAmount;
            const gainPct = i.investedAmount > 0 ? ((gain / i.investedAmount) * 100).toFixed(1) : 0;
            const col     = gain >= 0 ? "#16a34a" : "#dc2626";
            const sign    = gain >= 0 ? "+" : "";
            tbody.innerHTML += `<tr>
                <td><span class="badge badge-blue">${i.investmentType}</span></td>
                <td><strong>${i.investmentName}</strong></td>
                <td>₹${Number(i.investedAmount).toLocaleString("en-IN")}</td>
                <td style="font-weight:600;">₹${Number(i.currentValue).toLocaleString("en-IN")}</td>
                <td style="color:${col};font-weight:600;">${sign}₹${Math.abs(Math.round(gain)).toLocaleString("en-IN")} (${sign}${gainPct}%)</td>
                <td style="display:flex;gap:6px;">
                    <button class="btn btn-warning" onclick="editInvestment(${i.id})">✏️ Edit</button>
                    <button class="btn btn-danger"  onclick="confirmDelete(${i.id})">🗑 Delete</button>
                </td></tr>`;
        });
    } catch { tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#dc2626;padding:20px;">Failed to load investments.</td></tr>`; }
}

async function saveInvestment() {
    const token = localStorage.getItem("token");
    const inv = {
        investmentType: document.getElementById("investmentType").value.trim(),
        investmentName: document.getElementById("investmentName").value.trim(),
        investedAmount: Number(document.getElementById("investedAmount").value),
        currentValue:   Number(document.getElementById("currentValue").value)
    };
    if (!inv.investmentName || !inv.investedAmount) { showToast("Please fill in name and amount.", "warning"); return; }
    try {
        const url    = editingId ? "/api/investments/" + editingId : "/api/investments";
        const method = editingId ? "PUT" : "POST";
        await fetch(url, { method, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify(inv) });
        showToast(editingId ? "Investment updated!" : "Investment added!", "success");
        editingId = null;
        ["investmentType","investmentName","investedAmount","currentValue"].forEach(id => document.getElementById(id).value = "");
        document.querySelector(".btn-primary").textContent = "💾 Save Investment";
        loadInvestments();
    } catch { showToast("Failed to save investment.", "error"); }
}

async function editInvestment(id) {
    const token = localStorage.getItem("token");
    const inv   = await fetch("/api/investments/" + id, { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
    editingId = id;
    document.getElementById("investmentType").value  = inv.investmentType;
    document.getElementById("investmentName").value  = inv.investmentName;
    document.getElementById("investedAmount").value  = inv.investedAmount;
    document.getElementById("currentValue").value    = inv.currentValue;
    document.querySelector(".btn-primary").textContent = "💾 Update Investment";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function confirmDelete(id) { showConfirm("This investment will be permanently deleted.", () => deleteInvestment(id)); }

async function deleteInvestment(id) {
    const token = localStorage.getItem("token");
    try {
        await fetch("/api/investments/" + id, { method: "DELETE", headers: { "Authorization": "Bearer " + token } });
        showToast("Investment deleted.", "success");
        loadInvestments();
    } catch { showToast("Failed to delete investment.", "error"); }
}