import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, Inter_Tight } from "next/font/google";

import { Concierge } from "@/components/concierge/concierge";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/chrome/footer";
import { Header } from "@/components/chrome/header";
import { RegionProvider } from "@/components/chrome/region-provider";
import { DictionaryProvider } from "@/components/i18n/dictionary-provider";
import { toClientDictionary } from "@/lib/i18n/client-dictionary";
import { SavedFramesProvider } from "@/components/account/saved-frames-provider";
import { htmlLang, locales } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";
import { site } from "@/lib/site";

import "../globals.css";

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

/** Required by Cache Components: every root parameter needs a known value. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  const locale = await getLocale();

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} · ${dict.meta.statement}`,
      template: `%s · ${site.name}`,
    },
    description: dict.meta.description,
    applicationName: site.name,
    keywords: [...dict.meta.keywords],
    alternates: alternatesFor("/", locale),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: htmlLang[locale],
      title: `${site.name} · ${dict.meta.statement}`,
      description: dict.meta.description,
      url: `${site.url}/${locale}`,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F5F2" },
    { media: "(prefers-color-scheme: dark)", color: "#141413" },
  ],
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <html
      lang={htmlLang[locale]}
      className={`${display.variable} ${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory text-obsidian">
        <DictionaryProvider locale={locale} dict={toClientDictionary(dict)}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-obsidian focus:px-5 focus:py-3 focus:text-ivory focus:eyebrow"
          >
            {dict.header.skipToContent}
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
        </DictionaryProvider>
      </body>
    </html>
  );
}
