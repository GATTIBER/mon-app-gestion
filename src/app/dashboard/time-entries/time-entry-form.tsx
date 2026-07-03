"use client";

import { useActionState } from "react";
import type { TimeEntryFormState } from "@/app/actions/time-entries";

type Client = { id: string; name: string };

type TimeEntryFormValues = {
  clientId: string;
  date: string;
  hours: string;
  description: string;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function TimeEntryForm({
  clients,
  action,
  defaultValues,
  submitLabel = "Ajouter le temps",
}: {
  clients: Client[];
  action: (
    prevState: TimeEntryFormState,
    formData: FormData
  ) => Promise<TimeEntryFormState>;
  defaultValues?: Partial<TimeEntryFormValues>;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  if (clients.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        Ajoute d&apos;abord un client avant de pouvoir saisir des temps.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="clientId" className="text-sm font-medium">
          Client *
        </label>
        <select
          id="clientId"
          name="clientId"
          required
          defaultValue={defaultValues?.clientId ?? ""}
          className="rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        >
          <option value="" disabled>
            Sélectionner un client
          </option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="date" className="text-sm font-medium">
          Date *
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={defaultValues?.date ?? today()}
          className="rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="hours" className="text-sm font-medium">
          Heures *
        </label>
        <input
          id="hours"
          name="hours"
          type="number"
          step="0.25"
          min="0.25"
          required
          defaultValue={defaultValues?.hours}
          className="rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          className="rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {pending ? "Enregistrement..." : submitLabel}
      </button>
    </form>
  );
}
