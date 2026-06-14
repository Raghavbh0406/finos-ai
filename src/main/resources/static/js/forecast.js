document.addEventListener("DOMContentLoaded", loadForecast);

async function loadForecast() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }

    try {
        const [expenses, budgets] = await Promise.all([
            fetch("/api/expenses", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
            fetch("/api/budgets",  { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
        ]);

        const now          = new Date();
        const year         = now.getFullYear();
        const month        = now.getMonth();
        const day          = now.getDate();
        const daysInMonth  = new Date(year, month + 1, 0).getDate();
        const daysLeft     = daysInMonth - day;

        // Filter to current month
        const thisMonthExp = expenses.filter(e => {
            const d = new Date(e.date);
            return d.getFullYear() === year && d.getMonth() === month;
        });

        const spentSoFar  = thisMonthExp.reduce((s, e) => s + e.amount, 0);
        const dailyRate   = day > 0 ? spentSoFar / day : 0;
        const projected   = Math.round(dailyRate * daysInMonth);
        const remaining   = Math.max(daysLeft * dailyRate, 0);
        const totalBudget = budgets.reduce((s, b) => s + b.limitAmount, 0);
        const willOverrun = totalBudget > 0 && projected > totalBudget;
        const nearLimit   = totalBudget > 0 && projected > totalBudget * 0.85;
        const safePerDay  = daysLeft > 0 && totalBudget > spentSoFar
                            ? (totalBudget - spentSoFar) / daysLeft : 0;

        const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");

        // Stat cards
        document.getElementById("spentSoFar").textContent       = fmt(spentSoFar);
        document.getElementById("dailyRate").textContent         = fmt(dailyRate);
        document.getElementById("projectedExp").textContent      = fmt(projected);
        document.getElementById("daysLeft").textContent          = daysLeft + " days";
        document.getElementById("remainingBudget").textContent   = fmt(Math.max(totalBudget - spentSoFar, 0));
        document.getElementById("safeToSpend").textContent       = fmt(Math.max(safePerDay, 0));

        // Alert banner
        const alertEl   = document.getElementById("forecastAlert");
        const alertText = document.getElementById("forecastAlertText");
        alertEl.style.display = "flex";
        if (willOverrun) {
            alertEl.className = "insight-item alert";
            alertText.innerHTML = `<strong>Budget overrun predicted!</strong> At ${fmt(dailyRate)}/day you'll spend ${fmt(projected)} this month — ${fmt(projected - totalBudget)} over your ${fmt(totalBudget)} budget.`;
        } else if (nearLimit) {
            alertEl.className = "insight-item warn";
            alertText.innerHTML = `<strong>Approaching budget limit.</strong> Projected spend is ${fmt(projected)} vs ${fmt(totalBudget)} budget. Slow down to stay safe.`;
        } else if (totalBudget > 0) {
            alertEl.className = "insight-item good";
            alertText.innerHTML = `<strong>On track!</strong> Projected spend of ${fmt(projected)} is within your ${fmt(totalBudget)} budget. Keep it up!`;
        } else {
            alertEl.className = "insight-item info";
            alertText.innerHTML = `<strong>No budget set.</strong> You've spent ${fmt(spentSoFar)} so far this month. <a href="/budgets-page" style="color:#2563eb;font-weight:600;">Set a budget →</a>`;
        }

        // Progress bar
        const pct    = totalBudget > 0 ? Math.min((projected / totalBudget) * 100, 100) : 0;
        const barCol = willOverrun ? "#ef4444" : nearLimit ? "#f59e0b" : "#16a34a";
        const barEl  = document.getElementById("forecastBar");
        const pctEl  = document.getElementById("forecastPct");
        if (barEl) { barEl.style.width = pct + "%"; barEl.style.background = barCol; }
        if (pctEl)   pctEl.textContent = totalBudget > 0 ? pct.toFixed(0) + "% of budget used (projected)" : "No budget set";

        // Daily spend — last 14 days
        const last14Labels = [], last14Data = [];
        for (let i = 13; i >= 0; i--) {
            const d = new Date(year, month, day - i);
            const daySpend = expenses
                .filter(e => { const ed = new Date(e.date); return ed.toDateString() === d.toDateString(); })
                .reduce((s, e) => s + e.amount, 0);
            last14Labels.push(`${d.getDate()}/${d.getMonth()+1}`);
            last14Data.push(Math.round(daySpend));
        }

        new Chart(document.getElementById("dailyChart"), {
            type: "bar",
            data: {
                labels: last14Labels,
                datasets: [{
                    label: "Daily Spend (₹)",
                    data: last14Data,
                    backgroundColor: last14Data.map(v => v > dailyRate * 1.5 ? "#ef4444" : "#2563eb"),
                    borderRadius: 5
                }, {
                    label: "Daily Avg",
                    data: Array(14).fill(Math.round(dailyRate)),
                    type: "line",
                    borderColor: "#f59e0b",
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                    tension: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { labels: { font: { size: 12 } } } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + v.toLocaleString("en-IN") } }
                }
            }
        });

        // Month projection chart
        new Chart(document.getElementById("projectionChart"), {
            type: "bar",
            data: {
                labels: ["Spent So Far", "Remaining (projected)", "Total Budget"],
                datasets: [{
                    data: [Math.round(spentSoFar), Math.round(remaining), Math.round(totalBudget)],
                    backgroundColor: ["#2563eb", "#bfdbfe", "#e2e8f0"],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + (v/1000).toFixed(0) + "K" } }
                }
            }
        });

        // Category-wise forecast
        const catEl  = document.getElementById("catForecast");
        const catMap = {};
        thisMonthExp.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
        const catBudgets = {};
        budgets.forEach(b => { catBudgets[b.category.toLowerCase()] = b.limitAmount; });

        if (!Object.keys(catMap).length) {
            catEl.innerHTML = `<p style="color:#64748b;font-size:14px;">No expenses recorded this month yet. <a href="/expenses-page" style="color:#2563eb;">Add expenses →</a></p>`;
            return;
        }

        catEl.innerHTML = Object.entries(catMap)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, spent]) => {
                const projCat = Math.round((spent / day) * daysInMonth);
                const budgCat = catBudgets[cat.toLowerCase()] || 0;
                const pctCat  = budgCat > 0 ? Math.min((projCat / budgCat) * 100, 100) : 50;
                const colCat  = budgCat > 0 && projCat > budgCat ? "#ef4444"
                              : budgCat > 0 && pctCat > 75        ? "#f59e0b"
                              : "#2563eb";
                const overTag = budgCat > 0 && projCat > budgCat
                              ? `<span style="color:#ef4444;font-size:11px;font-weight:700;margin-left:6px;">⚠️ Over</span>` : "";
                return `<div style="margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
                        <span style="font-size:14px;font-weight:600;">${cat}${overTag}</span>
                        <span style="font-size:13px;color:${colCat};font-weight:600;">
                            Projected: ${fmt(projCat)}${budgCat ? " / " + fmt(budgCat) : ""}
                        </span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${pctCat}%;background:${colCat};"></div>
                    </div>
                    <div style="font-size:11px;color:#94a3b8;margin-top:3px;">Spent so far: ${fmt(spent)}</div>
                </div>`;
            }).join("");

    } catch (err) {
        console.error("Forecast error:", err);
        document.getElementById("forecastAlert").style.display = "flex";
        document.getElementById("forecastAlert").className = "insight-item alert";
        document.getElementById("forecastAlertText").innerHTML = "<strong>Error loading forecast.</strong> Make sure you have expenses recorded.";
    }
}