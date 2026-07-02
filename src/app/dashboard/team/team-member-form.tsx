"use client";

import { useActionState } from "react";
import type { TeamFormState } from "@/app/actions/team";

export function TeamMemberForm({
  action,
}: {
  action: (
    prevState: TeamFormState,
    formData: FormData
  ) => Promise<TeamFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Nom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Mot de passe *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
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
        {pending ? "Création..." : "Créer le membre"}
      </button>
    </form>
  );
}
