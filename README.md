# Tamiale

The storefront for Tamiale — a contemporary eyewear house. Next.js App Router,
headless Shopify, with the collection presented as a pre-order on Edition 001.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm typecheck
pnpm lint
```

## Before you launch: what is real and what is placeholder

Four things in here are stand-ins. They are all plausible and internally
consistent, which is exactly why they need to be checked rather than trusted.

**Technical specifications** — `src/lib/catalog/frames.ts`. Every millimetre,
the 28 g weight, the VLT percentages, the filter categories and the material
names are working values chosen to build and lay out the store. They are
published to customers and emitted as Schema.org product data. Replace the file
with the factory specification sheet and the lens certificates.

**Policy copy** — `src/lib/catalog/legal.ts`. Drafts, not reviewed by counsel.
The pre-order terms in particular need checking against EU and UK distance
selling rules, which treat a deposit taken months before dispatch differently
from an ordinary sale.

**Prices** — the €420 / £360 / $450 / AED 1,750 price book in `frames.ts` is
illustrative. The house publishes a price list per market rather than
converting at the spot rate, so each figure is set deliberately.

**Photography** — there is one real photograph of the product. Ember is that
photograph; Champagne, Smoke, Cognac, Jade and Cobalt are derived from it by
re-tinting the lens (`scripts/process-assets.mjs`). They are honest previews of
the colourways and they are not product photography. Shoot the other five.

## Shopify

The store runs headless against the Storefront API. Without credentials the
site still builds and renders from the editorial catalogue in `src/lib/catalog`
— a storefront outage, or a store that does not exist yet, must never take the
shop window down with it. What you lose without credentials is checkout.

Set up in Shopify:

- A product with the handle **`the-marina`**.
- One option named **`Lens`**, with the values `Ember`, `Champagne`, `Smoke`,
  `Cognac`, `Jade`, `Cobalt`. The storefront matches variants on this value, so
  the spelling has to agree with the `name` fields in `frames.ts`.
- Each variant set to continue selling when out of stock, and attached to a
  selling plan for the pre-order. The storefront reads
  `sellingPlanAllocations` and will pass the plan through to the cart.

Variant IDs are never taken from the browser. `startCheckout` in
`src/lib/shopify/cart.ts` resolves them server-side from the product handle and
the colourway, and clamps the quantity, so a tampered payload cannot buy
something that was not offered.

## Vision Studio

Face tracking runs entirely in the browser on MediaPipe's face landmarker. The
runtime and the model are served from our own origin rather than a CDN: see
`scripts/sync-vision-runtime.mjs` for how they get into `public/vision`, and for
the one-off model download.

What the page promises, and what the code has to keep promising:

- Camera access is requested when the visitor opens the mirror, not on load.
  `pnpm qa:vision` asserts this — it fails the check if the vision runtime is
  fetched before consent.
- No image, video or landmark is sent anywhere. There is no upload path.
- Nothing is stored unless the visitor saves a fit profile, which lives in
  their own browser and can be deleted from My Tamiale.
- The fit estimate is labelled an estimate wherever it appears. It assumes an
  average pupil distance to recover scale from a single camera, which is a
  reasonable basis for a recommendation and a poor one for a prescription.
- The lens simulator shows the look of a tint. It is not a measurement of
  light transmission or UV protection, and says so.

The recommendation is driven by the visitor's stated preference, not by an
inference about their face.

## Geometry

`src/lib/frame-geometry.ts` holds the front elevation in millimetres and is the
single source for three things that must agree: the technical drawing on the
product page, the extruded mesh in the 3D atelier, and the overlay drawn on the
camera feed. Change the specification and all three follow. The rims are a true
outward offset of the aperture, with the end piece solved so the outer edge
lands exactly on the published total width.

## Environment

Everything is optional. Each absent key degrades one feature rather than
breaking the build.

| Variable | Without it |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | Catalogue renders, checkout is disabled |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | As above |
| `SHOPIFY_STOREFRONT_API_VERSION` | Falls back to a pinned version |
| `OPENAI_API_KEY` | Concierge answers from its own register, unrephrased |
| `OPENAI_MODEL` | Falls back to a default |
| `CLIENT_REGISTER_WEBHOOK_URL` | Private-client forms say they are not yet connected |
| `CLIENT_REGISTER_WEBHOOK_TOKEN` | Webhook is sent unauthenticated |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs and sitemap fall back to localhost |

The concierge never answers from the model alone: retrieval runs first, and the
model is only allowed to rephrase what was retrieved. An advisor who says "I'll
find out" is worth more to the house than one who invents a measurement.

## Visual QA

The harnesses drive the system Chrome through `puppeteer-core`. Start a server
first, then point them at it with `BASE`.

```bash
pnpm qa:shoot http://127.0.0.1:3000 /tmp/qa   # every route, desktop + handset
pnpm qa:atelier                               # 3D views and lighting rigs
pnpm qa:vision                                # camera path and consent order
```

`qa:vision` can be pointed at a known face instead of Chrome's test pattern,
which is the only way to check the try-on alignment automatically:

```bash
node scripts/make-y4m.mjs portrait.jpg /tmp/face.y4m
FACE_CLIP=/tmp/face.y4m pnpm qa:vision
```
