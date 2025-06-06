"use client";

import { useState, useEffect } from "react";

export default function Account() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  

  async function fetchBalance() {
    if (!token) return;
    // console.log("Fetching balance with token:", token); 

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      const data = await res.json();
      // console.log("Balance from backend:", data.balance); 
      setBalance(data.balance);
    }
  }

  

  useEffect(() => {
    if (token) {
      fetchBalance();
    }
  }, [token]);

  const handleDeposit = async () => {
    if (!amount) return;
    // console.log("Token:", token, "Amount:", amount);

    const res = await fetch(  
      `${process.env.NEXT_PUBLIC_API_URL}/me/accounts/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, amount: parseFloat(amount) }),
      }
      
    );
    // console.log(res);
    // console.log("Statu code:", res.status, "Response:", await res.text());


    if (res.ok) {
        // console.log("Deposit answer from backend:", await res.json()); 
        // console.log("Calling fetchBalance after deposit...");

      await fetchBalance();
      setAmount("");
    } else {
      alert("Sorry, something went wrong"); 
    }
  };

  return (
    <div className="flex flex-col items-center mt-18 h-screen">
      <h2 className="text-2xl font-bold mb-4">Account Balance: {balance} $</h2>
      <div className="flex gap-2">
        <input
          type="number"
          min="1"
          placeholder="Deposit amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-40"
        />
        <button
          onClick={handleDeposit}
          className="btn btn-primary text-white px-4 py-2 rounded-lg"
        >
          Deposit
        </button>
      </div>
    </div>
  )
}


  




