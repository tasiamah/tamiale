import type { JournalEntry } from "./types";

export const journal: JournalEntry[] = [
  {
    slug: "the-angle-is-the-argument",
    title: "The angle is the argument",
    standfirst:
      "Why Collection 001 is cut from straight lines, and what eight edges do to a face that a curve cannot.",
    category: "Design",
    readingMinutes: 4,
    publishedAt: "2026-09-18",
    body: [
      {
        kind: "paragraph",
        text: "Almost every sunglass front in production is drawn with a curve. Curves are forgiving: they flatter a wide range of faces, they tool easily, and they age slowly out of fashion. They are also, for the same reasons, forgettable.",
      },
      {
        kind: "paragraph",
        text: "The Marina is drawn with eight straight edges. The brow runs level, the outer shoulder is chamfered rather than rounded, and the lower edge rakes back toward the bridge. Nothing about the shape is accidental, and nothing about it is soft.",
      },
      { kind: "heading", text: "What a level brow does" },
      {
        kind: "paragraph",
        text: "A straight brow line gives the upper half of the face a horizon. The eye reads it as a datum and measures everything else against it — the line of the eyebrow, the set of the cheekbone, the tilt of the head. A curved frame has no datum; it follows the face instead of organising it.",
      },
      {
        kind: "pull",
        text: "A curve follows the face. A line organises it.",
      },
      {
        kind: "paragraph",
        text: "This is also why the Marina reads smaller in the hand than it does worn. Held at the temple it is a compact object, 136 millimetres across. On a face it behaves like a much larger frame, because the horizontal line carries further than its own width.",
      },
      { kind: "heading", text: "The cost of an edge" },
      {
        kind: "paragraph",
        text: "An edge is harder to make than a curve. Injection moulding rounds everything slightly as the material cools, so a crisp chamfer has to be milled from solid block and then polished without losing the arris. Ten days of tumbling across three abrasive grades gets the surface to a shine; a skilled hand keeps the edge while doing it.",
      },
      {
        kind: "paragraph",
        text: "Most of that labour is invisible in a photograph. It becomes obvious at arm's length, which is the only distance that matters.",
      },
    ],
  },
  {
    slug: "a-note-on-transmission",
    title: "A note on transmission",
    standfirst:
      "Three lenses, three numbers, and why the figure on the specification sheet tells you more than the name of the colour.",
    category: "Craft",
    readingMinutes: 5,
    publishedAt: "2026-10-02",
    body: [
      {
        kind: "paragraph",
        text: "Lens colour is usually sold as a mood. Warm, cool, vintage, modern. These are not useless words, but they describe the lens from the outside — how it looks on someone else's face — rather than from behind it, which is where you will spend your time.",
      },
      {
        kind: "paragraph",
        text: "The figure that describes the experience is visible light transmission: the percentage of light the lens lets through. Smoke transmits 18 per cent. Champagne transmits 38. That is more than twice the light, and it is the difference between a lens you take off indoors and one you forget you are wearing.",
      },
      { kind: "heading", text: "Reading the categories" },
      {
        kind: "paragraph",
        text: "European filter categories bundle transmission into five bands. Category 2 covers 18 to 43 per cent and suits most daylight. Category 3 covers 8 to 18 and is the standard for bright sun. Neither category says anything about ultraviolet protection, which is a separate specification — all three Tamiale lenses block to 400 nanometres regardless of how dark they are.",
      },
      {
        kind: "pull",
        text: "A dark lens is not a safer lens. A certified lens is.",
      },
      {
        kind: "paragraph",
        text: "This matters more than it sounds. A dark, uncertified lens is worse than no lens at all: the pupil opens behind it and admits more ultraviolet than it would in bright light with the naked eye. Density and protection are unrelated properties, and only one of them is visible.",
      },
      { kind: "heading", text: "Gradients" },
      {
        kind: "paragraph",
        text: "All three are gradients, denser at the brow than at the cheek. The practical effect is that you can read a menu, a phone or a dashboard through the lower half of the lens while the upper half is still doing its job against the sky. The aesthetic effect is that the eye stays visible, which is the whole argument for a gradient.",
      },
    ],
  },
  {
    slug: "what-a-passport-is-for",
    title: "What a passport is for",
    standfirst:
      "On serial numbers, repair over replacement, and the difference between owning an object and holding a receipt.",
    category: "The House",
    readingMinutes: 3,
    publishedAt: "2026-10-21",
    body: [
      {
        kind: "paragraph",
        text: "Every pair leaves the atelier with a serial engraved into the inner left temple, 0.12 millimetres deep. It is on the authenticity card too, and registering it opens a Tamiale Digital Passport.",
      },
      {
        kind: "paragraph",
        text: "A passport is not a certificate of authenticity. A printed code can be copied, and a copied code proves nothing. What the passport does is bind a serial to a registration the house controls and can revoke — which is a weaker claim than most brands make, and a true one.",
      },
      { kind: "heading", text: "What it is actually for" },
      {
        kind: "paragraph",
        text: "The useful part is service. A registered pair carries its own warranty, its own repair history and its own proof of purchase, none of which depend on you finding an email from three years ago. When a hinge needs replacing, the serial tells the workshop exactly which hinge, in which finish, from which production run.",
      },
      {
        kind: "pull",
        text: "The house would rather repair a pair than sell you a second one.",
      },
      {
        kind: "paragraph",
        text: "It also transfers. If the pair changes hands, so does the passport, and the warranty goes with it. That is a deliberate position: eyewear that is worth repairing is worth reselling, and a house that is confident in its work should have no objection to a second owner.",
      },
    ],
  },
];

export function findEntry(slug: string): JournalEntry | undefined {
  return journal.find((entry) => entry.slug === slug);
}
