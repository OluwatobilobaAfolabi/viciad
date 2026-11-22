import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { JsonLd, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from "@/components/seo/json-ld";
import { SiteLoader } from "@/components/site-loader";
import { LOADER_HEAD_SCRIPT } from "@/lib/site-loader";

import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.viciad.org"),
  title: {
    default: "Engineering That Holds. Construction That Lasts. | VICIAD",
    template: "%s | VICIAD",
  },
  description:
    "VICIAD delivers engineering that holds and construction that lasts. 147+ completed civil, road, and marine projects across Nigeria. Partner with us today.",
  keywords: [
    "Engineering That Holds Construction That Lasts",
    "Engineering That Holds",
    "Construction That Lasts",
    "VICIAD",
    "Viciad Engineering & Construction",
    "civil construction company in Nigeria",
    "road and bridge construction contractor Nigeria",
    "foundation engineering and piling contractors Rivers State",
    "marine construction and jetty contractors Nigeria",
    "hook up and commissioning engineering services",
    "detailed design engineering services Nigeria",
    "engineering feasibility studies Nigeria",
    "ISO certified construction contractor Nigeria",
    "civil engineering company Port Harcourt Rivers State",
  ],
  authors: [{ name: "VICIAD Engineering & Construction" }],
  creator: "VICIAD",
  publisher: "VICIAD",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: "https://www.viciad.org",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.viciad.org",
    siteName: "VICIAD Engineering & Construction",
    title: "Engineering That Holds. Construction That Lasts. | VICIAD",
    description:
      "VICIAD delivers engineering that holds and construction that lasts. 147+ completed civil, road, and marine projects across Nigeria. Partner with us today.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VICIAD — Engineering That Holds. Construction That Lasts.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering That Holds. Construction That Lasts. | VICIAD",
    description:
      "VICIAD delivers engineering that holds and construction that lasts. 147+ completed civil, road, and marine projects across Nigeria. Partner with us today.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "REPLACE_ME",
    other: {
      "msvalidate.01": "REPLACE_ME",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the loader's head script may mark <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
        <meta name="google-site-verification" content="REPLACE_ME" />
        <meta name="msvalidate.01" content="REPLACE_ME" />
        <JsonLd data={ORGANIZATION_SCHEMA} />
        <JsonLd data={WEBSITE_SCHEMA} />
        {/* Must run during parsing, before first paint: next/script's
            beforeInteractive queues inline code until Next's runtime loads. */}
        <script dangerouslySetInnerHTML={{ __html: LOADER_HEAD_SCRIPT }} />
      </head>
      <body className="font-body antialiased">
        {/* Google Analytics 4 (Placeholder: G-XXXXXXXXXX) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
