"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi, api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Plus, Trash2, Send, CheckCircle } from "lucide-react";

interface QuoteItem { category: string; name: string; qty: number; sizes: string }

const EMPTY_ITEM: QuoteItem = { category: "", name: "", qty: 10, sizes: "" };

export default function BulkQuotePage() {
  const { user } = useAuthStore();
  const [items, setItems] = useState<QuoteItem[]>([{ ...EMPTY_ITEM }]);
  const [form, setForm] = useState({
    guest_name: user?.name || "",
    guest_email: user?.email || "",
    guest_phone: user?.phone || "",
    guest_company: user?.company || "",
    delivery_city: "",
    delivery_state: "",
    delivery_pincode: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list().then(r => r.data),
  });

  function addItem() { setItems(prev => [...prev, { ...EMPTY_ITEM }]); }
  function removeItem(i: number) { setItems(prev => prev.filter((_, j) => j !== i)); }
  function updateItem(i: number, field: keyof QuoteItem, value: string | number) {
    setItems(prev => prev.map((item, j) => j === i ? { ...item, [field]: value } : item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.some(i => !i.name || !i.qty)) { setError("Please fill in all item details"); return; }
    setSubmitting(true); setError("");
    try {
      await api.post("/api/quotes", {
        ...form,
        items: items.map(i => ({ name: i.name, category: i.category, qty: i.qty, sizes: i.sizes })),
        user_id: user?.id || null,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to submit. Please try WhatsApp instead.");
    } finally { setSubmitting(false); }
  }

  if (submitted) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <CheckCircle size={56} className="mx-auto mb-4" style={{ color: "var(--success)" }} />
      <h1 className="font-display text-3xl font-bold mb-3">Quote request received!</h1>
      <p className="mb-2" style={{ color: "var(--text-secondary)" }}>We'll review your requirements and send a custom quote within 24 hours.</p>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>For urgent requirements, WhatsApp us directly at <strong>+91 74084 70002</strong></p>
      <a href="https://wa.me/917408470002" target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
        style={{ background: "#25D366" }}>
        Follow up on WhatsApp
      </a>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3" style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
          B2B / Institutional orders
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">Request a bulk quote</h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-sm">Fill in your requirements and we'll send a custom price quote within 24 hours. MOQ: 10 pieces per item.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Contact details */}
        <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <h2 className="font-semibold mb-5">Your details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["guest_name", "Full name *", "text"],
              ["guest_email", "Email *", "email"],
              ["guest_phone", "Phone / WhatsApp *", "tel"],
              ["guest_company", "Organisation / Company", "text"],
            ].map(([k, l, t]) => (
              <div key={k}>
                <label className="block text-sm font-medium mb-1.5">{l}</label>
                <input type={t} required={l.includes("*")} value={(form as any)[k]}
                  onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                  style={{ border: "1px solid var(--border)" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Items required</h2>
            <button type="button" onClick={addItem}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg"
              style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
              <Plus size={14} /> Add item
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {items.map((item, i) => (
              <div key={i} className="p-4 rounded-xl relative" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Category</label>
                    <select value={item.category} onChange={e => updateItem(i, "category", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm border outline-none bg-white"
                      style={{ border: "1px solid var(--border)" }}>
                      <option value="">Select</option>
                      {(categories || []).map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Item name *</label>
                    <input required value={item.name} onChange={e => updateItem(i, "name", e.target.value)}
                      placeholder="e.g. Doctor coat, Nurse uniform"
                      className="w-full px-3 py-2 rounded-lg text-sm border outline-none bg-white"
                      style={{ border: "1px solid var(--border)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Quantity *</label>
                    <input type="number" min="10" required value={item.qty}
                      onChange={e => updateItem(i, "qty", parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg text-sm border outline-none bg-white"
                      style={{ border: "1px solid var(--border)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Size breakdown</label>
                    <input value={item.sizes} onChange={e => updateItem(i, "sizes", e.target.value)}
                      placeholder="e.g. S×5, M×10, L×5"
                      className="w-full px-3 py-2 rounded-lg text-sm border outline-none bg-white"
                      style={{ border: "1px solid var(--border)" }} />
                  </div>
                </div>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg"
                    style={{ color: "var(--error)" }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery */}
        <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <h2 className="font-semibold mb-5">Delivery details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[["delivery_city","City"],["delivery_state","State"],["delivery_pincode","Pincode"]].map(([k,l]) => (
              <div key={k}>
                <label className="block text-sm font-medium mb-1.5">{l}</label>
                <input value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                  style={{ border: "1px solid var(--border)" }} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Additional notes</label>
            <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Specific colours, fabric preferences, embroidery, logo printing, delivery timeline..."
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none"
              style={{ border: "1px solid var(--border)" }} />
          </div>
        </div>

        {error && <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "#FAECE7", color: "var(--error)" }}>{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="submit" disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white disabled:opacity-60"
            style={{ background: "var(--brand)" }}>
            <Send size={16} /> {submitting ? "Submitting…" : "Submit quote request"}
          </button>
          <a href="https://wa.me/917408470002" target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-sm text-white"
            style={{ background: "#25D366" }}>
            WhatsApp instead
          </a>
        </div>
      </form>
    </div>
  );
}
