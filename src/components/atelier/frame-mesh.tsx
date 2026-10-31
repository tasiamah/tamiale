"use client";

import { useMemo } from "react";
import * as THREE from "three";

import { buildOutline, type Point } from "@/lib/frame-geometry";
import type { Colorway, Frame } from "@/lib/catalog/types";

/** Millimetres to scene units. The frame ends up roughly 1.4 units wide. */
const MM = 0.01;

/**
 * Radius in millimetres of the front's base curve. The Marina is a flat,
 * architectural front, so the sweep is slight, enough for the light to travel
 * across the brow rather than sit on it as one dead highlight.
 */
const BASE_CURVE = 520;

const sag = (x: number) => (x * x) / (2 * BASE_CURVE);

/** Bends a flat extrusion around the base curve, in place. */
function curveFront(geometry: THREE.BufferGeometry) {
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    position.setZ(i, position.getZ(i) - sag(position.getX(i)));
  }
  position.needsUpdate = true;
}

/**
 * Three.js reads y upward, the elevation reads y downward, so every point is
 * flipped on the way into a shape.
 */
function toShape(points: Point[], holes: Point[][] = []): THREE.Shape {
  const shape = new THREE.Shape();
  points.forEach(([x, y], index) => {
    if (index === 0) shape.moveTo(x, -y);
    else shape.lineTo(x, -y);
  });
  shape.closePath();

  for (const hole of holes) {
    const path = new THREE.Path();
    hole.forEach(([x, y], index) => {
      if (index === 0) path.moveTo(x, -y);
      else path.lineTo(x, -y);
    });
    path.closePath();
    shape.holes.push(path);
  }
  return shape;
}

/**
 * Extrudes a shape that is already in frame coordinates and leaves it there,
 * so the base curve can be applied in the same space.
 */
function extrude(
  shape: THREE.Shape,
  depth: number,
  bevel: number,
  zCentre = 0,
): THREE.BufferGeometry {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 2,
  });
  geometry.translate(0, 0, zCentre - depth / 2);
  curveFront(geometry);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Pushes a polygon outward by a fixed distance. The lens is cut to the
 * aperture, but the rim's chamfer opens the hole slightly at the front face,
 * so the glass is oversized to sit in the groove behind the rim as it would
 * on the bench, otherwise daylight shows between the two.
 */
function grow(points: Point[], mm: number): Point[] {
  const cx = points.reduce((sum, [x]) => sum + x, 0) / points.length;
  const cy = points.reduce((sum, [, y]) => sum + y, 0) / points.length;
  return points.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const length = Math.hypot(dx, dy) || 1;
    return [x + (dx / length) * mm, y + (dy / length) * mm];
  });
}

/**
 * Paints the vertical lens gradient into vertex colours, so the tint darkens at
 * the brow and clears toward the cheekbone exactly as the photography does.
 */
function gradeLens(geometry: THREE.BufferGeometry, top: string, bottom: string) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) return;

  const high = new THREE.Color(top);
  const low = new THREE.Color(bottom);
  const span = Math.max(box.max.y - box.min.y, 0.0001);

  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  const mix = new THREE.Color();

  for (let i = 0; i < position.count; i += 1) {
    const t = (position.getY(i) - box.min.y) / span;
    mix.copy(low).lerp(high, t);
    colors[i * 3] = mix.r;
    colors[i * 3 + 1] = mix.g;
    colors[i * 3 + 2] = mix.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

/**
 * A temple: a long tapered bar with a short drop at the ear. Built as a lathe
 * of rectangles rather than a box so the taper is real geometry.
 */
function templeGeometry(length: number, depth: number): THREE.BufferGeometry {
  const profile = new THREE.Shape();
  const h = depth / 2;
  profile.moveTo(0, -h);
  profile.lineTo(0, h);
  profile.lineTo(length * 0.62, h * 0.78);
  profile.lineTo(length, h * 0.42);
  profile.lineTo(length, -h * 0.42);
  profile.lineTo(length * 0.62, -h * 0.78);
  profile.closePath();

  const geometry = new THREE.ExtrudeGeometry(profile, {
    depth: 4,
    bevelEnabled: true,
    bevelThickness: 0.7,
    bevelSize: 0.7,
    bevelSegments: 3,
    curveSegments: 1,
  });
  geometry.rotateY(Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}

export function FrameMesh({
  frame,
  colorway,
}: {
  frame: Frame;
  colorway: Colorway;
}) {
  const geometry = useMemo(() => {
    const outline = buildOutline(frame.geometry);
    const depth = frame.geometry.frontDepth;

    const lenses = outline.apertures.map((aperture) =>
      // Set near the front of the rim, as a lens sits in its groove, so the
      // bright inner wall of the aperture is not left on show.
      extrude(toShape(grow(aperture, 1.3)), 2.2, 0, depth / 2 - 1.5),
    );
    for (const lens of lenses) {
      gradeLens(lens, colorway.lensHex, colorway.lensHexLower);
    }

    return {
      rims: outline.rims.map((rim, index) =>
        extrude(toShape(rim, [outline.apertures[index]]), depth, 0.55),
      ),
      lenses,
      bridge: extrude(toShape(outline.bridge), depth, 0.45),
      temple: templeGeometry(frame.geometry.templeLength, depth),
      hinges: outline.hingePoints,
      rivets: outline.rivets,
      // The outline's origin is the bridge centre, which sits near the top of
      // the front. Lift the assembly so the camera orbits its middle.
      lift: (outline.bounds.minY + outline.bounds.maxY) / 2,
    };
  }, [frame.geometry, colorway.lensHex, colorway.lensHexLower]);

  const acetate = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorway.frameHex),
        roughness: 0.3,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.11,
        // Onyx acetate is near-black; the form has to come from a few sharp
        // highlights, not from an overall lift in the diffuse response.
        reflectivity: 0.32,
        envMapIntensity: 0.55,
      }),
    [colorway.frameHex],
  );

  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.04,
        metalness: 0,
        transparent: true,
        opacity: 0.93,
        ior: 1.52,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        specularIntensity: 1,
        envMapIntensity: 1.5,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const nickel = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#cfcabd"),
        roughness: 0.26,
        metalness: 0.92,
        envMapIntensity: 1.4,
      }),
    [],
  );

  return (
    <group scale={MM} position={[0, geometry.lift * MM, 0]}>
      {geometry.rims.map((rim, index) => (
        <mesh
          key={`rim-${index}`}
          geometry={rim}
          material={acetate}
          castShadow
          receiveShadow
        />
      ))}

      {geometry.lenses.map((lens, index) => (
        <mesh key={`lens-${index}`} geometry={lens} material={glass} />
      ))}

      <mesh geometry={geometry.bridge} material={acetate} castShadow />

      {geometry.hinges.map(([x, y], index) => {
        const side = x < 0 ? -1 : 1;
        return (
          /* Temples splay out a few degrees and drop toward the ear. */
          <mesh
            key={`temple-${index}`}
            geometry={geometry.temple}
            material={acetate}
            position={[x, -y, -sag(x) - 2]}
            rotation={[0, side * -0.06, side * 0.04]}
            scale={[side, 1, 1]}
            castShadow
          />
        );
      })}

      {geometry.rivets.map(([x, y], index) => (
        <mesh
          key={`rivet-${index}`}
          material={nickel}
          position={[x, -y, frame.geometry.frontDepth / 2 + 0.2 - sag(x)]}
          rotation={[0, 0, Math.PI / 4]}
        >
          <boxGeometry args={[1.5, 1.5, 0.6]} />
        </mesh>
      ))}
    </group>
  );
}
