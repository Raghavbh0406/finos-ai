document.addEventListener(
    "DOMContentLoaded",
    loadExpenses
);

async function loadExpenses() {

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            "/api/expenses",
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const expenses =
            await response.json();

        const tbody =
            document.querySelector(
                "#expenseTable tbody"
            );

        tbody.innerHTML = "";

        expenses.forEach(function(expense) {

            const row =
                document.createElement("tr");

            row.innerHTML =
                "<td>" + expense.title + "</td>" +
                "<td>₹" + expense.amount + "</td>" +
                "<td>" + expense.category + "</td>" +
                "<td>" + expense.date + "</td>" +
                "<td><button onclick='deleteExpense(" +
                expense.id +
                ")'>Delete</button></td>";

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error(error);

    }
}

async function addExpense() {

    const token =
        localStorage.getItem("token");

    const title =
        document.getElementById("title").value;

    const amount =
        document.getElementById("amount").value;

    const category =
        document.getElementById("category").value;

    const today =
        new Date().toISOString().split("T")[0];

    try {

        const response = await fetch(
            "/api/expenses",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token
                },

                body: JSON.stringify({
                    title: title,
                    amount: amount,
                    category: category,
                    date: today
                })
            }
        );

        if (!response.ok) {

            throw new Error(
                "Failed to create expense"
            );
        }

        document.getElementById("title").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("category").value = "";

        loadExpenses();

    } catch (error) {

        console.error(error);

        alert("Failed to add expense");
    }
}

async function deleteExpense(id) {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                "/api/expenses/" + id,
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

        loadExpenses();

    } catch (error) {

        console.error(error);

        alert("Failed to delete expense");
    }
}