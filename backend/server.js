const express = require("express")
const cors =  require("cors");
const mysql = require("mysql2/promise");

const app = express();
const port = 4002;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  user: "root",
  password: "root",
  host: "localhost",
  database: "bank",
  port: 8889,
});

// Test connection
async function testConnection() {
  try {
    const [rows] = await pool.execute('SELECT 1');
    console.log('MySQL connection is successful!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// Test database connection when starting the server
testConnection();


// Helper function to handle SQL queries
async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Generate OTP
function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// Create user
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password must be provided" });
  }

  try {
    // Log the incoming request data to verify it  DEBUGGING
    // console.log("Request Body:", req.body);


    // Insert the user into the users table
    const result = await query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );
    // console.log(result)
    
    const userId = result.insertId;

    //debugging 
        // Log the result to verify the insert
        // console.log("Inserted user with ID:", userId);


    // Create an account for the user
    const result2 = await query(
      "INSERT INTO accounts (user_id, amount) VALUES (?, ?)",
      [userId, 0] 
    );
    console.log(result2)

    //debugging 
        // Check if everything is working till this point
    // console.log("Account created for user ID:", userId);


    res.status(201).json({ message: "User created", userId });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong when creating the user" });
  }
});

// Login
app.post("/sessions", async (req, res) => {
  const { username, password } = req.body;

  try {
    const users = await query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Wrong username or password" });
    }

    const user = users[0];
    const token = generateOTP();

    // Store session in the database
    await query(
      "INSERT INTO sessions (user_id, token) VALUES (?, ?)",
      [user.id, token]
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong when logging in" });
  }
});

// Get account balance
app.post("/me/accounts", async (req, res) => {
  const { token } = req.body;

  console.log("TOKEN I /me/accounts:", token);


  try {
    const sessions = await query("SELECT * FROM sessions WHERE token = ?", [token]);
    // console.log("Sessions hittade:", sessions);


    if (sessions.length === 0) {
      return res.status(401).json({ error: "Invalid one-time password" });
    }

    const session = sessions[0];
    const [accounts] = await query("SELECT * FROM accounts WHERE user_id = ?", [session.user_id]);
    // console.log("Accounts hittade:", accounts);


    if (accounts.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    
    res.json({ balance: accounts.amount });
  } catch (error) {
    console.error("Error when fetching account balance:", error);

    res.status(500).json({ error: "Something went wrong when fetching account balance" });
  }
});

// Deposit money
app.post("/me/accounts/transactions", async (req, res) => {
  const { token, amount } = req.body;

//   console.log("Received token:", token);
// console.log("Received amount:", amount);
// console.log("Type of amount:", typeof amount);


  try {
    const sessions = await query("SELECT * FROM sessions WHERE token = ?", [token]);

    if (sessions.length === 0) {
      return res.status(401).json({ error: "Invalid one-time password" });
    }

    const session = sessions[0];
    const accounts = await query("SELECT * FROM accounts WHERE user_id = ?", [session.user_id]);

    if (accounts.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    const account = accounts[0];
    const newBalance = parseFloat(account.amount) + parseFloat(amount);

    // Update balance
    await query("UPDATE accounts SET amount = ? WHERE id = ?", [newBalance, account.id]); 

    res.json({ message: "Insättning lyckades", newBalance });
  } catch (error) {
    res.status(500).json({ error: "Somwthing went wrong during the deposit process" });
  }
});


app.listen(port, () => {
  console.log(`Bankens backend runs on http://localhost:${port}`);
});







