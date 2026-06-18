document.addEventListener("DOMContentLoaded", () => { if (!checkTokenExpiry()) return; });

async function calculateGST() {
    const token  = localStorage.getItem("token");
    const amount = Number(document.getElementById("gstAmount").value);
    const rate   = Number(document.getElementById("gstRate").value);
    const type   = document.getElementById("gstType").value;
    if (!amount || !rate) return;

    let base, gst, total;
    if (type === "exclusive") {
        base  = amount;
        gst   = amount * rate / 100;
        total = amount + gst;
    } else {
        total = amount;
        base  = amount / (1 + rate / 100);
        gst   = total - base;
    }

    const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");
    document.getElementById("resBase").textContent  = fmt(base);
    document.getElementById("resCGST").textContent  = fmt(gst / 2);
    document.getElementById("resSGST").textContent  = fmt(gst / 2);
    document.getElementById("resGST").textContent   = fmt(gst);
    document.getElementById("resTotal").textContent = fmt(total);

    try {
        await fetch("/api/gst/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({ amount: base, gstRate: rate })
        });
    } catch(e) {}
}