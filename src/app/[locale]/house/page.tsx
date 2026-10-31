import type { Metadata } from "next";

import { PrivateAccess } from "@/components/home/private-access";
import { Craftsmanship } from "@/components/product/craftsmanship";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { frameFor } from "@/lib/catalog/content";
import { theMarina } from "@/lib/catalog/frames";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.house.metaTitle,
    description: dict.house.metaDescription,
    alternates: alternatesFor("/house", await getLocale()),
  };
}

export default async function HousePage() {
  const dict = await getDictionary();
  const frame = (await frameFor(theMarina.handle)) ?? theMarina;

  return (
    <>
      <header className="gutter border-b border-ivory-hairline section-y">
        <Reveal className="max-w-4xl">
          <p className="eyebrow text-stone">03 · {dict.house.eyebrow}</p>
          <h1 className="display-hero mt-8 text-balance">
            {dict.house.titleFirst} {dict.house.titleSecond}
          </h1>
          <p className="body-lg mt-10 max-w-xl text-pretty text-stone-dim">
{dict.house.lede}
          </p>
        </Reveal>
      </header>

      <section className="gutter section-y">
        <SectionHeading
          eyebrow={dict.house.pillarsEyebrow}
          title={dict.house.positionTitle}
          lede={dict.house.positionLede}
        />
        <div className="mt-20 grid gap-x-12 gap-y-14 sm:grid-cols-2">
          {dict.house.pillars.map((pillar, index) => (
            <Reveal
              key={pillar.title}
              delay={index * 70}
              className="border-t border-ivory-hairline pt-6"
            >
              <p className="eyebrow text-stone figure-num">
                {String(index + 1).padStart(2, "0")}
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
        <div className="gutter section-y">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="display-lg text-balance leading-[1.15]">
{dict.house.manifesto}
            </p>
          </Reveal>
        </div>
      </section>

      <Craftsmanship frame={frame} />

      <section className="gutter border-t border-ivory-hairline section-y">
        <SectionHeading
          eyebrow={dict.house.commitmentsEyebrow}
          title={dict.house.commitmentsTitle}
        />
        <dl className="mt-16 border-t border-ivory-hairline">
          {dict.house.commitments.map(({ title, body }, index) => (
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
        heading={dict.house.registerHeading}
        lede={dict.house.registerLede}
      />
    </>
  );
}
