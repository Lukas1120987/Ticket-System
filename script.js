let users = [];
let tickets = [];

// === Abschnitte umschalten ===
function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}

// === JSON-Daten laden ===
async function loadData() {
  const usersRes = await fetch("users.json");
  users = await usersRes.json();
  const ticketsRes = await fetch("tickets.json");
  tickets = await ticketsRes.json();

  fillUserSelects();
}

function fillUserSelects() {
  const selects = [document.getElementById("userSelect"), document.getElementById("userSelectView")];
  selects.forEach(sel => {
    sel.innerHTML = "";
    users.forEach(u => {
      const opt = document.createElement("option");
      opt.value = u.username;
      opt.textContent = u.username;
      sel.appendChild(opt);
    });
  });
}

// === Ticket kaufen ===
document.getElementById("buyForm").addEventListener("submit", e => {
  e.preventDefault();
  const user = document.getElementById("userSelect").value;
  const type = document.getElementById("ticketType").value;

  const ticketCode = "TCK-" + Math.floor(100000 + Math.random() * 900000);
  const newTicket = { user, type, code: ticketCode, redeemed: false };
  tickets.push(newTicket);

  localStorage.setItem("tickets", JSON.stringify(tickets));
  document.getElementById("buyMessage").textContent = `✅ Ticket gekauft! Deine Ticketnummer: ${ticketCode}`;
});

// === Ticket anzeigen ===
document.getElementById("viewForm").addEventListener("submit", e => {
  e.preventDefault();
  const user = document.getElementById("userSelectView").value;
  const listDiv = document.getElementById("ticketList");
  listDiv.innerHTML = "";

  const userTickets = tickets.filter(t => t.user === user);
  if (userTickets.length === 0) {
    listDiv.innerHTML = "<p>Keine Tickets gefunden.</p>";
    return;
  }

  userTickets.forEach(t => {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerHTML = `
      <p><strong>Typ:</strong> ${t.type}</p>
      <p><strong>Ticketnummer:</strong> ${t.code}</p>
      <p><strong>Status:</strong> ${t.redeemed ? "✅ Eingelöst" : "❌ Nicht eingelöst"}</p>
    `;
    listDiv.appendChild(div);
  });
});

// === Ticket einlösen ===
document.getElementById("redeemForm").addEventListener("submit", e => {
  e.preventDefault();
  const code = document.getElementById("ticketCode").value.trim();
  const msgDiv = document.getElementById("redeemMessage");

  const ticket = tickets.find(t => t.code === code);
  if (!ticket) {
    msgDiv.textContent = "❌ Ticketnummer ungültig.";
    return;
  }

  if (ticket.redeemed) {
    msgDiv.textContent = "⚠️ Dieses Ticket wurde bereits eingelöst.";
    return;
  }

  ticket.redeemed = true;
  localStorage.setItem("tickets", JSON.stringify(tickets));
  msgDiv.textContent = `✅ Ticket ${code} erfolgreich eingelöst!`;
});

loadData();
