"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type TimeEntryFormState = { error: string } | undefined;

export async function createTimeEntry(
  _prevState: TimeEntryFormState,
  formData: FormData
): Promise<TimeEntryFormState> {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const clientId = formData.get("clientId");
  const date = formData.get("date");
  const hoursRaw = formData.get("hours");
  const description = formData.get("description");

  if (typeof clientId !== "string" || clientId === "") {
    return { error: "Le client est obligatoire." };
  }
  if (typeof date !== "string" || date === "") {
    return { error: "La date est obligatoire." };
  }

  const hours = typeof hoursRaw === "string" ? Number(hoursRaw) : NaN;
  if (!Number.isFinite(hours) || hours <= 0) {
    return { error: "Le nombre d'heures doit être un nombre positif." };
  }

  await prisma.timeEntry.create({
    data: {
      clientId,
      userId: session.user.id,
      date: new Date(date),
      hours,
      description:
        typeof description === "string" && description.trim() !== ""
          ? description.trim()
          : null,
    },
  });

  revalidatePath("/dashboard/time-entries");
  redirect("/dashboard/time-entries");
}

export async function deleteTimeEntry(formData: FormData) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const id = formData.get("id");
  if (typeof id !== "string" || id === "") {
    return;
  }

  await prisma.timeEntry.delete({ where: { id } });

  revalidatePath("/dashboard/time-entries");
}
