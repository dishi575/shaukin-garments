"use client";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { Product } from "@/lib/api";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`}
      className="group rounded-2xl overflow-hidden transition-all hover:shadow-lg"
      style={{ background: "#fff", border: "1px solid var(--border)" }}>
      <div className="relative h-44 flex items-center justify-center" style={{ background: "var(--surface-2)" }}>
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex flex-col items-center gap-2" style={{ color: "var(--text-secondary)" }}>
            <Package size={32} /><span className="text-xs">No image</span>
          </div>
        )}
        {product.is_bulk_available && (
          <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--brand-light)", color: "var(--brand)" }}>Bulk</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{product.category?.name}</p>
        <h3 className="font-semibold text-sm mb-2 leading-snug">{product.name}</h3>
        <div className="flex items-end justify-between">
          <div>
            <div className="font-bold text-sm">&#8377;{product.price_retail.toLocaleString("en-IN")}</div>
            {product.price_bulk && <div className="text-xs" style={{ color: "var(--success)" }}>Bulk: &#8377;{product.price_bulk.toLocaleString("en-IN")}</div>}
          </div>
          {product.moq && product.is_bulk_available && <span className="text-xs" style={{ color: "var(--text-secondary)" }}>MOQ {product.moq}</span>}
        </div>
      </div>
    </Link>
  );
}
