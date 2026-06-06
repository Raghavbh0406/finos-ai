document.addEventListener(
"DOMContentLoaded",
loadExpenses
);

let editingId = null;

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
            "<td>" +
            "<button onclick='editExpense(" +
            expense.id +
            ")'>Edit</button> " +
            "<button onclick='deleteExpense(" +
            expense.id +
            ")'>Delete</button>" +
            "</td>";

        tbody.appendChild(row);

    });

} catch (error) {

    console.error(error);

}


}

async function addExpense() {


const token =
    localStorage.getItem("token");

const expense = {

    title:
        document.getElementById(
            "title"
        ).value,

    amount:
        Number(
            document.getElementById(
                "amount"
            ).value
        ),

    category:
        document.getElementById(
            "category"
        ).value,

    date:
        new Date()
            .toISOString()
            .split("T")[0]
};

try {

    let response;

    if (editingId !== null) {

        response = await fetch(
            "/api/expenses/" +
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
                        expense
                    )
            }
        );

        editingId = null;

    } else {

        response = await fetch(
            "/api/expenses",
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
                        expense
                    )
            }
        );
    }

    if (!response.ok) {

        throw new Error(
            "Operation failed"
        );
    }

    document.getElementById(
        "title"
    ).value = "";

    document.getElementById(
        "amount"
    ).value = "";

    document.getElementById(
        "category"
    ).value = "";

    loadExpenses();

} catch (error) {

    console.error(error);

    alert(
        "Failed to save expense"
    );
}


}

async function editExpense(id) {


const token =
    localStorage.getItem("token");

const response =
    await fetch(
        "/api/expenses/" + id,
        {
            headers: {
                "Authorization":
                    "Bearer " + token
            }
        }
    );

const expense =
    await response.json();

editingId = id;

document.getElementById(
    "title"
).value = expense.title;

document.getElementById(
    "amount"
).value = expense.amount;

document.getElementById(
    "category"
).value = expense.category;


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

    alert(
        "Failed to delete expense"
    );
}


}
