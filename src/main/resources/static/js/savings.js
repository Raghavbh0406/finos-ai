document.addEventListener(
    "DOMContentLoaded",
    loadGoals
);

async function loadGoals() {

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            "/api/savings-goals",
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const goals =
            await response.json();

        const tbody =
            document.querySelector(
                "#goalTable tbody"
            );

        tbody.innerHTML = "";

        goals.forEach(function(goal) {

            const progress =
                ((goal.savedAmount || 0) /
                 (goal.targetAmount || 1))
                 * 100;

            const row =
                document.createElement("tr");

            row.innerHTML =
                "<td>" + goal.goalName + "</td>" +
                "<td>₹" + goal.targetAmount + "</td>" +
                "<td>₹" + goal.savedAmount + "</td>" +
                "<td>" +
                progress.toFixed(1) +
                "%</td>";

            tbody.appendChild(row);

        });

    } catch (error) {

        console.error(error);

    }
}

async function createGoal() {

    const token =
        localStorage.getItem("token");

    const goalName =
        document.getElementById(
            "goalName"
        ).value;

    const targetAmount =
        document.getElementById(
            "targetAmount"
        ).value;

    const savedAmount =
        document.getElementById(
            "savedAmount"
        ).value;

    try {

        const response = await fetch(
            "/api/savings-goals",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token
                },

                body: JSON.stringify({
                    goalName: goalName,
                    targetAmount: targetAmount,
                    savedAmount: savedAmount
                })
            }
        );

        if (!response.ok) {

            throw new Error(
                "Failed to create goal"
            );
        }

        document.getElementById(
            "goalName"
        ).value = "";

        document.getElementById(
            "targetAmount"
        ).value = "";

        document.getElementById(
            "savedAmount"
        ).value = "";

        loadGoals();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to create goal"
        );
    }
}