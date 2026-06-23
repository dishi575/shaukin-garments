"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi, categoriesApi, api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Plus, Package, Tag, ShoppingBag, LogOut } from "lucide-react";

export default function AdminPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState<"products"|"add">("products");
  const [form, setForm] = useState({ name: "", slug: "", category_id: "", description: "", fabric: "", price_retail: "", price_bulk: "", moq: "10", stock: "0", product_type: "uniform", is_bulk_available: true, is_retail_available: true });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user && user.role !== "admin") router.push("/");
    if (!user) router.push("/login");
  }, [user]);

  const { data: products, refetch } = useQuery({ queryKey: ["admin-products"], queryFn: () => productsApi.list({ page_size: 50 }).then(r => r.data) });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: () => categoriesApi.list().then(r => r.data) });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg("");
    try {
      await api.post("/api/products", { ...form, price_retail: parseFloat(form.price_retail), price_bulk: form.price_bulk ? parseFloat(form.price_bulk) : null, moq: parseInt(form.moq), stock: parseInt(form.stock) });
      setMsg("Product added!"); refetch();
      setForm({ name: "", slug: "", category_id: "", description: "", fabric: "", price_retail: "", price_bulk: "", moq: "10", stock: "0", product_type: "uniform", is_bulk_available: true, is_retail_available: true });
      setTab("products");
    } catch (err: any) { setMsg(err?.response?.data?.detail || "Error saving product"); }
    finally { setSaving(false); }
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Welcome, {user.name}</p>
        </div>
        <button onClick={() => { logout(); router.push("/"); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border" style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: <Package size={20} />, label: "Products", value: products?.total ?? "—" },
          { icon: <Tag size={20} />, label: "Categories", value: categories?.length ?? "—" },
          { icon: <ShoppingBag size={20} />, label: "Orders", value: "—" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3 mb-2">
              <span style={{ color: "var(--brand)" }}>{s.icon}</span>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{s.label}</span>
            </div>
            <div className="font-display text-3xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["products", "add"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all"
            style={{ background: tab === t ? "var(--brand)" : "#fff", color: tab === t ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border)" }}>
            {t === "add" ? <span className="flex items-center gap-1"><Plus size={14} /> Add product</span> : "Products"}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <table className="w-full text-sm">
            <thead style={{ background: "var(--surface-2)" }}>
              <tr>
                {["Name", "Category", "Price (Retail)", "Price (Bulk)", "Stock", "MOQ"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(products?.items || []).map((p: any, i: number) => (
                <tr key={p.id} style={{ borderTop: "1px solid var(--border)", background: i % 2 === 0 ? "#fff" : "var(--surface)" }}>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{p.category?.name || "—"}</td>
                  <td className="px-4 py-3">&#8377;{p.price_retail}</td>
                  <td className="px-4 py-3">{p.price_bulk ? `₹${p.price_bulk}` : "—"}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.moq}</td>
                </tr>
              ))}
              {!products?.items?.length && (
                <tr><td colSpan={6} className="text-center py-12" style={{ color: "var(--text-secondary)" }}>No products yet — add your first one</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === "add" && (
        <div className="rounded-2xl p-8" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <h2 className="font-semibold text-lg mb-6">Add new product</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[["name","Product name*","text"],["slug","URL slug* (e.g. doctor-coat)","text"],["fabric","Fabric","text"],["description","Description","text"]].map(([k,l,t]) => (
              <div key={k} className={k === "description" ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium mb-1.5">{l}</label>
                <input required={l.includes("*")} type={t} value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ border: "1px solid var(--border)" }} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ border: "1px solid var(--border)" }}>
                <option value="">Select category</option>
                {(categories || []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Product type</label>
              <select value={form.product_type} onChange={e => setForm(f => ({ ...f, product_type: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ border: "1px solid var(--border)" }}>
                {["uniform","linen","accessory","saree","other"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {[["price_retail","Retail price (₹)*"],["price_bulk","Bulk price (₹)"],["moq","Min order qty"],["stock","Stock qty"]].map(([k,l]) => (
              <div key={k}>
                <label className="block text-sm font-medium mb-1.5">{l}</label>
                <input type="number" required={l.includes("*")} value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ border: "1px solid var(--border)" }} />
              </div>
            ))}
            <div className="flex gap-6 md:col-span-2">
              {[["is_bulk_available","Available for bulk orders"],["is_retail_available","Available for individual purchase"]].map(([k,l]) => (
                <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.checked }))} className="w-4 h-4 accent-brand" />
                  {l}
                </label>
              ))}
            </div>
            {msg && <p className="md:col-span-2 text-sm font-medium" style={{ color: msg.includes("added") ? "var(--success)" : "var(--error)" }}>{msg}</p>}
            <div className="md:col-span-2">
              <button type="submit" disabled={saving} className="px-8 py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-60" style={{ background: "var(--brand)" }}>
                {saving ? "Saving…" : "Add product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
