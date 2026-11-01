/**
 * The Marina's front elevation, expressed once and consumed three times: by
 * the technical drawing, by the 3D atelier extrusion, and by the Vision Studio
 * try-on overlay. Units are millimetres, origin at the centre of the bridge,
 * x to the wearer's left, y downward.
 */

export type Point = readonly [number, number];

/**
 * The lens aperture as a normalised polygon: a flattened octagon, level at
 * the brow and the base, with a chamfer off each of the four corners and a
 * near-vertical edge at the nose and at the temple.
 *
 * This used to be traced off the product photograph, and the photograph is
 * a three-quarter view. Scaling u and v into [0,1] separately takes out the
 * aspect ratio but not the perspective, and perspective is the half that
 * matters: in that shot the far edge of the lens is foreshortened and the
 * verticals converge, so the trace came back as a sheared polygon with a
 * base raking some fifteen degrees down toward the temple and a brow
 * dipping toward the nose. Mirrored into a pair it read as a swept wing,
 * and the two nasal corners rose into a narrow peak that the bridge then
 * had to span, which is where the aviator's double bridge came from.
 *
 * A front elevation cannot be recovered from a single three-quarter frame
 * without knowing the angle, so it is stated instead. The chamfers are
 * measured off the near lens of the master as a fraction of its own width
 * and height, which perspective leaves roughly intact, and the shape is
 * made symmetric about both axes because the milled part is.
 *
 * The chamfers were a quarter of the width and a quarter of the height,
 * which cut so far into each corner that the brow and the base were half
 * the lens and the thing rendered solid read as a stop sign. Measured off
 * the campaign frame, levelled on the line between the two lens centres,
 * the brow runs about seven tenths of the width and the temple edge about
 * six tenths of the height, so the corners come off at roughly a seventh
 * and a fifth. That is the difference between an octagon and a rectangle
 * with its corners taken off, and the second is the frame.
 *
 * The aspect ratio of the real lens lives in the spec below, not here.
 */
const APERTURE_UNIT: Point[] = [
  [0.145, 0.0],
  [0.855, 0.0],
  [1.0, 0.205],
  [1.0, 0.795],
  [0.855, 1.0],
  [0.145, 1.0],
  [0.0, 0.795],
  [0.0, 0.205],
];

export type FrameSpec = {
  lensWidth: number;
  lensHeight: number;
  bridge: number;
  templeLength: number;
  totalWidth: number;
  frontDepth: number;
};

export type FrameOutline = {
  /** Aperture and rim polygons for each side, in millimetres. */
  apertures: [Point[], Point[]];
  rims: [Point[], Point[]];
  bridge: Point[];
  /** Where a temple meets the front, per side. */
  hingePoints: [Point, Point];
  /** Rivet positions on the end pieces. */
  rivets: Point[];
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
};

/**
 * Outward miter direction at each vertex, for a clockwise polygon in this
 * y-downward space. Scaling a polygon away from its centroid is not an offset:
 * it moves the inner edge inward as well, which on a frame closes the bridge.
 */
function miterNormals(points: Point[]): Point[] {
  const n = points.length;
  const edgeNormal = ([dx, dy]: Point): Point => {
    const length = Math.hypot(dx, dy) || 1;
    return [dy / length, -dx / length];
  };

  return points.map(([x, y], index) => {
    const [px, py] = points[(index - 1 + n) % n];
    const [qx, qy] = points[(index + 1) % n];
    const before = edgeNormal([x - px, y - py]);
    const after = edgeNormal([qx - x, qy - y]);

    const bx = before[0] + after[0];
    const by = before[1] + after[1];
    const length = Math.hypot(bx, by) || 1;
    const ux = bx / length;
    const uy = by / length;

    // Extend along the bisector so the two offset edges actually meet, with a
    // cap so a sharp corner cannot shoot off to infinity.
    const miter = 1 / Math.max(0.4, ux * before[0] + uy * before[1]);
    return [ux * miter, uy * miter];
  });
}

function mirrorX(points: Point[]): Point[] {
  // Reversed so both polygons keep the same winding order after mirroring,
  // which the extruder relies on to cut holes rather than fuse them.
  return points.map(([x, y]) => [-x, y] as Point).reverse();
}

