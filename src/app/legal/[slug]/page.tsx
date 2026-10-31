import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Reveal } from "@/components/ui/reveal";
import { findLegalDocument, legalDocuments } from "@/lib/catalog/legal";

export function generateStaticParams() {
  return legalDocuments.map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const document = findLegalDocument(slug);
  if (!document) return { title: "Not found" };

  return {
    title: document.title,
    description: document.summary,
    alternates: { canonical: `/legal/${document.slug}` },
  };
}

export default function LegalPage(props: PageProps<"/legal/[slug]">) {
  return (
    <Suspense fallback={<div className="gutter py-32" aria-hidden />}>
      <Document {...props} />
    </Suspense>
  );
}

async function Document({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const document = findLegalDocument(slug);
  if (!document) notFound();

  return (
    <div className="gutter grid gap-16 py-16 md:py-24 lg:grid-cols-[16rem_1fr] lg:gap-24">
      <nav aria-label="Policies" className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="eyebrow text-stone">Policies</h2>
        <ul className="mt-6 flex flex-col gap-3.5">
          {legalDocuments.map((item) => (
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
            Updated{" "}
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(document.updated))}
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
          Draft policy, written to the positions the house has taken elsewhere
          on this site. It has not been reviewed by counsel and must be checked
          against consumer law in each market before launch.
        </p>
      </article>
    </div>
  );
}
