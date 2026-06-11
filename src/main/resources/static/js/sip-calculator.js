let sipDonutChart = null;
let sipGrowthChart = null;

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    calculate();
});

async function calculate() {
    const token = localStorage.getItem("token");
    const monthly = Number(document.getElementById("monthlyInvestment").value);
    const years   = Number(document.getElementById("years").value);
    const ret     = Number(document.getElementById("expectedReturn").value);
    if (!monthly || !years || !ret) return;

    try {
        const res = await fetch("/api/sip/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ monthlyInvestment: monthly, years: years, expectedReturn: ret })
        });
        const data = await res.json();

        const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
        document.getElementById("res-invested").textContent = fmt(data.investedAmount);
        document.getElementById("res-returns").textContent  = fmt(data.wealthGained);
        document.getElementById("res-total").textContent    = fmt(data.estimatedValue);

        // Rule of 72
        const doubleYrs = (72 / ret).toFixed(1);
        document.getElementById("rule72").textContent = `At ${ret}% return, your money doubles every ~${doubleYrs} years.`;

        // Donut
        if (sipDonutChart) sipDonutChart.destroy();
        sipDonutChart = new Chart(document.getElementById("sipDonut"), {
            type: "doughnut",
            data: {
                labels: ["Invested Amount", "Estimated Returns"],
                datasets: [{ data: [data.investedAmount, data.wealthGained],
                    backgroundColor: ["#bfdbfe", "#2563eb"], borderWidth: 2, borderColor: "#fff" }]
            },
            options: { responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 12 } } } } }
        });

        // Year-by-year growth chart
        const labels = [], invested = [], value = [];
        for (let y = 1; y <= years; y++) {
            const m = y * 12;
            const r = ret / 12 / 100;
            const fv = monthly * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
            labels.push("Yr " + y);
            invested.push(Math.round(monthly * m));
            value.push(Math.round(fv));
        }

        if (sipGrowthChart) sipGrowthChart.destroy();
        sipGrowthChart = new Chart(document.getElementById("sipGrowth"), {
            type: "line",
            data: {
                labels,
                datasets: [
                    { label: "Invested Amount", data: invested, borderColor: "#94a3b8", backgroundColor: "rgba(148,163,184,0.1)", fill: true, tension: 0.4, borderDash: [5,5] },
                    { label: "Portfolio Value",  data: value,    borderColor: "#2563eb", backgroundColor: "rgba(37,99,235,0.1)",   fill: true, tension: 0.4, pointRadius: 3 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: true,
                plugins: { legend: { labels: { font: { size: 12 } } } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + (v/100000).toFixed(1) + "L" } }
                }
            }
        });
    } catch (err) { console.error(err); }
}