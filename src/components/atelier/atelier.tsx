"use client";

import { CameraControls, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, type RefObject } from "react";

import { FrameDrawing } from "@/components/product/frame-drawing";
import { cn } from "@/lib/cn";
import type { Colorway, Frame } from "@/lib/catalog/types";

import { FrameMesh } from "./frame-mesh";

type ViewId = "three-quarter" | "front" | "side" | "top" | "rear";

const VIEWS: { id: ViewId; label: string; position: [number, number, number] }[] =
  [
    { id: "three-quarter", label: "Three-quarter", position: [1.08, 0.3, 1.78] },
    { id: "front", label: "Front", position: [0, 0, 2.15] },
    { id: "side", label: "Profile", position: [2.35, 0.05, 0.18] },
    { id: "top", label: "Plan", position: [0, 2.2, 0.3] },
    { id: "rear", label: "Rear", position: [0, 0.2, -2.2] },
  ];

type LightingId = "studio" | "boutique" | "nocturne";

type Scheme = {
  label: string;
  background: string;
  ambient: number;
  key: string;
  rim: string;
  /**
   * The room the frame reflects. Kept dark whatever the canvas background is:
   * polished black acetate mirrors its surroundings, so a bright room turns it
   * uniformly grey and the sculpture disappears.
   */
  room: string;
  /** Brightness of the softbox panels the acetate reflects. */
  softbox: number;
};

const LIGHTING: Record<LightingId, Scheme> = {
  studio: {
    label: "Studio",
    background: "#e9e4da",
    room: "#272520",
    ambient: 0.3,
    key: "#ffffff",
    rim: "#c9c4b8",
    softbox: 4.5,
  },
  boutique: {
    label: "Boutique",
    background: "#1a1917",
    room: "#15140f",
    ambient: 0.12,
    key: "#f2e2c4",
    rim: "#c1a67d",
    softbox: 4,
  },
  nocturne: {
    label: "Nocturne",
    background: "#111110",
    room: "#0c0c10",
    ambient: 0.1,
    key: "#dce6f5",
    rim: "#6f8bb5",
    softbox: 3.4,
  },
};

/**
 * A black acetate frame is almost entirely described by what it reflects, so
 * the rig is built from softbox panels rather than an HDR file — nothing to
 * download, and the highlights travel correctly as the frame turns.
 */
