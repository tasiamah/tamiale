import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

import { Concierge } from "@/components/concierge/concierge";
import { BagBar } from "@/components/cart/bag-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { BottomBarProvider } from "@/components/commerce/bottom-bar";
import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/chrome/footer";
import { Header } from "@/components/chrome/header";
import { RegionProvider } from "@/components/chrome/region-provider";
import { DictionaryProvider } from "@/components/i18n/dictionary-provider";
import { LanguageOffer } from "@/components/i18n/language-offer";
import { toClientDictionary } from "@/lib/i18n/client-dictionary";
import { SavedFramesProvider } from "@/components/account/saved-frames-provider";
import { htmlLang, locales } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";
import { site } from "@/lib/site";

import "../globals.css";

/**
 * Two families, bound to CSS variables so licensed cuts can replace them
 * without touching markup.
 *
 * An old-style serif carries everything the house says and a geometric sans
 * carries the wayfinding. That pairing is the one nearly every maison has
 * settled on, and the pair this replaces was the problem: Instrument Serif
 * has become the default display face of the free-font landing page, and
 * Inter reads as software no matter what you set it in. Neither is bad type.
 * Both are the wrong accent for a house.
 *
 * Cormorant is cut thin and set with a lot of air, so it is loaded at 300 for
 * the largest sizes and 400 where it has to hold at small ones.
 */
const serif = Cormorant_Garamond({
  variable: "--font-tamiale-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Jost({
  variable: "--font-tamiale-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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
      default: `${dict.meta.homeTitle} · ${site.name}`,
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
      title: `${dict.meta.homeTitle} · ${site.name}`,
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
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
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
                <BottomBarProvider>
                  <Header />
                  <LanguageOffer locale={locale} />
                  <main id="main" className="flex-1">
                    {children}
                  </main>
                  <Footer />
                  <BagBar />
                  <CartDrawer />
                  <Concierge />
                </BottomBarProvider>
              </CartProvider>
            </SavedFramesProvider>
          </RegionProvider>
        </DictionaryProvider>
      </body>
    </html>
  );
}
