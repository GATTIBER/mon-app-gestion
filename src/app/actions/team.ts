"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type TeamFormState = { error: string } | undefined;

export async function createTeamMember(
  _prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || email.trim() === "") {
    return { error: "L'email est obligatoire." };
  }
  if (typeof password !== "string" || password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name: typeof name === "string" && name.trim() !== "" ? name.trim() : null,
      passwordHash,
    },
  });

  revalidatePath("/dashboard/team");
  redirect("/dashboard/team");
}

export async function deleteTeamMember(formData: FormData) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const id = formData.get("id");
  if (typeof id !== "string" || id === "") {
    return;
  }

  if (id === session.user?.id) {
    return;
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/dashboard/team");
}
