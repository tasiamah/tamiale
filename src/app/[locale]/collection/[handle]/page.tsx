import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Link } from "@/components/i18n/link";
import { Craftsmanship } from "@/components/product/craftsmanship";
import { ProductStage } from "@/components/product/product-stage";
import { isApplePayConfigured } from "@/lib/shopify/apple-pay-config";
import { Reveal } from "@/components/ui/reveal";
import { frameFor } from "@/lib/catalog/content";
import { frames } from "@/lib/catalog/frames";
import type { Frame } from "@/lib/catalog/types";
import { fill, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor, openGraphFor } from "@/lib/i18n/metadata";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return frames.map((frame) => ({ handle: frame.handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/collection/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const frame = await frameFor(handle);
  if (!frame) return { title: "Not found" };

  const dict = await getDictionary();
  const locale = await getLocale();

  return {
    /*
     * The collection line used to sit here, which spent the whole title on
     * two names a stranger has never read. The descriptor says what the
     * object is instead, and the model name keeps the first position
     * because that is what a returning visitor searches for.
     */
    title: `${frame.name} · ${frame.searchDescriptor}`,
    /*
     * The tagline used to be pasted on the front of this. Together they ran
     * past two hundred characters in French and German, which is forty
     * past the point a result stops rendering, so the sentence that
     * survived truncation was the poetic one rather than the one naming
     * the product.
     */
    description: fill(dict.commerce.metaDescription, {
      name: frame.name,
      count: frame.colorways.length,
      edition: frame.edition,
      month: frame.shipsFrom,
    }),
    alternates: alternatesFor(`/collection/${frame.handle}`, locale),
    /*
     * The card is the frame on the ivory plate, not the catalogue cutout
     * this used to point at. That file is a transparent PNG 219px tall,
     * under the 600 every platform wants before it will run a card at full
     * width, so a share was demoted to a thumbnail and the frame was drawn
     * against whatever colour the reader's app happened to be: black on
     * black in a dark theme.
     */
    openGraph: {
      ...openGraphFor({
        title: `${frame.name} · ${site.name}`,
        description: frame.tagline,
        path: `/collection/${frame.handle}`,
        locale,
        image: {
          url: `/media/og/${frame.handle}.jpg`,
          width: 1200,
          height: 630,
          alt: `${frame.name} — ${frame.tagline}`,
        },
      }),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${frame.name} · ${site.name}`,
      description: frame.tagline,
      images: [`/media/og/${frame.handle}.jpg`],
    },
  };
}

/**
 * Rendered whole, with no streaming boundary. The lens in `?lens` used to be
 * read here, which made the page dynamic: the shell painted a skeleton, the
 * real stage arrived above the footer and moved it, and the photograph that
 * is the largest contentful paint could not be found by the browser until
 * the stage had streamed. `ProductStage` picks the lens out of the URL on the
 * client instead, so the published frames prerender complete.
 */
export default async function FramePage({
  params,
}: PageProps<"/[locale]/collection/[handle]">) {
  const { handle } = await params;
  const dict = await getDictionary();
  const locale = await getLocale();
  const frame = await frameFor(handle);
  if (!frame) notFound();

  return (
    <>
      <nav
        aria-label={dict.collection.breadcrumbCollection}
        className="gutter pt-10 pb-8"
      >
        <ol className="flex gap-2 eyebrow text-stone">
          <li>
            <Link href="/collection" className="hover:text-obsidian">
              {dict.collection.breadcrumbCollection}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-obsidian">{frame.name}</li>
        </ol>
      </nav>

      <ProductStage frame={frame} applePay={isApplePayConfigured()} />

      <section className="border-t border-ivory-hairline bg-ivory">
        <div className="gutter grid gap-14 section-y lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow text-stone">{dict.collection.theDesign}</p>
            <h2 className="display-lg mt-6 text-balance">
              {frame.personality}.
            </h2>
            <p className="mt-6 text-sm text-stone">{frame.character}</p>
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-7">
            {frame.story.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="body-lg text-pretty text-stone-dim"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      <Craftsmanship frame={frame} />

      <script
        type="application/ld+json"
        // Structured data is generated from the same catalog the page renders.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema(frame, locale)),
        }}
      />
    </>
  );
}

function productSchema(frame: Frame, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: frame.name,
    description: frame.tagline,
    brand: { "@type": "Brand", name: site.name },
    category: "Sunglasses",
    inLanguage: locale,
    image: frame.colorways.map((way) => `${site.url}${way.image.src}`),
    weight: {
      "@type": "QuantitativeValue",
      value: frame.geometry.weightGrams,
      unitCode: "GRM",
    },
    offers: frame.colorways.map((way) => ({
      "@type": "Offer",
      name: `${frame.name} ${way.frameFinish} / ${way.name}`,
      sku: way.sku,
      price: frame.price.amount,
      priceCurrency: frame.price.currencyCode,
      availability: way.availableForSale
        ? "https://schema.org/PreOrder"
        : "https://schema.org/SoldOut",
      url: `${site.url}${localePath(locale, `/collection/${frame.handle}`)}?lens=${way.id}`,
    })),
  };
}
