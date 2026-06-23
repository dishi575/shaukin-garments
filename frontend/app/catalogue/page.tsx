"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi, productsApi } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  hospital: "🏥", school: "🏫", "petrol-pump": "⛽",
  industrial: "🦺", corporate: "💼", linens: "🛏️", sarees: "🥻",
};

function CatalogueContent() {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("category") || "");
  const [bulkOnly, setBulkOnly] = useState(params.get("bulk") === "true");
  const [page, setPage] = useState(1);

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: () => categoriesApi.list().then(r => r.data) });
  const { data, isLoading } = useQuery({
    queryKey: ["products", { search, category, bulkOnly, page }],
    queryFn: () => productsApi.list({ search: search || undefined, category: category || undefined, bulk_only: bulkOnly || undefined, page, page_size: 12 }).then(r => r.data),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1">Product Catalogue</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {data?.total ?? "—"} products available
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
          <input
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none focus:ring-2"
            style={{ border: "1px solid var(--border)", background: "#fff" }}
            placeholder="Search products, fabrics, categories…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer" style={{ background: bulkOnly ? "var(--brand)" : "#fff", color: bulkOnly ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border)" }}>
          <input type="checkbox" className="sr-only" checked={bulkOnly} onChange={e => { setBulkOnly(e.target.checked); setPage(1); }} />
          <SlidersHorizontal size={14} /> Bulk only
        </label>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => { setCategory(""); setPage(1); }}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
          style={{ background: !category ? "var(--brand)" : "#fff", color: !category ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border)" }}>
          All
        </button>
        {(categories || []).map((cat: any) => (
          <button key={cat.slug} onClick={() => { setCategory(cat.slug); setPage(1); }}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5"
            style={{ background: category === cat.slug ? "var(--brand)" : "#fff", color: category === cat.slug ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border)" }}>
            {CATEGORY_ICONS[cat.slug]} {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: "var(--surface-2)" }} />
          ))}
        </div>
      ) : data?.items?.length ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.items.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
          {data.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: data.pages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
                  style={{ background: page === i + 1 ? "var(--brand)" : "#fff", color: page === i + 1 ? "#fff" : "var(--text-secondary)", border: "1px solid var(--border)" }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20" style={{ color: "var(--text-secondary)" }}>
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium">No products found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      )}
    </div>
  );
}

export default function CataloguePage() {
  return <Suspense><CatalogueContent /></Suspense>;
}
