/**
 * The Marina's front elevation, expressed once and consumed three times: by
 * the technical drawing, by the 3D atelier extrusion, and by the Vision Studio
 * try-on overlay. Units are millimetres, origin at the centre of the bridge,
 * x to the wearer's left, y downward.
 */

export type Point = readonly [number, number];

/**
 * The lens aperture as a normalised polygon, traced off the product
 * photograph: the glass is the only warm mid-dark region in the picture, so
 * it separates cleanly, and its convex hull reduced to eight corners is the
 * cut. The frame sits at 5.8 degrees in that shot, measured from the line
 * between the two lens centres and taken out before normalising.
 *
 * Eight edges, which is what the house says the front is cut with and what
 * the photograph shows: a level brow, a short chamfer off each end of it,
 * a near-vertical outer edge, a level base, and a long rake back up to the
 * bridge. The previous polygon had seven, a brow that sloped toward the
 * nose and a single raked base, and read as a soft lozenge rather than
 * something milled.
 *
 * The photograph is a three-quarter view and so compressed horizontally.
 * That does not survive normalising u and v to [0,1] separately, which is
 * why the aspect ratio of the real lens lives in the spec below rather than
 * in these numbers.
 */
const APERTURE_UNIT: Point[] = [
  [0.142, 0.027],
  [0.7, 0.02],
  [0.89, 0.19],
  [1.0, 0.673],
  [0.891, 0.975],
  [0.311, 0.96],
  [0.059, 0.583],
  [0.0, 0.267],
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
  const RIM_THICKNESS = 4.6;
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
   * A shallow keyhole bridge. It has to land on the rims' own nasal edge
   * rather than on a nominal bridge width, or it floats free of the fronts:
   * those edges rake inward, so the span is wide at the brow and narrow at
   * the nose.
   */
  const nasal = rimRight.reduce(
    (best, [x], index) => (x < rimRight[best][0] ? index : best),
    0,
  );
  const [innerX, innerY] = rimRight[nasal];
  const [upperX, upperY] = rimRight[(nasal + 1) % rimRight.length];
  /*
   * How far the keyhole is cut up into the saddle, as a fraction of the drop
   * from the brow to the rims' nasal corner. At a half, lifted by a further
   * third at the centre, the cut reached almost to the brow line and the two
   * rims met in a narrow peak: an aviator's double bridge, not this frame.
   * A fifth leaves the saddle solid and takes a shallow scoop out of its
   * underside, which is what the photograph shows.
   */
  const arch = (innerY - upperY) * 0.2;

  const bridge: Point[] = [
    [-upperX, upperY],
    [upperX, upperY],
    [innerX, innerY],
    [innerX * 0.52, innerY - arch],
    [0, innerY - arch * 0.9],
    [-innerX * 0.52, innerY - arch],
    [-innerX, innerY],
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
