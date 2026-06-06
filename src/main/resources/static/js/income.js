document.addEventListener(
    "DOMContentLoaded",
    loadIncome
);

let editingId = null;

async function loadIncome() {

    const token =
        localStorage.getItem("token");

    const response =
        await fetch(
            "/api/income",
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

    const incomeList =
        await response.json();

    const tbody =
        document.querySelector(
            "#incomeTable tbody"
        );

    tbody.innerHTML = "";

    incomeList.forEach(income => {

        tbody.innerHTML += `
            <tr>
                <td>${income.source}</td>
                <td>₹${income.amount}</td>
                <td>${income.date}</td>

                <td>
                    <button onclick="editIncome(${income.id})">
                        Edit
                    </button>

                    <button onclick="deleteIncome(${income.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

async function addIncome() {

    const token =
        localStorage.getItem("token");

    const income = {

        source:
            document.getElementById(
                "source"
            ).value,

        amount:
            Number(
                document.getElementById(
                    "amount"
                ).value
            ),

        date:
            document.getElementById(
                "date"
            ).value
    };

    if (editingId !== null) {

        await fetch(
            "/api/income/" + editingId,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token
                },

                body:
                    JSON.stringify(income)
            }
        );

        editingId = null;

    } else {

        await fetch(
            "/api/income",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token
                },

                body:
                    JSON.stringify(income)
            }
        );
    }

    document.getElementById(
        "source"
    ).value = "";

    document.getElementById(
        "amount"
    ).value = "";

    document.getElementById(
        "date"
    ).value = "";

    loadIncome();
}

async function editIncome(id) {

    const token =
        localStorage.getItem("token");

    const response =
        await fetch(
            "/api/income",
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

    const incomeList =
        await response.json();

    const income =
        incomeList.find(
            i => i.id === id
        );

    editingId = id;

    document.getElementById(
        "source"
    ).value = income.source;

    document.getElementById(
        "amount"
    ).value = income.amount;

    document.getElementById(
        "date"
    ).value = income.date;
}

async function deleteIncome(id) {

    const token =
        localStorage.getItem("token");

    await fetch(
        "/api/income/" + id,
        {
            method: "DELETE",

            headers: {
                "Authorization":
                    "Bearer " + token
            }
        }
    );

    loadIncome();
}