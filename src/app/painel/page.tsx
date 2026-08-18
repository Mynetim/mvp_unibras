import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Marca } from "@/components/marca";
import { lerSessao } from "@/lib/sessao";
import { sair } from "./actions";

export const metadata: Metadata = { title: "Painel" };

const ROTULO_PERFIL: Record<string, string> = {
  MASTER: "Administrador Master",
  ADMIN_UNIDADE: "Administrador de Unidade",
  DOCENTE: "Docente",
  TECNICO: "Técnico de Laboratório",
};

/** Módulos do ERS e onde cada um entra no plano de sprints. */
const MODULOS = [
  {
    modulo: "Módulo 1",
    nome: "Unidades e Infraestrutura",
    descricao:
      "Cadastro de campi, blocos, laboratórios e a grade de horários de cada unidade.",
    sprint: "Sprint 1–2",
  },
  {
    modulo: "Módulo 2",
    nome: "Agendamento e Reservas",
    descricao:
      "Calendário de ocupação, solicitação de reserva, trava anti-conflito e workflow de aprovação.",
    sprint: "Sprint 2–3",
  },
  {
    modulo: "Módulo 3",
    nome: "Estoque e Insumos",
    descricao:
      "Catálogo, saldo por unidade, reserva de insumo na aprovação e alerta de estoque mínimo.",
    sprint: "Sprint 4",
  },
  {
    modulo: "Módulo 4",
    nome: "Manutenção e Ocorrências",
    descricao:
      "Equipamento inoperante bloqueando a agenda e chamados de reparo.",
    sprint: "Sprint 5",
  },
  {
    modulo: "Módulo 5",
    nome: "Relatórios e Indicadores",
    descricao:
      "Taxa de ocupação, consumo e custo por aluno, exportação em CSV e PDF.",
    sprint: "Sprint 6",
  },
];

export default async function PainelPage() {
  const sessao = await lerSessao();

  // O middleware já barra o acesso sem sessão. Esta checagem é a segunda
  // barreira: a página não confia que alguém antes dela fez o trabalho.
  if (!sessao) redirect("/login");

  const escopo = sessao.unidadeNome ?? "Todas as unidades da rede";

  return (
    <div className="min-h-dvh">
      <header className="border-b border-rule bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-6 py-4">
          <Marca tamanho="sm" />
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold leading-tight">
                {sessao.nome}
              </p>
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-3">
                {ROTULO_PERFIL[sessao.perfil] ?? sessao.perfil}
              </p>
            </div>
            <form action={sair}>
              <button
                type="submit"
                className="min-h-11 border border-rule px-4 text-sm text-ink-2 transition-colors hover:border-accent hover:text-accent"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
        <section className="flex flex-col gap-3">
          <h1 className="font-display text-3xl tracking-[-0.015em]">
            Bem-vindo, {sessao.nome.split(" ")[0]}.
          </h1>
          <p className="max-w-2xl text-ink-2">
            Você está autenticado como{" "}
            <strong className="text-ink">
              {ROTULO_PERFIL[sessao.perfil] ?? sessao.perfil}
            </strong>
            . Seu escopo de dados é{" "}
            <strong className="text-ink">{escopo}</strong>. A sessão expira em 8
            horas.
          </p>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-3">
              Módulos do sistema
            </h2>
            <p className="text-sm text-ink-3">
              O acesso e os perfis estão no ar. Os módulos abaixo entram nas
              próximas sprints.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {MODULOS.map((item) => (
              <li
                key={item.nome}
                className="flex flex-col gap-2 border border-rule border-t-2 border-t-rule-strong bg-surface p-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-3">
                    {item.modulo}
                  </span>
                  <span className="font-mono text-[0.66rem] tracking-[0.06em] text-accent">
                    {item.sprint}
                  </span>
                </div>
                <h3 className="font-display text-lg leading-tight">
                  {item.nome}
                </h3>
                <p className="text-sm leading-relaxed text-ink-2">
                  {item.descricao}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <footer className="border-t border-rule pt-6 font-mono text-[0.66rem] leading-relaxed tracking-[0.06em] text-ink-3">
          SIGEL · Centro Universitário UniBRAS Montes Belos
          <br />
          Engenharia de Software · Projeto-piloto 2026.2
        </footer>
      </main>
    </div>
  );
}
