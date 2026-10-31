"use client";

import { useEffect, useId, useRef, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { useDictionary, useLocale } from "@/components/i18n/dictionary-provider";
import { Link } from "@/components/i18n/link";
import { useOverlay } from "@/components/chrome/use-overlay";
import { Rivet } from "@/components/ui/wordmark";
import { cn } from "@/lib/cn";
import { type ConciergeAction } from "@/lib/concierge/knowledge";

type Turn = {
  id: number;
  role: "visitor" | "advisor";
  text: string;
  actions?: ConciergeAction[];
};

export function Concierge() {
  const dict = useDictionary();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([
    { id: 0, role: "advisor", text: dict.concierge.greeting },
  ]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const panelRef = useOverlay(open, () => setOpen(false));
  const { count, isOpen: bagOpen } = useCart();
  const bagBarShown = count > 0 && !bagOpen;
  const logRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const openers = [
    dict.concierge.suggestions.tailoring,
    dict.concierge.suggestions.widerFace,
    dict.concierge.suggestions.shipping,
    dict.concierge.suggestions.material,
  ];

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns, pending]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || pending) return;

    setDraft("");
    setPending(true);
    setTurns((current) => [
      ...current,
      { id: Date.now(), role: "visitor", text: trimmed },
    ]);

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, locale }),
      });
      const data = (await response.json()) as {
        answer?: string;
        actions?: ConciergeAction[];
      };
      setTurns((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "advisor",
          text:
            data.answer ??
            dict.concierge.interrupted,
          actions: data.actions,
        },
      ]);
    } catch {
      setTurns((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "advisor",
          text:
            "I have lost the connection. Please write to info@tamiale.com and an advisor will reply within one working day.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className={cn(
          "fixed right-5 bottom-5 z-70 hidden cursor-pointer items-center gap-2.5 border border-obsidian/15 bg-ivory/90 py-3 pr-5 pl-4 eyebrow text-obsidian shadow-[0_1px_40px_-12px_rgba(17,17,16,0.3)] backdrop-blur-xl transition-[opacity,bottom,transform] duration-500 ease-tamiale hover:-translate-y-0.5 sm:flex",
          // The bag bar takes the foot of the screen once there is something
          // in it, so the pill steps up out of its way.
          bagBarShown && "bottom-24",
          open && "pointer-events-none opacity-0",
        )}
      >
        {dict.concierge.open}
      </button>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        aria-label={dict.concierge.title}
        inert={!open}
        className={cn(
          "fixed right-0 bottom-0 z-95 flex h-[min(40rem,92dvh)] w-full flex-col border-l border-ivory-hairline bg-ivory text-obsidian transition-[opacity,transform] duration-600 ease-tamiale sm:right-5 sm:bottom-5 sm:w-[25rem] sm:border",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ivory-hairline px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Rivet className="text-stone" aria-hidden />
            <h2 className="eyebrow">{dict.concierge.title}</h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="eyebrow cursor-pointer text-stone transition-colors hover:text-obsidian"
          >
            {dict.concierge.close}
          </button>
        </div>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          className="flex-1 space-y-5 overflow-y-auto px-5 py-6"
        >
          {turns.map((turn) => (
            <div key={turn.id}>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  turn.role === "visitor"
                    ? "ml-auto max-w-[85%] bg-obsidian px-4 py-3 text-ivory"
                    : "text-stone",
                )}
              >
                {turn.text}
              </p>
              {turn.actions && turn.actions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {turn.actions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onClick={() => setOpen(false)}
                      className="border border-ivory-hairline px-3 py-2 text-xs text-stone transition-colors hover:border-obsidian hover:text-obsidian"
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {pending && (
            <p className="eyebrow text-stone">{dict.concierge.thinking}</p>
          )}

          {turns.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {openers.map((opener) => (
                <button
                  key={opener}
                  type="button"
                  onClick={() => ask(opener)}
                  className="cursor-pointer border border-ivory-hairline px-3 py-2 text-left text-xs text-stone transition-colors hover:border-ivory-hairline hover:text-obsidian"
                >
                  {opener}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void ask(draft);
          }}
          className="flex shrink-0 items-center gap-3 border-t border-ivory-hairline px-5 py-4"
        >
          <label htmlFor={inputId} className="sr-only">
            {dict.concierge.title}
          </label>
          <input
            id={inputId}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={dict.concierge.placeholder}
            autoComplete="off"
            className="flex-1 bg-transparent py-1 text-sm text-obsidian placeholder:text-stone focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending || draft.trim().length === 0}
            className="eyebrow cursor-pointer text-obsidian transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-25"
          >
            {dict.concierge.send}
          </button>
        </form>
      </div>
    </>
  );
}
