import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, Inter_Tight } from "next/font/google";

import { Concierge } from "@/components/concierge/concierge";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/chrome/footer";
import { Header } from "@/components/chrome/header";
import { RegionProvider } from "@/components/chrome/region-provider";
import { SavedFramesProvider } from "@/components/account/saved-frames-provider";
import { site } from "@/lib/site";

import "./globals.css";

/**
 * Three roles, bound to CSS variables so the licensed cuts can replace them
 * without touching markup: a tight grotesque carries the headlines, a text
 * grotesque carries the interface, and the serif is kept back for the names
 * of frames and the prices beside them.
 */
const display = Inter_Tight({
  variable: "--font-tamiale-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-tamiale-sans",
  subsets: ["latin"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-tamiale-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.statement}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "luxury eyewear",
    "designer sunglasses",
    "acetate frames",
    "Tamiale",
    "virtual try-on",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.statement}`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F5F2" },
    { media: "(prefers-color-scheme: dark)", color: "#141413" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory text-obsidian">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-obsidian focus:px-5 focus:py-3 focus:text-ivory focus:eyebrow"
        >
          Skip to content
        </a>
        <RegionProvider>
          <SavedFramesProvider>
            <CartProvider>
              <Header />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
              <CartDrawer />
              <Concierge />
            </CartProvider>
          </SavedFramesProvider>
        </RegionProvider>
      </body>
    </html>
  );
}
