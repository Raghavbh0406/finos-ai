document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {


const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "/";

    return;
}

try {

    const expenses = await (
        await fetch("/api/expenses", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
    ).json();

    const budgets = await (
        await fetch("/api/budgets", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
    ).json();

    const investments = await (
        await fetch("/api/investments", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
    ).json();

    const goals = await (
        await fetch("/api/savings-goals", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
    ).json();

    const income = await (
        await fetch("/api/income", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
    ).json();

    const totalIncome =
        income.reduce(
            (sum, i) =>
                sum + i.amount,
            0
        );

    const totalExpenses =
        expenses.reduce(
            (sum, e) =>
                sum + e.amount,
            0
        );

    const totalBudgets =
        budgets.reduce(
            (sum, b) =>
                sum + b.limitAmount,
            0
        );

    const totalInvestments =
        investments.reduce(
            (sum, i) =>
                sum + i.currentValue,
            0
        );

    const totalSavings =
        goals.reduce(
            (sum, g) =>
                sum + g.savedAmount,
            0
        );

    const portfolioGain =
        investments.reduce(
            (sum, i) =>
                sum +
                (
                    i.currentValue -
                    i.investedAmount
                ),
            0
        );

    const cashFlow =
        totalIncome -
        totalExpenses;

    const savingsRate =
        totalIncome === 0
            ? 0
            : (
                (
                    totalIncome -
                    totalExpenses
                ) /
                totalIncome
            ) * 100;

    document.getElementById(
        "totalExpenses"
    ).innerText =
        "₹" + totalExpenses;

    document.getElementById(
        "totalBudgets"
    ).innerText =
        "₹" + totalBudgets;

    document.getElementById(
        "totalInvestments"
    ).innerText =
        "₹" + totalInvestments;

    document.getElementById(
        "totalSavings"
    ).innerText =
        "₹" + totalSavings;

    document.getElementById(
        "expenseCount"
    ).innerText =
        expenses.length;

    document.getElementById(
        "investmentCount"
    ).innerText =
        investments.length;

    document.getElementById(
        "goalCount"
    ).innerText =
        goals.length;

    document.getElementById(
        "portfolioGain"
    ).innerText =
        "₹" + portfolioGain;

    document.getElementById(
        "totalIncome"
    ).innerText =
        "₹" + totalIncome;

    document.getElementById(
        "cashFlow"
    ).innerText =
        "₹" + cashFlow;

    document.getElementById(
        "savingsRate"
    ).innerText =
        savingsRate.toFixed(1)
        + "%";

    const netWorth =
        totalInvestments +
        totalSavings -
        totalExpenses;

    const totalTarget =
        goals.reduce(
            (sum, g) =>
                sum +
                g.targetAmount,
            0
        );

    const progress =
        totalTarget === 0
            ? 0
            : (
                totalSavings /
                totalTarget
            ) * 100;

    const budgetUtilization =
        totalBudgets === 0
            ? 0
            : (
                totalExpenses /
                totalBudgets
            ) * 100;

    let health = 50;

    if (portfolioGain > 0) {
        health += 15;
    }

    if (budgetUtilization < 80) {
        health += 15;
    }

    if (progress > 50) {
        health += 20;
    }

    document.getElementById(
        "netWorth"
    ).innerText =
        "₹" + netWorth;

    document.getElementById(
        "savingsProgress"
    ).innerText =
        progress.toFixed(1)
        + "%";

    document.getElementById(
        "budgetUtilization"
    ).innerText =
        budgetUtilization.toFixed(1)
        + "%";

    document.getElementById(
        "healthScore"
    ).innerText =
        Math.min(
            health,
            100
        ) + "/100";

    const insights = [];

    if (
        budgetUtilization > 100
    ) {

        insights.push(
            "You are exceeding your budget."
        );
    }

    if (
        portfolioGain > 0
    ) {

        insights.push(
            "Your investments are profitable."
        );
    }

    if (
        progress > 50
    ) {

        insights.push(
            "Savings goals are progressing well."
        );
    }

    const insightsList =
        document.getElementById(
            "insightsList"
        );

    insightsList.innerHTML = "";

    insights.forEach(
        function(item) {

            const li =
                document.createElement(
                    "li"
                );

            li.innerText =
                item;

            insightsList
                .appendChild(li);
        }
    );

    renderExpenseChart(
        expenses
    );

    renderInvestmentChart(
        investments
    );

    renderExpenseTrendChart(
        expenses
    );

    renderIncomeExpenseChart(
        totalIncome,
        totalExpenses
    );

} catch (error) {

    console.error(error);

}


}

function renderExpenseChart(expenses) {

const categoryTotals = {};

expenses.forEach(
    function(expense) {

        if (
            !categoryTotals[
                expense.category
            ]
        ) {

            categoryTotals[
                expense.category
            ] = 0;
        }

        categoryTotals[
            expense.category
        ] += expense.amount;
    }
);

new Chart(
    document.getElementById(
        "expenseChart"
    ),
    {
        type: "pie",

        data: {

            labels:
                Object.keys(
                    categoryTotals
                ),

            datasets: [
                {
                    data:
                        Object.values(
                            categoryTotals
                        )
                }
            ]
        }
    }
);


}

function renderInvestmentChart(
investments
) {


const names =
    investments.map(
        i =>
            i.investmentName
    );

const values =
    investments.map(
        i =>
            i.currentValue
    );

new Chart(
    document.getElementById(
        "investmentChart"
    ),
    {
        type: "bar",

        data: {

            labels:
                names,

            datasets: [
                {
                    label:
                        "Current Value",

                    data:
                        values
                }
            ]
        }
    }
);


}

function renderExpenseTrendChart(
expenses
) {


const monthlyTotals = {};

expenses.forEach(
    function(expense) {

        const month =
            new Date(
                expense.date
            )
            .toLocaleString(
                "default",
                {
                    month: "short"
                }
            );

        if (
            !monthlyTotals[
                month
            ]
        ) {

            monthlyTotals[
                month
            ] = 0;
        }

        monthlyTotals[
            month
        ] += expense.amount;
    }
);

new Chart(
    document.getElementById(
        "expenseTrendChart"
    ),
    {
        type: "line",

        data: {

            labels:
                Object.keys(
                    monthlyTotals
                ),

            datasets: [
                {
                    label:
                        "Monthly Expenses",

                    data:
                        Object.values(
                            monthlyTotals
                        ),

                    fill:
                        false,

                    tension:
                        0.3
                }
            ]
        }
    }
);


}

function renderIncomeExpenseChart(
totalIncome,
totalExpenses
) {


new Chart(
    document.getElementById(
        "incomeExpenseChart"
    ),
    {
        type: "bar",

        data: {

            labels: [
                "Income",
                "Expenses"
            ],

            datasets: [
                {
                    label:
                        "Amount",

                    data: [
                        totalIncome,
                        totalExpenses
                    ]
                }
            ]
        }
    }
);


}

function logout() {

localStorage.removeItem(
    "token"
);

window.location.href =
    "/";

}
