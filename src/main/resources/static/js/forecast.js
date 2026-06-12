document.addEventListener("DOMContentLoaded", loadForecast);

async function loadForecast() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }

    try {
        // Try backend forecast endpoint first
        let forecastData = null;
        try {
            const res = await fetch("/api/forecast", {
                headers: { "Authorization": "Bearer " + token }
            });
            if (res.ok) forecastData = await res.json();
        } catch(e) {}

        // Also load raw expenses for our own calculations
        const [expenses, income, budgets] = await Promise.all([
            fetch("/api/expenses", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
            fetch("/api/income",   { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
            fetch("/api/budgets",  { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
        ]);

        const now   = new Date();
        const year  = now.getFullYear();
        const month = now.getMonth();
        const day   = now.getDate();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysLeft = daysInMonth - day;

        // This month's expenses
        const thisMonthExp = expenses.filter(e => {
            const d = new Date(e.date);
            return d.getFullYear() === year && d.getMonth() === month;
        });
        const thisMonthInc = income.filter(i => {
            const d = new Date(i.date);
            return d.getFullYear() === year && d.getMonth() === month;
        });

        const spentSoFar  = thisMonthExp.reduce((s,e) => s + e.amount, 0);
        const incSoFar    = thisMonthInc.reduce((s,i) => s + i.amount, 0);
        const dailyRate   = day > 0 ? spentSoFar / day : 0;
        const projected   = forecastData?.projectedMonthlyExpense || Math.round(dailyRate * daysInMonth);
        const remaining   = Math.max(daysLeft * dailyRate, 0);
        const totalBudget = budgets.reduce((s,b) => s + b.limitAmount, 0);
        const willOverrun = projected > totalBudget && totalBudget > 0;

        const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");

        // Stat cards
        document.getElementById("spentSoFar").textContent  = fmt(spentSoFar);
        document.getElementById("dailyRate").textContent   = fmt(dailyRate);
        document.getElementById("projectedExp").textContent = fmt(projected);
        document.getElementById("daysLeft").textContent    = daysLeft + " days";
        document.getElementById("remainingBudget").textContent = fmt(Math.max(totalBudget - spentSoFar, 0));
        document.getElementById("safeToSpend").textContent = fmt(Math.max((totalBudget - spentSoFar) / Math.max(daysLeft, 1), 0));

        // Overrun alert
        const alertEl = document.getElementById("forecastAlert");
        if (willOverrun) {
            alertEl.style.display = "flex";
            alertEl.className = "insight-item alert";
            document.getElementById("forecastAlertText").innerHTML =
                `<strong>Budget overrun predicted!</strong> At ₹${Math.round(dailyRate).toLocaleString("en-IN")}/day, you'll spend ${fmt(projected)} this month — ${fmt(projected - totalBudget)} over your ${fmt(totalBudget)} budget.`;
        } else if (totalBudget > 0 && projected > totalBudget * 0.85) {
            alertEl.style.display = "flex";
            alertEl.className = "insight-item warn";
            document.getElementById("forecastAlertText").innerHTML =
                `<strong>Approaching budget limit.</strong> Projected spend is ${fmt(projected)} vs ${fmt(totalBudget)} budget. Slow down spending to stay safe.`;
        } else {
            alertEl.style.display = "flex";
            alertEl.className = "insight-item good";
            document.getElementById("forecastAlertText").innerHTML =
                `<strong>On track!</strong> Projected spend of ${fmt(projected)} is within your ${fmt(totalBudget)} budget. Keep it up!`;
        }

        // Progress bar
        const pct = totalBudget > 0 ? Math.min((projected / totalBudget) * 100, 100) : 0;
        const barCol = willOverrun ? "#ef4444" : pct > 85 ? "#f59e0b" : "#16a34a";
        document.getElementById("forecastBar").style.width = pct + "%";
        document.getElementById("forecastBar").style.background = barCol;
        document.getElementById("forecastPct").textContent = pct.toFixed(0) + "% of budget";

        // Daily spend chart — last 14 days
        const last14 = [];
        const last14Labels = [];
        for (let i = 13; i >= 0; i--) {
            const d = new Date(year, month, day - i);
            const dayExp = expenses.filter(e => {
                const ed = new Date(e.date);
                return ed.toDateString() === d.toDateString();
            }).reduce((s,e) => s + e.amount, 0);
            last14.push(Math.round(dayExp));
            last14Labels.push(`${d.getDate()}/${d.getMonth()+1}`);
        }

        new Chart(document.getElementById("dailyChart"), {
            type: "bar",
            data: {
                labels: last14Labels,
                datasets: [{
                    label: "Daily Spend",
                    data: last14,
                    backgroundColor: last14.map(v => v > dailyRate * 1.5 ? "#ef4444" : "#2563eb"),
                    borderRadius: 5
                }, {
                    label: "Daily Average",
                    data: Array(14).fill(Math.round(dailyRate)),
                    type: "line",
                    borderColor: "#f59e0b",
                    borderDash: [5,5],
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: { responsive: true, maintainAspectRatio: true,
                plugins: { legend: { labels: { font: { size: 12 } } } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + v.toLocaleString("en-IN") } }
                }
            }
        });

        // Month projection chart
        const projLabels = ["Spent so far", "Remaining projected", "Budget"];
        new Chart(document.getElementById("projectionChart"), {
            type: "bar",
            data: {
                labels: projLabels,
                datasets: [{
                    data: [Math.round(spentSoFar), Math.round(remaining), Math.round(totalBudget)],
                    backgroundColor: ["#2563eb", "#bfdbfe", "#e2e8f0"],
                    borderRadius: 6
                }]
            },
            options: { responsive: true, maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + (v/1000).toFixed(0) + "K" } }
                }
            }
        });

        // Category forecast
        const catEl = document.getElementById("catForecast");
        const catMap = {};
        thisMonthExp.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
        const catBudgets = {};
        budgets.forEach(b => { catBudgets[b.category.toLowerCase()] = b.limitAmount; });

        catEl.innerHTML = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).map(([cat, spent]) => {
            const projCat  = Math.round((spent / day) * daysInMonth);
            const budgCat  = catBudgets[cat.toLowerCase()] || 0;
            const pctCat   = budgCat > 0 ? Math.min((projCat / budgCat) * 100, 100) : 0;
            const colCat   = projCat > budgCat && budgCat > 0 ? "#ef4444" : pctCat > 75 ? "#f59e0b" : "#2563eb";
            return `<div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="font-size:14px;font-weight:600;">${cat}</span>
                    <span style="font-size:13px;color:${colCat};font-weight:600;">Projected: ${fmt(projCat)}${budgCat?" / "+fmt(budgCat):""}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${pctCat||30}%;background:${colCat};"></div></div>
            </div>`;
        }).join("") || `<p style="color:#64748b;font-size:14px;">No expenses this month yet.</p>`;

    } catch(err) { console.error(err); }
}