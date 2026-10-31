import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Link } from "@/components/i18n/link";
import { Reveal } from "@/components/ui/reveal";
import {
  legalDocumentFor,
  legalDocumentsFor,
} from "@/lib/catalog/copy/legal";
import { legalDocuments } from "@/lib/catalog/legal";
import { dateLocale, fill } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";

export function generateStaticParams() {
  return legalDocuments.map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const document = await legalDocumentFor(slug);
  if (!document) return { title: "Not found" };

  return {
    title: document.title,
    description: document.summary,
    alternates: alternatesFor(`/legal/${document.slug}`, await getLocale()),
  };
}

export default function LegalPage(props: PageProps<"/[locale]/legal/[slug]">) {
  return (
    <Suspense fallback={<div className="gutter py-32" aria-hidden />}>
      <Document {...props} />
    </Suspense>
  );
}

async function Document({ params }: PageProps<"/[locale]/legal/[slug]">) {
  const { slug } = await params;
  const dict = await getDictionary();
  const document = await legalDocumentFor(slug);
  if (!document) notFound();

  const policies = await legalDocumentsFor();

  return (
    <div className="gutter grid gap-16 section-y-sm lg:grid-cols-[16rem_1fr] lg:gap-24">
      <nav aria-label={dict.legal.policies} className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="eyebrow text-stone">{dict.legal.policies}</h2>
        <ul className="mt-6 flex flex-col gap-3.5">
          {policies.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/legal/${item.slug}`}
                aria-current={item.slug === document.slug ? "page" : undefined}
                className={
                  item.slug === document.slug
                    ? "text-sm text-obsidian"
                    : "text-sm text-stone transition-colors hover:text-obsidian"
                }
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <article className="max-w-2xl">
        <Reveal>
          <h1 className="display-xl text-balance">{document.title}</h1>
          <p className="body-lg mt-6 text-pretty text-stone-dim">
            {document.summary}
          </p>
          <p className="mt-8 border-t border-ivory-hairline pt-5 eyebrow text-stone">
            {fill(dict.legal.updated, {
              date: new Intl.DateTimeFormat(dateLocale[await getLocale()], {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(document.updated)),
            })}
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-12">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="display-md">{section.heading}</h2>
              <div className="mt-5 flex flex-col gap-4">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="leading-relaxed text-pretty text-stone-dim"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-16 border-t border-ivory-hairline pt-6 text-xs leading-relaxed text-stone">
{dict.legal.draftNote}
        </p>
      </article>
    </div>
  );
}
