import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// Din kod här. Skriv dina arrayer
const users = [];
const accounts = [];
const sessions = [];

// Din kod här. Skriv dina routes:

// Skapa användare
app.post("/users", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Användarnamn och lösenord krävs" });
  }

  const userId = users.length + 101;
  users.push({ id: userId, username, password });
  accounts.push({ id: accounts.length + 1, userId, amount: 0 });

  res.status(201).json({ message: "Användare skapad", userId });
});

// Logga in
app.post("/sessions", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Fel användarnamn eller lösenord" });
  }

  const token = generateOTP();
  sessions.push({ userId: user.id, token });

  res.json({ token });
});

// Hämta saldo
app.post("/me/accounts", (req, res) => {
  const { token } = req.body;
  const session = sessions.find((s) => s.token === token);

  if (!session) {
    return res.status(401).json({ error: "Ogiltigt engångslösenord" });
  }

  const account = accounts.find((a) => a.userId === session.userId);
  res.json({ balance: account.amount });
});

// Sätt in pengar
app.post("/me/accounts/transactions", (req, res) => {
  const { token, amount } = req.body;
  const session = sessions.find((s) => s.token === token);

  if (!session) {
    return res.status(401).json({ error: "Ogiltigt engångslösenord" });
  }

  const account = accounts.find((a) => a.userId === session.userId);
  account.amount += amount;

  res.json({ message: "Insättning lyckades", newBalance: account.amount });
});

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`);
});
