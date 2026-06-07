document.addEventListener(
"DOMContentLoaded",
loadInvestments
);

let editingId = null;

async function loadInvestments() {


const token =
    localStorage.getItem("token");

try {

    const response =
        await fetch(
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

    investments.forEach(investment => {

        tbody.innerHTML += `
            <tr>
                <td>${investment.investmentType}</td>
                <td>${investment.investmentName}</td>
                <td>₹${investment.investedAmount}</td>
                <td>₹${investment.currentValue}</td>

                <td>
                    <button onclick="editInvestment(${investment.id})">
                        Edit
                    </button>

                    <button onclick="deleteInvestment(${investment.id})">
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

async function saveInvestment() {


const token =
    localStorage.getItem("token");

const investment = {

    investmentType:
        document.getElementById(
            "investmentType"
        ).value,

    investmentName:
        document.getElementById(
            "investmentName"
        ).value,

    investedAmount:
        Number(
            document.getElementById(
                "investedAmount"
            ).value
        ),

    currentValue:
        Number(
            document.getElementById(
                "currentValue"
            ).value
        )
};

try {

    let response;

    if (editingId !== null) {

        response =
            await fetch(
                "/api/investments/" +
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
                            investment
                        )
                }
            );

        editingId = null;

    } else {

        response =
            await fetch(
                "/api/investments",
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
                            investment
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
        "Failed to save investment"
    );
}


}

async function editInvestment(id) {


const token =
    localStorage.getItem("token");

try {

    const response =
        await fetch(
            "/api/investments/" + id,
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

    const investment =
        await response.json();

    editingId = id;

    document.getElementById(
        "investmentType"
    ).value =
        investment.investmentType;

    document.getElementById(
        "investmentName"
    ).value =
        investment.investmentName;

    document.getElementById(
        "investedAmount"
    ).value =
        investment.investedAmount;

    document.getElementById(
        "currentValue"
    ).value =
        investment.currentValue;

} catch (error) {

    console.error(error);

}


}

async function deleteInvestment(id) {


const token =
    localStorage.getItem("token");

try {

    const response =
        await fetch(
            "/api/investments/" + id,
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

    loadInvestments();

} catch (error) {

    console.error(error);

    alert(
        "Failed to delete investment"
    );
}


}
