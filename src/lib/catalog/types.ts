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
  /** Pieces released in this expression of Edition 001. */
  allocation: number;
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

export type JournalEntry = {
  slug: string;
  title: string;
  standfirst: string;
  category: string;
  readingMinutes: number;
  publishedAt: string;
  body: { kind: "paragraph" | "heading" | "pull"; text: string }[];
};
