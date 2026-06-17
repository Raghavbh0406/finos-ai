document.addEventListener("DOMContentLoaded", () => { if (checkTokenExpiry()) loadProfile(); });

async function loadProfile() {
    const token = localStorage.getItem("token");
    try {
        const user = await fetch("/api/users/profile", { headers: { "Authorization": "Bearer " + token } }).then(r => r.json());
        const nameEl    = document.getElementById("name");
        const emailEl   = document.getElementById("email");
        const avatarEl  = document.getElementById("avatarInitial");
        const profName  = document.getElementById("profileName");
        const profEmail = document.getElementById("profileEmail");
        if (nameEl)    nameEl.textContent    = user.name;
        if (emailEl)   emailEl.textContent   = user.email;
        if (avatarEl)  avatarEl.textContent  = user.name ? user.name.charAt(0).toUpperCase() : "?";
        if (profName)  profName.textContent  = user.name;
        if (profEmail) profEmail.textContent = user.email;
    } catch { showToast("Failed to load profile.", "error"); }
}