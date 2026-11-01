import { buildOutline, type Point } from "@/lib/frame-geometry";
import type { Colorway, Frame } from "@/lib/catalog/types";

import { pixelsPerMillimetre } from "./fit";
import type { FaceReading } from "./tracker";

/**
 * Draws the frame onto a transparent canvas stacked over the video. The
 * geometry is held in millimetres throughout and converted to pixels only in
 * the final transform, so what the wearer sees is the published frame at the
 * scale their own face implies, not an image resized until it looks right.
 */

export type Pose = {
  x: number;
  y: number;
  /** Pixels per millimetre. */
  scale: number;
  roll: number;
  yaw: number;
};

/** Exponential smoothing: low enough to settle, high enough to keep up. */
const RESPONSIVENESS = 0.4;

export function createSmoother() {
  let state: Pose | null = null;
  return (next: Pose): Pose => {
    if (!state) {
      state = next;
      return state;
    }
    const k = RESPONSIVENESS;
    state = {
      x: state.x + (next.x - state.x) * k,
      y: state.y + (next.y - state.y) * k,
      scale: state.scale + (next.scale - state.scale) * k,
      roll: state.roll + (next.roll - state.roll) * k,
      yaw: state.yaw + (next.yaw - state.yaw) * k,
    };
    return state;
  };
}

export function readPose(reading: FaceReading, frame: Frame): Pose {
  const scale = pixelsPerMillimetre(reading);
  const centre = {
    x: (reading.irisRight.x + reading.irisLeft.x) / 2,
    y: (reading.irisRight.y + reading.irisLeft.y) / 2,
  };
  /**
   * Where the pupil sits inside the lens. Worn frames put the eye a little
   * above the centre of the aperture: higher than this and the rim covers the
   * brow, lower and it cuts across the cheek. Measured down from the lens top
   * as a fraction of its height.
   */
  const PUPIL_HEIGHT = 0.44;
  const drop = (0.5 - PUPIL_HEIGHT) * frame.geometry.lensHeight * scale;
  return {
    x: centre.x - Math.sin(reading.roll) * drop,
    y: centre.y + Math.cos(reading.roll) * drop,
    scale,
    roll: reading.roll,
    yaw: reading.yaw,
  };
}

function trace(context: CanvasRenderingContext2D, points: Point[]) {
  points.forEach(([x, y], index) => {
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.closePath();
}

function applyPose(
  context: CanvasRenderingContext2D,
  frame: Frame,
  pose: Pose,
) {
  context.translate(pose.x, pose.y);
  context.rotate(pose.roll);
  context.scale(pose.scale, pose.scale);
  // A turned head foreshortens the front.
  context.scale(Math.max(0.3, Math.cos(pose.yaw)), 1);
  context.translate(0, -frame.geometry.lensHeight / 2);
}

export function drawOverlay(
  context: CanvasRenderingContext2D,
  frame: Frame,
  colorway: Colorway,
  pose: Pose,
) {
  const outline = buildOutline(frame.geometry);
  const rings = outline.rims.map((rim, index) => ({
    rim,
    aperture: outline.apertures[index],
  }));

  context.save();
  applyPose(context, frame, pose);
  context.lineJoin = "round";

  // 1. Contact shadow on the face.
  context.save();
  context.globalAlpha = 0.26;
  context.filter = "blur(2px)";
  context.fillStyle = "#000000";
  context.translate(0, 1.8);
  context.beginPath();
  for (const { rim } of rings) trace(context, rim);
  trace(context, outline.bridge);
  context.fill();
  context.restore();

  /*
   * 2. The temple that the turn of the head reveals, behind the front.
   *
   * Two fifths of a 145mm temple is 58mm of acetate laid flat across the
   * cheek, tapering to a point: at any real angle the arm had left the
   * face and become a wing. What a camera actually sees of a temple is the
   * near end of it before the head takes the rest, so it is short, and it
   * keeps most of its depth over that length because a temple does.
   */
  const reveal = Math.min(1, Math.abs(Math.sin(pose.yaw)) * 2.8);
  if (reveal > 0.03) {
    const [hx, hy] = outline.hingePoints[pose.yaw > 0 ? 1 : 0];
    const direction = Math.sign(hx) || 1;
    const length = frame.geometry.templeLength * reveal * 0.18;
    context.save();
    context.fillStyle = colorway.frameHex;
    context.beginPath();
    context.moveTo(hx, hy - 3.8);
    context.lineTo(hx + direction * length, hy - 2.6 + length * 0.1);
    context.lineTo(hx + direction * length, hy + 2.2 + length * 0.1);
    context.lineTo(hx, hy + 3.8);
    context.closePath();
    context.fill();
    context.restore();
  }

  // 3. The glass.
  for (const { aperture } of rings) {
    const ys = aperture.map(([, y]) => y);
    const top = Math.min(...ys);
    const bottom = Math.max(...ys);
    const gradient = context.createLinearGradient(0, top, 0, bottom);
    gradient.addColorStop(0, colorway.lensHex);
    gradient.addColorStop(1, colorway.lensHexLower);

    context.save();
    // Denser glass transmits less, so it hides more of the eye behind it.
    context.globalAlpha = Math.min(0.9, 1 - colorway.vlt / 150);
    context.fillStyle = gradient;
    context.beginPath();
    trace(context, aperture);
    context.fill();

    // One specular streak across the upper third.
    const xs = aperture.map(([x]) => x);
    const left = Math.min(...xs);
    const span = Math.max(...xs) - left;
    context.globalAlpha = 0.14;
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.moveTo(left + span * 0.08, top + 2);
    context.lineTo(left + span * 0.8, top + 1.5);
    context.lineTo(left + span * 0.6, top + 9);
    context.lineTo(left + span * 0.02, top + 10);
    context.closePath();
    context.fill();
    context.restore();
  }

  // 4. The acetate front, cut as a ring so the glass shows through.
  context.fillStyle = colorway.frameHex;
  context.beginPath();
  for (const { rim, aperture } of rings) {
    trace(context, rim);
    trace(context, aperture);
  }
  context.fill("evenodd");

  context.beginPath();
  trace(context, outline.bridge);
  context.fill();

  // 5. The brow highlight and the two rivets.
  context.save();
  context.globalAlpha = 0.24;
  context.strokeStyle = "#ffffff";
  context.lineWidth = 0.8;
  for (const { rim } of rings) {
    context.beginPath();
    context.moveTo(rim[0][0], rim[0][1]);
    context.lineTo(rim[1][0], rim[1][1]);
    context.lineTo(rim[2][0], rim[2][1]);
    context.stroke();
  }
  context.globalAlpha = 0.8;
  context.fillStyle = "#cfcabd";
  context.beginPath();
  for (const [x, y] of outline.rivets) {
    context.moveTo(x, y - 1.1);
    context.lineTo(x + 1.1, y);
    context.lineTo(x, y + 1.1);
    context.lineTo(x - 1.1, y);
    context.closePath();
  }
  context.fill();
  context.restore();

  context.restore();
}
