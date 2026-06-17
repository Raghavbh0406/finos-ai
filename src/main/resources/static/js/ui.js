/* ═══════════════════════════════════════════
   FinOS AI — Shared UI utilities (Phase 9)
   Toast · Modal · Skeleton · Greeting · Token
   ═══════════════════════════════════════════ */

/* ── Toast ── */
function showToast(message, type = "success") {
    const existing = document.getElementById("finosToastContainer");
    if (!existing) {
        const container = document.createElement("div");
        container.id = "finosToastContainer";
        container.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;";
        document.body.appendChild(container);
    }
    const colors = {
        success: { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a", icon: "✅" },
        error:   { bg: "#fef2f2", border: "#fecaca", text: "#dc2626", icon: "❌" },
        warning: { bg: "#fffbeb", border: "#fde68a", text: "#d97706", icon: "⚠️" },
        info:    { bg: "#eff6ff", border: "#bfdbfe", text: "#2563eb", icon: "ℹ️" },
    };
    const c = colors[type] || colors.success;
    const toast = document.createElement("div");
    toast.style.cssText = `
        display:flex;align-items:center;gap:10px;
        padding:12px 16px;border-radius:10px;
        background:${c.bg};border:1px solid ${c.border};color:${c.text};
        font-family:'Inter',Arial,sans-serif;font-size:14px;font-weight:500;
        box-shadow:0 4px 20px rgba(0,0,0,0.12);
        min-width:260px;max-width:360px;
        animation:slideInToast 0.3s ease;
        cursor:pointer;
    `;
    toast.innerHTML = `<span style="font-size:16px;">${c.icon}</span><span style="flex:1;">${message}</span><span style="opacity:0.5;font-size:18px;">×</span>`;
    toast.onclick = () => dismissToast(toast);
    document.getElementById("finosToastContainer").appendChild(toast);

    if (!document.getElementById("toastStyle")) {
        const style = document.createElement("style");
        style.id = "toastStyle";
        style.textContent = `
            @keyframes slideInToast { from { transform: translateX(100px); opacity:0; } to { transform: translateX(0); opacity:1; } }
            @keyframes slideOutToast { from { transform: translateX(0); opacity:1; } to { transform: translateX(100px); opacity:0; } }
        `;
        document.head.appendChild(style);
    }
    setTimeout(() => dismissToast(toast), 3500);
}

function dismissToast(toast) {
    toast.style.animation = "slideOutToast 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
}

/* ── Confirm Modal ── */
function showConfirm(message, onConfirm) {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;";
    overlay.innerHTML = `
        <div style="background:white;border-radius:14px;padding:28px;max-width:380px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.2);font-family:'Inter',Arial,sans-serif;">
            <div style="font-size:22px;margin-bottom:12px;">🗑️</div>
            <div style="font-size:16px;font-weight:600;color:#0f172a;margin-bottom:8px;">Are you sure?</div>
            <div style="font-size:14px;color:#64748b;margin-bottom:24px;">${message}</div>
            <div style="display:flex;gap:10px;justify-content:flex-end;">
                <button id="cancelBtn" style="padding:9px 18px;border:1.5px solid #e2e8f0;border-radius:8px;background:white;color:#64748b;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;">Cancel</button>
                <button id="confirmBtn" style="padding:9px 18px;border:none;border-radius:8px;background:#ef4444;color:white;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;">Delete</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);
    document.getElementById("cancelBtn").onclick  = () => overlay.remove();
    document.getElementById("confirmBtn").onclick = () => { overlay.remove(); onConfirm(); };
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

/* ── Empty state ── */
function emptyState(icon, title, subtitle, actionLabel, actionHref) {
    return `<div style="text-align:center;padding:48px 24px;color:#64748b;">
        <div style="font-size:48px;margin-bottom:16px;">${icon}</div>
        <div style="font-size:17px;font-weight:700;color:#0f172a;margin-bottom:6px;">${title}</div>
        <div style="font-size:14px;color:#64748b;margin-bottom:20px;">${subtitle}</div>
        ${actionLabel ? `<a href="${actionHref||'#'}" style="display:inline-flex;align-items:center;gap:6px;padding:10px 20px;background:#2563eb;color:white;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">${actionLabel}</a>` : ''}
    </div>`;
}

/* ── Skeleton loader ── */
function skeletonRows(count = 3, cols = 4) {
    if (!document.getElementById("skeletonStyle")) {
        const s = document.createElement("style");
        s.id = "skeletonStyle";
        s.textContent = `@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}.skeleton{background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);background-size:400px 100%;animation:shimmer 1.4s infinite;border-radius:6px;height:16px;}`;
        document.head.appendChild(s);
    }
    return Array.from({length: count}, () =>
        `<tr>${Array.from({length: cols}, () => `<td><div class="skeleton"></div></td>`).join("")}</tr>`
    ).join("");
}

/* ── Dashboard greeting ── */
async function loadGreeting() {
    const el = document.getElementById("dashGreeting");
    if (!el) return;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const token = localStorage.getItem("token");
    try {
        const res  = await fetch("/api/users/profile", { headers: { "Authorization": "Bearer " + token } });
        const user = await res.json();
        const firstName = user.name ? user.name.split(" ")[0] : "";
        const emoji = hour < 12 ? "☀️" : hour < 17 ? "👋" : "🌙";
        el.innerHTML = `
            <div style="font-size:24px;font-weight:700;color:#0f172a;letter-spacing:-0.4px;">${greeting}, ${firstName}! ${emoji}</div>
            <div style="font-size:14px;color:#64748b;margin-top:2px;">${new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</div>`;
    } catch(e) {
        el.innerHTML = `<div style="font-size:24px;font-weight:700;color:#0f172a;">${greeting}! ${hour < 12 ? "☀️" : "👋"}</div>`;
    }
}

/* ── Token expiry check ── */
function checkTokenExpiry() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return false; }
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            showToast("Your session has expired. Please log in again.", "warning");
            setTimeout(() => window.location.href = "/", 2000);
            return false;
        }
    } catch(e) {}
    return true;
}