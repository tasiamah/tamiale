import { Link } from "@/components/i18n/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ShipTo } from "@/components/chrome/ship-to";
import { Wordmark } from "@/components/ui/wordmark";
import { getDictionary } from "@/lib/i18n/dictionary";
import { footerGroups } from "@/lib/site";

export async function Footer() {
  const dict = await getDictionary();
  const year = 2026;

  return (
    <footer className="grain border-t border-obsidian-hairline bg-obsidian text-ivory">
      <div className="gutter section-y">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div className="flex flex-col gap-8">
            {/*
             * The slogan sits directly under the wordmark and nowhere else.
             * That is the one position where a house line reads as a
             * signature rather than as advertising, and it leaves the
             * homepage free to open on the frame.
             */}
            <div>
              <Wordmark size="lg" className="text-ivory" />
              <p className="display-md mt-6 max-w-xs text-balance text-ivory">
                {dict.meta.slogan}
              </p>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ivory/50">
              {dict.footer.blurb}
            </p>
            <LanguageSwitcher tone="ivory" className="max-w-56" />
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <nav key={group.heading} aria-label={dict.footer[group.heading]}>
                <h2 className="eyebrow text-ivory/40">
                  {dict.footer[group.heading]}
                </h2>
                <ul className="mt-7 flex flex-col gap-4">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ivory/75 transition-colors duration-300 hover:text-ivory"
                      >
                        {dict.footer[link.key]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/*
         * Destination on the left, ownership on the right. Both are things a
         * shop is expected to state at the foot of the page and neither is
         * worth a heading, so they sit on one rule as a single quiet line.
         */}
        <div className="mt-28 flex flex-col gap-6 border-t border-obsidian-hairline pt-10 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <ShipTo />
          <p>
            © Tamiale {year}. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
