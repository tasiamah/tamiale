import type { FaceShapeGuide } from "./types";

/**
 * The face shape guide.
 *
 * Every eyewear brand publishes one of these, and almost all of them state
 * a convention as though it were a finding. The house cannot do that: the
 * brief forbids presenting subjective styling judgments as objective facts,
 * and the same page also has to be useful enough to earn the search it is
 * written for. The resolution is to report the convention as a convention,
 * mark where it stops, and give the reader two numbers they can measure.
 *
 * NO MILLIMETRES APPEAR HERE ON PURPOSE. Every figure in `frames.ts` is a
 * placeholder pending the factory sheet, and a guide that told a reader to
 * compare their own face against a provisional number would be worse than
 * no guide. The prose points at the published specification instead, so it
 * stays correct when those numbers are replaced.
 */
export const faceShapeGuide: FaceShapeGuide = {
  slug: "sunglasses-for-your-face-shape",
  metaTitle: "Sunglasses for Your Face Shape",
  metaDescription:
    "How to find the best sunglasses for your face: what the face shape conventions claim, where they stop, and the two numbers to measure instead.",
  eyebrow: "Guide",
  title: "Sunglasses for your face shape",
  standfirst:
    "What the face shape conventions claim, where they stop being useful, and the two measurements that are worth more than any of them.",
  shapesHeading: "Five shapes, and what is actually being said about them",
  recogniseLabel: "How to recognise it",
  conventionLabel: "What the convention says",
  marinaLabel: "How the Marina reads",
  measureHeading: "Measure yourself first",
  intro: [
    "Every eyewear brand publishes a face shape chart, and most of them are written like physics. Round faces take angular frames. Square faces take round ones. Oval faces, apparently, take anything.",
    "These are conventions, not measurements. They describe a habit of taste that happens to be widely shared, which is a real thing and worth knowing, but nobody has shown that a rule about shape predicts whether you will like what you see in the mirror. The two things that can actually be measured are how wide a frame is and where it sits on your nose, and those are the two things this guide treats as fact.",
    "What follows is the convention stated plainly, with its limits marked, and then a way to measure yourself so that you can argue with it.",
  ],
  shapes: [
    {
      id: "oval",
      name: "Oval",
      recognise:
        "The cheekbones are the widest point, the forehead is a little wider than the jaw, and the line from temple to chin curves without turning a corner. The face is noticeably longer than it is wide.",
      convention:
        "That almost any frame works. This is less a compliment than an admission that the chart has run out of things to say.",
      marina:
        "A level brow line gives an oval face a horizontal, which is the one thing the shape does not supply on its own. The Marina is a medium front rather than an oversized one, so it tends to read as proportionate rather than as a declaration.",
    },
    {
      id: "round",
      name: "Round",
      recognise:
        "Width and length are close to equal, the cheeks are full, and the jaw turns without a visible angle.",
      convention:
        "Angular frames, on the theory that a straight line contrasts with a curve and that contrast flatters.",
      marina:
        "This is the case the convention was written for: eight straight edges and a level brow against a face that has neither. Whether that reads as structure or as severity is a matter of taste, which is exactly why it is worth seeing on your own face before deciding.",
    },
    {
      id: "square",
      name: "Square",
      recognise:
        "The jaw is broad and turns at a visible corner, the hairline runs straight, and the width at the jaw is close to the width at the temple.",
      convention:
        "Rounded or oval frames, to soften the jaw.",
      marina:
        "The convention argues against it. In practice the Marina's chamfered outer shoulder is a shallower angle than the jaw beneath it, and a frame whose corners are gentler than the face's own can read as deliberate rather than as a repetition. This is the shape where trying it on matters most.",
    },
    {
      id: "heart",
      name: "Heart",
      recognise:
        "The forehead and cheekbones are wide, the chin is narrow and comes to a point, and the hairline may dip at the centre.",
      convention:
        "Frames that are not top-heavy, so that the width is not all gathered above the eyes.",
      marina:
        "The brow is the heaviest part of this frame, which the convention counts against it. The counterweight is the width: the front is not a wide one, so it finishes near the cheekbone rather than past it.",
    },
    {
      id: "oblong",
      name: "Oblong",
      recognise:
        "Length runs well ahead of width, the cheeks are flat rather than full, and the forehead and jaw measure close to the same.",
      convention:
        "Deeper frames, to break the face horizontally and shorten it.",
      marina:
        "The lens is a medium depth, not a deep one, so the Marina only half answers this. The level brow does the horizontal work the convention asks for; the depth does not.",
    },
  ],
  measure: [
    "A shape name is a guess. Two numbers are not, and both can be taken in a mirror with a tape measure in under a minute. They are also the numbers the whole industry prints on its specification sheets, so they let you compare frames across brands instead of across adjectives.",
  ],
  measureSteps: [
    {
      title: "Temple to temple",
      body: "Measure straight across your face at its widest point, usually just above the ears. A frame's total width wants to land within roughly five millimetres of that figure. Every product page here publishes its total width.",
    },
    {
      title: "Bridge gap",
      body: "The distance between the inner corners of your eyes. This is the figure that decides whether a frame sits where it should or slides down, and it matters more than overall width. The profile of your nose matters as much as the gap, so treat the number as a starting point.",
    },
    {
      title: "A pair you already own",
      body: "The most reliable reference you have. Read the three figures printed inside the temple arm of your current sunglasses and set them against the ones published here. That comparison beats any chart, including this one.",
    },
  ],
  caveat:
    "None of this is a prescription. The conventions above are recorded because they are widely held, not because they have been demonstrated, and the house is not going to tell you that a shape of face obliges you to wear a shape of frame. The numbers are the part worth trusting.",
  cta: {
    heading: "Try it on, then decide",
    body: "Vision Studio opens your camera in the browser, estimates your face width and bridge gap, and places the frame where it would sit. Nothing is uploaded, and nothing is kept unless you ask for it.",
    label: "Open Vision Studio",
  },
};
