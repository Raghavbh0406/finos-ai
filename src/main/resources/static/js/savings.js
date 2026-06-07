document.addEventListener(
    "DOMContentLoaded",
    loadGoals
);

let editingId = null;

async function loadGoals() {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
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

        goals.forEach(goal => {

            tbody.innerHTML += `
                <tr>
                    <td>${goal.goalName}</td>
                    <td>₹${goal.targetAmount}</td>
                    <td>₹${goal.savedAmount}</td>

                    <td>
                        <button onclick="editGoal(${goal.id})">
                            Edit
                        </button>

                        <button onclick="deleteGoal(${goal.id})">
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

async function saveGoal() {

    const token =
        localStorage.getItem("token");

    const goal = {

        goalName:
            document.getElementById(
                "goalName"
            ).value,

        targetAmount:
            Number(
                document.getElementById(
                    "targetAmount"
                ).value
            ),

        savedAmount:
            Number(
                document.getElementById(
                    "savedAmount"
                ).value
            )
    };

    try {

        let response;

        if (editingId !== null) {

            response =
                await fetch(
                    "/api/savings-goals/" +
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
                                goal
                            )
                    }
                );

            editingId = null;

        } else {

            response =
                await fetch(
                    "/api/savings-goals",
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
                                goal
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
            "Failed to save goal"
        );
    }
}

async function editGoal(id) {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                "/api/savings-goals/" + id,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const goal =
            await response.json();

        editingId = id;

        document.getElementById(
            "goalName"
        ).value =
            goal.goalName;

        document.getElementById(
            "targetAmount"
        ).value =
            goal.targetAmount;

        document.getElementById(
            "savedAmount"
        ).value =
            goal.savedAmount;

    } catch (error) {

        console.error(error);

    }
}

async function deleteGoal(id) {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                "/api/savings-goals/" + id,
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

        loadGoals();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete goal"
        );
    }
}