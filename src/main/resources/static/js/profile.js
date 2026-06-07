document.addEventListener(
"DOMContentLoaded",
loadProfile
);

async function loadProfile() {


const token =
    localStorage.getItem(
        "token"
    );

if (!token) {

    window.location.href =
        "/";

    return;
}

try {

    const response =
        await fetch(
            "/api/users/profile",
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to load profile"
        );
    }

    const user =
        await response.json();

    document.getElementById(
        "name"
    ).innerText =
        user.name;

    document.getElementById(
        "email"
    ).innerText =
        user.email;

} catch (error) {

    console.error(
        error
    );

    alert(
        "Failed to load profile"
    );
}


}

function logout() {


localStorage.removeItem(
    "token"
);

window.location.href =
    "/";

}
