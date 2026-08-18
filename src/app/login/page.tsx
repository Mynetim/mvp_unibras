import type { Metadata } from "next";
import { Marca, SimboloSigel } from "@/components/marca";
import { FormularioLogin } from "./formulario-login";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Acesso ao Sistema Integrado de Gestão de Laboratórios e Insumos.",
};

/** O que o sistema faz, na ordem do fluxo principal do PRD (§7). */
const CAPACIDADES = [
  {
    titulo: "Reserve sem conflito",
    texto:
      "A grade mostra a ocupação real de cada laboratório. Dois agendamentos no mesmo espaço e horário são impossíveis por construção.",
  },
  {
    titulo: "Aprove com o estoque à vista",
    texto:
      "A solicitação chega com a lista de insumos e o saldo disponível na data da aula. Nada é aprovado sem material para acontecer.",
  },
  {
    titulo: "Feche o ciclo na aula",
    texto:
      "O check-in confirma a realização e baixa o consumo. Cada prática vira dado de ocupação e de custo por aluno.",
  },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ de?: string }>;
}) {
  // O middleware guarda aqui a rota que a pessoa tentou abrir sem sessão,
  // para devolvê-la ao lugar certo depois de entrar.
  const { de } = await searchParams;

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.15fr_1fr]">
      {/* -------------------------------------------------- painel da marca */}
      <section className="relative isolate hidden overflow-hidden bg-brand px-12 py-14 text-brand-ink lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="malha-grade absolute inset-0 -z-10" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-transparent to-brand"
        />

        <Marca />

        <div className="flex max-w-lg flex-col gap-10">
          <h1 className="font-display text-[clamp(2.1rem,3.2vw,2.9rem)] font-medium leading-[1.08] tracking-[-0.02em] text-balance">
            O laboratório certo, no horário certo, com o insumo em mãos.
          </h1>

          <ul className="flex flex-col gap-6 border-t border-brand-rule pt-8">
            {CAPACIDADES.map((item, indice) => (
              <li key={item.titulo} className="flex gap-4">
                <span className="mt-0.5 font-mono text-xs tabular-nums text-accent">
                  {String(indice + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-sm font-semibold">{item.titulo}</h2>
                  <p className="max-w-md text-sm leading-relaxed text-brand-ink-2">
                    {item.texto}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-[0.68rem] leading-relaxed tracking-[0.08em] text-brand-ink-2">
          Centro Universitário UniBRAS Montes Belos
          <br />
          Engenharia de Software · Projeto-piloto 2026.2
        </p>
      </section>

      {/* ------------------------------------------------------ formulário */}
      <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-8">
          {/* Cabeçalho compacto: substitui o painel da marca abaixo de 1024px. */}
          <div className="flex items-center gap-3 lg:hidden">
            <SimboloSigel className="size-7 text-accent" />
            <span className="font-display text-xl font-semibold tracking-[0.18em]">
              SIGEL
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl tracking-[-0.015em]">Entrar</h2>
            <p className="text-sm text-ink-2">
              Use o e-mail institucional cadastrado pela sua unidade.
            </p>
          </div>

          <FormularioLogin destino={de} />

          <p className="border-t border-rule pt-6 font-mono text-[0.68rem] leading-relaxed tracking-[0.06em] text-ink-3">
            O login único com a conta do grupo (SSO) chega depois do piloto.
          </p>
        </div>
      </section>
    </main>
  );
}
