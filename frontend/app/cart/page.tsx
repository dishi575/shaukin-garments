"use client";
import { useCartStore } from "@/lib/cartStore";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCartStore();

  if (!items.length) return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <ShoppingBag size={56} className="mx-auto mb-4" style={{ color: "var(--text-secondary)" }} />
      <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>Browse our catalogue and add items to get started.</p>
      <Link href="/catalogue" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white" style={{ background: "var(--brand)" }}>
        Browse Catalogue <ArrowRight size={16} />
      </Link>
    </div>
  );

  const subtotal = total();
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Your cart</h1>
        <button onClick={clearCart} className="text-sm flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
          <Trash2 size={14} /> Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 p-4 rounded-2xl" style={{ background: "#fff", border: "1px solid var(--border)" }}>
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative" style={{ background: "var(--surface-2)" }}>
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>{item.category}</p>
                <h3 className="font-semibold text-sm mb-1 truncate">{item.name}</h3>
                {item.size && <span className="text-xs px-2 py-0.5 rounded-full mr-1" style={{ background: "var(--surface-2)" }}>Size: {item.size}</span>}
                {item.color && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--surface-2)" }}>Color: {item.color}</span>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-1.5 hover:bg-gray-50 text-lg">−</button>
                    <span className="px-3 py-1.5 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-1.5 hover:bg-gray-50 text-lg">+</button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>₹{item.price} each</div>
                  </div>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 flex-shrink-0" style={{ color: "var(--error)" }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl p-6 sticky top-24" style={{ background: "#fff", border: "1px solid var(--border)" }}>
            <h2 className="font-semibold text-lg mb-5">Order summary</h2>
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Subtotal ({items.reduce((s,i) => s+i.quantity,0)} items)</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>GST (5%)</span>
                <span>₹{gst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                <span className="font-medium" style={{ color: "var(--success)" }}>Calculated at checkout</span>
              </div>
              <div className="h-px" style={{ background: "var(--border)" }} />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <Link href="/checkout" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white mb-3" style={{ background: "var(--brand)" }}>
              Proceed to checkout <ArrowRight size={16} />
            </Link>
            <Link href="/catalogue" className="w-full flex items-center justify-center py-3 rounded-xl text-sm border font-medium" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
              Continue shopping
            </Link>
            <div className="mt-5 p-3 rounded-xl text-xs" style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
              Need more than 10 pieces? <Link href="/bulk-quote" className="font-medium" style={{ color: "var(--brand)" }}>Request a bulk quote</Link> for better pricing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
