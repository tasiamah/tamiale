import type { Metadata } from "next";
import { Suspense } from "react";

import { VisionStudio } from "@/components/vision/vision-studio";
import { frameFor } from "@/lib/catalog/content";
import { findColorway, theMarina } from "@/lib/catalog/frames";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.visionStudio.metaTitle,
    description: dict.visionStudio.metaDescription,
    alternates: alternatesFor("/vision-studio", await getLocale()),
  };
}

export default async function VisionStudioPage({
  searchParams,
}: PageProps<"/[locale]/vision-studio">) {
  const dict = await getDictionary();

  return (
    <div data-stage="dark" className="grain min-h-screen bg-obsidian text-ivory">
      <div className="gutter pt-(--header-height)">
        <header className="max-w-3xl py-16 md:py-20">
          <p className="eyebrow text-ivory/55">{dict.visionStudio.eyebrow}</p>
          <h1 className="display-hero mt-7 text-balance">
            {dict.visionStudio.titleFirst}
            <br />
            {dict.visionStudio.titleSecond}
          </h1>
          <p className="body-lg mt-8 max-w-xl text-pretty text-ivory/55">
{dict.visionStudio.lede}
          </p>
        </header>

        <div className="pb-24 md:pb-32">
          <Suspense fallback={<StudioSkeleton />}>
            <ResolvedStudio searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ResolvedStudio({
  searchParams,
}: {
  searchParams: PageProps<"/[locale]/vision-studio">["searchParams"];
}) {
  const [{ lens }, frame] = await Promise.all([
    searchParams,
    frameFor(theMarina.handle),
  ]);
  const resolved = frame ?? theMarina;
  const colorway = findColorway(
    resolved,
    typeof lens === "string" ? lens : undefined,
  );

  return <VisionStudio frame={resolved} initialColorwayId={colorway.id} />;
}

function StudioSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <div className="aspect-3/4 w-full animate-pulse bg-obsidian-raised sm:aspect-4/3" />
      <div className="flex flex-col gap-5">
        <div className="h-3 w-24 animate-pulse bg-obsidian-raised" />
        <div className="h-11 w-72 animate-pulse bg-obsidian-raised" />
        <div className="h-32 w-full animate-pulse bg-obsidian-raised" />
      </div>
    </div>
  );
}
