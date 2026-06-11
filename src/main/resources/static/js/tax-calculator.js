let taxDonutChart = null;
let regimeCompareChart = null;

const NEW_SLABS = [
    { upto: 400000,   rate: 0  },
    { upto: 800000,   rate: 5  },
    { upto: 1200000,  rate: 10 },
    { upto: 1600000,  rate: 15 },
    { upto: 2000000,  rate: 20 },
    { upto: Infinity, rate: 30 },
];

const OLD_SLABS = [
    { upto: 250000,   rate: 0  },
    { upto: 500000,   rate: 5  },
    { upto: 1000000,  rate: 20 },
    { upto: Infinity, rate: 30 },
];

const NEW_SLAB_LABELS = [
    { label: "Up to ₹4L",       rate: 0  },
    { label: "₹4L – ₹8L",       rate: 5  },
    { label: "₹8L – ₹12L",      rate: 10 },
    { label: "₹12L – ₹16L",     rate: 15 },
    { label: "₹16L – ₹20L",     rate: 20 },
    { label: "Above ₹20L",      rate: 30 },
];

const OLD_SLAB_LABELS = [
    { label: "Up to ₹2.5L",     rate: 0  },
    { label: "₹2.5L – ₹5L",     rate: 5  },
    { label: "₹5L – ₹10L",      rate: 20 },
    { label: "Above ₹10L",      rate: 30 },
];

function calcTax(income, slabs) {
    let tax = 0, prev = 0;
    for (const slab of slabs) {
        if (income > prev) {
            const taxable = Math.min(income, slab.upto) - prev;
            tax += taxable * slab.rate / 100;
        }
        prev = slab.upto;
        if (income <= slab.upto) break;
    }
    return tax;
}

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
    renderSlabTable("NEW");
    calculate();
});

function calculate() {
    const income = Number(document.getElementById("annualIncome").value);
    const regime = document.getElementById("regime").value;
    if (!income) return;

    renderSlabTable(regime);

    const slabs = regime === "NEW" ? NEW_SLABS : OLD_SLABS;
    const tax    = calcTax(income, slabs);
    const inhand = income - tax;
    const effRate = income > 0 ? ((tax / income) * 100).toFixed(2) : "0.00";

    const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
    document.getElementById("res-income").textContent  = fmt(income);
    document.getElementById("res-tax").textContent     = fmt(tax);
    document.getElementById("res-inhand").textContent  = fmt(inhand);
    document.getElementById("res-rate").textContent    = effRate + "%";
    document.getElementById("res-monthly").textContent = fmt(inhand / 12);

    // Donut
    if (taxDonutChart) taxDonutChart.destroy();
    taxDonutChart = new Chart(document.getElementById("taxDonut"), {
        type: "doughnut",
        data: {
            labels: ["Tax Payable", "Take-Home"],
            datasets: [{ data: [Math.round(tax), Math.round(inhand)],
                backgroundColor: ["#fca5a5", "#86efac"],
                borderWidth: 2, borderColor: "#fff" }]
        },
        options: { responsive: true, maintainAspectRatio: true,
            plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 12 } } } } }
    });

    // Old vs New comparison
    const newTax = calcTax(income, NEW_SLABS);
    const oldTax = calcTax(income, OLD_SLABS);

    if (regimeCompareChart) regimeCompareChart.destroy();
    regimeCompareChart = new Chart(document.getElementById("regimeCompare"), {
        type: "bar",
        data: {
            labels: ["Tax Payable", "Take-Home Income"],
            datasets: [
                { label: "New Regime", data: [Math.round(newTax), Math.round(income - newTax)], backgroundColor: "#2563eb", borderRadius: 6 },
                { label: "Old Regime", data: [Math.round(oldTax), Math.round(income - oldTax)], backgroundColor: "#94a3b8", borderRadius: 6 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: true,
            plugins: { legend: { labels: { font: { size: 12 } } } },
            scales: {
                x: { grid: { display: false } },
                y: { grid: { color: "#f1f5f9" }, ticks: { callback: v => "₹" + (v/100000).toFixed(0) + "L" } }
            }
        }
    });
}

function renderSlabTable(regime) {
    const labels = regime === "NEW" ? NEW_SLAB_LABELS : OLD_SLAB_LABELS;
    document.getElementById("slabTitle").textContent = (regime === "NEW" ? "New" : "Old") + " Regime Slabs";
    document.getElementById("slabTable").innerHTML = labels.map(s =>
        `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f1f5f9;">
            <span style="color:#374151;">${s.label}</span>
            <span style="font-weight:600;color:${s.rate === 0 ? '#16a34a' : '#374151'};">${s.rate}%</span>
        </div>`
    ).join("");
}