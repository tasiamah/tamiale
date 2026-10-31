import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { journal } from "@/lib/catalog/journal";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Writing from the house on design, craft and ownership. Not search-engine filler, but the arguments behind the objects.",
  alternates: { canonical: "/journal" },
};

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function JournalPage() {
  return (
    <>
      <header className="gutter border-b border-ivory-hairline py-20 md:py-28">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-stone">04 · Journal</p>
          <h1 className="display-hero mt-8">Journal.</h1>
          <p className="body-lg mt-10 max-w-xl text-pretty text-stone-dim">
            Writing from the house on design, craft and ownership. Each piece
            exists because there was an argument worth making, not because a
            keyword needed covering.
          </p>
        </Reveal>
      </header>

      <div className="gutter py-16 md:py-24">
        <ul className="border-t border-ivory-hairline">
          {journal.map((entry, index) => (
            <Reveal as="li" key={entry.slug} delay={index * 70}>
              <Link
                href={`/journal/${entry.slug}`}
                className="group grid gap-5 border-b border-ivory-hairline py-10 md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-12 md:py-12"
              >
                <span className="eyebrow text-stone md:w-28">
                  {entry.category}
                </span>
                <span className="block max-w-2xl">
                  <span className="display-lg block text-balance transition-[transform,opacity] duration-700 ease-tamiale group-hover:translate-x-2 group-hover:opacity-70">
                    {entry.title}
                  </span>
                  <span className="mt-4 block text-pretty text-stone-dim">
                    {entry.standfirst}
                  </span>
                </span>
                <span className="eyebrow text-stone md:text-right">
                  <time dateTime={entry.publishedAt}>
                    {formatter.format(new Date(entry.publishedAt))}
                  </time>
                  <span className="mt-2 block opacity-60">
                    {entry.readingMinutes} min
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </>
  );
}
