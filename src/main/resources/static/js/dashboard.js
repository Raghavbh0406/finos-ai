document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }

    try {
        const [expenses, budgets, investments, goals, income] = await Promise.all([
            fetch("/api/expenses",     { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
            fetch("/api/budgets",      { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
            fetch("/api/investments",  { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
            fetch("/api/savings-goals",{ headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
            fetch("/api/income",       { headers: { "Authorization": "Bearer " + token } }).then(r => r.json()),
        ]);

        // ── Core numbers ──
        const totalIncome      = income.reduce((s, i) => s + i.amount, 0);
        const totalExpenses    = expenses.reduce((s, e) => s + e.amount, 0);
        const totalBudgets     = budgets.reduce((s, b) => s + b.limitAmount, 0);
        const totalInvested    = investments.reduce((s, i) => s + i.investedAmount, 0);
        const totalInvValue    = investments.reduce((s, i) => s + i.currentValue, 0);
        const totalSavings     = goals.reduce((s, g) => s + g.savedAmount, 0);
        const totalTarget      = goals.reduce((s, g) => s + g.targetAmount, 0);
        const portfolioGain    = totalInvValue - totalInvested;
        const cashFlow         = totalIncome - totalExpenses;
        const netWorth         = totalInvValue + totalSavings + cashFlow;
        const savingsRate      = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
        const savingsProgress  = totalTarget > 0 ? (totalSavings / totalTarget) * 100 : 0;
        const budgetUtil       = totalBudgets > 0 ? (totalExpenses / totalBudgets) * 100 : 0;
        const portfolioReturn  = totalInvested > 0 ? (portfolioGain / totalInvested) * 100 : 0;

        // ── Health score ──
        let health = 40;
        if (savingsRate >= 20)     health += 15;
        else if (savingsRate >= 10) health += 8;
        if (budgetUtil < 80)       health += 15;
        else if (budgetUtil < 100) health += 7;
        if (portfolioGain > 0)     health += 15;
        if (savingsProgress > 50)  health += 15;
        if (income.length > 0)     health += 5;
        if (goals.length > 0)      health += 5;
        health = Math.min(health, 100);

        // ── Stat cards ──
        const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
        setText("totalIncome",     fmt(totalIncome));
        setText("totalExpenses",   fmt(totalExpenses));
        setText("cashFlow",        fmt(cashFlow));
        setText("netWorth",        fmt(netWorth));
        setText("totalInvestments",fmt(totalInvValue));
        setText("portfolioGain",   fmt(portfolioGain));
        setText("totalSavings",    fmt(totalSavings));
        setText("totalBudgets",    fmt(totalBudgets));
        setText("budgetUtilization", budgetUtil.toFixed(1) + "%");
        setText("savingsProgress", savingsProgress.toFixed(1) + "%");
        setText("savingsRate",     savingsRate.toFixed(1) + "%");
        setText("healthScore",     health + "/100");
        setText("expenseCount",    expenses.length);
        setText("investmentCount", investments.length);
        setText("goalCount",       goals.length);

        // colour cash flow
        const cfEl = document.getElementById("cashFlow");
        if (cfEl) cfEl.style.color = cashFlow >= 0 ? "#16a34a" : "#dc2626";
        const pgEl = document.getElementById("portfolioGain");
        if (pgEl) pgEl.style.color = portfolioGain >= 0 ? "#16a34a" : "#dc2626";

        // ── Health ring ──
        renderHealthRing(health, budgetUtil, savingsRate, portfolioReturn, savingsProgress);

        // ── Charts ──
        renderExpenseDonut(expenses);
        renderInvestmentChart(investments);
        renderExpenseTrendChart(expenses, income);
        renderIncomeExpenseBar(income, expenses);
        renderCategoryBar(expenses);
        renderSavingsProgress(goals);

        // ── Insights ──
        renderInsights({ totalIncome, totalExpenses, cashFlow, budgetUtil,
            savingsRate, portfolioGain, portfolioReturn, savingsProgress,
            expenses, goals, income, investments });

        // ── Savings goal mini cards ──
        renderGoalCards(goals);

    } catch (err) { console.error(err); }
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ── Health ring ──
function renderHealthRing(score, budgetUtil, savingsRate, portReturn, savProg) {
    const ring = document.getElementById("healthRingFill");
    if (!ring) return;
    const circ = 2 * Math.PI * 45; // r=45
    const color = score >= 75 ? "#16a34a" : score >= 50 ? "#f59e0b" : "#ef4444";
    ring.style.stroke = color;
    ring.style.strokeDasharray = circ;
    ring.style.strokeDashoffset = circ - (score / 100) * circ;
    const label = document.getElementById("healthLabel");
    if (label) { label.textContent = score >= 75 ? "Excellent" : score >= 50 ? "Good" : "Needs Work"; label.style.color = color; }

    const bars = [
        { id: "hb-budget",  val: Math.min(100 - budgetUtil, 100), color: budgetUtil < 80 ? "#16a34a" : budgetUtil < 100 ? "#f59e0b" : "#ef4444" },
        { id: "hb-savings", val: Math.min(savingsRate * 5, 100),  color: savingsRate >= 20 ? "#16a34a" : savingsRate >= 10 ? "#f59e0b" : "#ef4444" },
        { id: "hb-invest",  val: Math.min(portReturn * 10 + 50, 100), color: portReturn > 0 ? "#16a34a" : portReturn >= -5 ? "#f59e0b" : "#ef4444" },
        { id: "hb-goals",   val: Math.min(savProg, 100), color: savProg >= 50 ? "#16a34a" : "#f59e0b" },
    ];
    bars.forEach(b => {
        const el = document.getElementById(b.id);
        if (el) { el.style.width = b.val + "%"; el.style.background = b.color; }
    });
}

// ── Expense donut ──
function renderExpenseDonut(expenses) {
    const ctx = document.getElementById("expenseChart");
    if (!ctx) return;
    const cat = {};
    expenses.forEach(e => { cat[e.category] = (cat[e.category] || 0) + e.amount; });
    if (!Object.keys(cat).length) return;
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: Object.keys(cat),
            datasets: [{ data: Object.values(cat),
                backgroundColor: ["#2563eb","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"],
                borderWidth: 2, borderColor: "#fff" }]
        },
        options: { responsive: true, maintainAspectRatio: true,
            plugins: { legend: { position: "right", labels: { boxWidth: 12, font: { size: 12 } } } } }
    });
}

// ── Investment bar ──
function renderInvestmentChart(investments) {
    const ctx = document.getElementById("investmentChart");
    if (!ctx || !investments.length) return;
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: investments.map(i => i.investmentName),
            datasets: [
                { label: "Invested", data: investments.map(i => i.investedAmount), backgroundColor: "#bfdbfe", borderRadius: 6 },
                { label: "Current Value", data: investments.map(i => i.currentValue), backgroundColor: "#2563eb", borderRadius: 6 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: true,
            plugins: { legend: { labels: { font: { size: 12 } } } },
            scales: { x: { grid: { display: false } }, y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + v.toLocaleString("en-IN") } } } }
    });
}

// ── Expense trend + income overlay ──
function renderExpenseTrendChart(expenses, income) {
    const ctx = document.getElementById("expenseTrendChart");
    if (!ctx) return;
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const expM = Array(12).fill(0), incM = Array(12).fill(0);
    expenses.forEach(e => { const d = new Date(e.date); if (!isNaN(d)) expM[d.getMonth()] += e.amount; });
    income.forEach(i => { const d = new Date(i.date); if (!isNaN(d)) incM[d.getMonth()] += i.amount; });
    new Chart(ctx, {
        type: "line",
        data: {
            labels: months,
            datasets: [
                { label: "Expenses", data: expM, borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#ef4444" },
                { label: "Income",   data: incM, borderColor: "#16a34a", backgroundColor: "rgba(22,163,74,0.08)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#16a34a" }
            ]
        },
        options: { responsive: true, maintainAspectRatio: true,
            plugins: { legend: { labels: { font: { size: 12 } } } },
            scales: { x: { grid: { display: false } }, y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + v.toLocaleString("en-IN") } } } }
    });
}

// ── Income vs Expense grouped bar ──
function renderIncomeExpenseBar(income, expenses) {
    const ctx = document.getElementById("incomeExpenseChart");
    if (!ctx) return;
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const expM = Array(12).fill(0), incM = Array(12).fill(0);
    expenses.forEach(e => { const d = new Date(e.date); if (!isNaN(d)) expM[d.getMonth()] += e.amount; });
    income.forEach(i => { const d = new Date(i.date); if (!isNaN(d)) incM[d.getMonth()] += i.amount; });
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: months,
            datasets: [
                { label: "Income",   data: incM, backgroundColor: "#16a34a", borderRadius: 5 },
                { label: "Expenses", data: expM, backgroundColor: "#ef4444", borderRadius: 5 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: true,
            plugins: { legend: { labels: { font: { size: 12 } } } },
            scales: { x: { grid: { display: false } }, y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + v.toLocaleString("en-IN") } } } }
    });
}

