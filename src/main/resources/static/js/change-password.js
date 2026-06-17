document.addEventListener("DOMContentLoaded", () => { checkTokenExpiry(); });

async function changePassword() {
    const token       = localStorage.getItem("token");
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!oldPassword || !newPassword) {
        showToast("Please fill in both fields.", "warning"); return;
    }
    if (newPassword.length < 6) {
        showToast("New password must be at least 6 characters.", "warning"); return;
    }

    try {
        const res = await fetch("/api/users/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ oldPassword, newPassword })
        });

        if (res.ok) {
            showToast("Password updated successfully!", "success");
            document.getElementById("oldPassword").value = "";
            document.getElementById("newPassword").value = "";
        } else {
            showToast("Current password is incorrect.", "error");
        }
    } catch {
        showToast("Something went wrong. Try again.", "error");
    }
}

function toggleOldPassword() {
    const f = document.getElementById("oldPassword");
    f.type = f.type === "password" ? "text" : "password";
}

function toggleNewPassword() {
    const f = document.getElementById("newPassword");
    f.type = f.type === "password" ? "text" : "password";
}