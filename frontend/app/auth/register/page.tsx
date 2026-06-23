"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name:"", email:"", password:"", phone:"", role:"retail_customer" as const, company:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await authApi.register(form);
      setUser(data.user, data.access_token);
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-sg-ink mb-2">Create account</h1>
          <p className="text-sg-muted text-sm">Join Shaukin Garments</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-sg-surface border border-sg-border rounded-2xl p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
          {[
            { label:"Full name", key:"name", type:"text", placeholder:"Your name" },
            { label:"Email", key:"email", type:"email", placeholder:"you@example.com" },
            { label:"Password", key:"password", type:"password", placeholder:"Min 8 characters" },
            { label:"Phone", key:"phone", type:"tel", placeholder:"10-digit mobile number" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-sg-muted mb-1.5">{f.label}</label>
              <input
                type={f.type} required={f.key !== "phone"}
                value={(form as any)[f.key]}
                onChange={(e) => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full border border-sg-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sg-indigo"
                placeholder={f.placeholder}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-sg-muted mb-1.5">Account type</label>
            <select
              value={form.role}
              onChange={(e) => setForm(p => ({ ...p, role: e.target.value as any }))}
              className="w-full border border-sg-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sg-indigo bg-white"
            >
              <option value="retail_customer">Individual / Retail</option>
              <option value="b2b_client">Business / Institution (B2B)</option>
            </select>
          </div>
          {form.role === "b2b_client" && (
            <div>
              <label className="block text-xs font-medium text-sg-muted mb-1.5">Organisation name</label>
              <input
                type="text" value={form.company}
                onChange={(e) => setForm(p => ({ ...p, company: e.target.value }))}
                className="w-full border border-sg-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-sg-indigo"
                placeholder="Hospital / School / Company name"
              />
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full bg-sg-indigo text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
          <p className="text-center text-xs text-sg-muted">
            Already registered?{" "}
            <Link href="/auth/login" className="text-sg-indigo hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
