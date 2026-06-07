document.addEventListener(
    "DOMContentLoaded",
    loadBudgets
);

let editingId = null;

async function loadBudgets() {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
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

        budgets.forEach(budget => {

            tbody.innerHTML += `
                <tr>
                    <td>${budget.category}</td>
                    <td>₹${budget.limitAmount}</td>

                    <td>
                        <button onclick="editBudget(${budget.id})">
                            Edit
                        </button>

                        <button onclick="deleteBudget(${budget.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {

        console.error(error);

    }
}

async function saveBudget() {

    const token =
        localStorage.getItem("token");

    const budget = {

        category:
            document.getElementById(
                "category"
            ).value,

        limitAmount:
            Number(
                document.getElementById(
                    "limitAmount"
                ).value
            )
    };

    try {

        let response;

        if (editingId !== null) {

            response =
                await fetch(
                    "/api/budgets/" +
                    editingId,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token
                        },

                        body:
                            JSON.stringify(
                                budget
                            )
                    }
                );

            editingId = null;

        } else {

            response =
                await fetch(
                    "/api/budgets",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " + token
                        },

                        body:
                            JSON.stringify(
                                budget
                            )
                    }
                );
        }

        if (!response.ok) {

            throw new Error(
                "Save failed"
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
            "Failed to save budget"
        );
    }
}

async function editBudget(id) {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                "/api/budgets/" + id,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const budget =
            await response.json();

        editingId = id;

        document.getElementById(
            "category"
        ).value =
            budget.category;

        document.getElementById(
            "limitAmount"
        ).value =
            budget.limitAmount;

    } catch (error) {

        console.error(error);

    }
}

async function deleteBudget(id) {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                "/api/budgets/" + id,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );
        }

        loadBudgets();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete budget"
        );
    }
}