import { NextResponse } from "next/server";

/**
 * Where the edge thinks the visitor is.
 *
 * The country is deliberately not read while rendering a page. Every route
 * under /[locale] is statically prerenderable under Cache Components, and
 * one call to `headers()` in a layout would make the whole tree dynamic for
 * the sake of a single line in the footer. Asking for it over a tiny
 * endpoint keeps the pages static and costs one request, once, on the first
 * visit of a session.
 *
 * `x-vercel-ip-country` is set by the platform and overwritten on every
 * request, so a client cannot forge it in production. Locally it is absent,
 * which is why a null answer is normal rather than an error.
 */
export async function GET(request: Request) {
  const country = request.headers.get("x-vercel-ip-country");

  return NextResponse.json(
    { country: country ? country.toUpperCase() : null },
    // Per visitor and never shared: a CDN copy of this would hand one
    // visitor's country to everyone behind the same edge node.
    { headers: { "cache-control": "private, no-store" } },
  );
}
