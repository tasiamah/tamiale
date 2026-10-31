import { QuietLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n/dictionary";

/**
 * Type on paper and nothing else. A watermarked outline of the frame used to
 * sit behind this. It crossed the words and read as decoration, which is the
 * opposite of what a statement like this needs.
 */
export async function Philosophy() {
  const dict = await getDictionary();

  return (
    <section className="border-t border-ivory-hairline bg-ivory">
      <div className="gutter py-28 md:py-40">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-stone">03 · {dict.home.houseEyebrow}</p>
          <p className="display-lg mt-10 text-balance leading-[1.15]">
            {dict.home.manifesto}
            <span className="text-stone"> {dict.home.manifestoTail}</span>
          </p>
          <div className="mt-14 flex justify-center">
            <QuietLink href="/house" className="text-obsidian">
              {dict.home.houseCta}
            </QuietLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
