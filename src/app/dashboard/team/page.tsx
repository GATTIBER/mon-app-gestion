import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTeamMember, deleteTeamMember } from "@/app/actions/team";
import { TeamMemberForm } from "./team-member-form";

export default async function TeamPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const members = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-1 flex-col gap-10 bg-zinc-50 px-6 py-16 dark:bg-black sm:px-16">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Équipe
        </h1>

        <div className="overflow-x-auto rounded-lg border border-black/[.08] dark:border-white/[.145]">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/[.03] dark:bg-white/[.06]">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-black/[.08] dark:border-white/[.145]"
                >
                  <td className="px-4 py-3">{member.name ?? "—"}</td>
                  <td className="px-4 py-3">{member.email}</td>
                  <td className="px-4 py-3 text-right">
                    {member.id !== session.user.id && (
                      <form action={deleteTeamMember}>
                        <input type="hidden" name="id" value={member.id} />
                        <button
                          type="submit"
                          className="text-sm font-medium text-red-600 underline-offset-2 hover:underline dark:text-red-400"
                        >
                          Supprimer
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
          Ajouter un membre
        </h2>
        <TeamMemberForm action={createTeamMember} />
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
