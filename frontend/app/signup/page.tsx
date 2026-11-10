"use client";

import { useState } from "react";

export default function RegisterPage() {
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();

setMessage("");
setIsSuccess(false);
setLoading(true);

try {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username.trim(),
        email: email.trim(),
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  setMessage("Account created successfully! You can now log in.");
  setIsSuccess(true);

  setUsername("");
  setEmail("");
  setPassword("");
} catch (error) {
  setMessage(
    error instanceof Error
      ? error.message
      : "Something went wrong. Please try again."
  );
} finally {
  setLoading(false);
}


}

return ( <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white"> <h1 className="text-center text-2xl font-bold text-yellow-400">
CREATE YOUR MANTRIX ACCOUNT </h1>


  <form
    className="mt-6 flex w-full max-w-sm flex-col gap-4"
    onSubmit={handleSubmit}
  >
    <input
      className="w-full rounded-lg border border-yellow-400/30 bg-zinc-900 p-3 text-white placeholder:text-zinc-500 outline-none focus:border-yellow-400"
      type="text"
      name="username"
      placeholder="Enter your username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      autoComplete="username"
      required
    />

    <input
      className="w-full rounded-lg border border-yellow-400/30 bg-zinc-900 p-3 text-white placeholder:text-zinc-500 outline-none focus:border-yellow-400"
      type="email"
      name="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      autoComplete="email"
      required
    />

    <input
      className="w-full rounded-lg border border-yellow-400/30 bg-zinc-900 p-3 text-white placeholder:text-zinc-500 outline-none focus:border-yellow-400"
      type="password"
      name="password"
      placeholder="Create a password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      autoComplete="new-password"
      required
    />

    <button
      className="rounded-lg bg-yellow-400 p-3 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
      type="submit"
      disabled={loading}
    >
      {loading ? "Creating Account..." : "Create Account"}
    </button>

    {message && (
      <p
        role="status"
        className={`text-center text-sm ${
          isSuccess ? "text-green-400" : "text-red-400"
        }`}
      >
        {message}
      </p>
    )}
  </form>
</main>


);
}