// ── Category bar ──
function renderCategoryBar(expenses) {
    const ctx = document.getElementById("categoryChart");
    if (!ctx) return;
    const cat = {};
    expenses.forEach(e => { cat[e.category] = (cat[e.category] || 0) + e.amount; });
    const sorted = Object.entries(cat).sort((a,b) => b[1]-a[1]).slice(0, 8);
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: sorted.map(e => e[0]),
            datasets: [{ label: "Spend", data: sorted.map(e => e[1]),
                backgroundColor: ["#2563eb","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"],
                borderRadius: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: true, indexAxis: "y",
            plugins: { legend: { display: false } },
            scales: { x: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + v.toLocaleString("en-IN") } }, y: { grid: { display: false } } } }
    });
}

// ── Savings progress chart ──
function renderSavingsProgress(goals) {
    const ctx = document.getElementById("savingsChart");
    if (!ctx || !goals.length) return;
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: goals.map(g => g.goalName),
            datasets: [
                { label: "Saved",  data: goals.map(g => g.savedAmount),  backgroundColor: "#2563eb", borderRadius: 5 },
                { label: "Target", data: goals.map(g => g.targetAmount), backgroundColor: "#dbeafe", borderRadius: 5 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: true,
            plugins: { legend: { labels: { font: { size: 12 } } } },
            scales: { x: { grid: { display: false } }, y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + v.toLocaleString("en-IN") } } } }
    });
}

