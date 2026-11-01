import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Link } from "@/components/i18n/link";
import { QuietLink } from "@/components/ui/button";
import { journalEntryFor, journalFor } from "@/lib/catalog/copy/journal";
import { journal } from "@/lib/catalog/journal";
import { dateLocale, fill, localePath } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor, houseCard, openGraphFor } from "@/lib/i18n/metadata";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return journal.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = await journalEntryFor(slug);
  if (!entry) return { title: "Not found" };

  const locale = await getLocale();

  return {
    title: entry.title,
    description: entry.standfirst,
    alternates: alternatesFor(`/journal/${entry.slug}`, locale),
    openGraph: {
      ...openGraphFor({
        title: entry.title,
        description: entry.standfirst,
        path: `/journal/${entry.slug}`,
        locale,
        image: houseCard(locale, entry.title),
      }),
      type: "article",
      publishedTime: entry.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.standfirst,
      images: [`/media/og/tamiale-${locale}.jpg`],
    },
  };
}

/*
 * Every entry is listed in `generateStaticParams` and written at build time,
 * so there is nothing to stream. Behind a boundary the shell painted an empty
 * placeholder with the footer under it and then inserted the entry above,
 * which moved the footer down the length of the article. The guide page was
 * long enough for that to show up as a layout shift of 0.543; these were only
 * spared by being a little shorter.
 */
export default async function JournalEntryPage({
  params,
}: PageProps<"/[locale]/journal/[slug]">) {
  const { slug } = await params;
  const dict = await getDictionary();
  const locale = await getLocale();
  const entry = await journalEntryFor(slug);
  if (!entry) notFound();

  const others = (await journalFor()).filter(
    (item) => item.slug !== entry.slug,
  );

  return (
    <article className="gutter">
      <header className="mx-auto max-w-3xl pt-16 pb-14 md:pt-24">
        <p className="eyebrow text-stone">
          {entry.category} ·{" "}
          {fill(dict.journal.readingTime, { minutes: entry.readingMinutes })}
        </p>
        <h1 className="display-xl mt-7 text-balance">{entry.title}</h1>
        <p className="body-lg mt-8 text-pretty text-stone-dim">
          {entry.standfirst}
        </p>
        <p className="mt-10 border-t border-ivory-hairline pt-5 eyebrow text-stone">
          <time dateTime={entry.publishedAt}>
            {new Intl.DateTimeFormat(dateLocale[locale], {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(entry.publishedAt))}
          </time>
        </p>
      </header>

      <div className="mx-auto flex max-w-2xl flex-col gap-7 pb-20">
        {entry.body.map((block, index) => {
          if (block.kind === "heading") {
            return (
              <h2 key={index} className="display-md mt-8 text-balance">
                {block.text}
              </h2>
            );
          }
          if (block.kind === "pull") {
            return (
              <blockquote
                key={index}
                className="my-6 border-l-2 border-obsidian py-2 pl-7"
              >
                <p className="display-md text-balance text-stone-dim">
                  {block.text}
                </p>
              </blockquote>
            );
          }
          return (
            <p key={index} className="body-lg text-pretty text-stone-dim">
              {block.text}
            </p>
          );
        })}
      </div>

      <footer className="mx-auto max-w-2xl border-t border-ivory-hairline py-14">
        <p className="eyebrow text-stone">{dict.journal.continueReading}</p>
        <ul className="mt-7 flex flex-col gap-5">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/journal/${item.slug}`}
                className="group flex items-baseline justify-between gap-6"
              >
                <span className="display-md transition-opacity duration-500 group-hover:opacity-60">
                  {item.title}
                </span>
                <span className="eyebrow shrink-0 text-stone">
                  {item.category}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <QuietLink href="/journal">{dict.journal.allEntries}</QuietLink>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: entry.title,
            description: entry.standfirst,
            datePublished: entry.publishedAt,
            author: { "@type": "Organization", name: site.name },
            publisher: { "@type": "Organization", name: site.name },
            inLanguage: locale,
            mainEntityOfPage: `${site.url}${localePath(locale, `/journal/${entry.slug}`)}`,
          }),
        }}
      />
    </article>
  );
}
