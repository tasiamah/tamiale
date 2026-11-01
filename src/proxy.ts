import { NextResponse, type NextRequest } from "next/server";

import {
  LOCALE_COOKIE,
  defaultLocale,
  isLocale,
  localeByCountry,
  locales,
  type Locale,
} from "@/lib/i18n/config";

/**
 * Sends a visitor without a locale in the URL to one. Everything below the
 * prefix is static, so this is the only request-dependent step in the stack.
 *
 * The order of evidence matters. An explicit choice from the switcher always
 * wins. After that `Accept-Language` beats the IP country, because the
 * browser's language is what the person reads while the IP is only where
 * they happen to be sitting: an English speaker living in Paris should not
 * be handed French, and a French speaker on holiday should not lose it.
 * Country is the fallback for when the header says nothing useful.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const target = chooseLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;

  // 307 rather than 308: the choice depends on the visitor, so it must never
  // be cached by a CDN or memorised by a browser as a permanent move.
  return NextResponse.redirect(url, 307);
}

function chooseLocale(request: NextRequest): Locale {
  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  if (chosen && isLocale(chosen)) return chosen;

  const fromHeader = fromAcceptLanguage(
    request.headers.get("accept-language"),
  );
  if (fromHeader) return fromHeader;

  const country = request.headers.get("x-vercel-ip-country");
  if (country && localeByCountry[country]) return localeByCountry[country];

  return defaultLocale;
}

/**
 * Picks the highest-weighted language we publish. `fr-CA;q=0.9` counts as
 * French, and anything we do not publish is skipped rather than defaulted,
 * so a visitor who asks for Spanish then Italian then French lands on French
 * rather than English.
 */
function fromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return {
        base: tag.trim().toLowerCase().split("-")[0],
        quality: q ? Number.parseFloat(q.split("=")[1]) || 0 : 1,
      };
    })
    .filter((entry) => entry.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  return ranked.find((entry) => isLocale(entry.base))?.base as
    | Locale
    | undefined;
}

export const config = {
  matcher: [
    /*
     * Everything except the API, Next's own assets, and the files that must
     * stay at the domain root for crawlers and browsers to find them.
     *
     * `.well-known` is in that last group and is easy to miss, because the
     * things that read it are not browsers and will not follow a redirect.
     * Apple fetches the merchant association from the bare origin and takes
     * a 307 to /en as a failure, which refuses the domain.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|media|vision|\\.well-known|.*\\.[a-z0-9]+$).*)",
  ],
};
