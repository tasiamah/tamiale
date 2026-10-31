/**
 * Face tracking for Vision Studio.
 *
 * The WebAssembly runtime and the landmark model are served from this origin
 * (`/vision/*`), so a try-on session makes no third-party request and no frame
 * of video leaves the device.
 */
import type { FaceLandmarker } from "@mediapipe/tasks-vision";

export type Vec2 = { x: number; y: number };

export type FaceReading = {
  /** Iris centres, in video pixels. */
  irisRight: Vec2;
  irisLeft: Vec2;
  /** Inner eye corners, used for the bridge estimate. */
  innerRight: Vec2;
  innerLeft: Vec2;
  /** Face contour at ear height, used for the width estimate. */
  cheekRight: Vec2;
  cheekLeft: Vec2;
  jawRight: Vec2;
  jawLeft: Vec2;
  forehead: Vec2;
  chin: Vec2;
  noseBridge: Vec2;
  /** Radians. Roll is read from the eye line, yaw and pitch from head pose. */
  roll: number;
  yaw: number;
  pitch: number;
};

/** MediaPipe Face Landmarker indices, 478-point mesh with iris refinement. */
const POINT = {
  irisRight: 468,
  irisLeft: 473,
  innerRight: 133,
  innerLeft: 362,
  cheekRight: 234,
  cheekLeft: 454,
  jawRight: 172,
  jawLeft: 397,
  forehead: 10,
  chin: 152,
  noseBridge: 168,
} as const;

export type Tracker = {
  detect: (video: HTMLVideoElement, timestamp: number) => FaceReading | null;
  close: () => void;
};

export async function createTracker(): Promise<Tracker> {
  const { FaceLandmarker: Landmarker, FilesetResolver } = await import(
    "@mediapipe/tasks-vision"
  );

  const fileset = await FilesetResolver.forVisionTasks("/vision/wasm");
  const landmarker: FaceLandmarker = await Landmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: "/vision/models/face_landmarker.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numFaces: 1,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: true,
  });

  return {
    detect(video, timestamp) {
      const result = landmarker.detectForVideo(video, timestamp);
      const mesh = result.faceLandmarks?.[0];
      if (!mesh || mesh.length < 478) return null;

      const width = video.videoWidth;
      const height = video.videoHeight;
      const at = (index: number): Vec2 => ({
        x: mesh[index].x * width,
        y: mesh[index].y * height,
      });

      const irisRight = at(POINT.irisRight);
      const irisLeft = at(POINT.irisLeft);

      // Roll comes from the eye line: in image space it is the most stable
      // signal there is, and it is the rotation the overlay most depends on.
      const roll = Math.atan2(
        irisLeft.y - irisRight.y,
        irisLeft.x - irisRight.x,
      );

      let yaw = 0;
      let pitch = 0;
      const matrix = result.facialTransformationMatrixes?.[0]?.data;
      if (matrix && matrix.length === 16) {
        // Column-major: m[column * 4 + row].
        const r02 = matrix[8];
        const r12 = matrix[9];
        const r22 = matrix[10];
        yaw = Math.atan2(r02, r22);
        pitch = Math.atan2(-r12, Math.hypot(r02, r22));
      }

      return {
        irisRight,
        irisLeft,
        innerRight: at(POINT.innerRight),
        innerLeft: at(POINT.innerLeft),
        cheekRight: at(POINT.cheekRight),
        cheekLeft: at(POINT.cheekLeft),
        jawRight: at(POINT.jawRight),
        jawLeft: at(POINT.jawLeft),
        forehead: at(POINT.forehead),
        chin: at(POINT.chin),
        noseBridge: at(POINT.noseBridge),
        roll,
        yaw,
        pitch,
      };
    },
    close() {
      landmarker.close();
    },
  };
}

export function distance(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
