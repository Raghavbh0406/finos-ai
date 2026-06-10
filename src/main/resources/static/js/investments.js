document.addEventListener("DOMContentLoaded", loadInvestments);
let editingId = null;

async function loadInvestments() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    const investments = await fetch("/api/investments", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
    const tbody = document.querySelector("#investmentTable tbody");
    tbody.innerHTML = "";
    if (!investments.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#64748b;padding:24px;">No investments yet. Add one above!</td></tr>'; return; }
    investments.forEach(i => {
        const gain = i.currentValue - i.investedAmount;
        const gainPct = i.investedAmount > 0 ? ((gain / i.investedAmount) * 100).toFixed(1) : 0;
        const gainColor = gain >= 0 ? "#16a34a" : "#dc2626";
        const gainSign = gain >= 0 ? "+" : "";
        tbody.innerHTML += `<tr>
            <td><span class="badge badge-blue">${i.investmentType}</span></td>
            <td><strong>${i.investmentName}</strong></td>
            <td>₹${Number(i.investedAmount).toLocaleString("en-IN")}</td>
            <td style="font-weight:600;">₹${Number(i.currentValue).toLocaleString("en-IN")}</td>
            <td style="color:${gainColor};font-weight:600;">${gainSign}₹${Math.abs(Math.round(gain)).toLocaleString("en-IN")} (${gainSign}${gainPct}%)</td>
            <td style="display:flex;gap:6px;">
                <button class="btn btn-warning" onclick="editInvestment(${i.id})">✏️ Edit</button>
                <button class="btn btn-danger" onclick="deleteInvestment(${i.id})">🗑 Delete</button>
            </td></tr>`;
    });
}

async function saveInvestment() {
    const token = localStorage.getItem("token");
    const inv = {
        investmentType: document.getElementById("investmentType").value,
        investmentName: document.getElementById("investmentName").value,
        investedAmount: Number(document.getElementById("investedAmount").value),
        currentValue: Number(document.getElementById("currentValue").value)
    };
    if (!inv.investmentName || !inv.investedAmount) { alert("Please fill in name and amount."); return; }
    const url = editingId ? "/api/investments/" + editingId : "/api/investments";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }, body: JSON.stringify(inv) });
    editingId = null;
    ["investmentType","investmentName","investedAmount","currentValue"].forEach(id => document.getElementById(id).value = "");
    loadInvestments();
}

async function editInvestment(id) {
    const token = localStorage.getItem("token");
    const inv = await fetch("/api/investments/" + id, { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
    editingId = id;
    document.getElementById("investmentType").value = inv.investmentType;
    document.getElementById("investmentName").value = inv.investmentName;
    document.getElementById("investedAmount").value = inv.investedAmount;
    document.getElementById("currentValue").value = inv.currentValue;
    document.getElementById("investmentType").focus();
}

async function deleteInvestment(id) {
    if (!confirm("Delete this investment?")) return;
    const token = localStorage.getItem("token");
    await fetch("/api/investments/" + id, { method: "DELETE", headers: { "Authorization": "Bearer " + token } });
    loadInvestments();
}