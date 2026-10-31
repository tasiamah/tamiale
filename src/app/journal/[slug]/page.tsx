import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { QuietLink } from "@/components/ui/button";
import { journal, findEntry } from "@/lib/catalog/journal";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return journal.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) return { title: "Not found" };

  return {
    title: entry.title,
    description: entry.standfirst,
    alternates: { canonical: `/journal/${entry.slug}` },
    openGraph: {
      type: "article",
      title: entry.title,
      description: entry.standfirst,
      publishedTime: entry.publishedAt,
    },
  };
}

export default function JournalEntryPage(props: PageProps<"/journal/[slug]">) {
  return (
    <Suspense fallback={<div className="gutter py-32" aria-hidden />}>
      <Entry {...props} />
    </Suspense>
  );
}

async function Entry({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) notFound();

  const others = journal.filter((item) => item.slug !== entry.slug);

  return (
    <article className="gutter">
      <header className="mx-auto max-w-3xl pt-16 pb-14 md:pt-24">
        <p className="eyebrow text-stone">
          {entry.category} · {entry.readingMinutes} min
        </p>
        <h1 className="display-xl mt-7 text-balance">{entry.title}</h1>
        <p className="body-lg mt-8 text-pretty text-stone-dim">
          {entry.standfirst}
        </p>
        <p className="mt-10 border-t border-ivory-hairline pt-5 eyebrow text-stone">
          <time dateTime={entry.publishedAt}>
            {new Intl.DateTimeFormat("en-GB", {
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
                className="my-6 border-l-2 border-champagne py-2 pl-7"
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
        <p className="eyebrow text-stone">Continue reading</p>
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
          <QuietLink href="/journal">All entries</QuietLink>
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
            mainEntityOfPage: `${site.url}/journal/${entry.slug}`,
          }),
        }}
      />
    </article>
  );
}
