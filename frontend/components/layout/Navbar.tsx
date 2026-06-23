"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { useAuthStore } from "@/lib/store";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <header style={{ background: "#fff", borderBottom: "1px solid var(--border)" }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold" style={{ color: "var(--brand)" }}>Shaukin</span>
          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Garments</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/catalogue" className="hover:text-brand transition-colors" style={{ color: "var(--text-secondary)" }}>Catalogue</Link>
          <Link href="/catalogue?bulk=true" className="hover:text-brand transition-colors" style={{ color: "var(--text-secondary)" }}>Bulk Orders</Link>
          <Link href="#categories" className="hover:text-brand transition-colors" style={{ color: "var(--text-secondary)" }}>Categories</Link>
          <Link href="#contact" className="hover:text-brand transition-colors" style={{ color: "var(--text-secondary)" }}>Contact</Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link href="/catalogue" className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search size={18} style={{ color: "var(--text-secondary)" }} />
          </Link>
          <Link href="/cart" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ShoppingCart size={18} style={{ color: "var(--text-secondary)" }} />
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <Link href="/admin" className="hidden md:block text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "var(--brand-light)", color: "var(--brand)" }}>Admin</Link>
              )}
              <button onClick={logout} className="hidden md:block text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>Logout</button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block text-sm px-4 py-2 rounded-lg font-medium text-white transition-opacity hover:opacity-90" style={{ background: "var(--brand)" }}>Login</Link>
          )}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-4 text-sm" style={{ background: "#fff", borderColor: "var(--border)" }}>
          <Link href="/catalogue" onClick={() => setOpen(false)}>Catalogue</Link>
          <Link href="/catalogue?bulk=true" onClick={() => setOpen(false)}>Bulk Orders</Link>
          <Link href="#contact" onClick={() => setOpen(false)}>Contact</Link>
          {user ? (
            <button onClick={() => { logout(); setOpen(false); }} className="text-left">Logout</button>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="font-medium" style={{ color: "var(--brand)" }}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
