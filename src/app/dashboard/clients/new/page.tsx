import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createClient } from "@/app/actions/clients";
import { ClientForm } from "../client-form";

export default async function NewClientPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-zinc-50 px-6 py-16 dark:bg-black sm:px-16">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Nouveau client
      </h1>
      <ClientForm action={createClient} submitLabel="Créer le client" />
    </div>
  );
}
