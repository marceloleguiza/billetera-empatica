import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi Gastito",
  description: "Decime en qué vas a gastar y te digo qué tan roto estás.",
  openGraph: {
    title: "Mi Gastito 💸",
    description: "Decime en qué vas a gastar y te digo qué tan roto estás.",
    url: "https://migastito.vercel.app",
    siteName: "Mi Gastito",
    images: [
      {
        url: "https://migastito.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mi Gastito",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mi Gastito 💸",
    description: "Decime en qué vas a gastar y te digo qué tan roto estás.",
    images: ["https://migastito.vercel.app/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}