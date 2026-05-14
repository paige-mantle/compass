import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_ORIGIN } from "@/compass/lib/seo";
import "./globals.css";

/* Compass type system, all via `next/font/google` so fonts ship
   self-hosted, no extra DNS lookups, zero-CLS, and the per-route
   external `<link rel="stylesheet" href="fonts.googleapis.com/...">`
   tags can be removed.

   `--font-geist-sans` and `--font-geist-mono` feed Tailwind's
   `font-sans` / `font-mono` via the @theme inline block in
   globals.css. `--font-manrope` feeds Tailwind's `font-heading`
   via the override in @theme below. */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  // `metadataBase` is the prefix every relative URL in this Metadata
  // tree resolves against — canonical URLs, OG image URLs, Twitter
  // card URLs, etc. Pull from the single SITE_ORIGIN constant so
  // moving Compass to a new subdomain is a one-line change.
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Mantle Compass — practical manuals for early-stage founders",
    template: "%s | Mantle Compass",
  },
  description:
    "Mantle Compass — practical manuals for early-stage founders on positioning, real demand, and customer discovery.",
  applicationName: "Mantle Compass",
  openGraph: {
    type: "website",
    siteName: "Mantle Compass",
    title: "Mantle Compass — practical manuals for early-stage founders",
    description:
      "Mantle Compass — practical manuals for early-stage founders on positioning, real demand, and customer discovery.",
    url: SITE_ORIGIN,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mantle Compass — practical manuals for early-stage founders",
    description:
      "Mantle Compass — practical manuals for early-stage founders on positioning, real demand, and customer discovery.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} antialiased`}
      >
        {children}
        {/* Vercel Analytics — page views + custom events. Lives in
            the root body so every Compass route inherits it. Use
            `track('event_name')` from `@vercel/analytics` to record
            custom events (Copy prompt, Open in Mantle AI, etc.). */}
        <Analytics />
      </body>
    </html>
  );
}
