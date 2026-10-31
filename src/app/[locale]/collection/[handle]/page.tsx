import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Link } from "@/components/i18n/link";
import { Craftsmanship } from "@/components/product/craftsmanship";
import { ProductStage } from "@/components/product/product-stage";
import { Reveal } from "@/components/ui/reveal";
import { frameFor } from "@/lib/catalog/content";
import { findColorway, frames } from "@/lib/catalog/frames";
import type { Frame } from "@/lib/catalog/types";
import { fill, localePath, type Locale } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";
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

  return {
    title: `${frame.name} · ${frame.collection}`,
    description: `${frame.tagline} ${fill(dict.commerce.metaDescription, {
      name: frame.name,
      count: frame.colorways.length,
      edition: frame.edition,
      month: frame.shipsFrom,
    })}`,
    alternates: alternatesFor(`/collection/${frame.handle}`, await getLocale()),
    openGraph: {
      title: `${frame.name} · ${site.name}`,
      description: frame.tagline,
      images: [{ url: frame.colorways[0].image.src }],
    },
  };
}

/**
 * The whole view depends on the handle, so it sits behind one boundary. With
 * `generateStaticParams` the published frames prerender complete; the
 * skeleton is only ever seen on a navigation to an unknown handle.
 */
export default function FramePage(props: PageProps<"/[locale]/collection/[handle]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <FrameView {...props} />
    </Suspense>
  );
}

async function FrameView({
  params,
  searchParams,
}: PageProps<"/[locale]/collection/[handle]">) {
  const { handle } = await params;
  const dict = await getDictionary();
  const locale = await getLocale();
  const frame = await frameFor(handle);
  if (!frame) notFound();

  return (
    <>
      <nav aria-label={dict.collection.breadcrumbCollection} className="gutter pt-10 pb-8">
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

      <ResolvedStage frame={frame} searchParams={searchParams} />

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

async function ResolvedStage({
  frame,
  searchParams,
}: {
  frame: Frame;
  searchParams: PageProps<"/[locale]/collection/[handle]">["searchParams"];
}) {
  const { lens } = await searchParams;
  const colorway = findColorway(frame, typeof lens === "string" ? lens : undefined);
  return <ProductStage frame={frame} initialColorwayId={colorway.id} />;
}

function PageSkeleton() {
  return (
    <div className="gutter pt-20 pb-20">
      <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div className="aspect-4/3 w-full animate-pulse bg-ivory-dim" />
        <div className="flex flex-col gap-5">
          <div className="h-3 w-40 animate-pulse bg-ivory-dim" />
          <div className="h-14 w-72 animate-pulse bg-ivory-dim" />
          <div className="h-8 w-28 animate-pulse bg-ivory-dim" />
          <div className="mt-6 h-11 w-full max-w-sm animate-pulse bg-ivory-dim" />
        </div>
      </div>
    </div>
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
