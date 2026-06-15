document.addEventListener("DOMContentLoaded", loadSubscriptions);

let editingId = null;

const ICONS = {
    netflix: "🎬", spotify: "🎵", amazon: "📦", youtube: "▶️",
    disney: "✨", hotstar: "🏏", chatgpt: "🤖", openai: "🤖",
    gym: "💪", icloud: "☁️", google: "🔍", microsoft: "💻",
    adobe: "🎨", default: "📱"
};

function getIcon(name) {
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(ICONS)) {
        if (lower.includes(key)) return icon;
    }
    return ICONS.default;
}

function daysUntil(dateStr) {
    const today = new Date(); today.setHours(0,0,0,0);
    const target = new Date(dateStr); target.setHours(0,0,0,0);
    return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

async function loadSubscriptions() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/"; return; }

    try {
        const subs = await fetch("/api/subscriptions", {
            headers: { "Authorization": "Bearer " + token }
        }).then(r => r.json());

        const monthly  = subs.reduce((s, x) => s + x.amount, 0);
        const dueWeek  = subs.filter(x => { const d = daysUntil(x.nextBillingDate); return d >= 0 && d <= 7; }).length;

        document.getElementById("monthlyTotal").textContent  = "₹" + Math.round(monthly).toLocaleString("en-IN");
        document.getElementById("annualTotal").textContent   = "₹" + Math.round(monthly * 12).toLocaleString("en-IN");
        document.getElementById("subCount").textContent      = subs.length;
        document.getElementById("dueThisWeek").textContent   = dueWeek;

        // Due soon alert
        const dueSoon  = subs.filter(x => { const d = daysUntil(x.nextBillingDate); return d >= 0 && d <= 7; });
        const alertEl  = document.getElementById("dueAlert");
        const alertList = document.getElementById("dueAlertList");
        if (dueSoon.length > 0) {
            alertEl.style.display = "block";
            alertList.innerHTML = dueSoon.map(x => {
                const d = daysUntil(x.nextBillingDate);
                return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #fde68a;">
                    <span style="font-weight:600;">${getIcon(x.name)} ${x.name}</span>
                    <span style="color:#d97706;font-weight:600;">${d === 0 ? "Due TODAY" : "Due in " + d + " day" + (d > 1 ? "s" : "")} — ₹${x.amount.toLocaleString("en-IN")}</span>
                </div>`;
            }).join("");
        } else {
            alertEl.style.display = "none";
        }

        // Cards grid
        const grid = document.getElementById("subGrid");
        if (!subs.length) {
            grid.innerHTML = `<div class="card" style="grid-column:1/-1;text-align:center;padding:40px;color:#64748b;">
                No subscriptions yet. Add one above or use Quick Add!
            </div>`;
            return;
        }

        grid.innerHTML = subs.map(x => {
            const days       = daysUntil(x.nextBillingDate);
            const urgent     = days >= 0 && days <= 3;
            const soon       = days >= 0 && days <= 7;
            const badgeBg    = urgent ? "#fef2f2" : soon ? "#fffbeb" : "#f0fdf4";
            const badgeColor = urgent ? "#dc2626"  : soon ? "#d97706"  : "#16a34a";
            const badgeBorder= urgent ? "#fecaca"  : soon ? "#fde68a"  : "#bbf7d0";
            const daysLabel  = days < 0 ? "Overdue" : days === 0 ? "Due today" : `${days} days left`;

            return `<div class="card" style="padding:20px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
                    <div style="width:44px;height:44px;background:#eff6ff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;">${getIcon(x.name)}</div>
                    <div>
                        <div style="font-size:15px;font-weight:700;color:#0f172a;">${x.name}</div>
                        <div style="font-size:13px;color:#64748b;">Monthly</div>
                    </div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <span style="font-size:22px;font-weight:700;color:#0f172a;">₹${x.amount.toLocaleString("en-IN")}</span>
                    <span style="font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;background:${badgeBg};color:${badgeColor};border:1px solid ${badgeBorder};">${daysLabel}</span>
                </div>
                <div style="font-size:12px;color:#94a3b8;margin-bottom:12px;">Next billing: ${x.nextBillingDate}</div>
                <div style="display:flex;gap:8px;">
                    <button class="btn btn-warning" style="flex:1;justify-content:center;" onclick="editSubscription(${x.id},'${x.name}',${x.amount},'${x.nextBillingDate}')">✏️ Edit</button>
                    <button class="btn btn-danger"  style="flex:1;justify-content:center;" onclick="deleteSubscription(${x.id})">🗑 Delete</button>
                </div>
            </div>`;
        }).join("");

    } catch(err) { console.error(err); }
}

async function addSubscription() {
    const token  = localStorage.getItem("token");
    const name   = document.getElementById("subName").value.trim();
    const amount = Number(document.getElementById("subAmount").value);
    const date   = document.getElementById("subDate").value;
    if (!name || !amount || !date) { alert("Please fill in all fields."); return; }

    const url    = editingId ? "/api/subscriptions/" + editingId : "/api/subscriptions";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ name, amount, nextBillingDate: date })
    });

    editingId = null;
    document.getElementById("subName").value   = "";
    document.getElementById("subAmount").value = "";
    document.getElementById("subDate").value   = "";
    document.querySelector(".btn-primary").textContent = "💾 Add Subscription";
    loadSubscriptions();
}

function editSubscription(id, name, amount, date) {
    editingId = id;
    document.getElementById("subName").value   = name;
    document.getElementById("subAmount").value = amount;
    document.getElementById("subDate").value   = date;
    document.querySelector(".btn-primary").textContent = "💾 Update Subscription";
    document.getElementById("subName").focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteSubscription(id) {
    if (!confirm("Delete this subscription?")) return;
    const token = localStorage.getItem("token");
    await fetch("/api/subscriptions/" + id, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });
    loadSubscriptions();
}

function quickAdd(name, amount) {
    editingId = null;
    document.getElementById("subName").value   = name;
    document.getElementById("subAmount").value = amount;
    const d = new Date();
    d.setDate(d.getDate() + 30);
    document.getElementById("subDate").value = d.toISOString().split("T")[0];
    document.querySelector(".btn-primary").textContent = "💾 Add Subscription";
    document.getElementById("subName").focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}