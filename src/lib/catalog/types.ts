export type CurrencyCode = "EUR" | "USD" | "AED" | "GBP";

export type Money = {
  amount: number;
  currencyCode: CurrencyCode;
};

/** A lens expression of a frame. Maps to one Shopify variant. */
export type Colorway = {
  /** Option value handle, used in URLs and as the Shopify option value key. */
  id: string;
  name: string;
  /** Acetate finish. Collection 001 is released in Onyx only. */
  frameFinish: string;
  frameHex: string;
  /** Representative swatch colour for the glass. */
  lensHex: string;
  /** Second stop of the gradient, read at the lower edge of the lens. */
  lensHexLower: string;
  lensDescription: string;
  /** Visible light transmission, percent. */
  vlt: number;
  /** EN ISO 12312-1 filter category. */
  filterCategory: 0 | 1 | 2 | 3 | 4;
  gradient: boolean;
  sku: string;
  /** Pieces released in this expression of Edition 001. A published figure. */
  editionSize: number;
  /**
   * Pieces still unsold. Only Shopify knows this, so it is absent until the
   * storefront is connected, and the store must say "an edition of 150",
   * never "150 remaining", while it is absent.
   */
  remaining?: number;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  /** Present once the Shopify storefront is connected. */
  variantId?: string;
  sellingPlanId?: string;
  availableForSale: boolean;
};

export type Measurement = {
  label: string;
  value: string;
  /** Shown beneath the value in the technical table. */
  note?: string;
};

export type FrameStatus = "preorder" | "available" | "in-development";

export type Frame = {
  handle: string;
  name: string;
  /** Short form used in navigation and the bag. */
  shortName: string;
  collection: string;
  personality: string;
  character: string;
  status: FrameStatus;
  /** One line, used under the product title. */
  tagline: string;
  /**
   * How the frame is named in a search result, where the reader does not
   * yet know what "The Marina" is. It is a plain description of the
   * category and the obvious attribute, so it has to be checked against
   * each new frame rather than inherited: a title calling a tortoiseshell
   * pair black would be both a lie and a bounce.
   */
  searchDescriptor: string;
  /** Long-form editorial, one paragraph per entry. */
  story: string[];
  price: Money;
  /**
   * Published price per market. Shopify Markets overrides this once the
   * storefront is connected; the house does not convert at the spot rate.
   */
  priceBook: Record<CurrencyCode, number>;
  shipsFrom: string;
  edition: string;
  measurements: Measurement[];
  /** Front-elevation geometry in millimetres, used by the 3D atelier and try-on. */
  geometry: {
    lensWidth: number;
    lensHeight: number;
    bridge: number;
    templeLength: number;
    totalWidth: number;
    frontDepth: number;
    weightGrams: number;
  };
  materials: { heading: string; body: string }[];
  colorways: Colorway[];
  shopifyProductId?: string;
};

/**
 * One face shape as this guide treats it: how a reader can tell they have
 * it, what the industry convention claims about it, and how the house's own
 * frame actually sits on it. The three are kept as separate fields rather
 * than one block of prose so that the page can label which is observation
 * and which is received opinion, which is the whole reason the page is
 * allowed to exist.
 */
export type FaceShape = {
  id: string;
  name: string;
  recognise: string;
  convention: string;
  marina: string;
};

export type FaceShapeGuide = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  standfirst: string;
  intro: string[];
  shapesHeading: string;
  recogniseLabel: string;
  conventionLabel: string;
  marinaLabel: string;
  shapes: FaceShape[];
  measureHeading: string;
  measure: string[];
  measureSteps: { title: string; body: string }[];
  caveat: string;
  cta: { heading: string; body: string; label: string };
};

export type JournalEntry = {
  slug: string;
  title: string;
  standfirst: string;
  category: string;
  readingMinutes: number;
  publishedAt: string;
  body: { kind: "paragraph" | "heading" | "pull"; text: string }[];
};
