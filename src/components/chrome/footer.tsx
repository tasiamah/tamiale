import Link from "next/link";

import { RegionSelector } from "@/components/chrome/region-selector";
import { Wordmark } from "@/components/ui/wordmark";
import { footerLinks, site } from "@/lib/site";

export function Footer() {
  const year = 2026;

  return (
    <footer className="grain border-t border-obsidian-hairline bg-obsidian text-ivory">
      <div className="gutter py-20 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div className="flex flex-col gap-8">
            <Wordmark size="lg" className="text-ivory" />
            <p className="max-w-xs text-sm leading-relaxed text-ivory/50">
              A contemporary eyewear house. Designed in {site.foundedIn},
              made in Italy, released in numbered editions.
            </p>
            <RegionSelector tone="ivory" className="max-w-56" />
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="eyebrow text-ivory/40">{group.heading}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ivory/75 transition-colors duration-300 hover:text-ivory"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-5 border-t border-obsidian-hairline pt-8 text-xs text-ivory/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Tamiale. All rights reserved.
          </p>
          <p className="eyebrow text-ivory/30">{site.statement}</p>
        </div>
      </div>
    </footer>
  );
}
