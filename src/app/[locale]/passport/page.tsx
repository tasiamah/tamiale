import type { Metadata } from "next";

import { Link } from "@/components/i18n/link";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";
import { Wordmark } from "@/components/ui/wordmark";
import { SPECIMEN_SERIAL } from "@/lib/passport";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.passport.metaTitle,
    description: dict.passport.metaDescription,
    alternates: alternatesFor("/passport", await getLocale()),
  };
}

export default async function PassportPage() {
  const dict = await getDictionary();
  const { steps } = dict.passport;
  const stages = [
    { title: steps.findTitle, body: steps.findBody },
    { title: steps.registerTitle, body: steps.registerBody },
    { title: steps.keepTitle, body: steps.keepBody },
  ];

  return (
    <>
      <header className="gutter border-b border-ivory-hairline section-y">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="eyebrow text-stone">{dict.passport.eyebrow}</p>
          <h1 className="display-hero mt-8 text-balance">
            {dict.passport.titleFirst} {dict.passport.titleSecond}
          </h1>
          <p className="body-lg mt-8 max-w-xl text-pretty text-stone-dim">
{dict.passport.lede}
          </p>
        </Reveal>
      </header>

      <section className="gutter grid gap-16 section-y lg:grid-cols-[1fr_1fr] lg:gap-24">
        <div>
          <ol className="border-t border-ivory-hairline">
            {stages.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 70}
                className="border-b border-ivory-hairline py-7"
              >
                <p className="eyebrow text-stone figure-num">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="display-md mt-4">{step.title}</h2>
                <p className="mt-3 max-w-md leading-relaxed text-stone-dim">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={240} className="mt-12">
            <h2 className="eyebrow text-stone">{dict.passport.lookupLabel}</h2>
            <form action="/passport/lookup" className="mt-5 flex flex-col gap-4 sm:flex-row">
              <label htmlFor="serial" className="sr-only">
                {dict.passport.fields.serial}
              </label>
              <input
                id="serial"
                name="serial"
                placeholder={dict.passport.lookupPlaceholder}
                autoComplete="off"
                spellCheck={false}
                className="flex-1 border-b border-obsidian/20 bg-transparent py-3 font-mono text-base tracking-wider uppercase transition-colors placeholder:text-stone/50 focus:border-obsidian focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 cursor-pointer border border-obsidian px-7 py-4 eyebrow transition-colors hover:bg-obsidian hover:text-ivory"
              >
                {dict.passport.lookupCta}
              </button>
            </form>
            <p className="mt-5 text-xs leading-relaxed text-stone">
              {dict.passport.lookupNote}{" "}
              <Link
                href={`/passport/${SPECIMEN_SERIAL}`}
                className="font-mono tracking-wider text-obsidian underline underline-offset-4"
              >
                {SPECIMEN_SERIAL}
              </Link>
              .
            </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="grain sticky top-28 border border-ivory-hairline bg-ivory p-8 text-obsidian">
            <div className="flex items-center justify-between">
              <Wordmark size="sm" />
              <span className="eyebrow text-stone">{dict.passport.specimen}</span>
            </div>
            <p className="eyebrow mt-12 text-stone">
              {dict.passport.fields.passport}
            </p>
            <p className="display-lg mt-4">The Marina</p>
            <p className="mt-2 text-sm text-stone">
              Edition 001 / Onyx · Champagne
            </p>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-ivory-hairline pt-6">
              <div>
                <dt className="eyebrow text-stone">{dict.passport.fields.authenticity}</dt>
                <dd className="mt-2 text-sm text-obsidian">
                  {dict.passport.fields.registered}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-stone">{dict.passport.fields.serial}</dt>
                <dd className="mt-2 font-mono text-xs tracking-wider text-obsidian">
                  {SPECIMEN_SERIAL}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-stone">{dict.passport.fields.edition}</dt>
                <dd className="mt-2 text-sm text-obsidian tabular-nums">
                  017 / 150
                </dd>
              </div>
            </dl>
            <p className="mt-10 text-xs leading-relaxed text-stone">
              {dict.passport.notReal}
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
