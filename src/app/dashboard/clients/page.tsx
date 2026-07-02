import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteClient } from "@/app/actions/clients";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const clients = await prisma.client.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query } },
            { company: { contains: query } },
            { email: { contains: query } },
            { phone: { contains: query } },
            { city: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-1 flex-col gap-6 bg-zinc-50 px-6 py-16 dark:bg-black sm:px-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Clients
        </h1>
        <Link
          href="/dashboard/clients/new"
          className="flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Ajouter un client
        </Link>
      </div>

      <form method="GET" className="flex max-w-sm gap-2">
        <input
          type="search"
          name="q"
          placeholder="Rechercher un client..."
          defaultValue={query}
          className="w-full rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:focus:border-white/40"
        />
        <button
          type="submit"
          className="flex h-10 shrink-0 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Rechercher
        </button>
        {query && (
          <Link
            href="/dashboard/clients"
            className="flex h-10 shrink-0 items-center justify-center px-2 text-sm font-medium underline-offset-2 hover:underline"
          >
            Réinitialiser
          </Link>
        )}
      </form>

      {clients.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          {query
            ? `Aucun client ne correspond à "${query}".`
            : "Aucun client pour le moment."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-black/[.08] dark:border-white/[.145]">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/[.03] dark:bg-white/[.06]">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Entreprise</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 font-medium">Ville</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-black/[.08] dark:border-white/[.145]"
                >
                  <td className="px-4 py-3">{client.name}</td>
                  <td className="px-4 py-3">{client.company ?? "—"}</td>
                  <td className="px-4 py-3">{client.email ?? "—"}</td>
                  <td className="px-4 py-3">{client.phone ?? "—"}</td>
                  <td className="px-4 py-3">{client.city ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/dashboard/time-entries?clientId=${client.id}`}
                        className="text-sm font-medium underline-offset-2 hover:underline"
                      >
                        Temps
                      </Link>
                      <Link
                        href={`/dashboard/clients/${client.id}/edit`}
                        className="text-sm font-medium underline-offset-2 hover:underline"
                      >
                        Modifier
                      </Link>
                      <form action={deleteClient}>
                        <input type="hidden" name="id" value={client.id} />
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
          </table>
        </div>
      )}

      <Link
        href="/dashboard"
        className="text-sm font-medium underline-offset-2 hover:underline"
      >
        ← Retour au tableau de bord
      </Link>
    </div>
  );
}
