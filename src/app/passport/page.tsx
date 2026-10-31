import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { Wordmark } from "@/components/ui/wordmark";
import { SPECIMEN_SERIAL } from "@/lib/passport";

export const metadata: Metadata = {
  title: "Digital Passport",
  description:
    "Every Tamiale pair carries a serial engraved into the inner temple. Registering it opens a passport: warranty, service history, edition number and proof of purchase.",
  alternates: { canonical: "/passport" },
};

const STEPS = [
  {
    index: "01",
    title: "Find the serial",
    body: "Engraved into the inner left temple at a depth of 0.12 mm, and printed on the authenticity card in the case.",
  },
  {
    index: "02",
    title: "Register it",
    body: "The serial is bound to the unit when it is made. Registering claims that binding to you, and the house can revoke it if a claim is disputed.",
  },
  {
    index: "03",
    title: "Keep it, or pass it on",
    body: "Warranty, repair history and proof of purchase follow the passport. If the pair changes hands, the passport transfers with it.",
  },
];

export default function PassportPage() {
  return (
    <>
      <header className="gutter border-b border-ivory-hairline py-20 md:py-28">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-stone">Ownership</p>
          <h1 className="display-hero mt-8 text-balance">
            The Digital Passport.
          </h1>
          <p className="body-lg mt-10 max-w-xl text-pretty text-stone-dim">
            A record the house keeps for a pair rather than for a purchase. It
            holds the edition number, the warranty, the service history and the
            proof of purchase, and it survives the loss of your email.
          </p>
        </Reveal>
      </header>

      <section className="gutter grid gap-16 py-20 md:py-28 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <div>
          <ol className="border-t border-ivory-hairline">
            {STEPS.map((step, index) => (
              <Reveal
                as="li"
                key={step.index}
                delay={index * 70}
                className="border-b border-ivory-hairline py-7"
              >
                <p className="eyebrow text-stone figure-num">
                  {step.index}
                </p>
                <h2 className="display-md mt-4">{step.title}</h2>
                <p className="mt-3 max-w-md leading-relaxed text-stone-dim">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={240} className="mt-12">
            <h2 className="eyebrow text-stone">Look up a passport</h2>
            <form action="/passport/lookup" className="mt-5 flex flex-col gap-4 sm:flex-row">
              <label htmlFor="serial" className="sr-only">
                Serial number
              </label>
              <input
                id="serial"
                name="serial"
                placeholder="TM-001-00000"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 border-b border-obsidian/20 bg-transparent py-3 font-mono text-base tracking-wider uppercase transition-colors placeholder:text-stone/50 focus:border-obsidian focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 cursor-pointer border border-obsidian px-7 py-4 eyebrow transition-colors hover:bg-obsidian hover:text-ivory"
              >
                Open passport
              </button>
            </form>
            <p className="mt-5 text-xs leading-relaxed text-stone">
              The registry is not yet bound to production units. One specimen
              record is published so the interface can be reviewed:{" "}
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
              <span className="eyebrow text-stone">Specimen</span>
            </div>
            <p className="eyebrow mt-12 text-stone">
              Digital Product Passport
            </p>
            <p className="display-lg mt-4">The Marina</p>
            <p className="mt-2 text-sm text-stone">
              Edition 001 / Onyx · Champagne
            </p>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-ivory-hairline pt-6">
              <div>
                <dt className="eyebrow text-stone">Authenticity</dt>
                <dd className="mt-2 text-sm text-obsidian">Registered</dd>
              </div>
              <div>
                <dt className="eyebrow text-stone">Serial</dt>
                <dd className="mt-2 font-mono text-xs tracking-wider text-obsidian">
                  {SPECIMEN_SERIAL}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-stone">Edition</dt>
                <dd className="mt-2 text-sm text-obsidian tabular-nums">
                  017 / 150
                </dd>
              </div>
            </dl>
            <p className="mt-10 text-xs leading-relaxed text-stone">
              Illustrative. Not a registered product.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
