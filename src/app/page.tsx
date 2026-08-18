import { redirect } from "next/navigation";
import { lerSessao } from "@/lib/sessao";

/** A raiz decide entre o painel e o login conforme a sessão. */
export default async function Home() {
  const sessao = await lerSessao();
  redirect(sessao ? "/painel" : "/login");
}
