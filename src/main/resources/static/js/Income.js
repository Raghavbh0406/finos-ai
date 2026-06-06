document.addEventListener(
    "DOMContentLoaded",
    loadIncome
);

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
                JSON.stringify(
                    income
                )
        }
    );

    loadIncome();
}