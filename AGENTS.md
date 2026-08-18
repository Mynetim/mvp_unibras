# AGENTS.md — SIGEL

Regras de desenvolvimento deste repositório. Vale para pessoas e para agentes
de IA. Se uma instrução aqui contradiz o que você ia fazer, esta ganha.

> **Estado deste documento.** As seções 1 a 9 descrevem convenções que o
> projeto já pratica e que estão verificáveis no código. A seção 10 lista o que
> ainda depende de definição da Audax — não invente resposta para aqueles itens.

---

## 1. O que é este projeto

SIGEL — Sistema Integrado de Gestão de Laboratórios e Insumos. Projeto-piloto
acadêmico do curso de Engenharia de Software da UniBRAS Montes Belos, executado
por alunos em sprints de duas semanas.

Leia antes de mexer em qualquer coisa:

| Documento | Para quê |
|---|---|
| [`docs/PRD-SIGEL.md`](docs/PRD-SIGEL.md) | Escopo, épicos, critérios de aceite, regras de negócio |
| [`docs/SCHEMA-SIGEL.md`](docs/SCHEMA-SIGEL.md) | Modelo de dados e as decisões estruturais |
| [`prisma/schema.prisma`](prisma/schema.prisma) | Definição executável do banco |

O PRD é a fonte de escopo. **Nada entra que não esteja nele** — ver §8.

## 2. Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção (roda o TypeScript)
npm run typecheck    # tsc --noEmit
npm run db:migrate   # aplica migração
npm run db:seed      # cria unidade-sede e Administrador Master
npm run db:studio    # inspeciona o banco
```

Primeiro acesso: `cp .env.example .env`, preencha, `npm run db:migrate`,
`npm run db:seed`.

## 3. Stack e versões

| | | Por que assim |
|---|---|---|
| Next.js | `^16` | O 15 carrega advisories de `postcss` e `sharp` corrigidos só no 16 |
| React | `19` | Server Actions e `useActionState` |
| Prisma | **`6.12.0` exato** | Da 6.13 em diante entra um `deepmerge-ts` vulnerável. **Não troque para `^6`** |
| PostgreSQL | 18 | `Decimal`, arrays e unicidade parcial são requisito, não preferência |
| Tailwind | `^4` | Tokens em `@theme inline`, ver `src/app/globals.css` |
| Zod | `^4` | Validação de toda entrada |
| jose | `^6` | Assinatura do cookie de sessão |
| bcryptjs | `^3` | Hash de senha, custo 12 |

`npm audit` precisa terminar em **0 vulnerabilidades**. Se subir uma
dependência e aparecer alerta, resolva antes do merge.

## 4. Convenções de código

**Idioma.** O domínio é escrito em **português**: modelos, campos, funções,
rotas, variáveis, comentários e mensagens de erro. Palavra técnica sem tradução
consagrada fica em inglês (`build`, `commit`, `hash`, `token`, `slot`). Não
misture: `criarSessao`, não `createSessao`.

**Nomes.**

| O quê | Forma | Exemplo |
|---|---|---|
| Arquivo | `kebab-case` | `formulario-login.tsx` |
| Componente React | `PascalCase` | `FormularioLogin` |
| Função e variável | `camelCase` | `conferirSenha` |
| Modelo Prisma | `PascalCase` singular | `MovimentoEstoque` |
| Tabela | `snake_case` plural via `@@map` | `movimentos_estoque` |
| Constante de módulo | `SCREAMING_SNAKE` | `TENTATIVAS_ATE_BLOQUEIO` |

**Comentários explicam o porquê, não o quê.** `// incrementa contador` é ruído.
`// gasta o mesmo tempo de uma verificação real, para a latência não denunciar a
existência da conta` é o que o próximo leitor precisa. Amarre a decisão ao
requisito quando houver: `// RN04 —`, `// E1.1 CA2 —`.

**Onde as coisas moram.**

```
src/app/<rota>/page.tsx              Server Component: busca dado, checa sessão
src/app/<rota>/actions.ts            "use server" — mutações
src/app/<rota>/estado.ts             tipos e estado inicial de formulário
src/app/<rota>/<componente>.tsx      "use client" — só quando precisa de estado
src/lib/                             regra reutilizável sem UI
src/components/                      componente compartilhado
src/middleware.ts                    porteiro de rota
```

## 5. Regras de arquitetura

Cada uma existe porque a violação já custou caro em algum lugar.

**5.1 Multi-unidade não é opcional.** Toda entidade de negócio carrega
`unidadeId`. Toda consulta filtra por ele. `MASTER` é a única exceção — vê a
rede inteira. Acesso a dado de outra unidade retorna **403**, nunca lista vazia:
lista vazia é indistinguível de "não existe" e esconde o bug.

**5.2 Permissão se confere no servidor.** Esconder botão não é controle de
acesso. O middleware é a primeira barreira, não a única — **a página confere de
novo**. Uma barreira só é uma barreira só.

**5.3 Módulo `"use server"` só exporta função assíncrona.** Exportar um objeto
de lá não gera erro de compilação: o valor chega `undefined` no cliente e a tela
quebra em runtime. Tipo pode ficar (some na compilação); valor, não — vai para
um módulo separado. Ver `src/app/login/estado.ts`.

**5.4 `redirect()` nunca dentro de `try/catch`.** Ele sinaliza lançando uma
exceção especial, que um `catch` genérico engole — o usuário autentica e fica
parado na tela. Guarde a intenção numa variável e redirecione depois do bloco.
Ver `src/app/login/actions.ts`.

