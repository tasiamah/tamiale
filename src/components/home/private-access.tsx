"use client";

import { useActionState, useId } from "react";

import { useDictionary } from "@/components/i18n/dictionary-provider";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { IDLE, requestPrivateAccess } from "@/lib/actions";
import { cn } from "@/lib/cn";

export function PrivateAccess({
  heading,
  lede,
  /*
   * The register appears on three pages and is the last section of each,
   * so the number is a property of where it is standing rather than of
   * what it is. Only the homepage has had to say otherwise so far.
   */
  index = "06",
}: {
  heading?: string;
  lede?: string;
  index?: string;
}) {
  const dict = useDictionary();
  const [state, action, pending] = useActionState(requestPrivateAccess, IDLE);
  const emailId = useId();
  const title = heading ?? dict.home.registerTitle;
  const body = lede ?? dict.home.registerLede;

  return (
    <section
      id="private-access"
      className="grain border-t border-ivory-hairline bg-ivory text-obsidian"
    >
      <div className="gutter grid gap-14 section-y lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <p className="eyebrow text-stone">
            {index} · {dict.home.registerEyebrow}
          </p>
          <h2 className="display-xl mt-6 text-balance">{title}</h2>
        </Reveal>

        <Reveal delay={120} className="flex flex-col justify-end">
          <p className="body-lg max-w-lg text-pretty text-stone">{body}</p>

          <form action={action} className="mt-10 max-w-lg">
            <label htmlFor={emailId} className="eyebrow text-stone">
              {dict.privateClient.form.email}
            </label>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <input
                id={emailId}
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={dict.home.registerPlaceholder}
                className="flex-1 border-b border-ivory-hairline bg-transparent py-3 text-base text-obsidian transition-colors placeholder:text-stone focus:border-obsidian focus:outline-none"
              />
              <Button
                type="submit"
                tone="obsidian"
                variant="outline"
                disabled={pending}
                className="shrink-0"
              >
                {pending ? dict.privateClient.form.sending : dict.home.registerCta}
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
{dict.home.registerNote}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
