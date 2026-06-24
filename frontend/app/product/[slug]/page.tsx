"use client";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Package, ArrowLeft, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsApi.get(slug).then(r => r.data),
    enabled: !!slug,
  });

  if (isLoading) return (
    <div className="max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--brand)", borderTopColor: "transparent" }} />
    </div>
  );

  if (!product) return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">🔍</div>
      <h1 className="font-display text-2xl font-bold mb-2">Product not found</h1>
      <Link href="/catalogue" className="text-sm font-medium" style={{ color: "var(--brand)" }}>← Back to catalogue</Link>
    </div>
  );

  const images = product.images?.length ? product.images : [];
  const whatsappMsg = `Hi, I'm interested in ${product.name} (₹${product.price_retail}). Please share more details.`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        <Link href="/catalogue" className="flex items-center gap-1 hover:underline">
          <ArrowLeft size={14} /> Catalogue
        </Link>
        <span>/</span>
        {product.category && <Link href={`/catalogue?category=${product.category.slug}`} className="hover:underline">{product.category.name}</Link>}
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative rounded-2xl overflow-hidden mb-3" style={{ aspectRatio: "1", background: "var(--surface-2)" }}>
            {images.length > 0 ? (
              <>
                <Image src={images[imgIndex]} alt={product.name} fill className="object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.9)" }}>
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => setImgIndex(i => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.9)" }}>
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ color: "var(--text-secondary)" }}>
                <Package size={48} />
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((url: string, i: number) => (
                <button key={i} onClick={() => setImgIndex(i)}
                  className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all"
                  style={{ border: imgIndex === i ? "2px solid var(--brand)" : "2px solid transparent" }}>
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <Link href={`/catalogue?category=${product.category.slug}`}
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
              style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
              {product.category.name}
            </Link>
          )}
          <h1 className="font-display text-3xl font-bold mb-2">{product.name}</h1>
          {product.fabric && <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Fabric: {product.fabric}</p>}
          {product.description && <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>{product.description}</p>}

          {/* Pricing */}
          <div className="rounded-2xl p-5 mb-6" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div className="flex items-end gap-4 mb-3">
              <div>
                <div className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Retail price</div>
                <div className="font-display text-3xl font-bold">₹{product.price_retail.toLocaleString("en-IN")}</div>
              </div>
              {product.price_bulk && (
                <div>
                  <div className="text-xs mb-1" style={{ color: "var(--success)" }}>Bulk price</div>
                  <div className="font-display text-2xl font-bold" style={{ color: "var(--success)" }}>₹{product.price_bulk.toLocaleString("en-IN")}</div>
                </div>
              )}
            </div>
            {product.is_bulk_available && (
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Bulk pricing applies from MOQ of {product.moq} pieces
              </p>
            )}
          </div>

          {/* Sizes */}
          {product.available_sizes?.length > 0 && (
            <div className="mb-5">
              <div className="text-sm font-medium mb-2">Available sizes</div>
              <div className="flex flex-wrap gap-2">
                {product.available_sizes.map((s: string) => (
                  <span key={s} className="px-3 py-1 rounded-lg text-sm border" style={{ borderColor: "var(--border)" }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.available_colors?.length > 0 && (
            <div className="mb-5">
              <div className="text-sm font-medium mb-2">Available colours</div>
              <div className="flex flex-wrap gap-2">
                {product.available_colors.map((c: string) => (
                  <span key={c} className="px-3 py-1 rounded-lg text-sm border" style={{ borderColor: "var(--border)" }}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full" style={{ background: product.stock > 0 ? "var(--success)" : "var(--error)" }} />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {product.is_retail_available && (
              <div className="flex gap-3">
                <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "var(--border)" }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-3 text-lg font-medium hover:bg-gray-50">−</button>
                  <span className="px-4 py-3 text-sm font-medium min-w-[3rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="px-3 py-3 text-lg font-medium hover:bg-gray-50">+</button>
                </div>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white" style={{ background: "var(--brand)" }}>
                  <ShoppingCart size={16} /> Add to cart
                </button>
              </div>
            )}
            {product.is_bulk_available && (
              <a href={`https://wa.me/917408470002?text=${encodeURIComponent(`Hi, I need a bulk quote for ${product.name}. MOQ: ${product.moq} pieces.`)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
                style={{ background: "#25D366" }}>
                <MessageCircle size={16} /> Request bulk quote on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
