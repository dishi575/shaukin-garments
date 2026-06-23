"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsApi.list({ page_size: 8 }).then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-sg-border animate-pulse" />
        ))}
      </div>
    );
  }

  const products = data?.items || [];
  if (!products.length) {
    return (
      <div className="text-center py-12 text-sg-muted">
        <i className="ti ti-package text-4xl block mb-3" />
        <p>Products coming soon — add them via the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
