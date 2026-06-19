document.addEventListener("DOMContentLoaded", () => { if (!checkTokenExpiry()) return; });

async function getAdvice() {
    const token  = localStorage.getItem("token");
    const income = Number(document.getElementById("advisorIncome").value);
    if (!income) { showToast("Please enter your annual income.", "warning"); return; }

    try {
        const res  = await fetch("/api/tax-advisor/advice?income=" + income, {
            headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();

        // Backend recommendation
        document.getElementById("backendAdvice").style.display = "block";
        document.getElementById("backendAdviceText").textContent = data.recommendation;

    } catch(e) {}

    // Always show detailed frontend advice
    const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");

    const strategies = [];

    // 80C — up to 1.5L
    strategies.push({
        icon: "🏦", title: "Section 80C", limit: 150000,
        desc: "Invest in ELSS, PPF, EPF, NSC, life insurance, or 5-year FD to claim up to ₹1.5L deduction.",
        items: ["ELSS Mutual Funds", "PPF (Public Provident Fund)", "EPF Contribution", "NSC", "5-year Tax Saver FD"]
    });

    // 80D — health insurance
    strategies.push({
        icon: "🏥", title: "Section 80D", limit: income > 500000 ? 50000 : 25000,
        desc: "Health insurance premium deduction — ₹25,000 for self/family, extra ₹25,000 for parents.",
        items: ["Self & Family Health Insurance", "Parents Health Insurance", "Preventive Health Check-up (₹5,000)"]
    });

    // 80CCD(1B) — NPS
    strategies.push({
        icon: "👴", title: "Section 80CCD(1B) — NPS", limit: 50000,
        desc: "Additional ₹50,000 deduction for NPS contribution over and above 80C limit.",
        items: ["National Pension System (NPS)", "Atal Pension Yojana"]
    });

    // HRA
    if (income > 600000) {
        strategies.push({
            icon: "🏠", title: "HRA Exemption", limit: Math.round(income * 0.4),
            desc: "If you pay rent, claim HRA exemption. Keep rent receipts and landlord PAN for amounts > ₹1L/year.",
            items: ["Monthly rent receipts", "Landlord PAN (if rent > ₹8,333/month)", "Rental agreement"]
        });
    }

    // 24B — home loan interest
    strategies.push({
        icon: "🏡", title: "Section 24(b) — Home Loan", limit: 200000,
        desc: "Deduction up to ₹2L on home loan interest for self-occupied property.",
        items: ["Home Loan Interest Certificate", "Property ownership documents"]
    });

    document.getElementById("adviceCards").innerHTML = strategies.map(s => `
        <div class="card" style="padding:18px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                <span style="font-size:24px;">${s.icon}</span>
                <div>
                    <div style="font-size:14px;font-weight:700;color:#0f172a;">${s.title}</div>
                    <div style="font-size:12px;color:#16a34a;font-weight:600;">Save up to ${fmt(s.limit * 0.3)}</div>
                </div>
            </div>
            <div style="font-size:13px;color:#64748b;margin-bottom:10px;line-height:1.5;">${s.desc}</div>
            <div style="display:flex;flex-direction:column;gap:4px;">
                ${s.items.map(i => `<div style="font-size:12px;color:#374151;display:flex;align-items:center;gap:6px;"><span style="color:#16a34a;">✓</span>${i}</div>`).join("")}
            </div>
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;">
                <span style="font-size:12px;color:#64748b;">Max Deduction</span>
                <span style="font-size:13px;font-weight:700;color:#2563eb;">${fmt(s.limit)}</span>
            </div>
        </div>`
    ).join("");

    // Savings summary
    const totalDeductions = strategies.reduce((s, x) => s + x.limit, 0);
    const taxSaved        = Math.round(totalDeductions * 0.30);
    document.getElementById("savingItems").innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;">
            <div class="stat-card" style="border-left:4px solid #2563eb;"><div class="stat-label">Total Deductions Possible</div><div class="stat-value blue">${fmt(totalDeductions)}</div></div>
            <div class="stat-card" style="border-left:4px solid #16a34a;"><div class="stat-label">Max Tax You Can Save</div><div class="stat-value positive">${fmt(taxSaved)}</div></div>
            <div class="stat-card" style="border-left:4px solid #f59e0b;"><div class="stat-label">Strategies Available</div><div class="stat-value">${strategies.length}</div></div>
        </div>`;

    document.getElementById("adviceGrid").style.display    = "block";
    document.getElementById("savingSummary").style.display = "block";
    showToast("Tax saving strategies loaded!", "success");
}