"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ClientFormState = { error: string } | undefined;

function readClientFormData(formData: FormData) {
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim() === "") {
    return null;
  }

  const optional = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" && value.trim() !== ""
      ? value.trim()
      : null;
  };

  return {
    name: name.trim(),
    company: optional("company"),
    email: optional("email"),
    phone: optional("phone"),
    address: optional("address"),
    postalCode: optional("postalCode"),
    city: optional("city"),
    siret: optional("siret"),
    notes: optional("notes"),
  };
}

export async function createClient(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const data = readClientFormData(formData);
  if (!data) {
    return { error: "Le nom du client est obligatoire." };
  }

  await prisma.client.create({ data });

  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
}

export async function updateClient(
  id: string,
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const data = readClientFormData(formData);
  if (!data) {
    return { error: "Le nom du client est obligatoire." };
  }

  await prisma.client.update({ where: { id }, data });

  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
}

export async function deleteClient(formData: FormData) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const id = formData.get("id");
  if (typeof id !== "string" || id === "") {
    return;
  }

  await prisma.client.delete({ where: { id } });

  revalidatePath("/dashboard/clients");
}
