import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Frame } from "@/lib/catalog/types";

export async function VisionTeaser({ frame }: { frame: Frame }) {
  const dict = await getDictionary();
  const capabilities = [
    { title: dict.home.visionFeatures.tryOnTitle, body: dict.home.visionFeatures.tryOnBody },
    { title: dict.home.visionFeatures.fitTitle, body: dict.home.visionFeatures.fitBody },
    { title: dict.home.visionFeatures.lensTitle, body: dict.home.visionFeatures.lensBody },
    { title: dict.home.visionFeatures.privacyTitle, body: dict.home.visionFeatures.privacyBody },
  ];

  return (
    <section className="grain border-t border-obsidian-hairline bg-obsidian text-ivory">
      <div className="gutter grid items-center gap-16 section-y lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        <Reveal>
          <p className="eyebrow text-ivory/55">02 · {dict.home.visionEyebrow}</p>
          <h2 className="display-xl mt-6 text-balance">
            {dict.home.visionTitleFirst}
            <br />
            {dict.home.visionTitleSecond}
          </h2>
          <p className="body-lg mt-8 max-w-md text-pretty text-ivory/55">
{dict.home.visionLede}
          </p>

          <dl className="mt-12 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {capabilities.map((item) => (
              <div key={item.title} className="border-t border-obsidian-hairline pt-4">
                <dt className="eyebrow text-ivory/80">{item.title}</dt>
                <dd className="mt-2.5 text-sm leading-relaxed text-ivory/45">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>

          <ButtonLink
            href="/vision-studio"
            tone="ivory"
            variant="outline"
            className="mt-12"
          >
            {dict.home.visionCta}
          </ButtonLink>
        </Reveal>

        {/*
         * What the studio shows you, which is a face wearing the frame.
         * A wireframe of the front elevation stood here, floating in a dark
         * panel under viewfinder brackets. It described the instrument
         * accurately and sold nothing: a visitor who cannot picture the
         * Marina on themselves is not helped by a line drawing of it. The
         * brackets stay, because over a photograph they read as the thing
         * they are imitating.
         */}
        <Reveal delay={140}>
          <div className="relative aspect-4/5 w-full overflow-hidden border border-obsidian-hairline bg-obsidian-raised sm:aspect-4/3 lg:aspect-4/5">
            <Image
              src="/media/editorial/studio-portrait.jpg"
              alt={dict.home.portraitAlt}
              fill
              sizes="(max-width: 1024px) 92vw, 46vw"
              quality={90}
              className="object-cover object-top"
            />
            {/* Keeps the readouts legible against the lit part of the frame. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-obsidian/70 via-transparent to-obsidian/35"
            />

            <Bracket className="top-4 left-4" />
            <Bracket className="top-4 right-4 rotate-90" />
            <Bracket className="right-4 bottom-4 rotate-180" />
            <Bracket className="bottom-4 left-4 -rotate-90" />

            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between">
              <span className="eyebrow text-ivory/40">{dict.home.visionEyebrow}</span>
              <span className="eyebrow text-ivory/55 figure-num">
                {frame.geometry.totalWidth} mm
              </span>
            </div>
            <div className="absolute inset-x-6 top-6">
              <span className="eyebrow text-ivory/40">
                Tamiale / Vision Studio
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Bracket({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute size-5 border-t border-l border-ivory/25 ${className}`}
    />
  );
}
