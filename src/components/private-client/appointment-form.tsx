"use client";

import { useActionState, useId } from "react";

import { useRegion } from "@/components/chrome/region-provider";
import { Button } from "@/components/ui/button";
import { IDLE, requestAppointment } from "@/lib/actions";
import { REGIONS } from "@/lib/region";
import { cn } from "@/lib/cn";

export function AppointmentForm() {
  const [state, action, pending] = useActionState(requestAppointment, IDLE);
  const { region } = useRegion();
  const ids = {
    name: useId(),
    email: useId(),
    region: useId(),
    note: useId(),
  };

  return (
    <form action={action} className="flex flex-col gap-7">
      <Field id={ids.name} label="Name">
        <input
          id={ids.name}
          name="name"
          required
          autoComplete="name"
          className={inputClass}
        />
      </Field>

      <Field id={ids.email} label="Email">
        <input
          id={ids.email}
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </Field>

      <Field id={ids.region} label="Where you are">
        <select
          id={ids.region}
          name="region"
          defaultValue={region.label}
          className={cn(inputClass, "cursor-pointer appearance-none")}
        >
          {REGIONS.map((option) => (
            <option key={option.id} value={option.label} className="text-obsidian">
              {option.label}
            </option>
          ))}
          <option value="Elsewhere" className="text-obsidian">
            Elsewhere
          </option>
        </select>
      </Field>

      <Field
        id={ids.note}
        label="What you would like to discuss"
        hint="Optional. Measurements from a pair you already own are the single most useful thing you can bring."
      >
        <textarea
          id={ids.note}
          name="note"
          rows={4}
          maxLength={1000}
          className={cn(inputClass, "resize-none")}
        />
      </Field>

      <div>
        <Button type="submit" tone="ivory" variant="outline" disabled={pending}>
          {pending ? "Sending…" : "Request an appointment"}
        </Button>
      </div>

      {state.status !== "idle" && (
        <p
          role="status"
          className={cn(
            "border-l-2 py-1 pl-4 text-sm leading-relaxed",
            state.status === "ok"
              ? "border-champagne text-ivory/75"
              : "border-stone text-ivory/55",
          )}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

const inputClass =
  "w-full border-b border-ivory/20 bg-transparent py-3 text-base text-ivory transition-colors placeholder:text-ivory/25 focus:border-champagne focus:outline-none";

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow text-ivory/45">
        {label}
      </label>
      <div className="mt-3">{children}</div>
      {hint && <p className="mt-3 text-xs leading-relaxed text-ivory/30">{hint}</p>}
    </div>
  );
}
