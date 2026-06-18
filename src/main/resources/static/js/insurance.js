document.addEventListener("DOMContentLoaded", () => { if (!checkTokenExpiry()) return; });

async function calculate() {
    const token  = localStorage.getItem("token");
    const income = Number(document.getElementById("annualIncome").value);
    const age    = Number(document.getElementById("age").value);
    if (!income || !age) return;

    try {
        const res  = await fetch("/api/insurance/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ annualIncome: income, age })
        });
        const data = await res.json();
        const fmt  = n => "₹" + Math.round(n).toLocaleString("en-IN");

        document.getElementById("resLife").textContent      = fmt(data.recommendedLifeCover);
        document.getElementById("resHealth").textContent    = fmt(data.recommendedHealthCover);
        document.getElementById("resEmergency").textContent = fmt(data.emergencyFund);
        document.getElementById("resRisk").textContent      = data.riskProfile;

        // Risk profile color
        const riskEl = document.getElementById("resRisk");
        const riskColors = { Low: "#16a34a", Medium: "#f59e0b", High: "#ef4444" };
        riskEl.style.color = riskColors[data.riskProfile] || "#2563eb";

        // Advice
        const tips = [];
        if (age < 30) tips.push({ icon:"🎯", text: "You're young — lock in low premiums now. Term insurance is cheapest in your 20s." });
        else if (age < 45) tips.push({ icon:"📋", text: "Review your coverage annually. Your responsibilities may have increased." });
        else tips.push({ icon:"⚠️", text: "Consider top-up health plans. Premium costs increase significantly after 45." });

        if (income > 1000000) tips.push({ icon:"💼", text: "With high income, consider a critical illness rider along with term plan." });
        tips.push({ icon:"🏥", text: `Target health cover of ${fmt(data.recommendedHealthCover)} for adequate hospitalisation protection.` });
        tips.push({ icon:"🛡️", text: `Your life cover of ${fmt(data.recommendedLifeCover)} is ${Math.round(data.recommendedLifeCover/income)}x your annual income — a healthy ratio.` });

        document.getElementById("adviceList").innerHTML = tips.map(t =>
            `<div class="insight-item info" style="margin-bottom:8px;"><span class="insight-icon">${t.icon}</span><span class="insight-text">${t.text}</span></div>`
        ).join("");

        document.getElementById("resultsPanel").style.display = "block";
        document.getElementById("emptyPanel").style.display   = "none";
    } catch(e) { showToast("Failed to get recommendations. Try again.", "error"); }
}