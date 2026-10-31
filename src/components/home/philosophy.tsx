import { QuietLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/**
 * Type on paper and nothing else. A watermarked outline of the frame used to
 * sit behind this. It crossed the words and read as decoration, which is the
 * opposite of what a statement like this needs.
 */
export function Philosophy() {
  return (
    <section className="border-t border-ivory-hairline bg-ivory">
      <div className="gutter py-28 md:py-40">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-stone">03 · The House</p>
          <p className="display-lg mt-10 text-balance leading-[1.15]">
            True luxury is never accidental. It is found in the balance of form,
            precision and identity.
            <span className="text-stone">
              {" "}
              Tamiale creates eyewear for individuals who never needed
              permission to stand apart.
            </span>
          </p>
          <div className="mt-14 flex justify-center">
            <QuietLink href="/house" className="text-obsidian">
              Read the house file
            </QuietLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
