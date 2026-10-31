import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { ButtonLink } from "@/components/ui/button";
import { Wordmark } from "@/components/ui/wordmark";
import { findColorway, findFrame } from "@/lib/catalog/frames";
import { findPassport, SPECIMEN_SERIAL } from "@/lib/passport";

export const metadata: Metadata = {
  title: "Digital Passport",
  // A passport URL contains a serial; it should not be crawled or archived.
  robots: { index: false, follow: false },
};

export default function PassportRecordPage(
  props: PageProps<"/passport/[serial]">,
) {
  return (
    <div className="grain min-h-[70vh] bg-ivory text-obsidian">
      <Suspense fallback={<div className="gutter py-32" aria-hidden />}>
        <Record {...props} />
      </Suspense>
    </div>
  );
}

async function Record({ params }: PageProps<"/passport/[serial]">) {
  const { serial } = await params;
  const record = findPassport(decodeURIComponent(serial));

  if (!record) {
    return (
      <div className="gutter mx-auto max-w-2xl py-28 text-center md:py-36">
        <Wordmark size="sm" className="text-stone" />
        <h1 className="display-xl mt-12 text-balance">
          No passport for that serial.
        </h1>
        <p className="mt-7 leading-relaxed text-stone">
          The registry binds a serial to a unit when it is manufactured, so an
          unrecognised serial means one of three things: the pair has not been
          serialised yet, the number was mistyped, or the pair is not ours.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-stone">
          Collection 001 has not entered production, so no customer serial is
          live. The specimen record is{" "}
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
            Back to passports
          </ButtonLink>
          <ButtonLink href="/private-client" tone="obsidian" variant="ghost">
            Ask an advisor
          </ButtonLink>
        </div>
      </div>
    );
  }

  const frame = findFrame(record.frameHandle);
  const colorway = frame ? findColorway(frame, record.colorwayId) : null;

  return (
    <div className="gutter mx-auto max-w-4xl py-20 md:py-28">
      <div className="flex items-center justify-between border-b border-ivory-hairline pb-6">
        <Wordmark size="sm" />
        <p className="eyebrow text-stone">Digital Product Passport</p>
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
            <Entry label="Authenticity">
              <span className="text-stone">Registered</span> · Verified
            </Entry>
            <Entry label="Serial">
              <span className="font-mono text-sm tracking-wider">
                {record.serial}
              </span>
            </Entry>
            <Entry label="Edition">
              {String(record.editionNumber).padStart(3, "0")} /{" "}
              {record.editionSize}
            </Entry>
            <Entry label="Made">
              {new Date(record.manufacturedAt).toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </Entry>
            <Entry label="Registered to">{record.registeredTo ?? "—"}</Entry>
            <Entry label="Warranty until">
              {new Date(record.warrantyUntil).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Entry>
          </dl>

          <div className="border-t border-ivory-hairline pt-7">
            <h2 className="eyebrow text-stone">Service history</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {record.serviceHistory.map((item) => (
                <li key={item.date} className="flex gap-5 text-sm">
                  <time
                    dateTime={item.date}
                    className="w-24 shrink-0 tabular-nums text-stone"
                  >
                    {new Date(item.date).toLocaleDateString("en-GB")}
                  </time>
                  <span className="text-stone">{item.event}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-ivory-hairline pt-7">
            <h2 className="eyebrow text-stone">Request</h2>
            <div className="mt-5 flex flex-col gap-3">
              <ButtonLink href="/private-client#contact" tone="obsidian" variant="outline">
                Book a service
              </ButtonLink>
              <ButtonLink href="/legal/warranty" tone="obsidian" variant="ghost">
                What the warranty covers
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <p className="border-t border-ivory-hairline pt-6 text-xs leading-relaxed text-stone">
        Illustrative record. The production registry binds each serial to a
        manufactured unit at the line, and a registration can be revoked or
        transferred by the house. A printed code on its own is not proof of
        authenticity.
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
