// ===================== DATEN =====================
let users = ["Max", "Anna", "Tom", "Lea"];
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

// ===================== SECTION NAVIGATION =====================
function showSection(id) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.remove("visible"));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add("visible");
}

// ===================== USER DROPDOWNS =====================
function fillUserSelects() {
  const selects = [document.getElementById("userSelect"), document.getElementById("userSelectView")];
  selects.forEach(sel => {
    sel.innerHTML = "";
    users.forEach(u => {
      const opt = document.createElement("option");
      opt.value = u;
      opt.textContent = u;
      sel.appendChild(opt);
    });
  });
}
fillUserSelects();

// ===================== MODAL ELEMENTE =====================
const modal = document.getElementById("paymentModal");
const modalClose = modal.querySelector(".close");
const paymentInfo = document.getElementById("paymentInfo");
const paymentForm = document.getElementById("paymentForm");
const paymentResult = document.getElementById("paymentResult");

let currentPurchase = null;

modalClose.onclick = () => modal.style.display = "none";
window.onclick = e => { if(e.target === modal) modal.style.display = "none"; };

// ===================== TICKET KAUF / DEMO-ZAHLUNG =====================
document.getElementById("buyForm").addEventListener("submit", e => {
  e.preventDefault();
  const user = document.getElementById("userSelect").value;
  const type = document.getElementById("ticketType").value;
  const paymentMethod = document.querySelector("#buyForm select:nth-of-type(2)").value;

  currentPurchase = { user, type, paymentMethod };

  // Modal öffnen → Weiterleitungssimulation
  paymentInfo.innerHTML = `
    Du wirst zu <strong>PayFun (Demo)</strong> weitergeleitet…<br>
    <em>Lade Zahlungsseite…</em>
  `;
  paymentResult.textContent = "";
  paymentForm.style.display = "none";
  modal.style.display = "flex";

  // Nach 2 Sekunden das Vorausgefüllte Zahlungsformular zeigen
  setTimeout(() => {
    paymentInfo.innerHTML = `Bitte bestätige die Zahlung (Demo).`;
    paymentForm.style.display = "flex";
  }, 2000);
});

// ===================== DEMO-ZAHLUNG ABSCHLIEßEN =====================
paymentForm.addEventListener("submit", e => {
  e.preventDefault();
  paymentResult.textContent = "⏳ Zahlung wird verarbeitet…";

  setTimeout(() => {
    const ticketCode = "TCK-" + Math.floor(100000 + Math.random() * 900000);
    const newTicket = { ...currentPurchase, code: ticketCode, redeemed: false };
    tickets.push(newTicket);
    localStorage.setItem("tickets", JSON.stringify(tickets));

    paymentResult.innerHTML = `✅ Zahlung erfolgreich!<br>Deine Ticketnummer: <strong>${ticketCode}</strong>`;
    document.getElementById("buyMessage").textContent = `✅ Ticket gekauft! Ticketnummer: ${ticketCode}`;
    currentPurchase = null;

    // Modal nach 3 Sekunden schließen
    setTimeout(() => modal.style.display = "none", 3000);
  }, 2000);
});

// ===================== TICKET ANZEIGEN =====================
document.getElementById("viewForm").addEventListener("submit", e => {
  e.preventDefault();
  const user = document.getElementById("userSelectView").value;
  const list = tickets.filter(t => t.user === user);
  const ticketList = document.getElementById("ticketList");
  ticketList.innerHTML = "";

  if (list.length === 0) {
    ticketList.textContent = "Keine Tickets gefunden.";
    return;
  }

  list.forEach(t => {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerHTML = `
      <p><strong>Ticketnummer:</strong> ${t.code}</p>
      <p><strong>Typ:</strong> ${t.type}</p>
      <p><strong>Status:</strong> ${t.redeemed ? "✅ Eingelöst" : "❌ Nicht eingelöst"}</p>
    `;
    ticketList.appendChild(div);
  });
});

// ===================== TICKET EINLÖSEN =====================
document.getElementById("redeemForm").addEventListener("submit", e => {
  e.preventDefault();
  const code = document.getElementById("ticketCode").value.trim();
  const ticket = tickets.find(t => t.code === code);
  const msg = document.getElementById("redeemMessage");

  if (!ticket) {
    msg.textContent = "❌ Ticketnummer ungültig.";
    return;
  }
  if (ticket.redeemed) {
    msg.textContent = "⚠️ Dieses Ticket wurde bereits eingelöst.";
    return;
  }

  ticket.redeemed = true;
  localStorage.setItem("tickets", JSON.stringify(tickets));
  msg.textContent = `✅ Ticket ${code} erfolgreich eingelöst!`;
});

// ===================== KONTAKTFORMULAR =====================
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = e.target.querySelector("input[type=text]").value;
  document.getElementById("contactMessage").textContent = `✅ Danke, ${name}! Deine Nachricht wurde gesendet.`;
  e.target.reset();
});
