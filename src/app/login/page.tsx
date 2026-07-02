import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  const { callbackUrl } = await searchParams;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-zinc-50 px-6 py-32 dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Connexion
      </h1>
      <LoginForm callbackUrl={callbackUrl ?? "/dashboard"} />
    </div>
  );
}