export function buildOutline(spec: FrameSpec): FrameOutline {
  const halfBridge = spec.bridge / 2;

  // Right side of the face (positive x), then mirrored.
  const apertureRight: Point[] = APERTURE_UNIT.map(([u, v]) => [
    halfBridge + u * spec.lensWidth,
    v * spec.lensHeight,
  ]);

  /**
   * The rim is offset outward from the aperture: RIM_THICKNESS around the
   * brow and the bridge side, thickening toward the temple into the end piece
   * that carries the hinge. The end piece is then solved so the outer edge
   * lands exactly on the published total front width.
   */
  /*
   * Measured the same way as the chamfers: the acetate above the glass is
   * about an eighth of the lens height in the campaign frame, which on a
   * thirty millimetre lens is a little under four. At 4.6 the brow was
   * heavy enough to close the gap over the bridge into a solid bar.
   */
  const RIM_THICKNESS = 3.9;
  const normals = miterNormals(apertureRight);
  const minApertureX = Math.min(...apertureRight.map(([x]) => x));
  const maxApertureX = Math.max(...apertureRight.map(([x]) => x));
  const outer = apertureRight.reduce(
    (best, [x], index) => (x > apertureRight[best][0] ? index : best),
    0,
  );

  const taper = (x: number) =>
    ((x - minApertureX) / (maxApertureX - minApertureX)) ** 2;

  const endPiece =
    spec.totalWidth / 2 - maxApertureX - normals[outer][0] * RIM_THICKNESS;

  const rimRight: Point[] = apertureRight.map(([x, y], index) => [
    x + normals[index][0] * RIM_THICKNESS + endPiece * taper(x),
    y + normals[index][1] * RIM_THICKNESS,
  ]);

  const apertureLeft = mirrorX(apertureRight);
  const rimLeft = mirrorX(rimRight);

  const rimTop = Math.min(...rimRight.map(([, y]) => y));
  const rimBottom = Math.max(...rimRight.map(([, y]) => y));
  const rimOuter = Math.max(...rimRight.map(([x]) => x));
  /**
   * A shallow keyhole bridge, spanning the rims' own nasal edge so that it
   * lands on the fronts rather than floating at some nominal width.
   *
   * Its depth is stated rather than taken from whichever pair of vertices
   * happen to be adjacent. It used to read the leftmost vertex and the one
   * after it, which worked only because the traced aperture was raked
   * enough to have a single leftmost corner near the brow. A nasal edge
   * that is actually vertical has two corners at that same x, so the pair
   * became the whole edge and the bridge grew to the full height of the
   * lens: a block of acetate across the nose from brow to cheek.
   */
  const nasalX = Math.min(...rimRight.map(([x]) => x));
  const innerX = nasalX;
  const topY = Math.min(
    ...rimRight.filter(([x]) => x <= nasalX + 0.01).map(([, y]) => y),
  );
  /*
   * How far the saddle comes down the nasal edge. The frame wears its
   * bridge high: a little under half the lens, which leaves the nose open
   * below it, as the photograph shows.
   */
  const bottomY = topY + spec.lensHeight * 0.46;
  /*
   * The keyhole, cut up into the underside of the saddle. Deep enough to
   * read as a cut and shallow enough to leave the saddle solid.
   */
  const arch = (bottomY - topY) * 0.42;

  const bridge: Point[] = [
    [-innerX, topY],
    [innerX, topY],
    [innerX, bottomY],
    [innerX * 0.55, bottomY - arch],
    [0, bottomY - arch * 0.85],
    [-innerX * 0.55, bottomY - arch],
    [-innerX, bottomY],
  ];

  const hingeY = rimTop + (rimBottom - rimTop) * 0.32;

  return {
    apertures: [apertureLeft, apertureRight],
    rims: [rimLeft, rimRight],
    bridge,
    hingePoints: [
      [-rimOuter, hingeY],
      [rimOuter, hingeY],
    ],
    // The two hand-set rivets on each end piece.
    rivets: [
      [-rimOuter + 2.4, hingeY - 2.2],
      [-rimOuter + 2.4, hingeY + 2.2],
      [rimOuter - 2.4, hingeY - 2.2],
      [rimOuter - 2.4, hingeY + 2.2],
    ],
    bounds: {
      minX: -rimOuter,
      maxX: rimOuter,
      minY: rimTop,
      maxY: rimBottom,
    },
  };
}

export function toPathData(points: Point[]): string {
  return `${points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ")} Z`;
}
