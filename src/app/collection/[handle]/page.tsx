import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Craftsmanship } from "@/components/product/craftsmanship";
import { ProductStage } from "@/components/product/product-stage";
import { Reveal } from "@/components/ui/reveal";
import { findColorway, frames } from "@/lib/catalog/frames";
import { getFrame } from "@/lib/shopify/catalog";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return frames.map((frame) => ({ handle: frame.handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collection/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const frame = await getFrame(handle);
  if (!frame) return { title: "Not found" };

  return {
    title: `${frame.name} · ${frame.collection}`,
    description: `${frame.tagline} ${frame.name} is released in ${frame.colorways.length} lens expressions, in ${frame.edition}, shipping ${frame.shipsFrom}.`,
    alternates: { canonical: `/collection/${frame.handle}` },
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
export default function FramePage(props: PageProps<"/collection/[handle]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <FrameView {...props} />
    </Suspense>
  );
}

async function FrameView({
  params,
  searchParams,
}: PageProps<"/collection/[handle]">) {
  const { handle } = await params;
  const frame = await getFrame(handle);
  if (!frame) notFound();

  return (
    <>
      <nav aria-label="Breadcrumb" className="gutter pt-10 pb-8">
        <ol className="flex gap-2 eyebrow text-stone">
          <li>
            <Link href="/collection" className="hover:text-obsidian">
              Collection
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-obsidian">{frame.name}</li>
        </ol>
      </nav>

      <ResolvedStage frame={frame} searchParams={searchParams} />

      <section className="border-t border-ivory-hairline bg-ivory">
        <div className="gutter grid gap-14 py-24 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow text-stone">The design</p>
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
          __html: JSON.stringify(productSchema(frame)),
        }}
      />
    </>
  );
}

async function ResolvedStage({
  frame,
  searchParams,
}: {
  frame: NonNullable<Awaited<ReturnType<typeof getFrame>>>;
  searchParams: PageProps<"/collection/[handle]">["searchParams"];
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

function productSchema(
  frame: NonNullable<Awaited<ReturnType<typeof getFrame>>>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: frame.name,
    description: frame.tagline,
    brand: { "@type": "Brand", name: site.name },
    category: "Sunglasses",
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
      url: `${site.url}/collection/${frame.handle}?lens=${way.id}`,
    })),
  };
}
