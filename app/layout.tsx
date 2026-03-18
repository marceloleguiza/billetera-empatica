import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Empática",
  description: "Descubrí qué gustito te podés dar este mes según tu estado financiero.",
  openGraph: {
    title: "Billetera Empática 💸",
    description: "Descubrí qué gustito te podés dar este mes.",
    url: "https://tu-url.com",
    siteName: "Billetera Empática",
    images: [
      {
        url: "https://tu-url.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Billetera Empática",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Billetera Empática 💸",
    description: "Descubrí qué gustito te podés dar este mes.",
    images: ["https://tu-url.com/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}