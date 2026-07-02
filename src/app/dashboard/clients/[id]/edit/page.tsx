import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateClient } from "@/app/actions/clients";
import { ClientForm } from "../../client-form";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });

  if (!client) {
    notFound();
  }

  const updateClientWithId = updateClient.bind(null, id);

  return (
    <div className="flex flex-1 flex-col gap-6 bg-zinc-50 px-6 py-16 dark:bg-black sm:px-16">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Modifier {client.name}
      </h1>
      <ClientForm
        action={updateClientWithId}
        defaultValues={client}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
