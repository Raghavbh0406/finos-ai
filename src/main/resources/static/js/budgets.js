document.addEventListener(
    "DOMContentLoaded",
    loadBudgets
);

async function loadBudgets() {

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            "/api/budgets",
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const budgets =
            await response.json();

        const tbody =
            document.querySelector(
                "#budgetTable tbody"
            );

        tbody.innerHTML = "";

        budgets.forEach(function(budget) {

            const row =
                document.createElement("tr");

            row.innerHTML =
                "<td>" + budget.category + "</td>" +
                "<td>₹" + budget.limitAmount + "</td>";

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error(error);

    }
}

async function createBudget() {

    const token =
        localStorage.getItem("token");

    const category =
        document.getElementById(
            "category"
        ).value;

    const limitAmount =
        document.getElementById(
            "limitAmount"
        ).value;

    try {

        const response = await fetch(
            "/api/budgets",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token
                },

                body: JSON.stringify({
                    category: category,
                    limitAmount: limitAmount
                })
            }
        );

        if (!response.ok) {

            throw new Error(
                "Failed to create budget"
            );
        }

        document.getElementById(
            "category"
        ).value = "";

        document.getElementById(
            "limitAmount"
        ).value = "";

        loadBudgets();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to create budget"
        );
    }
}