import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTimeEntry, deleteTimeEntry } from "@/app/actions/time-entries";
import { TimeEntryForm } from "./time-entry-form";

export default async function TimeEntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { clientId } = await searchParams;

  const [entries, clients] = await Promise.all([
    prisma.timeEntry.findMany({
      where: clientId ? { clientId } : undefined,
      include: { client: true, user: true },
      orderBy: { date: "desc" },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const activeClient = clientId
    ? clients.find((c) => c.id === clientId)
    : undefined;

  return (
    <div className="flex flex-1 flex-col gap-10 bg-zinc-50 px-6 py-16 dark:bg-black sm:px-16">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Temps {activeClient ? `— ${activeClient.name}` : ""}
          </h1>
          {activeClient && (
            <Link
              href="/dashboard/time-entries"
              className="text-sm font-medium underline-offset-2 hover:underline"
            >
              Voir tous les clients
            </Link>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            Aucun temps saisi pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-black/[.08] dark:border-white/[.145]">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/[.03] dark:bg-white/[.06]">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Membre</th>
                  <th className="px-4 py-3 font-medium">Heures</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-t border-black/[.08] dark:border-white/[.145]"
                  >
                    <td className="px-4 py-3">
                      {entry.date.toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">{entry.client.name}</td>
                    <td className="px-4 py-3">
                      {entry.user.name ?? entry.user.email}
                    </td>
                    <td className="px-4 py-3">{entry.hours}</td>
                    <td className="px-4 py-3">{entry.description ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-4">
                        <Link
                          href={`/dashboard/time-entries/${entry.id}/edit`}
                          className="text-sm font-medium underline-offset-2 hover:underline"
                        >
                          Modifier
                        </Link>
                        <form action={deleteTimeEntry}>
                          <input type="hidden" name="id" value={entry.id} />
                          <button
                            type="submit"
                            className="text-sm font-medium text-red-600 underline-offset-2 hover:underline dark:text-red-400"
                          >
                            Supprimer
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-black/[.08] dark:border-white/[.145] font-medium">
                  <td className="px-4 py-3" colSpan={3}>
                    Total
                  </td>
                  <td className="px-4 py-3">{totalHours}</td>
                  <td className="px-4 py-3" colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
          Saisir un temps
        </h2>
        <TimeEntryForm
          clients={clients}
          action={createTimeEntry}
          defaultValues={clientId ? { clientId } : undefined}
        />
      </div>

      <Link
        href="/dashboard"
        className="text-sm font-medium underline-offset-2 hover:underline"
      >
        ← Retour au tableau de bord
      </Link>
    </div>
  );
}
