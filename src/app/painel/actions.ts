"use server";

import { redirect } from "next/navigation";
import { encerrarSessao } from "@/lib/sessao";

export async function sair(): Promise<void> {
  await encerrarSessao();
  redirect("/login");
}
