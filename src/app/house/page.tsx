import type { Metadata } from "next";

import { PrivateAccess } from "@/components/home/private-access";
import { Craftsmanship } from "@/components/product/craftsmanship";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { theMarina } from "@/lib/catalog/frames";
import { getFrame } from "@/lib/shopify/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The House",
  description:
    "The Tamiale position on design, material and manufacture — written as commitments that can be checked rather than claims that cannot.",
  alternates: { canonical: "/house" },
};

const PILLARS = [
  {
    index: "01",
    title: "Exclusivity",
    body: "Editions are numbered and small. When an expression is gone it is not reissued, and the house does not discount what is left.",
  },
  {
    index: "02",
    title: "Intelligent luxury",
    body: "Vision Studio runs on your device, estimates rather than asserts, and says so. Technology that oversells itself is not a luxury; it is a liability.",
  },
  {
    index: "03",
    title: "Identity",
    body: "No logo on the front. The silhouette is the signature, and the wordmark is engraved where only the wearer will find it.",
  },
  {
    index: "04",
    title: "Craftsmanship",
    body: "Published measurements, named materials, declared transmission figures, and a serviceable hinge. Everything stated here is something a customer can verify.",
  },
];

const COMMITMENTS = [
  ["Repair before replacement", "Hinges, temples and lenses are all serviceable. A frame that can be fixed should be."],
  ["No dark patterns", "No countdown timers, no fabricated scarcity, no pop-up asking for an address before the page has loaded."],
  ["Honest technology", "Face data never leaves the browser. Fit figures are labelled as estimates because that is what they are."],
  ["One price per market", "Published and held. Not converted at the spot rate, not adjusted by where you clicked from."],
];

export default async function HousePage() {
  const frame = (await getFrame(theMarina.handle)) ?? theMarina;

  return (
    <>
      <header className="gutter border-b border-ivory-hairline py-20 md:py-28">
        <Reveal className="max-w-4xl">
          <p className="eyebrow text-stone">03 — The House</p>
          <h1 className="display-hero mt-8 text-balance">
            True luxury is never accidental.
          </h1>
          <p className="body-lg mt-10 max-w-xl text-pretty text-stone-dim">
            Tamiale is a contemporary eyewear house, designed in{" "}
            {site.foundedIn} and made in Italy. It exists to make a small
            number of frames that are worth keeping, and to be straight about
            how they are made.
          </p>
        </Reveal>
      </header>

      <section className="gutter py-24 md:py-32">
        <SectionHeading
          eyebrow="Four pillars"
          title="What the house is for."
          lede="Written as positions the house can be held to, rather than adjectives."
        />
        <div className="mt-20 grid gap-x-12 gap-y-14 sm:grid-cols-2">
          {PILLARS.map((pillar, index) => (
            <Reveal
              key={pillar.title}
              delay={index * 70}
              className="border-t border-ivory-hairline pt-6"
            >
              <p className="eyebrow text-stone figure-num">
                {pillar.index}
              </p>
              <h3 className="display-md mt-5">{pillar.title}</h3>
              <p className="mt-4 max-w-md leading-relaxed text-stone-dim">
                {pillar.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grain border-y border-ivory-hairline bg-ivory text-obsidian">
        <div className="gutter py-24 md:py-32">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="display-lg text-balance leading-[1.15]">
              Tamiale creates eyewear for individuals who never needed
              permission to stand apart.
            </p>
          </Reveal>
        </div>
      </section>

      <Craftsmanship frame={frame} index="—" />

      <section className="gutter border-t border-ivory-hairline py-24 md:py-32">
        <SectionHeading
          eyebrow="Commitments"
          title="Four things the house will not do."
        />
        <dl className="mt-16 border-t border-ivory-hairline">
          {COMMITMENTS.map(([title, body], index) => (
            <Reveal
              key={title}
              delay={index * 60}
              className="grid gap-3 border-b border-ivory-hairline py-7 md:grid-cols-[1fr_2fr] md:gap-12"
            >
              <dt className="display-md">{title}</dt>
              <dd className="max-w-xl leading-relaxed text-stone-dim">
                {body}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <PrivateAccess
        heading="Join the house register."
        lede="The register hears about a release before it is announced, and has the first opportunity to take it."
      />
    </>
  );
}
