"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { ShoppingBag } from "lucide-react";

declare global { interface Window { Razorpay: any } }

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: user?.phone || "",
    address: "", city: "", state: "", pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  if (!items.length) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: "var(--text-secondary)" }} />
      <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
      <Link href="/catalogue" className="inline-block mt-4 px-6 py-3 rounded-xl font-semibold text-sm text-white" style={{ background: "var(--brand)" }}>Browse Catalogue</Link>
    </div>
  );

  const subtotal = total();
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    setLoading(true); setError("");
    try {
      const orderItems = items.map(i => ({ product_id: i.id, name: i.name, qty: i.quantity, size: i.size, color: i.color, price: i.price }));
      const { data: order } = await api.post("/api/orders", {
        items: orderItems,
        subtotal,
        gst_amount: gst,
        total: grandTotal,
        delivery_address: form.address,
        delivery_city: form.city,
        delivery_state: form.state,
        delivery_pincode: form.pincode,
      });

      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
      const rzp = new window.Razorpay({
        key: rzpKey,
        amount: grandTotal * 100,
        currency: "INR",
        name: "Shaukin Garments",
        description: `Order #${order.id?.slice(0,8)}`,
        order_id: order.razorpay_order_id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#534AB7" },
        handler: async (response: any) => {
          await api.post(`/api/orders/${order.id}/confirm`, { razorpay_payment_id: response.razorpay_payment_id });
          clearCart();
          router.push(`/orders?success=true`);
        },
      });
      rzp.open();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Checkout failed. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleCheckout} className="flex flex-col gap-5">
          <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--border)" }}>
            <h2 className="font-semibold mb-4">Contact information</h2>
            <div className="flex flex-col gap-3">
              {[["name","Full name","text"],["email","Email","email"],["phone","Phone","tel"]].map(([k,l,t]) => (
                <div key={k}>
                  <label className="block text-sm font-medium mb-1.5">{l}</label>
                  <input type={t} required value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ border: "1px solid var(--border)" }} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--border)" }}>
            <h2 className="font-semibold mb-4">Delivery address</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Street address</label>
                <textarea rows={2} required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none" style={{ border: "1px solid var(--border)" }} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[["city","City"],["state","State"],["pincode","Pincode"]].map(([k,l]) => (
                  <div key={k}>
                    <label className="block text-sm font-medium mb-1.5">{l}</label>
                    <input required value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none" style={{ border: "1px solid var(--border)" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {error && <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "#FAECE7", color: "var(--error)" }}>{error}</p>}
          {!user && (
            <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
              <Link href="/login" className="font-semibold underline">Login</Link> to place an order, or <Link href="/register" className="font-semibold underline">create an account</Link>.
            </p>
          )}
          <button type="submit" disabled={loading || !user}
            className="w-full py-4 rounded-xl font-bold text-white disabled:opacity-60"
            style={{ background: "var(--brand)" }}>
            {loading ? "Processing…" : `Pay ₹${grandTotal.toLocaleString("en-IN")} with Razorpay`}
          </button>
        </form>

        {/* Order summary */}
        <div className="rounded-2xl p-6 h-fit sticky top-24" style={{ background: "#fff", border: "1px solid var(--border)" }}>
          <h2 className="font-semibold mb-5">Order summary</h2>
          <div className="flex flex-col gap-3 mb-5">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "var(--surface-2)" }}>
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">👕</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
          <div className="h-px mb-4" style={{ background: "var(--border)" }} />
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>GST (5%)</span><span>₹{gst.toLocaleString("en-IN")}</span></div>
            <div className="h-px my-1" style={{ background: "var(--border)" }} />
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{grandTotal.toLocaleString("en-IN")}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
