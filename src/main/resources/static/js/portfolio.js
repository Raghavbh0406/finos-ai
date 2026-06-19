document.addEventListener("DOMContentLoaded", async () => {
    if (!checkTokenExpiry()) return;
    const token = localStorage.getItem("token");

    try {
        const [investments, portfolioRes] = await Promise.all([
            fetch("/api/investments", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
            fetch("/api/portfolio/analytics", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json())
        ]);

        const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
        const totalInvested = portfolioRes.totalInvested || 0;
        const currentValue  = portfolioRes.currentValue  || 0;
        const profit        = portfolioRes.profit         || 0;
        const returnPct     = portfolioRes.returnPercentage || 0;
        const profitColor   = profit >= 0 ? "#16a34a" : "#dc2626";

        // Stats
        document.getElementById("portfolioStats").innerHTML = `
            <div class="stat-card"><div class="stat-label">Total Invested</div><div class="stat-value">${fmt(totalInvested)}</div></div>
            <div class="stat-card"><div class="stat-label">Current Value</div><div class="stat-value blue">${fmt(currentValue)}</div></div>
            <div class="stat-card"><div class="stat-label">Total Gain/Loss</div><div class="stat-value" style="color:${profitColor};">${profit >= 0 ? "+" : ""}${fmt(profit)}</div></div>
            <div class="stat-card"><div class="stat-label">Overall Return</div><div class="stat-value" style="color:${profitColor};">${returnPct >= 0 ? "+" : ""}${returnPct.toFixed(2)}%</div></div>
            <div class="stat-card"><div class="stat-label">Holdings</div><div class="stat-value">${investments.length}</div></div>
        `;

        if (!investments.length) {
            document.getElementById("holdingsTable").querySelector("tbody").innerHTML =
                `<tr><td colspan="7">${emptyState("📈", "No investments yet", "Add investments to see your portfolio analysis.", "➕ Add Investment", "/investments-page")}</td></tr>`;
            return;
        }

        // Composition donut
        const typeMap = {};
        investments.forEach(i => { typeMap[i.investmentType] = (typeMap[i.investmentType] || 0) + i.currentValue; });
        new Chart(document.getElementById("compositionChart"), {
            type: "doughnut",
            data: {
                labels: Object.keys(typeMap),
                datasets: [{ data: Object.values(typeMap),
                    backgroundColor: ["#2563eb","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"],
                    borderWidth: 2, borderColor: "#fff" }]
            },
            options: { responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: "right", labels: { boxWidth: 12, font: { size: 12 } } } } }
        });

        // Bar chart
        new Chart(document.getElementById("valueChart"), {
            type: "bar",
            data: {
                labels: investments.map(i => i.investmentName),
                datasets: [
                    { label: "Invested", data: investments.map(i => i.investedAmount), backgroundColor: "#bfdbfe", borderRadius: 5 },
                    { label: "Current",  data: investments.map(i => i.currentValue),   backgroundColor: "#2563eb", borderRadius: 5 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: true,
                plugins: { legend: { labels: { font: { size: 12 } } } },
                scales: { x: { grid: { display: false } }, y: { grid: { color: "#f1f5f9" },
                    ticks: { callback: v => "₹" + (v/1000).toFixed(0) + "K" } } } }
        });

        // Holdings table
        const tbody = document.querySelector("#holdingsTable tbody");
        tbody.innerHTML = investments.map(i => {
            const gain    = i.currentValue - i.investedAmount;
            const ret     = i.investedAmount > 0 ? ((gain / i.investedAmount) * 100).toFixed(1) : 0;
            const weight  = currentValue > 0 ? ((i.currentValue / currentValue) * 100).toFixed(1) : 0;
            const col     = gain >= 0 ? "#16a34a" : "#dc2626";
            return `<tr>
                <td><span class="badge badge-blue">${i.investmentType}</span></td>
                <td><strong>${i.investmentName}</strong></td>
                <td>${fmt(i.investedAmount)}</td>
                <td style="font-weight:600;">${fmt(i.currentValue)}</td>
                <td style="color:${col};font-weight:600;">${gain >= 0 ? "+" : ""}${fmt(gain)}</td>
                <td style="color:${col};font-weight:600;">${ret >= 0 ? "+" : ""}${ret}%</td>
                <td><div style="display:flex;align-items:center;gap:6px;"><div class="progress-bar" style="flex:1;"><div class="progress-fill" style="width:${weight}%;background:#2563eb;"></div></div><span style="font-size:12px;color:#64748b;width:36px;">${weight}%</span></div></td>
            </tr>`;
        }).join("");

        // Insights
        const insights = [];
        const topPerformer = [...investments].sort((a,b) => (b.currentValue/b.investedAmount) - (a.currentValue/a.investedAmount))[0];
        const worst        = [...investments].sort((a,b) => (a.currentValue/a.investedAmount) - (b.currentValue/b.investedAmount))[0];

        if (topPerformer) {
            const r = ((topPerformer.currentValue - topPerformer.investedAmount)/topPerformer.investedAmount*100).toFixed(1);
            insights.push({ type:"good", icon:"🌟", text:`<strong>Best performer:</strong> ${topPerformer.investmentName} with ${r}% return.` });
        }
        if (worst && worst.id !== topPerformer?.id) {
            const r = ((worst.currentValue - worst.investedAmount)/worst.investedAmount*100).toFixed(1);
            const type = Number(r) < 0 ? "alert" : "info";
            insights.push({ type, icon: Number(r) < 0 ? "📉" : "📊", text:`<strong>Needs attention:</strong> ${worst.investmentName} at ${r}% return.` });
        }
        if (returnPct > 12) insights.push({ type:"good", icon:"🎯", text:`<strong>Excellent returns!</strong> Your portfolio's ${returnPct.toFixed(1)}% return beats the market average.` });
        else if (returnPct < 0) insights.push({ type:"alert", icon:"⚠️", text:`<strong>Portfolio at a loss.</strong> Consider reviewing underperforming holdings.` });

        const types = Object.keys(typeMap);
        if (types.length === 1) insights.push({ type:"warn", icon:"💡", text:`<strong>Diversify!</strong> All investments are in ${types[0]}. Spread across asset classes to reduce risk.` });

        document.getElementById("portfolioInsights").innerHTML = insights.map(i =>
            `<div class="insight-item ${i.type}" style="margin-bottom:8px;"><span class="insight-icon">${i.icon}</span><span class="insight-text">${i.text}</span></div>`
        ).join("");

    } catch(e) { showToast("Failed to load portfolio data.", "error"); }
});