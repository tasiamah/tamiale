import { notFound } from "next/navigation";

/**
 * Every address under a locale that matches nothing else.
 *
 * Next resolves concrete and dynamic segments before a catch-all, so this
 * only ever sees paths the shop genuinely has no page for. Without it those
 * paths fell past the router entirely and were answered by the framework's
 * own 404, which is a black page set in the system typeface. The house has
 * its own, and `notFound()` is what reaches it, together with the chrome,
 * the right language and the 404 status.
 *
 * A root `app/not-found.tsx` would be the usual way to catch these, but it
 * renders above every layout, and this app keeps its only layout inside
 * `[locale]`. There is no `<html>` to render into up there.
 */
export default function UnmatchedRoute(): never {
  notFound();
}
