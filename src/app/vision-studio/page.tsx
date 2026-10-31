import type { Metadata } from "next";
import { Suspense } from "react";

import { VisionStudio } from "@/components/vision/vision-studio";
import { findColorway, theMarina } from "@/lib/catalog/frames";
import { getFrame } from "@/lib/shopify/catalog";

export const metadata: Metadata = {
  title: "Vision Studio",
  description:
    "Try The Marina on through your own camera, estimate your fit against the published millimetres, and see what each of the six lenses does to the light. Everything runs on your device.",
  alternates: { canonical: "/vision-studio" },
};

export default function VisionStudioPage({
  searchParams,
}: PageProps<"/vision-studio">) {
  return (
    <div data-stage="dark" className="grain min-h-screen bg-obsidian text-ivory">
      <div className="gutter pt-(--header-height)">
        <header className="max-w-3xl py-16 md:py-20">
          <p className="eyebrow text-champagne">Vision Studio</p>
          <h1 className="display-hero mt-7 text-balance">
            Your perspective.
            <br />
            Your fit.
          </h1>
          <p className="body-lg mt-8 max-w-xl text-pretty text-ivory/55">
            A digital mirror rather than a filter. The frame is drawn from its
            own factory geometry and scaled to your face, so what you see is
            the size the Marina will actually be.
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
  searchParams: PageProps<"/vision-studio">["searchParams"];
}) {
  const [{ lens }, frame] = await Promise.all([
    searchParams,
    getFrame(theMarina.handle),
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
