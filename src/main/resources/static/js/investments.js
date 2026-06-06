document.addEventListener(
    "DOMContentLoaded",
    loadInvestments
);

async function loadInvestments() {

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            "/api/investments",
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const investments =
            await response.json();

        const tbody =
            document.querySelector(
                "#investmentTable tbody"
            );

        tbody.innerHTML = "";

        investments.forEach(function(investment) {

            const row =
                document.createElement("tr");

            row.innerHTML =
                "<td>" + investment.investmentType + "</td>" +
                "<td>" + investment.investmentName + "</td>" +
                "<td>₹" + investment.investedAmount + "</td>" +
                "<td>₹" + investment.currentValue + "</td>";

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error(error);

    }
}

async function createInvestment() {

    const token =
        localStorage.getItem("token");

    const investmentType =
        document.getElementById(
            "investmentType"
        ).value;

    const investmentName =
        document.getElementById(
            "investmentName"
        ).value;

    const investedAmount =
        document.getElementById(
            "investedAmount"
        ).value;

    const currentValue =
        document.getElementById(
            "currentValue"
        ).value;

    try {

        const response = await fetch(
            "/api/investments",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token
                },

                body: JSON.stringify({
                    investmentType: investmentType,
                    investmentName: investmentName,
                    investedAmount: investedAmount,
                    currentValue: currentValue
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to create investment"
            );
        }

        document.getElementById(
            "investmentType"
        ).value = "";

        document.getElementById(
            "investmentName"
        ).value = "";

        document.getElementById(
            "investedAmount"
        ).value = "";

        document.getElementById(
            "currentValue"
        ).value = "";

        loadInvestments();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to create investment"
        );
    }
}