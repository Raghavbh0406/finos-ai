let gainsChart = null;

document.addEventListener("DOMContentLoaded", () => {
    if (!checkTokenExpiry()) return;
});

async function calculate() {
    const token    = localStorage.getItem("token");
    const purchase = Number(document.getElementById("purchasePrice").value);
    const selling  = Number(document.getElementById("sellingPrice").value);
    const period   = document.getElementById("holdingPeriod").value;
    if (!purchase || !selling) return;

    // Calculate frontend (also call backend for consistency)
    const gain    = selling - purchase;
    const taxRate = period === "short" ? 0.20 : 0.125;
    const tax     = gain > 0 ? gain * taxRate : 0;
    const net     = gain - tax;

    const fmt = n => "₹" + Math.abs(Math.round(n)).toLocaleString("en-IN");
    const gainColor = gain >= 0 ? "#16a34a" : "#dc2626";
    const gainPrefix = gain >= 0 ? "+" : "-";

    document.getElementById("resPurchase").textContent = fmt(purchase);
    document.getElementById("resSelling").textContent  = fmt(selling);
    document.getElementById("resGain").textContent     = gainPrefix + fmt(gain);
    document.getElementById("resGain").style.color     = gainColor;
    document.getElementById("resTax").textContent      = fmt(tax);
    document.getElementById("resNet").textContent      = (net >= 0 ? "+" : "-") + fmt(net);
    document.getElementById("resNet").style.color      = net >= 0 ? "#16a34a" : "#dc2626";

    // Also call backend
    try {
        await fetch("/api/capital-gains/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ purchasePrice: purchase, sellingPrice: selling })
        });
    } catch(e) {}

    // Chart
    if (gainsChart) gainsChart.destroy();
    gainsChart = new Chart(document.getElementById("gainsChart"), {
        type: "bar",
        data: {
            labels: ["Purchase Price", "Selling Price", "Capital Gain", "Tax Payable", "Net Profit"],
            datasets: [{
                data: [Math.round(purchase), Math.round(selling), Math.max(Math.round(gain),0), Math.round(tax), Math.max(Math.round(net),0)],
                backgroundColor: ["#94a3b8", "#2563eb", "#16a34a", "#ef4444", "#8b5cf6"],
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
}