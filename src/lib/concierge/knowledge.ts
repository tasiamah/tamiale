import { theMarina } from "@/lib/catalog/frames";

export type ConciergeAction = {
  label: string;
  href: string;
};

export type KnowledgeEntry = {
  id: string;
  /** Terms the advisor listens for. Matching is lexical, not generative. */
  terms: string[];
  answer: string;
  actions?: ConciergeAction[];
};

const lensSummary = theMarina.colorways
  .map((way) => `${way.name} (${way.vlt}% VLT, category ${way.filterCategory})`)
  .join(", ");

/**
 * The concierge answers only from this register. It is deliberately small and
 * hand-written: an advisor who says "I'll find out" is worth more to the house
 * than one who invents a measurement.
 */
export const knowledge: KnowledgeEntry[] = [
  {
    id: "price",
    terms: ["price", "cost", "how much", "expensive", "eur", "euro", "dollar"],
    answer: `The Marina is €395 in Europe, £340 in the United Kingdom, $425 in the United States and AED 1,650 in the Emirates. Each market has its own published price; we do not convert at the spot rate. European and UK prices are shown with taxes included.`,
    actions: [{ label: "View The Marina", href: "/collection/the-marina" }],
  },
  {
    id: "preorder",
    terms: ["pre-order", "preorder", "reserve", "when", "ship", "delivery", "arrive", "dispatch"],
    answer: `Collection 001 is open for pre-order. You are charged when you reserve, your pair is held from the edition, and it is dispatched in ${theMarina.shipsFrom}. Delivery is insured and complimentary in every market we serve. If the date moves, you are told before it does, and you can cancel for a full refund at any point before dispatch.`,
    actions: [{ label: "Reserve a pair", href: "/collection/the-marina" }],
  },
  {
    id: "sizing",
    terms: ["size", "sizing", "measurement", "mm", "width", "bridge", "temple", "wide", "wider", "narrow", "small", "big", "fit"],
    answer: `The Marina measures ${theMarina.geometry.lensWidth} mm lens width, ${theMarina.geometry.bridge} mm bridge and ${theMarina.geometry.templeLength} mm temples, for a total front of ${theMarina.geometry.totalWidth} mm. It suits a face measuring roughly 128 to 144 mm temple to temple. If your current glasses carry three numbers on the inside of the temple, compare them with those first. That is the most reliable check there is.`,
    actions: [
      { label: "Estimate your fit", href: "/vision-studio#fit" },
      { label: "Full specification", href: "/collection/the-marina#specification" },
    ],
  },
  {
    id: "lenses",
    terms: ["lens", "lenses", "tint", "colour", "color", "colourway", "colorway", "vlt", "dark", "darkest", "lightest tint"],
    answer: `Three expressions, all on the same Onyx acetate: ${lensSummary}. Smoke is the most neutral and the darkest; Champagne is the lightest and the most flattering in portraits; Cognac is the signature of the edition. Every lens blocks UVA and UVB to 400 nm.`,
    actions: [{ label: "Compare the three", href: "/collection#expressions" }],
  },
  {
    id: "difference",
    terms: ["difference", "compare", "versus", "vs", "between"],
    answer: `Collection 001 is a single silhouette, so the choice is one of lens rather than shape. The practical difference is light: Smoke at 18% transmission is the sunglass for bright, open light; Champagne at 38% reads closer to a tinted glass and stays comfortable indoors and at dusk; Cognac at 32% sits between them and warms flat weather. Smoke is category 3, the other two category 2.`,
    actions: [{ label: "See them side by side", href: "/collection#expressions" }],
  },
  {
    id: "suit",
    terms: ["suit", "tailored", "formal", "wedding", "office", "evening", "smart"],
    answer: `With tailoring, the house would put you in Onyx with Smoke. It is quiet at a distance, which is what you want beside a sharp lapel. The frame's angular brow does the work, and the lens stays out of the conversation. Champagne is the evening choice if you want the eyes to stay visible.`,
    actions: [{ label: "Try them on", href: "/vision-studio" }],
  },
  {
    id: "weight",
    terms: ["weight", "light", "lightest", "heavy", "grams"],
    answer: `The Marina weighs 28 grams complete with lenses. For block-milled acetate at this front depth that is on the light side, and the weight sits over the bridge rather than on the ears.`,
  },
  {
    id: "materials",
    terms: ["material", "acetate", "plastic", "hinge", "made", "manufactur", "craft", "quality"],
    answer: `The front is milled from solid Mazzucchelli acetate block, tumbled for ten days across three grades and finished by hand. The hinge is a seven-barrel German nickel-silver unit sunk into the acetate, and it is replaceable without disturbing the polish. Two rivets are set by hand into each end piece.`,
    actions: [{ label: "Read the craftsmanship file", href: "/house#craftsmanship" }],
  },
  {
    id: "uv",
    terms: ["uv", "uv400", "protection", "polarised", "polarized", "category", "driving"],
    answer: `All three lenses block UVA and UVB to 400 nm and are supplied with their conformity documentation. Smoke is filter category 3; Cognac and Champagne are category 2. None of the three is polarised at launch. Category 3 is suitable for driving in daylight but not at night.`,
  },
  {
    id: "tryon",
    terms: ["try", "try-on", "tryon", "virtual", "camera", "mirror", "vision studio", "3d", "see on"],
    answer: `Vision Studio puts the frame on your face through your own camera, and will estimate your face width and bridge fit from the same view. Everything runs on your device. The video never reaches our servers, and nothing is stored unless you choose to keep the fit profile.`,
    actions: [{ label: "Enter Vision Studio", href: "/vision-studio" }],
  },
  {
    id: "privacy",
    terms: ["privacy", "data", "face data", "store", "gdpr", "delete", "biometric"],
    answer: `Camera access is requested only when you press the button in Vision Studio, and the frames are processed in your browser. No image, video or face landmark is transmitted. A fit profile is saved only if you ask for it, lives in your own browser storage, and can be deleted from My Tamiale at any time. You can buy without ever opening the camera.`,
    actions: [{ label: "Camera and face data", href: "/legal/vision-privacy" }],
  },
  {
    id: "returns",
    terms: ["return", "refund", "exchange", "cancel", "send back"],
    answer: `Thirty days from delivery, unworn and in the original case, returned at our cost. Pre-orders can be cancelled for a full refund at any time before the edition is dispatched.`,
    actions: [{ label: "Returns in full", href: "/legal/returns" }],
  },
  {
    id: "warranty",
    terms: ["warranty", "repair", "broken", "fix", "guarantee", "service"],
    answer: `Two years against manufacturing defects, and a standing offer to repair rather than replace. Hinges, temples and lenses are all serviceable. Register the serial on the inner temple to your Digital Passport and the warranty follows the pair rather than the receipt.`,
    actions: [{ label: "Warranty and repairs", href: "/legal/warranty" }],
  },
  {
    id: "passport",
    terms: ["passport", "serial", "authentic", "register", "ownership", "counterfeit", "verify"],
    answer: `Every pair carries a serial engraved into the inner left temple and printed on the authenticity card. Registering it creates a Digital Passport: proof of purchase, warranty, service history and edition number, transferable if the pair changes hands.`,
    actions: [{ label: "Open a passport", href: "/passport" }],
  },
  {
    id: "care",
    terms: ["care", "clean", "scratch", "maintain", "wash"],
    answer: `Rinse under cool water before wiping, because most lens scratches are dust being dragged across glass by a dry cloth. Use the supplied microfibre, never alcohol or glass cleaner, and keep the pair in its case rather than on your head, which is what opens hinges over time.`,
  },
  {
    id: "advisor",
    terms: ["advisor", "adviser", "consultation", "private client", "speak", "human", "boutique", "shop", "showroom", "in person", "visit", "appointment", "stockist"],
    answer: `The house sells online only, so there is no boutique to visit and no appointment to keep. An advisor answers in writing within one working day: sizing against a pair you already own, the lens choice, or whether the frame suits you at all. In the meantime the Vision Studio will put the frame on your face in the browser, every measurement is published, and any pair can go back within thirty days.`,
    actions: [{ label: "Write to an advisor", href: "/private-client" }],
  },
  {
    id: "order",
    terms: ["order", "my order", "tracking", "status", "where is", "dubai", "invoice"],
    answer: `Order and tracking detail sits behind your account, and I can only read it once you are signed in. If you sign in from My Tamiale I can follow the pair from the atelier to your door; otherwise, the order confirmation email carries the same tracking link.`,
    actions: [{ label: "My Tamiale", href: "/my-tamiale" }],
  },
  {
    id: "collection",
    terms: ["collection", "models", "other frames", "jordaan", "bahnhof", "palm", "dam", "new", "next"],
    answer: `One silhouette is released: The Marina, in three lens expressions. Four more are drawn and in development and are not yet available to order: The Jordaan, The Bahnhof, The Palm and The Dam. Private Clients see each release before it is announced.`,
    actions: [
      { label: "The register", href: "/collection#register" },
      { label: "Request early access", href: "/private-client" },
    ],
  },
];

export const CONCIERGE_FALLBACK =
  "That is outside what I can answer accurately, and I would rather not guess. An advisor can take it from here: write to info@tamiale.com, or send a note from the private client page, and you will have a reply within one working day.";

export const CONCIERGE_FALLBACK_ACTIONS: ConciergeAction[] = [
  { label: "Write to an advisor", href: "/private-client" },
];

export const CONCIERGE_OPENERS = [
  "Which lens suits tailoring?",
  "Will this fit a wider face?",
  "When does Collection 001 ship?",
  "What is the frame made of?",
];
