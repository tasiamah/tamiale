import "server-only";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2025-07";

/**
 * The storefront is optional at build time. When the credentials are absent
 * the site serves the editorial catalog in `lib/catalog` so the experience can
 * be designed, reviewed and deployed before the Shopify store is provisioned.
 */
export function isShopifyConfigured(): boolean {
  return Boolean(DOMAIN && TOKEN);
}

/*
 * The Headless channel issues two tokens against one storefront and they are
 * not read on the same header. The public one is meant to be seen, is rate
 * limited per buyer and goes on X-Shopify-Storefront-Access-Token. The
 * private one is server only, carries the scopes this app was actually
 * granted, and on that header is refused with a bare 401 whose body is an
 * empty string, which is a long afternoon if you do not already know.
 *
 * Choosing by prefix means either kind can be dropped into the environment
 * without a second variable to keep in step with it.
 */
const TOKEN_HEADER = TOKEN?.startsWith("shpat_")
  ? "Shopify-Storefront-Private-Token"
  : "X-Shopify-Storefront-Access-Token";

export class ShopifyError extends Error {
  constructor(
    message: string,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = "ShopifyError";
  }
}

type StorefrontResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  /**
   * Leave `cache` unset for reads wrapped in `use cache`. The directive owns
   * their lifetime. Mutations pass `no-store` explicitly.
   */
  init?: { cache?: RequestCache; tags?: string[] },
): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new ShopifyError("Shopify storefront credentials are not configured");
  }

  const response = await fetch(
    `https://${DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [TOKEN_HEADER]: TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
      cache: init?.cache,
      next: init?.tags ? { tags: init.tags } : undefined,
    },
  );

  if (!response.ok) {
    throw new ShopifyError(
      `Storefront API responded ${response.status}`,
      await response.text().catch(() => undefined),
    );
  }

  const payload = (await response.json()) as StorefrontResponse<T>;

  if (payload.errors?.length) {
    throw new ShopifyError(
      payload.errors.map((error) => error.message).join("; "),
      payload.errors,
    );
  }
  if (!payload.data) {
    throw new ShopifyError("Storefront API returned no data");
  }

  return payload.data;
}