function Rig({ scheme }: { scheme: Scheme }) {
  return (
    <Environment key={scheme.label} resolution={256} frames={1}>
      <color attach="background" args={[scheme.room]} />
      {/* Long overhead strip: the signature highlight along the brow. */}
      <Lightformer
        form="rect"
        intensity={scheme.softbox}
        color={scheme.key}
        position={[0, 4, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[10, 3, 1]}
      />
      {/* Three-quarter fill, left. */}
      <Lightformer
        form="rect"
        intensity={scheme.softbox * 0.55}
        color={scheme.rim}
        position={[-5, 1, 2]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[6, 4, 1]}
      />
      {/* Narrow kicker behind right, to separate the temple from the ground. */}
      <Lightformer
        form="rect"
        intensity={scheme.softbox * 0.9}
        color={scheme.key}
        position={[4, 0.5, -3]}
        rotation={[0, -Math.PI / 3, 0]}
        scale={[2, 4, 1]}
      />
    </Environment>
  );
}

export function Atelier({
  frame,
  colorway,
  className,
}: {
  frame: Frame;
  colorway: Colorway;
  className?: string;
}) {
  const [view, setView] = useState<ViewId>("three-quarter");
  const [lighting, setLighting] = useState<LightingId>("studio");
  const [spinning, setSpinning] = useState(false);
  const [failed, setFailed] = useState(false);
  const controlsRef = useRef<CameraControls>(null);

  const scheme = LIGHTING[lighting];
  const dark = lighting !== "studio";

  useEffect(() => {
    const target = VIEWS.find((entry) => entry.id === view);
    if (!target || !controlsRef.current) return;
    void controlsRef.current.setLookAt(...target.position, 0, 0, 0, true);
  }, [view]);

  if (failed) {
    return (
      <div className={cn("flex flex-col justify-center bg-ivory-dim p-10", className)}>
        <FrameDrawing frame={frame} dimensions={false} />
        <p className="mt-8 text-center text-xs text-stone">
          The 3D atelier needs WebGL, which this browser has turned off. The
          technical elevation is shown instead.
        </p>
      </div>
    );
  }

  return (
    <div
      data-atelier
      className={cn("relative isolate overflow-hidden", className)}
      style={{ backgroundColor: scheme.background }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [1.08, 0.3, 1.78], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        /*
         * Contact shadows clear their depth target with the renderer's clear
         * colour, so it has to be transparent — otherwise the shadow plane
         * paints an opaque slab under the frame. The visible backdrop comes
         * from the scene background below, which follows the lighting rig.
         */
        onCreated={({ gl }) => gl.setClearAlpha(0)}
        onError={() => setFailed(true)}
      >
        <color attach="background" args={[scheme.background]} />
        <ambientLight intensity={scheme.ambient} />
        <directionalLight
          position={[2.5, 3, 4]}
          intensity={dark ? 1.4 : 1}
          color={scheme.key}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
        />
        <directionalLight
          position={[-3, 1, 2]}
          intensity={dark ? 0.4 : 0.7}
          color={scheme.rim}
        />

        <Suspense fallback={null}>
          <Rig scheme={scheme} />
          <FrameMesh frame={frame} colorway={colorway} />
          <ContactShadows
            position={[0, -0.42, 0]}
            opacity={dark ? 0.55 : 0.35}
            scale={4}
            blur={2.6}
            far={1.2}
          />
        </Suspense>

        <CameraControls
          ref={controlsRef}
          makeDefault
          minDistance={1.1}
          maxDistance={4}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI - 0.25}
          azimuthRotateSpeed={0.6}
          polarRotateSpeed={0.5}
          truckSpeed={0}
        />
        <AutoRotate controls={controlsRef} active={spinning} />
      </Canvas>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5",
          dark ? "text-ivory" : "text-obsidian",
        )}
      >
        <p className="eyebrow opacity-50">3D Atelier</p>
        <p className="eyebrow opacity-50">Drag to rotate</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5">
        <div className="flex flex-wrap gap-1.5">
          {VIEWS.map((entry) => (
            <Chip
              key={entry.id}
              dark={dark}
              active={view === entry.id}
              onClick={() => setView(entry.id)}
            >
              {entry.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(LIGHTING) as LightingId[]).map((id) => (
            <Chip
              key={id}
              dark={dark}
              active={lighting === id}
              onClick={() => setLighting(id)}
            >
              {LIGHTING[id].label}
            </Chip>
          ))}
          <Chip
            dark={dark}
            active={spinning}
            onClick={() => setSpinning((value) => !value)}
          >
            {spinning ? "Stop" : "Rotate"}
          </Chip>
        </div>
      </div>
    </div>
  );
}

/** `CameraControls` has no auto-rotate of its own, so the turntable is driven here. */
function AutoRotate({
  controls,
  active,
}: {
  controls: RefObject<CameraControls | null>;
  active: boolean;
}) {
  useFrame((_, delta) => {
    if (active) controls.current?.rotate(delta * 0.35, 0, false);
  });
  return null;
}

function Chip({
  children,
  active,
  dark,
  onClick,
}: {
  children: string;
  active: boolean;
  dark: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "cursor-pointer border px-3 py-2 text-[0.625rem] font-medium tracking-[0.16em] uppercase transition-colors duration-300",
        dark
          ? active
            ? "border-ivory bg-ivory text-obsidian"
            : "border-ivory/25 text-ivory/70 hover:border-ivory/70 hover:text-ivory"
          : active
            ? "border-obsidian bg-obsidian text-ivory"
            : "border-obsidian/20 text-obsidian/60 hover:border-obsidian/60 hover:text-obsidian",
      )}
    >
      {children}
    </button>
  );
}
