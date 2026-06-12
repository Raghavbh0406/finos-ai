// Streak widget — called from dashboard.js after page load
async function loadStreak() {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch("/api/streak", {
            headers: { "Authorization": "Bearer " + token }
        });
        if (!res.ok) return;
        const data = await res.json();
        const el = document.getElementById("streakWidget");
        if (!el) return;

        const streak  = data.currentStreak || 0;
        const longest = data.longestStreak || 0;
        const fire    = streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "💧";
        const msg     = streak >= 30 ? "Incredible!" : streak >= 14 ? "On fire!" :
                        streak >= 7  ? "Great habit!" : streak >= 3  ? "Keep going!" : "Start your streak!";

        el.innerHTML = `
            <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
                <div style="text-align:center;">
                    <div style="font-size:40px;">${fire}</div>
                    <div style="font-size:28px;font-weight:800;color:#0f172a;line-height:1;">${streak}</div>
                    <div style="font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">Day Streak</div>
                </div>
                <div style="flex:1;min-width:160px;">
                    <div style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:4px;">${msg}</div>
                    <div style="font-size:13px;color:#64748b;margin-bottom:10px;">
                        ${streak === 0 ? "Log an expense today to start your streak." :
                          `You've tracked expenses ${streak} day${streak>1?"s":""} in a row.`}
                    </div>
                    <div style="display:flex;gap:6px;">
                        ${Array.from({length: Math.min(streak, 7)}, (_,i) =>
                            `<div style="width:28px;height:28px;border-radius:6px;background:${i<streak?'#2563eb':'#f1f5f9'};display:flex;align-items:center;justify-content:center;font-size:13px;">${i<streak?"✓":""}</div>`
                        ).join("")}
                    </div>
                </div>
                <div style="text-align:center;padding:12px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
                    <div style="font-size:20px;font-weight:700;color:#2563eb;">${longest}</div>
                    <div style="font-size:11px;color:#64748b;font-weight:600;">Best Streak</div>
                </div>
            </div>`;
    } catch(e) {
        // Streak API not available — show motivation instead
        const el = document.getElementById("streakWidget");
        if (el) el.innerHTML = `<div style="color:#64748b;font-size:14px;">💡 Log your expenses daily to build a streak and stay on top of your finances!</div>`;
    }
}