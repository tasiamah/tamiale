"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Link } from "@/components/i18n/link";
import { useSavedFrames } from "@/components/account/saved-frames-provider";
import { useCart } from "@/components/cart/cart-provider";
import { fill, useDictionary } from "@/components/i18n/dictionary-provider";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { ColorwaySwatches } from "@/components/product/colorway-swatches";
import { Button, ButtonLink } from "@/components/ui/button";
import { findColorway } from "@/lib/catalog/frames";
import type { Frame } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";
import {
  estimateFit,
  recommendLenses,
  STYLING_ORDER,
  describeFit,
  type FitEstimate,
  type StylingPreference,
} from "@/lib/vision/fit";
import { createSmoother, drawOverlay, readPose } from "@/lib/vision/renderer";
import type { FaceReading, Tracker } from "@/lib/vision/tracker";

type CameraState =
  | "idle"
  | "starting"
  | "live"
  | "denied"
  | "unavailable"
  | "failed";

type Mode = "mirror" | "perspective";

export function VisionStudio({
  frame,
  initialColorwayId,
}: {
  frame: Frame;
  initialColorwayId: string;
}) {
  const [colorwayId, setColorwayId] = useState(initialColorwayId);
  const [camera, setCamera] = useState<CameraState>("idle");
  const dict = useDictionary();
  const vs = dict.visionStudio;
  const modes: { id: Mode; label: string }[] = [
    { id: "mirror", label: vs.tabMirror },
    { id: "perspective", label: vs.tabLens },
  ];
  const styling_options = STYLING_ORDER.map((id) => ({
    id,
    label: vs.styles[id],
    note: vs.styles[`${id}Note` as const],
  }));
  const [mode, setMode] = useState<Mode>("mirror");
  const [detected, setDetected] = useState(false);
  const [fit, setFit] = useState<FitEstimate | null>(null);
  const [styling, setStyling] = useState<StylingPreference>("architectural");
  const [failureDetail, setFailureDetail] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackerRef = useRef<Tracker | null>(null);
  const frameRef = useRef<number | null>(null);
  const readingRef = useRef<FaceReading | null>(null);
  const colorwayRef = useRef(initialColorwayId);
  const modeRef = useRef<Mode>("mirror");

  const { add } = useCart();
  const described = fit ? describeFit(fit, frame, vs.fit) : null;
  const { saveFitProfile } = useSavedFrames();
  const colorway = findColorway(frame, colorwayId);

  useEffect(() => {
    colorwayRef.current = colorwayId;
  }, [colorwayId]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    trackerRef.current?.close();
    trackerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    readingRef.current = null;
    setDetected(false);
    setCamera("idle");
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera("unavailable");
      return;
    }

    setCamera("starting");
    setFailureDetail(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
    } catch (error) {
      setCamera(
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "denied"
          : "unavailable",
      );
      return;
    }

    streamRef.current = stream;
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    await video.play().catch(() => undefined);

    try {
      const { createTracker } = await import("@/lib/vision/tracker");
      trackerRef.current = await createTracker();
    } catch (error) {
      console.error("[tamiale] face tracking unavailable:", error);
      setFailureDetail(
        vs.engineDegraded,
      );
      setCamera("failed");
      return;
    }

    setCamera("live");

    const smooth = createSmoother();
    const render = () => {
      frameRef.current = requestAnimationFrame(render);

      const canvas = canvasRef.current;
      const tracker = trackerRef.current;
      if (!canvas || !tracker || video.readyState < 2) return;

      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const context = canvas.getContext("2d");
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);

      const reading = tracker.detect(video, performance.now());
      readingRef.current = reading;
      setDetected((current) => (current === Boolean(reading) ? current : Boolean(reading)));

      if (!reading || modeRef.current !== "mirror") return;

      drawOverlay(
        context,
        frame,
        findColorway(frame, colorwayRef.current),
        smooth(readPose(reading, frame)),
      );
    };
    render();
  }, [frame, vs.engineDegraded]);

  const estimate = useCallback(() => {
    const reading = readingRef.current;
    if (!reading) return;
    setFit(estimateFit(reading));
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    const overlay = canvasRef.current;
    if (!video || !overlay) return;

    const output = document.createElement("canvas");
    output.width = video.videoWidth;
    output.height = video.videoHeight;
    const context = output.getContext("2d");
    if (!context) return;

    // The stage is mirrored for the wearer, so the capture is mirrored too.
    context.translate(output.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0);
    context.drawImage(overlay, 0, 0);

    const link = document.createElement("a");
    link.download = `tamiale-${frame.handle}-${colorway.id}.png`;
    link.href = output.toDataURL("image/png");
    link.click();
  }, [frame.handle, colorway.id]);

  const recommendation = recommendLenses(frame, styling);
  const live = camera === "live" || camera === "failed";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <div>
        <div className="flex flex-wrap gap-1.5 pb-4">
          {modes.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={mode === entry.id}
              onClick={() => setMode(entry.id)}
              className={cn(
                "cursor-pointer border px-3.5 py-2.5 text-[0.625rem] font-medium tracking-[0.16em] uppercase transition-colors duration-300",
                mode === entry.id
                  ? "border-ivory bg-ivory text-obsidian"
                  : "border-ivory/20 text-ivory/60 hover:border-ivory/60 hover:text-ivory",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <div className="relative isolate aspect-3/4 w-full overflow-hidden border border-obsidian-hairline bg-[radial-gradient(ellipse_at_50%_30%,#201e1b,#0d0d0c_72%)] sm:aspect-4/3">
          {/* Video and overlay share one mirrored space, so the canvas can
              work in raw video coordinates. */}
          <div className="absolute inset-0 -scale-x-100">
            <video
              ref={videoRef}
              playsInline
              muted
              className={cn(
                "size-full object-cover transition-opacity duration-1000",
                live ? "opacity-100" : "opacity-0",
              )}
            />
            <canvas
              ref={canvasRef}
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-700",
                mode === "mirror" && detected ? "opacity-100" : "opacity-0",
              )}
            />
          </div>

          {mode === "perspective" && (
            <>
              {!live && <PerspectiveScene />}
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-multiply"
                style={{
                  background: `linear-gradient(170deg, ${colorway.lensHex}, ${colorway.lensHexLower})`,
                  opacity: Math.min(0.92, 1 - colorway.vlt / 130),
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.5))]"
              />
            </>
          )}

          <Brackets />

          {!live && mode === "mirror" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-10 text-center">
              <p className="display-md text-ivory">
                {camera === "starting" ? vs.opening : vs.mirrorClosed}
              </p>
              <p className="max-w-sm text-sm leading-relaxed text-ivory/45">
                {cameraMessage(camera, vs)}
              </p>
              {camera !== "starting" && (
                <Button tone="ivory" variant="outline" onClick={start}>
                  {camera === "idle" ? vs.openCamera : vs.tryAgain}
                </Button>
              )}
            </div>
          )}

          {live && (
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
              <span className="eyebrow text-ivory/50">
                {mode === "mirror"
                  ? detected
                    ? vs.tracking
                    : vs.lookingForFace
                  : fill(vs.transmissionReadout, {
                      name: colorway.name,
                      vlt: colorway.vlt,
                    })}
              </span>
              <div className="flex gap-2">
                {mode === "mirror" && (
                  <GhostButton onClick={capture}>{vs.capture}</GhostButton>
                )}
                <GhostButton onClick={stop}>{vs.closeCamera}</GhostButton>
              </div>
            </div>
          )}

          <div className="absolute inset-x-5 top-5 flex justify-between">
            <span className="eyebrow text-ivory/40">Tamiale / Vision Studio</span>
            <span className="eyebrow text-ivory/40">{frame.name}</span>
          </div>
        </div>

        {failureDetail && (
          <p className="mt-4 border-l border-ivory/30 pl-4 text-sm text-ivory/55">
            {failureDetail}
          </p>
        )}

        <p className="mt-5 text-xs leading-relaxed text-ivory/35">
{vs.privacyNote}{" "}
          <Link
            href="/legal/vision-privacy"
            className="underline underline-offset-4 hover:text-ivory/70"
          >
            {vs.howThisWorks}
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <h2 className="eyebrow text-ivory/45">{vs.lens}</h2>
          <div className="mt-4">
            <ColorwaySwatches
              colorways={frame.colorways}
              selected={colorway.id}
              onSelect={setColorwayId}
              tone="ivory"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ivory/55">
            <span className="text-ivory">{colorway.name}.</span>{" "}
            {colorway.lensDescription}
          </p>
        </section>

        <section id="fit" className="scroll-mt-28 border-t border-obsidian-hairline pt-8">
          <h2 className="eyebrow text-ivory/45">{vs.fitIntelligence}</h2>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {styling_options.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={styling === option.id}
                onClick={() => setStyling(option.id)}
                title={option.note}
                className={cn(
                  "cursor-pointer border px-3 py-2 text-[0.625rem] font-medium tracking-[0.16em] uppercase transition-colors duration-300",
                  styling === option.id
                    ? "border-ivory text-ivory"
                    : "border-ivory/15 text-ivory/50 hover:border-ivory/50 hover:text-ivory",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {fit && described ? (
            <div className="mt-7">
              <p className="eyebrow text-ivory/55">{vs.fitEstimate}</p>
              <p className="display-md mt-3">{described.headline}</p>
              <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-obsidian-hairline py-5">
                <Metric label={vs.faceWidth} value={`${fit.faceWidthMm.toFixed(0)} mm`} />
                <Metric label={vs.bridgeGap} value={`${fit.bridgeGapMm.toFixed(0)} mm`} />
                <Metric
                  label={vs.proportion}
                  value={vs.fit.shapes[fit.faceShape]}
                />
              </dl>
              <ul className="mt-5 flex flex-col gap-3">
                {described.reasoning.map((line: string) => (
                  <li key={line.slice(0, 24)} className="text-sm leading-relaxed text-ivory/55">
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs leading-relaxed text-ivory/35">
                {fill(
                  fit.confidence === "low" ? vs.estimateNoteLow : vs.estimateNote,
                  {
                    confidence:
                      fit.confidence === "low"
                        ? vs.confidenceLow
                        : vs.confidenceFair,
                  },
                )}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  tone="ivory"
                  variant="outline"
                  onClick={() =>
                    saveFitProfile({
                      faceWidthMm: Number(fit.faceWidthMm.toFixed(1)),
                      pupillaryDistanceMm: fit.pupillaryDistanceMm,
                      faceShape: fit.faceShape,
                      styling,
                      capturedAt: new Date().toISOString(),
                    })
                  }
                >
                  {vs.keepProfile}
                </Button>
                <Button tone="ivory" variant="ghost" onClick={() => setFit(null)}>
                  {vs.discard}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-7">
              <p className="text-sm leading-relaxed text-ivory/55">
{vs.fitPrompt}
              </p>
              <Button
                tone="ivory"
                variant="outline"
                className="mt-6"
                disabled={!detected}
                onClick={estimate}
              >
                {detected ? vs.estimateMyFit : vs.openMirrorFirst}
              </Button>
            </div>
          )}
        </section>

        <section className="border-t border-obsidian-hairline pt-8">
          <h2 className="eyebrow text-ivory/45">{vs.stated}</h2>
          <p className="display-md mt-4">
            {frame.name}
            <span className="text-ivory/40"> / {recommendation.primary.name}</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/55">
            {fill(vs.recommendation, {
              style: vs.styles[styling].toLowerCase(),
              primary: recommendation.primary.name,
              vlt: recommendation.primary.vlt,
              alternate: recommendation.alternate.name,
            })}
          </p>
          <div className="mt-7 flex flex-col gap-3">
            <Button
              onClick={() => {
                setColorwayId(recommendation.primary.id);
                add({
                  handle: frame.handle,
                  colorwayId: recommendation.primary.id,
                  title: frame.name,
                  colorwayName: recommendation.primary.name,
                  shipsFrom: frame.shipsFrom,
                  priceBook: frame.priceBook,
                  image: recommendation.primary.image,
                });
              }}
              tone="ivory"
            >
              {fill(vs.reserveLens, { name: recommendation.primary.name })}
            </Button>
            <ButtonLink
              href={`/collection/${frame.handle}?lens=${colorway.id}`}
              tone="ivory"
              variant="outline"
            >
              {vs.openFullFrame}
            </ButtonLink>
          </div>
        </section>
      </div>
    </div>
  );
}

function cameraMessage(
  state: CameraState,
  vs: Dictionary["visionStudio"],
): string {
  switch (state) {
    case "denied":
      return vs.cameraDenied;
    case "unavailable":
      return vs.noCamera;
    case "failed":
      return vs.engineFailed;
    default:
      return vs.mirrorClosedBody;
  }
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-ivory/35">{label}</dt>
      <dd className="mt-2 font-display text-xl text-ivory capitalize">{value}</dd>
    </div>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer border border-ivory/25 bg-obsidian/40 px-3 py-2 text-[0.625rem] font-medium tracking-[0.16em] text-ivory/80 uppercase backdrop-blur transition-colors hover:border-ivory hover:text-ivory"
    >
      {children}
    </button>
  );
}

/** A plain architectural field to tint when no camera is open. */
function PerspectiveScene() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#bfd0dd_0%,#e6dfd2_52%,#cdbda6_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(to_bottom,#9a8e7c,#6d6557)]" />
      <div className="absolute bottom-[38%] left-[6%] h-[46%] w-[22%] bg-[linear-gradient(105deg,#f0e9dc,#c3b7a4)]" />
      <div className="absolute bottom-[38%] left-[34%] h-[62%] w-[18%] bg-[linear-gradient(105deg,#e4dccd,#ab9f8c)]" />
      <div className="absolute bottom-[38%] left-[58%] h-[38%] w-[26%] bg-[linear-gradient(105deg,#f4efe4,#bcb09c)]" />
      <div className="absolute top-[8%] right-[12%] size-24 rounded-full bg-[radial-gradient(circle,#fff8e6,transparent_68%)]" />
    </div>
  );
}

function Brackets() {
  return (
    <>
      {["top-4 left-4", "top-4 right-4 rotate-90", "right-4 bottom-4 rotate-180", "bottom-4 left-4 -rotate-90"].map(
        (position) => (
          <span
            key={position}
            aria-hidden
            className={`pointer-events-none absolute size-5 border-t border-l border-ivory/25 ${position}`}
          />
        ),
      )}
    </>
  );
}
