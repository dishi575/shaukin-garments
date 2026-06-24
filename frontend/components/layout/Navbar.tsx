"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useCartStore } from "@/lib/cartStore";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const count = useCartStore(s => s.count());

  return (
    <header style={{ background: "#fff", borderBottom: "1px solid var(--border)" }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold" style={{ color: "var(--brand)" }}>Shaukin</span>
          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Garments</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/catalogue" className="transition-colors" style={{ color: "var(--text-secondary)" }}>Catalogue</Link>
          <Link href="/bulk-quote" className="transition-colors" style={{ color: "var(--text-secondary)" }}>Bulk Orders</Link>
          <Link href="/#categories" className="transition-colors" style={{ color: "var(--text-secondary)" }}>Categories</Link>
          <Link href="/#contact" className="transition-colors" style={{ color: "var(--text-secondary)" }}>Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/catalogue" className="hidden md:flex p-2 rounded-lg hover:bg-gray-100">
            <Search size={18} style={{ color: "var(--text-secondary)" }} />
          </Link>
          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100">
            <ShoppingCart size={18} style={{ color: "var(--text-secondary)" }} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: "var(--brand)" }}>
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <Link href="/admin" className="hidden md:block text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "var(--brand-light)", color: "var(--brand)" }}>Admin</Link>
              )}
              <button onClick={logout} className="hidden md:block text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>Logout</button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block text-sm px-4 py-2 rounded-lg font-medium text-white" style={{ background: "var(--brand)" }}>Login</Link>
          )}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-4 text-sm" style={{ background: "#fff", borderColor: "var(--border)" }}>
          <Link href="/catalogue" onClick={() => setOpen(false)}>Catalogue</Link>
          <Link href="/bulk-quote" onClick={() => setOpen(false)}>Bulk Orders</Link>
          <Link href="/cart" onClick={() => setOpen(false)}>Cart {count > 0 && `(${count})`}</Link>
          <Link href="/#contact" onClick={() => setOpen(false)}>Contact</Link>
          {user ? (
            <>
              {user.role === "admin" && <Link href="/admin" onClick={() => setOpen(false)}>Admin Dashboard</Link>}
              <button onClick={() => { logout(); setOpen(false); }} className="text-left">Logout</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="font-medium" style={{ color: "var(--brand)" }}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
