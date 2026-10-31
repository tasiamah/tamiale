"use client";

import { useActionState, useId } from "react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { IDLE, requestPrivateAccess } from "@/lib/actions";
import { cn } from "@/lib/cn";

export function PrivateAccess({
  heading = "Private access.",
  lede = "Editions are small and are offered to the house register before they are announced. No campaigns and no discounts. Just a note when something is ready, and the first opportunity to take it.",
}: {
  heading?: string;
  lede?: string;
}) {
  const [state, action, pending] = useActionState(requestPrivateAccess, IDLE);
  const emailId = useId();

  return (
    <section
      id="private-access"
      className="grain border-t border-ivory-hairline bg-ivory text-obsidian"
    >
      <div className="gutter grid gap-14 py-24 md:py-32 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <p className="eyebrow text-stone">06 · The Register</p>
          <h2 className="display-xl mt-6 text-balance">{heading}</h2>
        </Reveal>

        <Reveal delay={120} className="flex flex-col justify-end">
          <p className="body-lg max-w-lg text-pretty text-stone">{lede}</p>

          <form action={action} className="mt-10 max-w-lg">
            <label htmlFor={emailId} className="eyebrow text-stone">
              Email address
            </label>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <input
                id={emailId}
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="flex-1 border-b border-ivory-hairline bg-transparent py-3 text-base text-obsidian transition-colors placeholder:text-stone focus:border-obsidian focus:outline-none"
              />
              <Button
                type="submit"
                tone="obsidian"
                variant="outline"
                disabled={pending}
                className="shrink-0"
              >
                {pending ? "Submitting…" : "Request access"}
              </Button>
            </div>

            {state.status !== "idle" && (
              <p
                role="status"
                className={cn(
                  "mt-5 border-l-2 py-1 pl-4 text-sm leading-relaxed",
                  state.status === "ok"
                    ? "border-obsidian text-stone"
                    : "border-stone text-stone",
                )}
              >
                {state.message}
              </p>
            )}

            <p className="mt-6 text-xs leading-relaxed text-stone">
              One or two letters a season. Unsubscribe in a single click. We do
              not share the register with anyone.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