**5.5 Destino de redirecionamento se valida.** Só aceite caminho que comece com
`/` e não com `//`. Sem isso, `?de=https://site-falso` vira redirecionamento
aberto — phishing usando a credibilidade do próprio domínio.

**5.6 Saldo de estoque nunca muda sem movimento gravado**, e sempre na mesma
transação. Corrigir erro é lançar `AJUSTE` com justificativa, nunca reescrever o
passado. Ver `docs/SCHEMA-SIGEL.md` §2.3.

**5.7 Trilha de auditoria é somente inserção.** Não exponha rota de `update` nem
de `delete` em `LogAuditoria`. Trilha editável não é trilha.

**5.8 Dinheiro e quantidade em `Decimal`, nunca `Float`.** Ponto flutuante
acumula erro de arredondamento. Três casas para quantidade, duas para preço.

**5.9 Integridade que importa mora no banco.** A trava anti-conflito é
restrição de unicidade, não `if` na aplicação — `SELECT` antes de `INSERT` falha
sob concorrência. Regra que não pode ser violada nem em condição de corrida vira
constraint.

**5.10 Erro diz o que aconteceu e o que fazer.** "Erro ao salvar" é inútil.
Detalhe de infraestrutura vai para o log do servidor, nunca para a tela.

## 6. Segredos

**6.1 Credencial não transita por chat, e-mail, ticket, print ou commit.** Só
por variável de ambiente e cofre de secrets. Segredo que passa por um canal fica
comprometido nesse canal — a correção passa a ser rotacionar, não confiar que
ninguém olhou.

**6.2 `.env` é ignorado pelo Git e nunca versionado.** `.env.example` acompanha
o repositório com placeholders e a explicação de cada variável.

**6.3 Antes de qualquer commit inicial ou push para remoto novo**, confirme que
nenhuma credencial entrou. Verifique **no remoto**, não só no índice local.

**6.4 Senha só existe como hash.** bcrypt custo 12. Senha em claro nunca é
persistida nem registrada em log — nem em log de erro.

**6.5 Resposta de autenticação não revela se a conta existe.** Mesma mensagem e
**mesmo tempo de resposta** para e-mail inexistente e senha errada.

**6.6 Segredo exposto é rotacionado, não avaliado.** Não discuta se alguém teria
visto. Troque.

## 7. Definition of Done

Item só sai de "em andamento" quando **tudo** abaixo é verdadeiro. Sem exceção
na última semana da sprint — é justamente aí que ela custa caro.

- [ ] Pull request revisado e aprovado por pelo menos uma pessoa de outra squad
- [ ] Teste automatizado do caminho feliz e de pelo menos um caminho de erro
- [ ] Permissão verificada no servidor, não só escondendo botão
- [ ] Nenhuma senha, chave ou string de conexão no repositório
- [ ] `npm run build` e `npm run typecheck` passam
- [ ] `npm audit` em 0 vulnerabilidades
- [ ] Funciona em tela de 360px de largura
- [ ] Foco de teclado visível; `aria-invalid` e `role="alert"` nos erros de campo
- [ ] Mensagem de erro que diz o que fazer
- [ ] Publicado no ambiente e demonstrado ao PO com dados do seed
- [ ] README e `.env.example` atualizados se mudou instalação, variável ou migração

## 8. Escopo

O PRD é a fonte. Requisito fora dele **não entra sem outro sair no lugar** — a
troca é decisão do Product Owner na planning, registrada no board.

Isso vale especialmente para agentes de IA: se você identificou uma melhoria
fora do escopo do item que está fazendo, **relate, não implemente**.

## 9. Git

- Branch a partir de `main`. Nunca commite direto na `main`.
- Nenhuma branch vive mais de **cinco dias** sem merge. Integração adiada é o
  modo mais comum de falhar na última semana.
- Mensagem de commit em português: assunto no imperativo, corpo explicando **por
  que**. Agentes de IA adicionam `Co-Authored-By`.
- Alterou o modelo? Atualize `schema.prisma`, gere a migração **e** atualize
  `docs/SCHEMA-SIGEL.md` no mesmo pull request. Documentação que divergiu do
  código é pior que documentação ausente, porque é acreditada.
- `.claude/skills/` não é versionado: contém symlink de caminho absoluto,
  específico da máquina. O que se versiona é `.agents/skills/` e
  `skills-lock.json`; cada pessoa restaura com `npx skills experimental_install`.

## 10. Pendente de definição pela Audax

**Não presuma resposta para nada desta lista.** Estes itens não estavam
disponíveis quando o documento foi escrito e precisam de decisão explícita.

| Tema | O que falta decidir |
|---|---|
| Lint e formatação | ESLint e Prettier ainda não estão configurados. Qual configuração é o padrão da casa? |
| Testes | Nenhum runner instalado. Vitest ou Jest? Cobertura mínima exigida? |
| CI | Sem pipeline. Quais checks bloqueiam merge? |
| Ambiente publicado | Vercel? Qual conta, qual domínio? |
| Cofre de secrets | Onde as credenciais de produção vivem? |
| Revisão | Prazo esperado de resposta em pull request? Quem aprova o quê? |
| Convenção de branch | `feat/`, `fix/`? Nome padronizado? |
| Versionamento | Semver? Changelog? Tag por sprint? |
| Observabilidade | Log estruturado, monitoramento de erro, alerta — qual ferramenta? |
| LGPD | Quem é o encarregado? Qual o prazo de retenção da trilha de auditoria? |

Ao definir qualquer um, mova a decisão para a seção correspondente acima e
remova a linha desta tabela.
