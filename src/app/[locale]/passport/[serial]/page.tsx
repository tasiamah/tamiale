import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";

import { Link } from "@/components/i18n/link";
import { ButtonLink } from "@/components/ui/button";
import { Wordmark } from "@/components/ui/wordmark";
import { frameFor } from "@/lib/catalog/content";
import { findColorway } from "@/lib/catalog/frames";
import { dateLocale } from "@/lib/i18n/config";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { findPassport, SPECIMEN_SERIAL } from "@/lib/passport";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: (await getDictionary()).passport.metaTitle,
    // A passport URL contains a serial; it should not be crawled or archived.
    robots: { index: false, follow: false },
  };
}

export default function PassportRecordPage(
  props: PageProps<"/[locale]/passport/[serial]">,
) {
  return (
    <div className="grain min-h-[70vh] bg-ivory text-obsidian">
      <Suspense fallback={<div className="gutter py-32" aria-hidden />}>
        <Record {...props} />
      </Suspense>
    </div>
  );
}

async function Record({ params }: PageProps<"/[locale]/passport/[serial]">) {
  const { serial } = await params;
  const dict = await getDictionary();
  const dates = dateLocale[await getLocale()];
  const record = findPassport(decodeURIComponent(serial));

  if (!record) {
    return (
      <div className="gutter mx-auto max-w-2xl py-28 text-center md:py-36">
        <Wordmark size="sm" className="text-stone" />
        <h1 className="display-xl mt-12 text-balance">
          {dict.passport.noRecordTitle}
        </h1>
        <p className="mt-7 leading-relaxed text-stone">
{dict.passport.noRecordBody}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-stone">
{dict.passport.noRecordSpecimen}{" "}
          <Link
            href={`/passport/${SPECIMEN_SERIAL}`}
            className="font-mono tracking-wider text-obsidian underline underline-offset-4"
          >
            {SPECIMEN_SERIAL}
          </Link>
          .
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/passport" tone="obsidian" variant="outline">
            {dict.passport.backToPassports}
          </ButtonLink>
          <ButtonLink href="/private-client" tone="obsidian" variant="ghost">
            {dict.passport.askAdvisor}
          </ButtonLink>
        </div>
      </div>
    );
  }

  const frame = await frameFor(record.frameHandle);
  const colorway = frame ? findColorway(frame, record.colorwayId) : null;

  return (
    <div className="gutter mx-auto max-w-4xl section-y">
      <div className="flex items-center justify-between border-b border-ivory-hairline pb-6">
        <Wordmark size="sm" />
        <p className="eyebrow text-stone">{dict.passport.fields.passport}</p>
      </div>

      <div className="grid gap-12 py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <h1 className="display-xl text-balance">{frame?.name ?? "Tamiale"}</h1>
          <p className="mt-4 text-stone">
            {record.edition} / {colorway?.frameFinish} · {colorway?.name}
          </p>

          {colorway && (
            <div className="mt-10 flex items-center justify-center bg-ivory-dim px-8 py-10">
              <Image
                src={colorway.image.src}
                alt={colorway.image.alt}
                width={colorway.image.width}
                height={colorway.image.height}
                sizes="(max-width: 1024px) 90vw, 32rem"
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-10">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
            <Entry label={dict.passport.fields.authenticity}>
              <span className="text-stone">{dict.passport.fields.registered}</span>{" "}
              · {dict.passport.verified}
            </Entry>
            <Entry label={dict.passport.fields.serial}>
              <span className="font-mono text-sm tracking-wider">
                {record.serial}
              </span>
            </Entry>
            <Entry label={dict.passport.fields.edition}>
              {String(record.editionNumber).padStart(3, "0")} /{" "}
              {record.editionSize}
            </Entry>
            <Entry label={dict.passport.fields.made}>
              {new Date(record.manufacturedAt).toLocaleDateString(dates, {
                month: "long",
                year: "numeric",
              })}
            </Entry>
            <Entry label={dict.passport.fields.registeredTo}>
              {record.registeredTo ?? dict.passport.fields.notRegistered}
            </Entry>
            <Entry label={dict.passport.fields.warrantyUntil}>
              {new Date(record.warrantyUntil).toLocaleDateString(dates, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Entry>
          </dl>

          <div className="border-t border-ivory-hairline pt-7">
            <h2 className="eyebrow text-stone">{dict.passport.serviceHistory}</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {record.serviceHistory.map((item) => (
                <li key={item.date} className="flex gap-5 text-sm">
                  <time
                    dateTime={item.date}
                    className="w-24 shrink-0 tabular-nums text-stone"
                  >
                    {new Date(item.date).toLocaleDateString(dates)}
                  </time>
                  <span className="text-stone">{item.event}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-ivory-hairline pt-7">
            <h2 className="eyebrow text-stone">{dict.passport.request}</h2>
            <div className="mt-5 flex flex-col gap-3">
              <ButtonLink href="/private-client#contact" tone="obsidian" variant="outline">
                {dict.passport.bookService}
              </ButtonLink>
              <ButtonLink href="/legal/warranty" tone="obsidian" variant="ghost">
                {dict.passport.warrantyCovers}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <p className="border-t border-ivory-hairline pt-6 text-xs leading-relaxed text-stone">
{dict.passport.recordCaveat}
      </p>
    </div>
  );
}

function Entry({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="eyebrow text-stone">{label}</dt>
      <dd className="mt-2.5 text-stone">{children}</dd>
    </div>
  );
}
