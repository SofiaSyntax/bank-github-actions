"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem("token", token);
      router.push("/account");
    } else {
      alert("Wrong login!");
    }
  };

  return (
    <div className="flex flex-col items-center mt-18 h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Log In</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          type="submit"
          className="btn btn-primary text-white px-4 py-2 rounded-lg"
        >
          Log In
        </button>
      </form>
    </div>
  )
}
