import type { Metadata } from "next";

import { MyTamiale } from "@/components/account/my-tamiale";
import { Reveal } from "@/components/ui/reveal";
import { framesFor } from "@/lib/catalog/content";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.myTamiale.metaTitle,
    description: dict.myTamiale.metaDescription,
    alternates: alternatesFor("/my-tamiale", await getLocale()),
    robots: { index: false, follow: true },
  };
}

export default async function MyTamialePage() {
  const dict = await getDictionary();
  const frames = await framesFor();

  return (
    <>
      <header className="gutter border-b border-ivory-hairline section-y">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-stone">06 · {dict.myTamiale.eyebrow}</p>
          <h1 className="display-hero mt-8">{dict.myTamiale.title}</h1>
          <p className="body-lg mt-10 max-w-xl text-pretty text-stone-dim">
{dict.myTamiale.lede}
          </p>
        </Reveal>
      </header>

      <MyTamiale frames={frames} />
    </>
  );
}
