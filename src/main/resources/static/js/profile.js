document.addEventListener("DOMContentLoaded", async () => {
    if (!checkTokenExpiry()) return;
    const token = localStorage.getItem("token");
    try {
        const user = await fetch("/api/users/profile", {
            headers: { "Authorization": "Bearer " + token }
        }).then(r => r.json());

        const name  = user.name  || "";
        const email = user.email || "";

        const els = {
            name:        document.getElementById("name"),
            email:       document.getElementById("email"),
            avatarInitial: document.getElementById("avatarInitial"),
            profileName:   document.getElementById("profileName"),
            profileEmail:  document.getElementById("profileEmail"),
        };

        if (els.name)          els.name.textContent          = name;
        if (els.email)         els.email.textContent         = email;
        if (els.avatarInitial) els.avatarInitial.textContent = name.charAt(0).toUpperCase() || "?";
        if (els.profileName)   els.profileName.textContent   = name;
        if (els.profileEmail)  els.profileEmail.textContent  = email;

    } catch(e) {
        const n = document.getElementById("name");
        if (n) n.textContent = "Could not load profile";
        showToast("Failed to load profile.", "error");
    }
});