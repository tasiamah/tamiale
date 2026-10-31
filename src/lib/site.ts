export const site = {
  name: "Tamiale",
  wordmark: "TAMIALE",
  statement: "A Different Perspective.",
  description:
    "Tamiale is a contemporary luxury eyewear house. Collection 001 — The Marina, an architectural silhouette in Italian acetate, released in three lens expressions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tamiale.com",
  email: "clients@tamiale.com",
  instagram: "https://instagram.com/tamiale",
  foundedIn: "Amsterdam",
} as const;

export const navigation = [
  { label: "The Collection", href: "/collection", index: "01" },
  { label: "Vision Studio", href: "/vision-studio", index: "02" },
  { label: "The House", href: "/house", index: "03" },
  { label: "Journal", href: "/journal", index: "04" },
  { label: "Private Client", href: "/private-client", index: "05" },
  { label: "My Tamiale", href: "/my-tamiale", index: "06" },
] as const;

export const navigationSummaries: Record<string, string> = {
  "/collection": "All frames, individual designs, limited editions",
  "/vision-studio": "Virtual try-on, fit recommendations, 3D viewing",
  "/house": "Philosophy, materials, craftsmanship",
  "/journal": "Editorial stories, campaigns, collaborations",
  "/private-client": "Appointments, concierge, private releases",
  "/my-tamiale": "Orders, saved frames, digital passports",
};

export const footerLinks = [
  {
    heading: "Client Care",
    links: [
      { label: "Shipping", href: "/legal/shipping" },
      { label: "Returns", href: "/legal/returns" },
      { label: "Warranty & Repairs", href: "/legal/warranty" },
      { label: "Contact", href: "/private-client#contact" },
    ],
  },
  {
    heading: "The House",
    links: [
      { label: "Philosophy", href: "/house" },
      { label: "Craftsmanship", href: "/house#craftsmanship" },
      { label: "Journal", href: "/journal" },
      { label: "Digital Passport", href: "/passport" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Accessibility", href: "/legal/accessibility" },
      { label: "Camera & Face Data", href: "/legal/vision-privacy" },
    ],
  },
] as const;
