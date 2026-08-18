# CLAUDE.md — SIGEL

As regras de desenvolvimento deste repositório vivem em um único lugar, para não
divergirem entre agentes:

@AGENTS.md

Leia aquele arquivo antes de qualquer alteração. O que segue abaixo é só o que é
específico do Claude Code.

---

## Verificação antes de encerrar

Este projeto tem servidor de desenvolvimento. Mudança observável no navegador se
verifica no navegador — não peça ao usuário para conferir manualmente.

```bash
npm run dev
```

Confira o console e os logs, leia a página, exercite o formulário, e só então
relate.

**Duas armadilhas deste projeto, já vividas:**

1. **Confirme que o teste testou o que você acha que testou.** Submeter
   formulário logo após navegação dá falso negativo — a página ainda não
   hidratou. Verifique que o `form` existe e hidratou antes de submeter.
2. **Não confie em leitura de estilo imediatamente após mudança de estado.**
   `getComputedStyle` lido no mesmo tique do `setState` devolve o valor antigo.
   Duas vezes isso pareceu bug e não era.

## Windows

- `prisma generate` falha com `EPERM` se o servidor de dev estiver rodando: ele
  segura `query_engine-windows.dll.node`. Pare o servidor, gere, suba de novo.
- Há Bash (POSIX) e PowerShell disponíveis, cada um com sua sintaxe. Caminho com
  acento pode falhar em algumas ferramentas — use curinga ou copie para um nome
  ASCII.
- `git` está instalado; `gh` **não**.

## Skills instaladas

| Skill | Para quê |
|---|---|
| `grill-with-docs` | Entrevista para afiar um plano ou design, gerando ADR e glossário |
| `grilling` | Interrogatório de decisão em rondas, com árvore de decisão |
| `domain-modeling` | Construir e afiar o modelo de domínio, `CONTEXT.md` e ADRs |

`grill-with-docs` chama as outras duas — as três precisam estar instaladas.
Restaurar após clonar:

```bash
npx skills experimental_install
```

Skills de terceiros rodam com permissão total de agente. **Leia o `SKILL.md`
antes de invocar uma que você não instalou.**

## Ao escrever documentação

Este repositório documenta **decisão e motivo**, não só o mecanismo. Um
documento que lista campos sem dizer por que o modelo é assim não ajuda quem vai
mudá-lo. Ao registrar uma decisão, inclua a alternativa descartada e o custo dela
— é isso que impede que a decisão seja revertida por engano seis meses depois.

## Ao relatar trabalho

Diga o que verificou e o que **não** verificou. "Testei o login" e "testei o
caminho de sucesso, mas não o bloqueio após 5 tentativas porque travaria a conta"
são afirmações diferentes, e só a segunda é útil para quem vai confiar no
resultado.
