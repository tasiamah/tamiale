import { redirect } from "next/navigation";

import { defaultLocale, isLocale } from "@/lib/i18n/config";

/**
 * Turns the serial typed into the lookup field into a passport URL.
 *
 * Route Handlers cannot read `next/root-params`, so the locale comes off the
 * params here. Losing it would drop a French visitor back into English.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const typed = new URL(request.url).searchParams.get("serial") ?? "";
  const serial = typed.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");

  redirect(
    serial
      ? `/${locale}/passport/${encodeURIComponent(serial)}`
      : `/${locale}/passport`,
  );
}
