"use client";

import { useActionState, useId } from "react";

import { useRegion } from "@/components/chrome/region-provider";
import { useDictionary } from "@/components/i18n/dictionary-provider";
import { Button } from "@/components/ui/button";
import { IDLE, requestAppointment } from "@/lib/actions";
import { REGIONS } from "@/lib/region";
import { cn } from "@/lib/cn";

export function AppointmentForm() {
  const dict = useDictionary();
  const [state, action, pending] = useActionState(requestAppointment, IDLE);
  const { label } = useRegion();
  const ids = {
    name: useId(),
    email: useId(),
    region: useId(),
    note: useId(),
  };

  return (
    <form action={action} className="flex flex-col gap-7">
      <Field id={ids.name} label={dict.privateClient.form.name}>
        <input
          id={ids.name}
          name="name"
          required
          autoComplete="name"
          className={inputClass}
        />
      </Field>

      <Field id={ids.email} label={dict.privateClient.form.email}>
        <input
          id={ids.email}
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </Field>

      <Field id={ids.region} label={dict.privateClient.form.region}>
        <select
          id={ids.region}
          name="region"
          defaultValue={label}
          className={cn(inputClass, "cursor-pointer appearance-none")}
        >
          {REGIONS.map((option) => (
            <option key={option.id} value={option.id} className="text-obsidian">
              {dict.region[option.id]}
            </option>
          ))}
          <option value="Elsewhere" className="text-obsidian">
            {dict.privateClient.form.elsewhere}
          </option>
        </select>
      </Field>

      <Field
        id={ids.note}
        label={dict.privateClient.form.interest}
        hint={dict.privateClient.form.measurements}
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
        <Button type="submit" tone="obsidian" variant="outline" disabled={pending}>
          {pending ? dict.privateClient.form.sending : dict.privateClient.form.submit}
        </Button>
      </div>

      {state.status !== "idle" && (
        <p
          role="status"
          className={cn(
            "border-l-2 py-1 pl-4 text-sm leading-relaxed",
            state.status === "ok"
              ? "border-obsidian text-stone"
              : "border-stone text-stone",
          )}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

const inputClass =
  "w-full border-b border-ivory-hairline bg-transparent py-3 text-base text-obsidian transition-colors placeholder:text-stone focus:border-obsidian focus:outline-none";

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
      <label htmlFor={id} className="eyebrow text-stone">
        {label}
      </label>
      <div className="mt-3">{children}</div>
      {hint && <p className="mt-3 text-xs leading-relaxed text-stone">{hint}</p>}
    </div>
  );
}
