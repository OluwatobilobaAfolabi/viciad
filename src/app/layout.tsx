import type { Metadata } from "next";
import { Archivo, Bricolage_Grotesque, Geist } from "next/font/google";
import { SiteLoader } from "@/components/site-loader";
import { LOADER_HEAD_SCRIPT } from "@/lib/site-loader";

import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

/* Headline face for the redesign; the width axis lets headlines run condensed. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VICIAD | Engineering That Holds. Construction That Lasts.",
    template: "%s | VICIAD",
  },
  description:
    "Quality-assured engineering services capable of satisfying the most stringent requirements of our clients, wherever required, using the best available technical skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the loader's head script may mark <html> before hydration.
    <html
      lang="en"
      className={`${archivo.variable} ${bricolage.variable} ${geist.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Must run during parsing, before first paint: next/script's
            beforeInteractive queues inline code until Next's runtime loads. */}
        <script dangerouslySetInnerHTML={{ __html: LOADER_HEAD_SCRIPT }} />
      </head>
      <body className="font-body antialiased">
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
