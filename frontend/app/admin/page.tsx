"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsApi, categoriesApi, api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Plus, Package, Tag, ShoppingBag, LogOut, Upload, X, Image as ImageIcon } from "lucide-react";

const EMPTY_FORM = {
  name: "", slug: "", category_id: "", description: "", fabric: "",
  price_retail: "", price_bulk: "", moq: "10", stock: "0",
  product_type: "uniform", is_bulk_available: true, is_retail_available: true,
};

export default function AdminPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState<"products" | "add">("products");
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && user.role !== "admin") router.push("/");
    if (!user) router.push("/login");
  }, [user]);

  const { data: products, refetch } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => productsApi.list({ page_size: 50 }).then(r => r.data),
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list().then(r => r.data),
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const { data } = await api.post("/api/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setImages(prev => [...prev, data.url]);
      }
    } catch (err: any) {
      setMsg("Image upload failed: " + (err?.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug || !form.price_retail) {
      setMsg("Name, slug and retail price are required"); return;
    }
    setSaving(true); setMsg("");
    try {
      await api.post("/api/products", {
        ...form,
        images,
        price_retail: parseFloat(form.price_retail),
        price_bulk: form.price_bulk ? parseFloat(form.price_bulk) : null,
        moq: parseInt(form.moq),
        stock: parseInt(form.stock),
        category_id: form.category_id || null,
      });
      setMsg("✓ Product added successfully!");
      setForm(EMPTY_FORM);
      setImages([]);
      refetch();
      setTimeout(() => setTab("products"), 1000);
    } catch (err: any) {
      setMsg("Error: " + (err?.response?.data?.detail || "Failed to save"));
    } finally { setSaving(false); }
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Welcome, {user.name}</p>
        </div>
        <button onClick={() => { logout(); router.push("/"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border"
          style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
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
          <button key={t} onClick={() => { setTab(t); setMsg(""); }}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: tab === t ? "var(--brand)" : "#fff", color: tab === t ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border)" }}>
            {t === "add" ? <span className="flex items-center gap-1"><Plus size={14} /> Add product</span> : "Products"}
          </button>
        ))}
      </div>

      {/* Products table */}
      {tab === "products" && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <table className="w-full text-sm">
            <thead style={{ background: "var(--surface-2)" }}>
              <tr>
                {["Image", "Name", "Category", "Retail", "Bulk", "Stock", "MOQ"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(products?.items || []).map((p: any, i: number) => (
                <tr key={p.id} style={{ borderTop: "1px solid var(--border)", background: i % 2 === 0 ? "#fff" : "var(--surface)" }}>
                  <td className="px-4 py-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
                        <ImageIcon size={16} style={{ color: "var(--text-secondary)" }} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{p.category?.name || "—"}</td>
                  <td className="px-4 py-3">₹{p.price_retail}</td>
                  <td className="px-4 py-3">{p.price_bulk ? `₹${p.price_bulk}` : "—"}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.moq}</td>
                </tr>
              ))}
              {!products?.items?.length && (
                <tr><td colSpan={7} className="text-center py-12" style={{ color: "var(--text-secondary)" }}>No products yet — add your first one</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add product form */}
      {tab === "add" && (
        <div className="rounded-2xl p-8" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <h2 className="font-semibold text-lg mb-6">Add new product</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Image upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Product images</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {images.map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.6)" }}>
                      <X size={10} color="#fff" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-24 h-24 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all disabled:opacity-50"
                  style={{ border: "2px dashed var(--border)", color: "var(--text-secondary)" }}>
                  {uploading ? (
                    <span className="text-xs">Uploading…</span>
                  ) : (
                    <><Upload size={20} style={{ color: "var(--brand)" }} />Upload photo</>
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Upload JPG, PNG or WebP. Max 5MB per image. First image is the main photo.</p>
            </div>

            {/* Text fields */}
            {[
              ["name", "Product name *", "text"],
              ["slug", "URL slug * (e.g. doctor-coat)", "text"],
              ["fabric", "Fabric (e.g. Cotton blend)", "text"],
            ].map(([k, l, t]) => (
              <div key={k}>
                <label className="block text-sm font-medium mb-1.5">{l}</label>
                <input type={t} value={(form as any)[k]}
                  onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
                  style={{ border: "1px solid var(--border)" }} />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
                style={{ border: "1px solid var(--border)" }} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                style={{ border: "1px solid var(--border)" }}>
                <option value="">Select category</option>
                {(categories || []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Product type</label>
              <select value={form.product_type} onChange={e => setForm(f => ({ ...f, product_type: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                style={{ border: "1px solid var(--border)" }}>
                {["uniform", "linen", "accessory", "saree", "other"].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            {[
              ["price_retail", "Retail price (₹) *"],
              ["price_bulk", "Bulk price (₹)"],
              ["moq", "Min order qty (bulk)"],
              ["stock", "Stock quantity"],
            ].map(([k, l]) => (
              <div key={k}>
                <label className="block text-sm font-medium mb-1.5">{l}</label>
                <input type="number" value={(form as any)[k]}
                  onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                  style={{ border: "1px solid var(--border)" }} min="0" />
              </div>
            ))}

            <div className="md:col-span-2 flex gap-6">
              {[
                ["is_bulk_available", "Available for bulk orders"],
                ["is_retail_available", "Available for individual purchase"],
              ].map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                  <input type="checkbox" checked={(form as any)[k]}
                    onChange={e => setForm(f => ({ ...f, [k]: e.target.checked }))}
                    className="w-4 h-4 rounded" />
                  {l}
                </label>
              ))}
            </div>

            {msg && (
              <p className="md:col-span-2 text-sm font-medium px-4 py-3 rounded-xl"
                style={{ background: msg.startsWith("✓") ? "#E1F5EE" : "#FAECE7", color: msg.startsWith("✓") ? "var(--success)" : "var(--error)" }}>
                {msg}
              </p>
            )}

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="px-8 py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-60 transition-opacity"
                style={{ background: "var(--brand)" }}>
                {saving ? "Saving…" : "Add product"}
              </button>
              <button type="button" onClick={() => { setForm(EMPTY_FORM); setImages([]); setMsg(""); }}
                className="px-6 py-3 rounded-xl text-sm border font-medium"
                style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                Clear
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
