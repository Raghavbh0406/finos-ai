document.addEventListener(
"DOMContentLoaded",
checkLogin
);

function checkLogin() {

const token =
    localStorage.getItem(
        "token"
    );

if (!token) {

    window.location.href =
        "/";
}


}

async function changePassword() {


const token =
    localStorage.getItem(
        "token"
    );

const oldPassword =
    document.getElementById(
        "oldPassword"
    ).value;

const newPassword =
    document.getElementById(
        "newPassword"
    ).value;

try {

    const response =
        await fetch(
            "/api/users/change-password",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token
                },

                body: JSON.stringify({
                    oldPassword:
                        oldPassword,

                    newPassword:
                        newPassword
                })
            }
        );

    const message =
        document.getElementById(
            "message"
        );

    if (response.ok) {

        message.innerText =
            "Password updated successfully.";

        document.getElementById(
            "oldPassword"
        ).value = "";

        document.getElementById(
            "newPassword"
        ).value = "";

    } else {

        message.innerText =
            "Failed to update password.";
    }

} catch (error) {

    console.error(error);

    document.getElementById(
        "message"
    ).innerText =
        "Something went wrong.";
}


}

function toggleOldPassword() {


const field =
    document.getElementById(
        "oldPassword"
    );

field.type =
    field.type === "password"
    ? "text"
    : "password";


}

function toggleNewPassword() {


const field =
    document.getElementById(
        "newPassword"
    );

field.type =
    field.type === "password"
    ? "text"
    : "password";


}

function logout() {


localStorage.removeItem(
    "token"
);

window.location.href =
    "/";


}
document.addEventListener(
"DOMContentLoaded",
checkLogin
);

function checkLogin() {


const token =
    localStorage.getItem(
        "token"
    );

if (!token) {

    window.location.href =
        "/";
}


}

async function changePassword() {


const token =
    localStorage.getItem(
        "token"
    );

const oldPassword =
    document.getElementById(
        "oldPassword"
    ).value;

const newPassword =
    document.getElementById(
        "newPassword"
    ).value;

try {

    const response =
        await fetch(
            "/api/users/change-password",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token
                },

                body: JSON.stringify({
                    oldPassword:
                        oldPassword,

                    newPassword:
                        newPassword
                })
            }
        );

    const message =
        document.getElementById(
            "message"
        );

    if (response.ok) {

        message.innerText =
            "Password updated successfully.";

        document.getElementById(
            "oldPassword"
        ).value = "";

        document.getElementById(
            "newPassword"
        ).value = "";

    } else {

        message.innerText =
            "Failed to update password.";
    }

} catch (error) {

    console.error(error);

    document.getElementById(
        "message"
    ).innerText =
        "Something went wrong.";
}


}

function toggleOldPassword() {


const field =
    document.getElementById(
        "oldPassword"
    );

field.type =
    field.type === "password"
    ? "text"
    : "password";


}

function toggleNewPassword() {


const field =
    document.getElementById(
        "newPassword"
    );

field.type =
    field.type === "password"
    ? "text"
    : "password";


}

function logout() {


localStorage.removeItem(
    "token"
);

window.location.href =
    "/";


}
