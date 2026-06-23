"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { categoriesApi } from "@/lib/api";

const CAT_ICONS: Record<string, string> = {
  hospital:    "ti-stethoscope",
  school:      "ti-school",
  "petrol-pump": "ti-gas-station",
  industrial:  "ti-tool",
  corporate:   "ti-briefcase",
  linens:      "ti-bed",
  sarees:      "ti-shirt",
};

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  hospital:    { bg: "bg-sg-green-lt",    text: "text-sg-green" },
  school:      { bg: "bg-sg-indigo-lt",   text: "text-sg-indigo" },
  "petrol-pump":{ bg: "bg-sg-saffron-lt", text: "text-sg-saffron" },
  industrial:  { bg: "bg-gray-100",       text: "text-gray-600" },
  corporate:   { bg: "bg-blue-50",        text: "text-blue-700" },
  linens:      { bg: "bg-purple-50",      text: "text-purple-700" },
  sarees:      { bg: "bg-rose-50",        text: "text-rose-700" },
};

export function CategoryGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list().then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-sg-border animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {(data || []).map((cat: any) => {
        const icon = CAT_ICONS[cat.slug] || "ti-tag";
        const color = CAT_COLORS[cat.slug] || { bg: "bg-sg-indigo-lt", text: "text-sg-indigo" };
        return (
          <Link
            key={cat.id}
            href={`/catalogue?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-sg-border bg-sg-surface hover:border-sg-indigo hover:shadow-sm transition-all text-center"
          >
            <div className={`w-12 h-12 rounded-full ${color.bg} flex items-center justify-center`}>
              <i className={`ti ${icon} ${color.text} text-xl`} />
            </div>
            <div>
              <div className="text-xs font-medium text-sg-ink group-hover:text-sg-indigo transition-colors">
                {cat.name}
              </div>
              <div className="text-[10px] text-sg-muted mt-0.5 leading-tight hidden sm:block">
                {cat.description?.split(",")[0]}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
