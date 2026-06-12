let reportCatChart = null;
let reportBarChart = null;

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }

    // Populate month selector — last 12 months
    const sel = document.getElementById("monthSelect");
    const now = new Date();
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const opt = document.createElement("option");
        opt.value = `${d.getFullYear()}-${d.getMonth()}`;
        opt.textContent = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
        if (i === 0) opt.selected = true;
        sel.appendChild(opt);
    }
    loadReport();
});

async function loadReport() {
    const token = localStorage.getItem("token");
    const [year, month] = document.getElementById("monthSelect").value.split("-").map(Number);

    try {
        const [expenses, income, budgets] = await Promise.all([
            fetch("/api/expenses",  { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
            fetch("/api/income",    { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
            fetch("/api/budgets",   { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
        ]);

        // Filter to selected month
        const filteredExp = expenses.filter(e => {
            const d = new Date(e.date);
            return d.getFullYear() === year && d.getMonth() === month;
        });
        const filteredInc = income.filter(i => {
            const d = new Date(i.date);
            return d.getFullYear() === year && d.getMonth() === month;
        });

        const totalExp = filteredExp.reduce((s, e) => s + e.amount, 0);
        const totalInc = filteredInc.reduce((s, i) => s + i.amount, 0);
        const cashFlow = totalInc - totalExp;
        const savingsRate = totalInc > 0 ? ((cashFlow / totalInc) * 100).toFixed(1) : 0;

        const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");

        // Stats
        document.getElementById("reportStats").innerHTML = `
            <div class="stat-card"><div class="stat-label">Total Income</div><div class="stat-value positive">${fmt(totalInc)}</div></div>
            <div class="stat-card"><div class="stat-label">Total Expenses</div><div class="stat-value negative">${fmt(totalExp)}</div></div>
            <div class="stat-card"><div class="stat-label">Cash Flow</div><div class="stat-value" style="color:${cashFlow>=0?'#16a34a':'#dc2626'}">${fmt(cashFlow)}</div></div>
            <div class="stat-card"><div class="stat-label">Savings Rate</div><div class="stat-value blue">${savingsRate}%</div></div>
            <div class="stat-card"><div class="stat-label">Transactions</div><div class="stat-value">${filteredExp.length}</div></div>
            <div class="stat-card"><div class="stat-label">Avg Daily Spend</div><div class="stat-value">${fmt(totalExp / 30)}</div></div>
        `;

        // Category chart
        const catMap = {};
        filteredExp.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });

        if (reportCatChart) reportCatChart.destroy();
        if (Object.keys(catMap).length) {
            reportCatChart = new Chart(document.getElementById("reportCatChart"), {
                type: "doughnut",
                data: {
                    labels: Object.keys(catMap),
                    datasets: [{ data: Object.values(catMap),
                        backgroundColor: ["#2563eb","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"],
                        borderWidth: 2, borderColor: "#fff" }]
                },
                options: { responsive: true, maintainAspectRatio: true,
                    plugins: { legend: { position: "right", labels: { boxWidth: 12, font: { size: 12 } } } } }
            });
        }

        // Bar chart
        if (reportBarChart) reportBarChart.destroy();
        reportBarChart = new Chart(document.getElementById("reportBarChart"), {
            type: "bar",
            data: {
                labels: ["This Month"],
                datasets: [
                    { label: "Income",   data: [Math.round(totalInc)], backgroundColor: "#16a34a", borderRadius: 6 },
                    { label: "Expenses", data: [Math.round(totalExp)], backgroundColor: "#ef4444", borderRadius: 6 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: true,
                plugins: { legend: { labels: { font: { size: 12 } } } },
                scales: { x: { grid: { display: false } }, y: { grid: { color: "#f1f5f9" },
                    ticks: { callback: v => "₹" + (v/1000).toFixed(0) + "K" } } } }
        });

        // Top expenses table
        const sorted = [...filteredExp].sort((a,b) => b.amount - a.amount).slice(0, 10);
        const tbody = document.querySelector("#reportTable tbody");
        tbody.innerHTML = !sorted.length
            ? `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:24px;">No expenses this month.</td></tr>`
            : sorted.map((e, i) => `<tr>
                <td style="color:#94a3b8;font-weight:600;">${i+1}</td>
                <td><strong>${e.title}</strong></td>
                <td><span class="badge badge-blue">${e.category}</span></td>
                <td style="color:#dc2626;font-weight:600;">${fmt(e.amount)}</td>
                <td style="color:#64748b;">${e.date || "—"}</td>
            </tr>`).join("");

        // Budget status
        const budgetEl = document.getElementById("budgetStatus");
        if (!budgets.length) {
            budgetEl.innerHTML = `<p style="color:#64748b;font-size:14px;">No budgets set. <a href="/budgets-page" style="color:#2563eb;">Add budgets →</a></p>`;
        } else {
            budgetEl.innerHTML = budgets.map(b => {
                const spent = filteredExp.filter(e => e.category.toLowerCase() === b.category.toLowerCase())
                                         .reduce((s,e) => s + e.amount, 0);
                const pct   = b.limitAmount > 0 ? Math.min((spent / b.limitAmount) * 100, 100) : 0;
                const over  = spent > b.limitAmount;
                const col   = over ? "#ef4444" : pct > 75 ? "#f59e0b" : "#16a34a";
                return `<div style="margin-bottom:14px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                        <span style="font-size:14px;font-weight:600;">${b.category}</span>
                        <span style="font-size:13px;color:${col};font-weight:600;">${fmt(spent)} / ${fmt(b.limitAmount)} ${over?"⚠️ Over budget":""}</span>
                    </div>
                    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${col};"></div></div>
                </div>`;
            }).join("");
        }

        // AI monthly summary
        const summaryEl = document.getElementById("monthlySummary");
        const tips = [];
        if (cashFlow < 0) tips.push({ type:"alert", icon:"🚨", text:`<strong>You spent more than you earned</strong> this month by ${fmt(Math.abs(cashFlow))}. Review your top spending categories.` });
        else tips.push({ type:"good", icon:"✅", text:`<strong>Positive month!</strong> You saved ${fmt(cashFlow)} (${savingsRate}% savings rate).` });

        const topCat = Object.entries(catMap).sort((a,b)=>b[1]-a[1])[0];
        if (topCat) tips.push({ type:"info", icon:"📊", text:`<strong>Biggest spend:</strong> "${topCat[0]}" at ${fmt(topCat[1])} (${totalExp>0?((topCat[1]/totalExp)*100).toFixed(0):0}% of expenses).` });

        const overBudgets = budgets.filter(b => {
            const spent = filteredExp.filter(e => e.category.toLowerCase() === b.category.toLowerCase()).reduce((s,e)=>s+e.amount,0);
            return spent > b.limitAmount;
        });
        if (overBudgets.length) tips.push({ type:"warn", icon:"⚠️", text:`<strong>${overBudgets.length} budget(s) exceeded:</strong> ${overBudgets.map(b=>b.category).join(", ")}. Tighten spending next month.` });

        if (!filteredExp.length) tips.push({ type:"info", icon:"💡", text:`<strong>No expenses recorded</strong> for this month. Start tracking to get insights!` });

        summaryEl.innerHTML = tips.map(t =>
            `<div class="insight-item ${t.type}"><span class="insight-icon">${t.icon}</span><span class="insight-text">${t.text}</span></div>`
        ).join("");

    } catch(err) { console.error(err); }
}