"use client";

import Link from "next/link";

import { Wordmark } from "@/components/ui/wordmark";
import { cn } from "@/lib/cn";
import { navigation, navigationSummaries, site } from "@/lib/site";

import { RegionSelector } from "./region-selector";
import { useOverlay } from "./use-overlay";

export function MenuOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useOverlay(open, onClose);

  return (
    <div
      id="house-menu"
      ref={panelRef}
      role="dialog"
      aria-modal={open}
      aria-label="Site menu"
      inert={!open}
      className={cn(
        "grain fixed inset-0 z-90 flex flex-col bg-obsidian text-ivory transition-opacity duration-700 ease-tamiale",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="gutter flex h-(--header-height) shrink-0 items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="eyebrow cursor-pointer transition-opacity duration-300 hover:opacity-60"
        >
          Close
        </button>
        <Wordmark size="md" />
        <span aria-hidden className="eyebrow invisible">
          Close
        </span>
      </div>

      <nav
        aria-label="House"
        className="gutter flex-1 overflow-y-auto pb-16"
        style={{ scrollbarWidth: "thin" }}
      >
        <ul className="mx-auto max-w-5xl">
          {navigation.map((item, index) => (
            <li key={item.href} className="border-t border-obsidian-hairline">
              <Link
                href={item.href}
                onClick={onClose}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-6 md:grid-cols-[auto_1fr_auto] md:gap-x-10 md:py-7"
                style={{
                  transitionDelay: open ? `${120 + index * 55}ms` : "0ms",
                }}
              >
                <span className="eyebrow text-ivory/40 figure-num">
                  {item.index}
                </span>
                <span className="display-lg text-ivory transition-[opacity,transform] duration-700 ease-tamiale group-hover:translate-x-2 group-hover:opacity-70">
                  {item.label}
                </span>
                <span className="col-start-2 mt-2 text-sm text-ivory/45 md:col-start-3 md:mt-0 md:max-w-56 md:text-right">
                  {navigationSummaries[item.href]}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-16 grid max-w-5xl gap-10 border-t border-obsidian-hairline pt-10 md:grid-cols-3">
          <RegionSelector tone="ivory" />
          <div className="flex flex-col gap-2">
            <p className="eyebrow text-ivory/50">Private client</p>
            <a
              href={`mailto:${site.email}`}
              className="text-sm text-ivory/80 transition-colors hover:text-ivory"
            >
              {site.email}
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <p className="eyebrow text-ivory/50">Follow</p>
            <a
              href={site.instagram}
              rel="noreferrer noopener"
              target="_blank"
              className="text-sm text-ivory/80 transition-colors hover:text-ivory"
            >
              Instagram
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
