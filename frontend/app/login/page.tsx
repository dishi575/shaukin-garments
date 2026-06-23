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
    e.preventDefault(); setError("");
    try { await login(email, password); router.push("/"); }
    catch (err: any) { setError(err?.response?.data?.detail || "Invalid email or password"); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--surface-2)" }}>
      <div className="w-full max-w-md rounded-2xl p-8" style={{ background: "#fff", border: "1px solid var(--border)" }}>
        <div className="text-center mb-8">
          <div className="font-display text-2xl font-bold mb-1" style={{ color: "var(--brand)" }}>Shaukin Garments</div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ border: "1px solid var(--border)" }} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ border: "1px solid var(--border)" }} placeholder="••••••••" />
          </div>
          {error && <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-60" style={{ background: "var(--brand)" }}>
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="text-center text-sm mt-6" style={{ color: "var(--text-secondary)" }}>
          No account? <Link href="/register" className="font-medium" style={{ color: "var(--brand)" }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
