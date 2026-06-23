import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Shaukin Garments — Uniforms & Linens",
  description: "Bulk & retail supply of hospital uniforms, school uniforms, industrial workwear, OT linens, bedsheets and sarees across India.",
  keywords: "hospital uniforms, school uniforms, bulk uniform supplier, OT linen, workwear India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
