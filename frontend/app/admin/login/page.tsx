"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flower2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin/orders");
        router.refresh();
        return;
      }
      const d = await res.json().catch(() => ({}));
      setError(
        d.detail === "too_many_attempts"
          ? "Too many attempts. Try again later."
          : "Invalid credentials.",
      );
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brume/40 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-brume"
      >
        <div className="flex items-center gap-2 justify-center mb-6">
          <Flower2 className="w-7 h-7 text-warda" />
          <span className="font-display text-2xl text-profond">Warda Admin</span>
        </div>
        <h1 className="text-lg font-medium text-profond mb-4 text-center">Login</h1>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
          className="w-full rounded-xl border border-brume px-4 py-3 mb-3 font-body"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          className="w-full rounded-xl border border-brume px-4 py-3 mb-4 font-body"
        />
        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-60"
        >
          {loading ? "..." : "Login"}
        </button>
      </form>
    </div>
  );
}
