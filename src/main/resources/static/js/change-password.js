document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }
});

function showFeedback(message, success) {
    const el = document.getElementById("feedbackMsg");
    if (!el) return;
    el.textContent = message;
    el.style.display = "block";
    el.style.background    = success ? "#f0fdf4" : "#fef2f2";
    el.style.border        = success ? "1px solid #bbf7d0" : "1px solid #fecaca";
    el.style.color         = success ? "#16a34a" : "#dc2626";
    setTimeout(() => { el.style.display = "none"; }, 4000);
}

async function changePassword() {
    const token       = localStorage.getItem("token");
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!oldPassword || !newPassword) {
        showFeedback("Please fill in both fields.", false);
        if (typeof showToast === "function") showToast("Please fill in both fields.", "warning");
        return;
    }
    if (newPassword.length < 6) {
        showFeedback("New password must be at least 6 characters.", false);
        if (typeof showToast === "function") showToast("New password must be at least 6 characters.", "warning");
        return;
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
            showFeedback("✅ Password updated successfully!", true);
            if (typeof showToast === "function") showToast("Password updated successfully!", "success");
            document.getElementById("oldPassword").value = "";
            document.getElementById("newPassword").value = "";
        } else {
            showFeedback("❌ Current password is incorrect.", false);
            if (typeof showToast === "function") showToast("Current password is incorrect.", "error");
        }
    } catch(e) {
        showFeedback("❌ Something went wrong. Try again.", false);
        if (typeof showToast === "function") showToast("Something went wrong. Try again.", "error");
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