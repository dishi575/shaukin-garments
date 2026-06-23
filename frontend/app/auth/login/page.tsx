"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid email or password");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-sg-ink mb-2">Welcome back</h1>
          <p className="text-sg-muted text-sm">Sign in to your Shaukin Garments account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-sg-surface border border-sg-border rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}
          <div>
            <label className="block text-xs font-medium text-sg-muted mb-1.5">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-sg-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sg-indigo"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-sg-muted mb-1.5">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-sg-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sg-indigo"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={isLoading}
            className="w-full bg-sg-indigo text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
          <p className="text-center text-xs text-sg-muted">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-sg-indigo hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
