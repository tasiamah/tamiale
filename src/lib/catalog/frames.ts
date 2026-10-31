import type { Colorway, Frame } from "./types";

/**
 * PLACEHOLDER TECHNICAL DATA.
 *
 * Every millimetre, gram, VLT figure and material name below is a working
 * placeholder written to build and lay out the store. Replace this file with
 * the factory specification sheet and the lens certificates before launch,
 * because these values are published to customers and to Schema.org data.
 */

const PRICE_EUR = 420;

/** Front elevation in millimetres. Drives the 3D atelier and the try-on scale. */
const MARINA_GEOMETRY = {
  lensWidth: 48,
  lensHeight: 36,
  bridge: 21,
  templeLength: 145,
  totalWidth: 136,
  frontDepth: 6.5,
  weightGrams: 28,
};

type ColorwaySeed = Omit<Colorway, "image" | "frameFinish" | "frameHex"> & {
  imageAlt: string;
};

const COLORWAY_SEEDS: ColorwaySeed[] = [
  {
    id: "cognac",
    name: "Cognac",
    lensHex: "#E8402F",
    lensHexLower: "#F7A682",
    lensDescription:
      "A warm red gradient that burns at the brow and clears toward the cheekbone.",
    vlt: 32,
    filterCategory: 2,
    gradient: true,
    sku: "TM-M-001-COG",
    editionSize: 150,
    availableForSale: true,
    imageAlt:
      "The Marina in Onyx acetate with a Cognac gradient lens, three-quarter studio view",
  },
  {
    id: "champagne",
    name: "Champagne",
    lensHex: "#C8A153",
    lensHexLower: "#F0DCAE",
    lensDescription:
      "The house signature. A pale gold wash that keeps skin tones warm and honest.",
    vlt: 38,
    filterCategory: 2,
    gradient: true,
    sku: "TM-M-001-CHA",
    editionSize: 150,
    availableForSale: true,
    imageAlt:
      "The Marina in Onyx acetate with a Champagne gold gradient lens, three-quarter studio view",
  },
  {
    id: "smoke",
    name: "Smoke",
    lensHex: "#5B5F66",
    lensHexLower: "#9BA0A7",
    lensDescription:
      "Neutral grey. The most faithful colour rendering in the collection.",
    vlt: 18,
    filterCategory: 3,
    gradient: true,
    sku: "TM-M-001-SMK",
    editionSize: 150,
    availableForSale: true,
    imageAlt:
      "The Marina in Onyx acetate with a Smoke grey lens, three-quarter studio view",
  },
];

/** Studio renders derived from the master photograph by `pnpm assets`. */
const MASTER_IMAGE = { width: 695, height: 219 };

const marinaColorways: Colorway[] = COLORWAY_SEEDS.map(
  ({ imageAlt, ...seed }) => ({
    ...seed,
    frameFinish: "Onyx",
    frameHex: "#14130F",
    image: {
      src: `/media/product/marina-onyx-${seed.id}.png`,
      alt: imageAlt,
      ...MASTER_IMAGE,
    },
  }),
);

export const theMarina: Frame = {
  handle: "the-marina",
  name: "The Marina",
  shortName: "Marina",
  collection: "Collection 001 · The Icons",
  personality: "Bold sophistication",
  character: "Architectural, commanding",
  status: "preorder",
  tagline:
    "A study in confident geometry, sculpted lines and understated presence.",
  story: [
    "The Marina began as a drawing of a building, not a frame. Its front is cut as a flattened hexagon: eight edges where most frames use a curve, each one meeting the next at an angle the eye can read from across a room.",
    "Held at the temple, the silhouette reads small and disciplined. Worn, it does the opposite. The raised brow line sits high and level, and the angular rim gives the face a horizon.",
    "The acetate is milled from block rather than injected, which is slower, wastes more material, and is the only way to get an edge this crisp to hold its polish. Two hand-set rivets mark the end piece. They are structural, and they are the only place the house permits itself an ornament.",
  ],
  price: { amount: PRICE_EUR, currencyCode: "EUR" },
  priceBook: { EUR: PRICE_EUR, GBP: 360, USD: 450, AED: 1750 },
  shipsFrom: "December 2026",
  edition: "Edition 001",
  geometry: MARINA_GEOMETRY,
  measurements: [
    { label: "Lens width", value: "48 mm" },
    { label: "Lens height", value: "36 mm" },
    { label: "Bridge", value: "21 mm" },
    { label: "Temple length", value: "145 mm" },
    { label: "Total front width", value: "136 mm" },
    { label: "Front depth", value: "6.5 mm", note: "At the brow line" },
    { label: "Weight", value: "28 g", note: "Complete, with lenses" },
    {
      label: "Recommended face width",
      value: "128 to 144 mm",
      note: "Temple to temple",
    },
  ],
  materials: [
    {
      heading: "Block-milled Italian acetate",
      body: "Mazzucchelli sheet, cured and rested before cutting, then milled from solid block. The front is tumbled for ten days across three abrasive grades and finished by hand, so the polish lives in the material rather than in a lacquer that can wear through.",
    },
    {
      heading: "Nickel-silver hardware",
      body: "A seven-barrel hinge in German nickel-silver, sunk into the acetate rather than pinned to its surface. It is rated for the life of the frame and can be replaced by any Tamiale service partner without disturbing the finish.",
    },
    {
      heading: "Lenses",
      body: "Nylon lenses in three tints, each specified with a measured visible light transmission and a declared filter category. All three block UVA and UVB to 400 nm and are supplied with their conformity documentation.",
    },
    {
      heading: "Engraving",
      body: "The wordmark is engraved into the inner left temple at a depth of 0.12 mm, alongside the serial that binds the pair to its Tamiale Digital Passport.",
    },
  ],
  colorways: marinaColorways,
};

/**
 * Silhouettes announced for Collection 001 but not yet released. They are
 * listed so the house register is complete; none are purchasable.
 */
export const forthcomingFrames = [
  {
    name: "The Jordaan",
    personality: "Creative elegance",
    character: "Refined, expressive",
  },
  {
    name: "The Bahnhof",
    personality: "Precision",
    character: "Clean, structured",
  },
  {
    name: "The Palm",
    personality: "Modern glamour",
    character: "Confident, sculptural",
  },
  {
    name: "The Dam",
    personality: "Timeless attitude",
    character: "Classic with an edge",
  },
] as const;

export const frames: Frame[] = [theMarina];

export function findFrame(handle: string): Frame | undefined {
  return frames.find((frame) => frame.handle === handle);
}

export function findColorway(
  frame: Frame,
  id: string | undefined,
): Colorway {
  return frame.colorways.find((way) => way.id === id) ?? frame.colorways[0];
}
