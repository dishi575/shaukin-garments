"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { Sparkles } from "lucide-react";

export function RecommendationStrip({ productId, categorySlug, title }: { productId?: string; categorySlug?: string; title?: string }) {
  const { data: recs, isLoading } = useQuery({
    queryKey: ["recommendations", productId, categorySlug],
    queryFn: () => {
      if (productId) return api.get(`/api/recommendations/product/${productId}`).then(r => r.data);
      return api.get("/api/recommendations/home", { params: { category: categorySlug } }).then(r => r.data);
    },
    enabled: !!productId || true,
  });

  if (isLoading || !recs?.length) return null;

  return (
    <section className="py-10">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={16} style={{ color: "var(--brand)" }} />
        <h2 className="font-semibold text-lg">{title || "You might also need"}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recs.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
