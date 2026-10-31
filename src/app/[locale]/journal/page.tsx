import type { Metadata } from "next";

import { Link } from "@/components/i18n/link";
import { Reveal } from "@/components/ui/reveal";
import { journalFor } from "@/lib/catalog/copy/journal";
import { dateLocale } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";
import { fill } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.journal.metaTitle,
    description: dict.journal.metaDescription,
    alternates: alternatesFor("/journal", await getLocale()),
  };
}

export default async function JournalPage() {
  const dict = await getDictionary();
  const entries = await journalFor();
  const formatter = new Intl.DateTimeFormat(dateLocale[await getLocale()], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <header className="gutter border-b border-ivory-hairline section-y">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="eyebrow text-stone">04 · {dict.journal.eyebrow}</p>
          <h1 className="display-hero mt-8">{dict.journal.title}</h1>
          <p className="body-lg mt-8 max-w-xl text-pretty text-stone-dim">
{dict.journal.lede}
          </p>
        </Reveal>
      </header>

      <div className="gutter section-y-sm">
        <ul className="border-t border-ivory-hairline">
          {entries.map((entry, index) => (
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
                    {fill(dict.journal.readingTime, {
                      minutes: entry.readingMinutes,
                    })}
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
