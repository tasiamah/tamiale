import { buildOutline, toPathData } from "@/lib/frame-geometry";
import type { Frame } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";

type Tone = "obsidian" | "ivory";

/**
 * Front elevation drawn from the published geometry, with the dimension lines
 * a factory drawing would carry. Nothing here is decorative: every callout is
 * the figure printed in the specification table.
 */
export function FrameDrawing({
  frame,
  tone = "obsidian",
  dimensions = true,
  className,
}: {
  frame: Frame;
  tone?: Tone;
  dimensions?: boolean;
  className?: string;
}) {
  const outline = buildOutline(frame.geometry);
  const { bounds } = outline;
  const pad = dimensions ? 26 : 8;

  // Even padding: the stacked callouts above the brow need as much room as
  // the overall width line below, or their figures are clipped by the edge.
  const viewBox = [
    bounds.minX - pad,
    bounds.minY - pad,
    bounds.maxX - bounds.minX + pad * 2,
    bounds.maxY - bounds.minY + pad * 2,
  ].join(" ");

  const line = tone === "ivory" ? "#8C8983" : "#8C8983";
  const solid = tone === "ivory" ? "#F3F0E9" : "#111110";

  return (
    <svg
      viewBox={viewBox}
      className={cn("w-full", className)}
      role="img"
      aria-label={`Technical front elevation of ${frame.name}: ${frame.geometry.lensWidth} millimetre lens width, ${frame.geometry.bridge} millimetre bridge, ${frame.geometry.totalWidth} millimetre total front width.`}
    >
      <g
        fill="none"
        stroke={solid}
        strokeWidth={0.6}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {outline.rims.map((rim, index) => (
          <path key={`rim-${index}`} d={toPathData(rim)} />
        ))}
        {outline.apertures.map((aperture, index) => (
          <path key={`aperture-${index}`} d={toPathData(aperture)} />
        ))}
        <path d={toPathData(outline.bridge)} />
      </g>

      <g fill={solid}>
        {outline.rivets.map(([x, y], index) => (
          <path
            key={`rivet-${index}`}
            d={`M${x} ${y - 0.9} L${x + 0.9} ${y} L${x} ${y + 0.9} L${x - 0.9} ${y} Z`}
          />
        ))}
      </g>

      {dimensions && (
        <g
          stroke={line}
          strokeWidth={0.35}
          fill={line}
          vectorEffect="non-scaling-stroke"
        >
          <Dimension
            from={[bounds.minX, bounds.maxY + 14]}
            to={[bounds.maxX, bounds.maxY + 14]}
            label={`${frame.geometry.totalWidth}`}
          />
          <Dimension
            from={[-frame.geometry.bridge / 2, bounds.minY - 10]}
            to={[frame.geometry.bridge / 2, bounds.minY - 10]}
            label={`${frame.geometry.bridge}`}
          />
          <Dimension
            from={[frame.geometry.bridge / 2, bounds.minY - 18]}
            to={[
              frame.geometry.bridge / 2 + frame.geometry.lensWidth,
              bounds.minY - 18,
            ]}
            label={`${frame.geometry.lensWidth}`}
          />
          <Dimension
            vertical
            from={[bounds.maxX + 13, 0]}
            to={[bounds.maxX + 13, frame.geometry.lensHeight]}
            label={`${frame.geometry.lensHeight}`}
          />
        </g>
      )}
    </svg>
  );
}

function Dimension({
  from,
  to,
  label,
  vertical = false,
}: {
  from: [number, number];
  to: [number, number];
  label: string;
  vertical?: boolean;
}) {
  const tick = 1.8;
  const mid: [number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];

  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} />
      {[from, to].map(([x, y], index) => (
        <line
          key={index}
          x1={vertical ? x - tick : x}
          y1={vertical ? y : y - tick}
          x2={vertical ? x + tick : x}
          y2={vertical ? y : y + tick}
        />
      ))}
      <text
        x={vertical ? mid[0] + 4.5 : mid[0]}
        y={vertical ? mid[1] : mid[1] - 2.6}
        textAnchor={vertical ? "start" : "middle"}
        dominantBaseline={vertical ? "middle" : "auto"}
        stroke="none"
        fontSize={5}
        letterSpacing={0.4}
        className="font-sans"
      >
        {label}
      </text>
    </g>
  );
}
