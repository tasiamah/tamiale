import { applePay } from "@/lib/shopify/apple-pay-config";

/**
 * Apple will not let this origin raise a payment sheet until it has fetched
 * this exact path and read back the text it issued when the domain was
 * registered against the merchant identifier. The file has no extension and
 * must be served as plain text.
 *
 * It is held in an environment variable rather than committed, so that
 * rotating the merchant identifier does not need a deploy of the repository
 * and the association is not published for a domain that no longer uses it.
 */
export async function GET() {
  if (!applePay.domainAssociation) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(applePay.domainAssociation, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
