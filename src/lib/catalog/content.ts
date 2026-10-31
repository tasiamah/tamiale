import { getLocale } from "@/lib/i18n/dictionary";
import { getFrame, getFrames } from "@/lib/shopify/catalog";

import type { Frame } from "./types";
import {
  getForthcoming,
  localiseFrame,
  localiseFrames,
  type Forthcoming,
} from "./copy";

/**
 * The catalog in the reader's language.
 *
 * Translation is applied outside the cached Shopify read on purpose. The
 * commerce half (price, stock, variant ids, selling plans) is identical in
 * every language and should be fetched and cached once; only the prose is
 * swapped afterwards. Folding locale into the cache key would triple the
 * number of Storefront requests to say the same thing three times.
 */
export async function frameFor(handle: string): Promise<Frame | undefined> {
  const frame = await getFrame(handle);
  if (!frame) return undefined;
  return localiseFrame(frame, await getLocale());
}

export async function framesFor(): Promise<Frame[]> {
  return localiseFrames(await getFrames(), await getLocale());
}

export async function forthcomingFor(): Promise<{
  items: Forthcoming[];
  inDevelopment: string;
}> {
  return getForthcoming(await getLocale());
}
