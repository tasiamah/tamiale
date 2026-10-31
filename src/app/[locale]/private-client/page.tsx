import type { Metadata } from "next";

import { PrivateAccess } from "@/components/home/private-access";
import { EnquiryForm } from "@/components/private-client/enquiry-form";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.privateClient.metaTitle,
    description: dict.privateClient.metaDescription,
    alternates: alternatesFor("/private-client", await getLocale()),
  };
}

export default async function PrivateClientPage() {
  const dict = await getDictionary();
  const { services } = dict.privateClient;
  const offered = [
    { title: services.accessTitle, body: services.accessBody },
    { title: services.directTitle, body: services.directBody },
    { title: services.serviceTitle, body: services.serviceBody },
  ];

  return (
    <>
      <header className="gutter border-b border-ivory-hairline section-y">
        <Reveal className="max-w-4xl">
          <p className="eyebrow text-stone">05 · {dict.privateClient.eyebrow}</p>
          <h1 className="display-hero mt-8 text-balance">
            {dict.privateClient.titleFirst} {dict.privateClient.titleSecond}
          </h1>
          <p className="body-lg mt-10 max-w-xl text-pretty text-stone-dim">
{dict.privateClient.lede}
          </p>
        </Reveal>
      </header>

      <section className="gutter section-y">
        <dl className="grid gap-x-16 gap-y-14 border-t border-ivory-hairline pt-14 sm:grid-cols-2 lg:grid-cols-3">
          {offered.map((service, index) => (
            <Reveal key={service.title} delay={index * 60}>
              <dt className="display-md">{service.title}</dt>
              <dd className="mt-4 max-w-sm leading-relaxed text-stone-dim">
                {service.body}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section
        id="contact"
        className="grain scroll-mt-(--header-height) border-t border-ivory-hairline bg-ivory text-obsidian"
      >
        <div className="gutter grid gap-14 section-y lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="eyebrow text-stone">{dict.privateClient.enquiriesEyebrow}</p>
            <h2 className="display-xl mt-6 text-balance">
              {dict.privateClient.enquiriesTitle}
            </h2>
            <p className="body-lg mt-8 max-w-md text-pretty text-stone">
{dict.privateClient.enquiriesLede}
            </p>
            <div className="mt-12 flex flex-col gap-2">
              <p className="eyebrow text-stone">{dict.privateClient.orWrite}</p>
              <a
                href={`mailto:${site.email}`}
                className="text-lg text-obsidian transition-opacity hover:opacity-60"
              >
                {site.email}
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <EnquiryForm />
          </Reveal>
        </div>
      </section>

      <PrivateAccess />
    </>
  );
}
