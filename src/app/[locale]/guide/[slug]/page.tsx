import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuietLink } from "@/components/ui/button";
import { guideFor } from "@/lib/catalog/copy/guide";
import { faceShapeGuide } from "@/lib/catalog/guide";
import { getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";

/*
 * One guide today, and the route is already a slug. The alternative was
 * /guide as a single page, which would have had to be moved, redirected and
 * re-indexed the first time a second guide was written.
 */
export function generateStaticParams() {
  return [{ slug: faceShapeGuide.slug }];
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/guide/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== faceShapeGuide.slug) return { title: "Not found" };

  const guide = await guideFor();
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: alternatesFor(`/guide/${guide.slug}`, await getLocale()),
  };
}

/*
 * No Suspense boundary. The guide is one slug, listed in
 * `generateStaticParams`, and every word of it is known at build time, so
 * there is nothing here worth streaming. Behind a boundary the shell painted
 * an empty placeholder with the footer directly under it and then dropped
 * several thousand pixels of article in above, which moved the footer off
 * the screen: a layout shift of 0.543 against the 0.1 Google calls good.
 */
export default async function GuidePage({
  params,
}: PageProps<"/[locale]/guide/[slug]">) {
  const { slug } = await params;
  if (slug !== faceShapeGuide.slug) notFound();

  const guide = await guideFor();

  return (
    <article className="gutter">
      <header className="mx-auto max-w-3xl pt-16 pb-14 md:pt-24">
        <p className="eyebrow text-stone">{guide.eyebrow}</p>
        <h1 className="display-xl mt-7 text-balance">{guide.title}</h1>
        <p className="body-lg mt-8 text-pretty text-stone-dim">
          {guide.standfirst}
        </p>
      </header>

      <div className="mx-auto flex max-w-2xl flex-col gap-7">
        {guide.intro.map((paragraph) => (
          <p key={paragraph} className="body-lg text-pretty text-stone-dim">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mx-auto max-w-2xl pt-20">
        <h2 className="display-md text-balance">{guide.shapesHeading}</h2>
        <div className="mt-12 flex flex-col gap-14">
          {guide.shapes.map((shape) => (
            <section key={shape.id}>
              <h3 className="display-sm border-b border-ivory-hairline pb-4">
                {shape.name}
              </h3>
              {/*
               * Three labelled rows rather than one paragraph. The reader
               * has to be able to see at a glance which line is a thing
               * they can check in a mirror and which is received opinion,
               * because the page's only claim to being worth reading is
               * that it keeps those two apart.
               */}
              <dl className="mt-6 flex flex-col gap-5">
                {[
                  [guide.recogniseLabel, shape.recognise],
                  [guide.conventionLabel, shape.convention],
                  [guide.marinaLabel, shape.marina],
                ].map(([label, body]) => (
                  <div key={label}>
                    <dt className="eyebrow text-stone">{label}</dt>
                    <dd className="mt-2 text-pretty text-stone-dim">{body}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl pt-20">
        <h2 className="display-md text-balance">{guide.measureHeading}</h2>
        {guide.measure.map((paragraph) => (
          <p
            key={paragraph}
            className="body-lg mt-8 text-pretty text-stone-dim"
          >
            {paragraph}
          </p>
        ))}
        <ol className="mt-12 flex flex-col gap-9">
          {guide.measureSteps.map((step) => (
            <li key={step.title}>
              <h3 className="display-sm">{step.title}</h3>
              <p className="mt-3 text-pretty text-stone-dim">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className="mx-auto mt-20 max-w-2xl border-t border-ivory-hairline pt-8 text-pretty text-sm text-stone">
        {guide.caveat}
      </p>

      <section className="mx-auto max-w-2xl py-20">
        <h2 className="display-md text-balance">{guide.cta.heading}</h2>
        <p className="body-lg mt-6 text-pretty text-stone-dim">
          {guide.cta.body}
        </p>
        <div className="mt-10">
          <QuietLink href="/vision-studio">{guide.cta.label}</QuietLink>
        </div>
      </section>
    </article>
  );
}
