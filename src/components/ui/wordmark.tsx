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