// ── Goal mini cards ──
function renderGoalCards(goals) {
    const el = document.getElementById("goalCards");
    if (!el) return;
    if (!goals.length) { el.innerHTML = '<p style="color:#64748b;font-size:14px;">No savings goals yet. <a href="/savings-page" style="color:#2563eb;">Add one →</a></p>'; return; }
    el.innerHTML = goals.map(g => {
        const pct = g.targetAmount > 0 ? Math.min((g.savedAmount / g.targetAmount) * 100, 100) : 0;
        const col = pct >= 75 ? "#16a34a" : pct >= 40 ? "#f59e0b" : "#2563eb";
        return `<div class="goal-mini-card">
            <div class="goal-mini-name">${g.goalName}</div>
            <div class="goal-mini-amounts"><span>₹${Math.round(g.savedAmount).toLocaleString("en-IN")}</span><span>₹${Math.round(g.targetAmount).toLocaleString("en-IN")}</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${col};"></div></div>
            <div style="font-size:11px;color:#64748b;margin-top:4px;text-align:right;">${pct.toFixed(0)}% complete</div>
        </div>`;
    }).join("");
}

// ── AI Insights ──
function renderInsights({ totalIncome, totalExpenses, cashFlow, budgetUtil,
    savingsRate, portfolioGain, portfolioReturn, savingsProgress,
    expenses, goals, income, investments }) {

    const el = document.getElementById("insightsList");
    if (!el) return;
    const tips = [];

    // Spending
    if (budgetUtil > 100) tips.push({ type: "alert", icon: "🚨", text: `<strong>Over budget!</strong> You've spent ${budgetUtil.toFixed(0)}% of your total budget. Identify and cut non-essential spending immediately.` });
    else if (budgetUtil > 85) tips.push({ type: "warn", icon: "⚠️", text: `<strong>Budget warning:</strong> You've used ${budgetUtil.toFixed(0)}% of your budget. Slow down on discretionary spending this month.` });
    else if (budgetUtil < 60 && totalBudgets > 0) tips.push({ type: "good", icon: "✅", text: `<strong>Great budgeting!</strong> You've only used ${budgetUtil.toFixed(0)}% of your budget — you're on track.` });

    // Cash flow
    if (cashFlow < 0) tips.push({ type: "alert", icon: "📉", text: `<strong>Negative cash flow:</strong> You're spending ₹${Math.abs(Math.round(cashFlow)).toLocaleString("en-IN")} more than you earn. Review your largest expense categories.` });
    else if (cashFlow > 0 && savingsRate < 10) tips.push({ type: "warn", icon: "💡", text: `<strong>Low savings rate (${savingsRate.toFixed(1)}%):</strong> You have positive cash flow but aren't saving much. Aim for at least 20% savings rate.` });
    else if (savingsRate >= 20) tips.push({ type: "good", icon: "🌟", text: `<strong>Excellent savings rate!</strong> Saving ${savingsRate.toFixed(1)}% of income puts you well ahead of most people. Keep it up!` });

    // Category insight
    const catMap = {};
    expenses.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
    const topCat = Object.entries(catMap).sort((a,b) => b[1]-a[1])[0];
    if (topCat && totalExpenses > 0) {
        const pct = ((topCat[1] / totalExpenses) * 100).toFixed(0);
        tips.push({ type: pct > 50 ? "warn" : "info", icon: "📊",
            text: `<strong>Top spending category:</strong> "${topCat[0]}" accounts for ${pct}% of your expenses (₹${Math.round(topCat[1]).toLocaleString("en-IN")}).` });
    }

    // Investments
    if (portfolioGain > 0) tips.push({ type: "good", icon: "📈", text: `<strong>Portfolio in profit!</strong> Your investments have gained ₹${Math.round(portfolioGain).toLocaleString("en-IN")} (${portfolioReturn.toFixed(1)}% return). Consider reinvesting gains.` });
    else if (portfolioGain < 0) tips.push({ type: "warn", icon: "📉", text: `<strong>Portfolio at a loss:</strong> Down ₹${Math.abs(Math.round(portfolioGain)).toLocaleString("en-IN")}. Market corrections are normal — stay the course if long-term.` });
    else if (investments.length === 0) tips.push({ type: "info", icon: "💼", text: `<strong>Start investing:</strong> You have no investments yet. Even small, consistent SIPs in index funds can build significant wealth over time.` });

    // Savings goals
    if (savingsProgress >= 75) tips.push({ type: "good", icon: "🎯", text: `<strong>Savings goals ${savingsProgress.toFixed(0)}% complete!</strong> You're close to your targets. Consider increasing contributions to finish sooner.` });
    else if (goals.length === 0) tips.push({ type: "info", icon: "🎯", text: `<strong>Set savings goals:</strong> Breaking your savings into named goals (emergency fund, vacation, etc.) makes it 2x more likely you'll hit them.` });

    // Emergency fund check
    const monthlyExpenses = totalExpenses / Math.max(new Set(expenses.map(e => new Date(e.date).getMonth())).size, 1);
    const emergencyGoal = goals.find(g => g.goalName.toLowerCase().includes("emergency"));
    if (!emergencyGoal && monthlyExpenses > 0) tips.push({ type: "info", icon: "🛡️", text: `<strong>Build an emergency fund:</strong> Aim for 3–6 months of expenses (₹${Math.round(monthlyExpenses * 3).toLocaleString("en-IN")}–₹${Math.round(monthlyExpenses * 6).toLocaleString("en-IN")}) in a liquid account.` });

    // Generic good
    if (tips.length === 0) tips.push({ type: "good", icon: "🎉", text: `<strong>Looking good!</strong> Your finances are in healthy shape. Keep tracking regularly and stay consistent.` });

    el.innerHTML = tips.map(t =>
        `<div class="insight-item ${t.type}"><span class="insight-icon">${t.icon}</span><span class="insight-text">${t.text}</span></div>`
    ).join("");
}

// totalBudgets is needed in insights — hoist
let totalBudgets = 0;

function logout() { localStorage.removeItem("token"); window.location.href = "/"; }