"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "retail_customer", company: "", gst_number: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await authApi.register(form);
      setUser(data.user, data.access_token);
      router.push("/");
    } catch (err: any) { setError(err?.response?.data?.detail || "Registration failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: "var(--surface-2)" }}>
      <div className="w-full max-w-md rounded-2xl p-8" style={{ background: "#fff", border: "1px solid var(--border)" }}>
        <div className="text-center mb-8">
          <div className="font-display text-2xl font-bold mb-1" style={{ color: "var(--brand)" }}>Create account</div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Join Shaukin Garments</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[["name","Full name","text","Your name"],["email","Email","email","you@example.com"],["password","Password","password","Min 8 characters"],["phone","Phone","tel","+91 XXXXX XXXXX"]].map(([k,l,t,p]) => (
            <div key={k}>
              <label className="block text-sm font-medium mb-1.5">{l}</label>
              <input type={t} value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ border: "1px solid var(--border)" }} placeholder={p} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1.5">Account type</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ border: "1px solid var(--border)" }}>
              <option value="retail_customer">Individual / Retail</option>
              <option value="b2b_client">Business / B2B</option>
            </select>
          </div>
          {form.role === "b2b_client" && (
            <>
              {[["company","Company name","Your organization"],["gst_number","GST number (optional)","22AAAAA0000A1Z5"]].map(([k,l,p]) => (
                <div key={k}>
                  <label className="block text-sm font-medium mb-1.5">{l}</label>
                  <input value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ border: "1px solid var(--border)" }} placeholder={p} />
                </div>
              ))}
            </>
          )}
          {error && <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-60" style={{ background: "var(--brand)" }}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="text-center text-sm mt-6" style={{ color: "var(--text-secondary)" }}>
          Have an account? <Link href="/login" className="font-medium" style={{ color: "var(--brand)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
