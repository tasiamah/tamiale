import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/**
 * The house wordmark. Set in the interface family at wide tracking so it reads
 * the same on screen as it does engraved into the inner temple.
 */
export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-[0.6875rem]",
    md: "text-[0.8125rem]",
    lg: "text-[1.0625rem]",
  };
  return (
    <span className={cn("wordmark block leading-none", sizes[size], className)}>
      {site.wordmark}
    </span>
  );
}

/**
 * The mark as it appears in the chrome: the wordmark with the city set under
 * it, the lockup the older houses use. The city is doing work that the word
 * alone cannot. A name nobody has heard of has to say where it is from
 * before it can ask several hundred for a frame, and the line under the
 * wordmark is the one place that reads as a seat rather than as a claim.
 *
 * Both lines carry the same tracking, so the shorter one centres under the
 * longer without being nudged, and the `wordmark` indent corrects the
 * trailing space that tracking leaves on each.
 */
export function HouseMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex flex-col items-center", className)}>
      <span className="wordmark block text-[clamp(0.9375rem,2.4vw,1.3125rem)] leading-none">
        {site.wordmark}
      </span>
      <span className="wordmark mt-[0.45em] block text-[0.5rem] leading-none opacity-55">
        {site.foundedIn}
      </span>
    </span>
  );
}

/** The rivet mark, taken from the two rivets set into the Marina's end piece. */
export function Rivet({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className={cn("size-2 fill-current", className)}
    >
      <path d="M6 0 12 6 6 12 0 6Z" />
    </svg>
  );
}
