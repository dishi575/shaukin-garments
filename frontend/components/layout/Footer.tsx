import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "#1A1A1A", color: "#fff" }} className="mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="font-display text-xl font-bold mb-2" style={{ color: "var(--accent)" }}>Shaukin Garments</div>
          <p className="text-sm" style={{ color: "#9CA3AF" }}>Trusted supplier of uniforms and linens to hospitals, schools, and industries across India.</p>
        </div>
        <div>
          <div className="font-medium mb-3 text-sm">Shop</div>
          <div className="flex flex-col gap-2 text-sm" style={{ color: "#9CA3AF" }}>
            <Link href="/catalogue?category=hospital">Hospital</Link>
            <Link href="/catalogue?category=school">School</Link>
            <Link href="/catalogue?category=industrial">Industrial</Link>
            <Link href="/catalogue?category=linens">Linens</Link>
          </div>
        </div>
        <div>
          <div className="font-medium mb-3 text-sm">Business</div>
          <div className="flex flex-col gap-2 text-sm" style={{ color: "#9CA3AF" }}>
            <Link href="/catalogue?bulk=true">Bulk Orders</Link>
            <Link href="/register">Create Account</Link>
            <Link href="/login">Login</Link>
          </div>
        </div>
        <div id="contact">
          <div className="font-medium mb-3 text-sm">Contact</div>
          <div className="flex flex-col gap-2 text-sm" style={{ color: "#9CA3AF" }}>
            <a href="https://wa.me/917408470002" target="_blank" rel="noreferrer">WhatsApp: +91 74084 70002</a>
            <span>Varanasi, Uttar Pradesh</span>
            <span>Pan-India delivery</span>
          </div>
        </div>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs" style={{ borderColor: "#374151", color: "#6B7280" }}>
        © {new Date().getFullYear()} Shaukin Garments. All rights reserved.
      </div>
    </footer>
  );
}
