import type { Metadata } from "next";
import { Cinzel_Decorative, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tequio · Comunidad de Tecnología con Alma",
  description:
    "El camino no se recorre en solitario; el conocimiento y el futuro se construyen en colectivo. Tequio es un colectivo híbrido de estudiantes y profesionales que usan la tecnología como herramienta de transformación social.",
  keywords: ["tequio", "comunidad tech", "hackathon", "tecnología social", "estudiantes", "méxico"],
  openGraph: {
    title: "Tequio · Comunidad de Tecnología con Alma",
    description: "El camino no se recorre en solitario; el conocimiento y el futuro se construyen en colectivo.",
    type: "website",
    locale: "es_MX",
  },
  icons: {
    icon: "/png/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cinzel.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-azul-noche text-blanco-lunar antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
