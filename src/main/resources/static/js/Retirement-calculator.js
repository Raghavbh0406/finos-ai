let retireDonutChart = null;
let retireGrowthChart = null;

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    calculate();
});

async function calculate() {
    const token      = localStorage.getItem("token");
    const currentAge = Number(document.getElementById("currentAge").value);
    const retireAge  = Number(document.getElementById("retirementAge").value);
    const monthly    = Number(document.getElementById("monthlyInvestment").value);
    const ret        = Number(document.getElementById("expectedReturn").value);
    if (!currentAge || !retireAge || !monthly || !ret || retireAge <= currentAge) return;

    try {
        const res = await fetch("/api/retirement/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ currentAge, retirementAge: retireAge, monthlyInvestment: monthly, expectedReturn: ret })
        });
        const data = await res.json();

        const corpus    = data.retirementCorpus;
        const years     = data.yearsRemaining;
        const invested  = monthly * years * 12;
        const gained    = corpus - invested;
        const pension   = (corpus * 0.04) / 12;

        const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
        document.getElementById("res-corpus").textContent   = fmt(corpus);
        document.getElementById("res-years").textContent    = years + " years";
        document.getElementById("res-invested").textContent = fmt(invested);
        document.getElementById("res-gain").textContent     = fmt(gained);
        document.getElementById("res-pension").textContent  = fmt(pension);

        // Readiness tip
        const needCorpus = pension * 12 * 25; // rough 4% rule target
        const readEl = document.getElementById("readiness-text");
        if (corpus >= needCorpus) {
            readEl.textContent = `At ₹${Math.round(pension).toLocaleString("en-IN")}/month pension, you're well-funded for a comfortable retirement!`;
            readEl.style.color = "#16a34a";
        } else {
            const gap = needCorpus - corpus;
            readEl.textContent = `You may need ₹${Math.round(gap).toLocaleString("en-IN")} more. Consider increasing your monthly investment.`;
            readEl.style.color = "#f59e0b";
        }

        // Donut
        if (retireDonutChart) retireDonutChart.destroy();
        retireDonutChart = new Chart(document.getElementById("retireDonut"), {
            type: "doughnut",
            data: {
                labels: ["Invested Amount", "Returns"],
                datasets: [{ data: [Math.round(invested), Math.round(gained)],
                    backgroundColor: ["#bfdbfe", "#8b5cf6"], borderWidth: 2, borderColor: "#fff" }]
            },
            options: { responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 12 } } } } }
        });

        // Growth chart
        const labels = [], invData = [], corpusData = [];
        const monthlyRate = ret / 12 / 100;
        for (let y = 1; y <= years; y++) {
            const m = y * 12;
            const fv = monthly * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
            labels.push("Age " + (currentAge + y));
            invData.push(Math.round(monthly * m));
            corpusData.push(Math.round(fv));
        }

        if (retireGrowthChart) retireGrowthChart.destroy();
        retireGrowthChart = new Chart(document.getElementById("retireGrowth"), {
            type: "line",
            data: {
                labels,
                datasets: [
                    { label: "Amount Invested",  data: invData,    borderColor: "#94a3b8", backgroundColor: "rgba(148,163,184,0.1)", fill: true, tension: 0.4, borderDash: [5,5] },
                    { label: "Corpus Value",      data: corpusData, borderColor: "#8b5cf6", backgroundColor: "rgba(139,92,246,0.1)",  fill: true, tension: 0.4, pointRadius: 2 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: true,
                plugins: { legend: { labels: { font: { size: 12 } } } },
                scales: {
                    x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
                    y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + (v/100000).toFixed(0) + "L" } }
                }
            }
        });
    } catch (err) { console.error(err); }
}