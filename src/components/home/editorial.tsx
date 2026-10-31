import Image from "next/image";

import { getDictionary } from "@/lib/i18n/dictionary";

/**
 * The campaign band at the top of the homepage.
 *
 * PLACEHOLDER. The file behind this is a stand-in until the editor delivers
 * the real homepage photograph, and it should not outlive that: the frames
 * in it are not The Marina, and a store whose first image shows eyewear it
 * does not sell is making a promise it cannot keep at the checkout. Swap
 * the file, the dimensions and the alt text together.
 *
 * Full bleed and cropped by height rather than letterboxed. The source is
 * close to 3:1, which is a handsome band on a desktop and a slot too
 * shallow to read on a phone, so the height is driven by the viewport and
 * the picture is cropped to fill it.
 */
export async function Editorial() {
  const dict = await getDictionary();

  return (
    <section className="relative isolate bg-ivory-dim">
      <Image
        src="/media/editorial/campaign-placeholder.jpg"
        alt={dict.home.editorialAlt}
        width={1024}
        height={348}
        priority
        sizes="100vw"
        /* Enlarged well past its native width; see the note above. */
        quality={90}
        /*
         * Held left of centre. The crop closes in from both edges on a
         * narrow screen, and the face that carries the picture is not in
         * the middle of it.
         */
        className="h-[clamp(15rem,34vw,30rem)] w-full object-cover object-[38%_center]"
      />
    </section>
  );
}
