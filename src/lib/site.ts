export const site = {
  name: "Tamiale",
  wordmark: "TAMIALE",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tamiale.com",
  email: "clients@tamiale.com",
  instagram: "https://instagram.com/tamiale",
  foundedIn: "Amsterdam",
} as const;

/**
 * Structure only. The labels are keys into `dict.nav` and `dict.navSummary`,
 * so adding a language cannot leave a menu item in English, and the order
 * and numbering stay identical in every market.
 */
export const navigation = [
  { key: "collection", href: "/collection", index: "01" },
  { key: "visionStudio", href: "/vision-studio", index: "02" },
  { key: "house", href: "/house", index: "03" },
  { key: "journal", href: "/journal", index: "04" },
  { key: "privateClient", href: "/private-client", index: "05" },
  { key: "myTamiale", href: "/my-tamiale", index: "06" },
] as const;

export type NavKey = (typeof navigation)[number]["key"];

/** Keys index into `dict.footer`. */
export const footerGroups = [
  {
    heading: "clientCare",
    links: [
      { key: "shipping", href: "/legal/shipping" },
      { key: "returns", href: "/legal/returns" },
      { key: "warranty", href: "/legal/warranty" },
      { key: "contact", href: "/private-client#contact" },
    ],
  },
  {
    heading: "theHouse",
    links: [
      { key: "philosophy", href: "/house" },
      { key: "craftsmanship", href: "/house#craftsmanship" },
      { key: "journal", href: "/journal" },
      { key: "digitalPassport", href: "/passport" },
    ],
  },
  {
    heading: "legal",
    links: [
      { key: "privacy", href: "/legal/privacy" },
      { key: "terms", href: "/legal/terms" },
      { key: "accessibility", href: "/legal/accessibility" },
      { key: "cameraData", href: "/legal/vision-privacy" },
    ],
  },
] as const;
