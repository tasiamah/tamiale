import { Link } from "@/components/i18n/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ShipTo } from "@/components/chrome/ship-to";
import { Wordmark } from "@/components/ui/wordmark";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { dateLocale } from "@/lib/i18n/config";
import { shippingCountries } from "@/lib/region";
import { footerGroups } from "@/lib/site";

export async function Footer() {
  const dict = await getDictionary();
  const locale = await getLocale();
  const year = 2026;
  const countries = shippingCountries(dateLocale[locale]);

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
            {/*
             * The two settings that decide how the shop reads, together,
             * because they are one question asked twice: where you are and
             * what you read. Destination first, since it is the one that
             * changes the prices.
             */}
            <div className="grid max-w-md gap-7 sm:grid-cols-2 sm:gap-8">
              <ShipTo countries={countries} />
              <LanguageSwitcher tone="ivory" />
            </div>
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
         * Ownership, alone on the last rule. The destination used to share
         * it, which made the one control that changes every price in the
         * store read as a piece of legal boilerplate.
         */}
        <div className="mt-24 border-t border-obsidian-hairline pt-10 text-xs text-ivory/50">
          <p>
            © Tamiale {year}. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
