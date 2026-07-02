"use client";

import { useActionState } from "react";
import type { ClientFormState } from "@/app/actions/clients";

type ClientFormValues = {
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  siret: string | null;
  notes: string | null;
};

const emptyValues: ClientFormValues = {
  name: "",
  company: null,
  email: null,
  phone: null,
  address: null,
  postalCode: null,
  city: null,
  siret: null,
  notes: null,
};

export function ClientForm({
  action,
  defaultValues = emptyValues,
  submitLabel,
}: {
  action: (
    prevState: ClientFormState,
    formData: FormData
  ) => Promise<ClientFormState>;
  defaultValues?: ClientFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full max-w-lg">
      <Field
        id="name"
        label="Nom *"
        defaultValue={defaultValues.name}
        required
      />
      <Field
        id="company"
        label="Entreprise"
        defaultValue={defaultValues.company}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        defaultValue={defaultValues.email}
      />
      <Field id="phone" label="Téléphone" defaultValue={defaultValues.phone} />
      <Field
        id="address"
        label="Adresse"
        defaultValue={defaultValues.address}
      />
      <div className="flex gap-4">
        <Field
          id="postalCode"
          label="Code postal"
          defaultValue={defaultValues.postalCode}
        />
        <Field id="city" label="Ville" defaultValue={defaultValues.city} />
      </div>
      <Field id="siret" label="SIRET" defaultValue={defaultValues.siret} />

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaultValues.notes ?? ""}
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

function Field({
  id,
  label,
  defaultValue,
  type = "text",
  required = false,
}: {
  id: string;
  label: string;
  defaultValue: string | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
      />
    </div>
  );
}
