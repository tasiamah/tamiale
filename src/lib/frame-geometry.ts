/**
 * The Marina's front elevation, expressed once and consumed three times: by
 * the technical drawing, by the 3D atelier extrusion, and by the Vision Studio
 * try-on overlay. Units are millimetres, origin at the centre of the bridge,
 * x to the wearer's left, y downward.
 */

export type Point = readonly [number, number];

/**
 * The lens aperture as a normalised polygon, traced from the master
 * photograph. Seven edges: a near-flat brow, a chamfered outer shoulder, a
 * raked lower edge and a short vertical return at the bridge.
 */
const APERTURE_UNIT: Point[] = [
  [0.1, 0.03],
  [0.86, 0.0],
  [1.0, 0.31],
  [0.93, 0.83],
  [0.56, 1.0],
  [0.12, 0.89],
  [0.0, 0.4],
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
  const arch = (innerY - upperY) * 0.5;

  const bridge: Point[] = [
    [-upperX, upperY],
    [upperX, upperY],
    [innerX, innerY],
    [innerX * 0.52, innerY - arch],
    [0, innerY - arch * 1.3],
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
