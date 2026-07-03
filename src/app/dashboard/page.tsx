import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logout } from "@/app/actions/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-32 dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Tableau de bord
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Connecté en tant que {session.user?.email}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/dashboard/clients"
          className="flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Voir les clients
        </Link>
        <Link
          href="/dashboard/time-entries"
          className="flex h-11 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Suivi des temps
        </Link>
        <Link
          href="/dashboard/team"
          className="flex h-11 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Équipe
        </Link>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="flex h-11 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Se déconnecter
        </button>
      </form>
    </div>
  );
}
