const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = 3000;

// Database temporaneo in memoria
let events = [];

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "test" && password === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Salva evento
app.post("/event", (req, res) => {
  const { date, type } = req.body;

  const existing = events.find(e => e.date === date);

  if (existing) {
    existing.type = type;
  } else {
    events.push({ date, type });
  }

  res.json({ success: true });
});

// Ottieni eventi
app.get("/events", (req, res) => {
  res.json(events);
});

app.listen(PORT, () => {
  console.log("Server attivo su http://localhost:3000");
});