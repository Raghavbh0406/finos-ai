let loanDonutChart = null;
let loanBalanceChart = null;

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    calculate();
});

async function calculate() {
    const token = localStorage.getItem("token");
    const principal = Number(document.getElementById("loanAmount").value);
    const rate      = Number(document.getElementById("interestRate").value);
    const tenure    = Number(document.getElementById("tenureYears").value);
    if (!principal || !rate || !tenure) return;

    try {
        const res = await fetch("/api/loan/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ loanAmount: principal, interestRate: rate, tenureYears: tenure })
        });
        const data = await res.json();

        const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
        document.getElementById("res-emi").textContent       = fmt(data.emi);
        document.getElementById("res-principal").textContent = fmt(principal);
        document.getElementById("res-interest").textContent  = fmt(data.totalInterest);
        document.getElementById("res-total").textContent     = fmt(data.totalPayment);

        const intPct = ((data.totalInterest / data.totalPayment) * 100).toFixed(1);
        document.getElementById("interestShare").textContent =
            `Interest makes up ${intPct}% of your total repayment. Lower rate or shorter tenure reduces this.`;

        // Donut
        if (loanDonutChart) loanDonutChart.destroy();
        loanDonutChart = new Chart(document.getElementById("loanDonut"), {
            type: "doughnut",
            data: {
                labels: ["Principal", "Total Interest"],
                datasets: [{ data: [principal, data.totalInterest],
                    backgroundColor: ["#2563eb", "#fca5a5"], borderWidth: 2, borderColor: "#fff" }]
            },
            options: { responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 12 } } } } }
        });

        // Balance chart — yearly outstanding
        const labels = [], balance = [], interestPaid = [], principalPaid = [];
        const monthlyRate = rate / 12 / 100;
        const months = tenure * 12;
        let outstanding = principal;
        for (let y = 1; y <= tenure; y++) {
            for (let m = 0; m < 12; m++) {
                const intComp = outstanding * monthlyRate;
                const prinComp = data.emi - intComp;
                outstanding = Math.max(outstanding - prinComp, 0);
            }
            labels.push("Yr " + y);
            balance.push(Math.round(outstanding));
        }

        if (loanBalanceChart) loanBalanceChart.destroy();
        loanBalanceChart = new Chart(document.getElementById("loanBalance"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Outstanding Balance",
                    data: balance,
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239,68,68,0.08)",
                    fill: true, tension: 0.4, pointRadius: 3
                }]
            },
            options: { responsive: true, maintainAspectRatio: true,
                plugins: { legend: { labels: { font: { size: 12 } } } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + (v/100000).toFixed(0) + "L" } }
                }
            }
        });
    } catch (err) { console.error(err); }
}