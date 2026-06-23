"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi, productsApi } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight, Truck, Users, ShieldCheck, RefreshCw } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  hospital: "🏥", school: "🏫", "petrol-pump": "⛽",
  industrial: "🦺", corporate: "💼", linens: "🛏️", sarees: "🥻",
};

export default function HomePage() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list().then(r => r.data),
  });

  const { data: featured } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsApi.list({ page_size: 8 }).then(r => r.data),
  });

  return (
    <div>
      <section style={{ background: "linear-gradient(135deg, #1A1650 0%, #534AB7 60%, #7F77DD 100%)" }} className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-6" style={{ background: "rgba(212,168,83,0.2)", color: "#D4A853", border: "1px solid rgba(212,168,83,0.4)" }}>
              Trusted by 500+ institutions across India
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Uniforms &amp; Linens<br />
              <span style={{ color: "#D4A853" }}>Built for Institutions</span>
            </h1>
            <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.75)" }}>
              From hospital OT drapes to school blazers — bulk supply specialists. MOQ from just 10 pieces.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/catalogue?bulk=true" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm" style={{ background: "#D4A853", color: "#1A1A1A" }}>
                Request Bulk Quote <ArrowRight size={16} />
              </Link>
              <Link href="/catalogue" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff", background: "rgba(255,255,255,0.08)" }}>
                Browse Catalogue
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "#D4A853", transform: "translate(30%, -30%)" }} />
      </section>

      <section style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap justify-center md:justify-between gap-6">
          {[
            { icon: <Truck size={18} />, text: "Pan-India delivery" },
            { icon: <Users size={18} />, text: "500+ B2B clients" },
            { icon: <ShieldCheck size={18} />, text: "ISO-grade fabrics" },
            { icon: <RefreshCw size={18} />, text: "Repeat order discounts" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--brand)" }}>{t.icon}</span>{t.text}
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--brand)" }}>What we supply</p>
            <h2 className="font-display text-3xl font-bold">Shop by category</h2>
          </div>
          <Link href="/catalogue" className="hidden md:flex items-center gap-1 text-sm font-medium" style={{ color: "var(--brand)" }}>View all <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {(categories || []).map((cat: any) => (
            <Link key={cat.id} href={`/catalogue?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all hover:shadow-md"
              style={{ background: "#fff", border: "1px solid var(--border)" }}>
              <div className="text-3xl">{CATEGORY_ICONS[cat.slug] || "👕"}</div>
              <div className="text-xs font-semibold">{cat.name}</div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{cat.description?.split(",")[0]}</div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--surface-2)" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--brand)" }}>Popular picks</p>
              <h2 className="font-display text-3xl font-bold">Featured products</h2>
            </div>
            <Link href="/catalogue" className="hidden md:flex items-center gap-1 text-sm font-medium" style={{ color: "var(--brand)" }}>All products <ArrowRight size={14} /></Link>
          </div>
          {featured?.items?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.items.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl" style={{ background: "#fff", border: "1px solid var(--border)" }}>
              <div className="text-4xl mb-3">👕</div>
              <p className="font-medium mb-1">No products yet</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Add products from the admin dashboard</p>
              <Link href="/admin" className="inline-block mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--brand)" }}>Go to Admin</Link>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8" style={{ background: "linear-gradient(135deg, #1A1650, #534AB7)" }}>
          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">Need uniforms in bulk?</h2>
            <p style={{ color: "rgba(255,255,255,0.75)" }} className="max-w-md">Tell us your requirement and we will send you a custom quote within 24 hours.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a href="https://wa.me/917408470002" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl font-semibold text-sm text-white" style={{ background: "#25D366" }}>WhatsApp us</a>
            <Link href="/catalogue?bulk=true" className="px-6 py-3 rounded-xl font-semibold text-sm border" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>Submit a quote request</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
