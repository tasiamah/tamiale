import type { Metadata } from "next";

import { MyTamiale } from "@/components/account/my-tamiale";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "My Tamiale",
  description:
    "Saved frames, your Vision Studio fit profile and your digital passports. Everything personal is kept in your own browser until you sign in.",
  alternates: { canonical: "/my-tamiale" },
  robots: { index: false, follow: true },
};

export default function MyTamialePage() {
  return (
    <>
      <header className="gutter border-b border-ivory-hairline py-20 md:py-28">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-stone">06 · My Tamiale</p>
          <h1 className="display-hero mt-8">My Tamiale.</h1>
          <p className="body-lg mt-10 max-w-xl text-pretty text-stone-dim">
            Saved frames and your fit profile live in this browser and nowhere
            else. Nothing here required an account, and you can delete all of
            it in one action.
          </p>
        </Reveal>
      </header>

      <MyTamiale />
    </>
  );
}
