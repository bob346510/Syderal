async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    generateCalendar();
  } else {
    alert("Credenziali errate");
  }
}

const startYear = 2026;
const startMonth = 2; // Marzo
const endYear = 2030;
const endMonth = 11; // Dicembre

async function generateCalendar() {
  const calendar = document.getElementById("calendar");

  const response = await fetch("/events");
  const events = await response.json();

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {

      if (year === startYear && month < startMonth) continue;
      if (year === endYear && month > endMonth) continue;

      const monthDiv = document.createElement("div");
      monthDiv.className = "month";

      const monthName = new Date(year, month).toLocaleString("it-IT", { month: "long" });

      monthDiv.innerHTML += `<h3>${monthName} ${year}</h3>`;

      const grid = document.createElement("div");
      grid.className = "grid";

      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${month+1}-${day}`;

        const dayDiv = document.createElement("div");
        dayDiv.className = "day";
        dayDiv.innerText = day;

        const event = events.find(e => e.date === dateString);
        if (event) {
          if (event.type === "assente") dayDiv.classList.add("absent");
          if (event.type === "ritardo") dayDiv.classList.add("late");
        }

        dayDiv.onclick = () => openMenu(dateString, dayDiv);

        grid.appendChild(dayDiv);
      }

      monthDiv.appendChild(grid);
      calendar.appendChild(monthDiv);
    }
  }
}

function openMenu(date, element) {
  const choice = prompt("Scrivi: assente oppure ritardo");

  if (!choice) return;

  fetch("/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, type: choice })
  });

  if (choice === "assente") {
    element.classList.remove("late");
    element.classList.add("absent");
  }

  if (choice === "ritardo") {
    element.classList.remove("absent");
    element.classList.add("late");
  }
}