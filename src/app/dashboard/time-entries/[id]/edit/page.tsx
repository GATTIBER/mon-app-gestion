import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateTimeEntry } from "@/app/actions/time-entries";
import { TimeEntryForm } from "../../time-entry-form";

export default async function EditTimeEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const [entry, clients] = await Promise.all([
    prisma.timeEntry.findUnique({ where: { id } }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!entry) {
    notFound();
  }
  if (session.user.role !== "ADMIN" && entry.userId !== session.user.id) {
    notFound();
  }

  const updateTimeEntryWithId = updateTimeEntry.bind(null, id);

  return (
    <div className="flex flex-1 flex-col gap-6 bg-zinc-50 px-6 py-16 dark:bg-black sm:px-16">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Modifier le temps
      </h1>
      <TimeEntryForm
        clients={clients}
        action={updateTimeEntryWithId}
        defaultValues={{
          clientId: entry.clientId,
          date: entry.date.toISOString().slice(0, 10),
          hours: String(entry.hours),
          description: entry.description ?? "",
        }}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
