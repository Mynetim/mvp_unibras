# PRD — SIGEL

**Sistema Integrado de Gestão de Laboratórios e Insumos**
Centro Universitário UniBRAS Montes Belos · Curso de Engenharia de Software

| | |
|---|---|
| **Documento** | SIGEL-PRD-2026-01 · v1.0 |
| **Origem** | SIGEL-ERS-2026-01 v1.0 (agosto de 2026) |
| **Escopo** | MVP — projeto-piloto acadêmico, 15 semanas |
| **Product Owner** | Prof. Guilherme Nogueira de Jesus |
| **Status** | Aprovado para execução |

---

## 1. Contexto e problema

A rede de faculdades opera laboratórios em múltiplas unidades, cada um com equipamentos fixos, regras de uso, EPIs obrigatórios e um estoque de insumos consumidos a cada aula prática. Hoje o agendamento vive em planilhas e grupos de mensagem, e o estoque só é conferido quando falta alguma coisa.

Os três sintomas que o SIGEL precisa eliminar:

1. **Conflito de agenda** — duas turmas chegam ao mesmo laboratório no mesmo horário.
2. **Aula inviabilizada por falta de insumo** — a reserva foi aprovada sem ninguém verificar se havia reagente suficiente para a data.
3. **Ausência de dado para decidir** — a coordenação não sabe qual laboratório está ocioso, quanto custa cada aula prática por aluno, nem onde o insumo está sendo desperdiçado.

## 2. Visão do produto

> Para **coordenadores, docentes e técnicos de laboratório** de uma rede multi-campus,
> que **precisam garantir que cada aula prática aconteça com espaço e insumo disponíveis**,
> o **SIGEL** é um sistema de gestão de laboratórios
> que **conecta a reserva do espaço ao consumo real de insumo**, em um único fluxo auditável.
> Diferente de **planilhas compartilhadas e agendas de calendário**,
> o SIGEL **impede o conflito na origem, valida o estoque antes de aprovar e transforma cada aula realizada em dado de gestão**.

## 3. Frase de aceite do MVP

Esta frase é o critério de corte do produto. Requisito que a sustenta entra no MVP; requisito que apenas a enriquece vai para a v2.

> Um **professor** solicita um laboratório para uma aula prática com a lista de insumos que vai usar. O **gestor da unidade** aprova sem risco de conflito de horário nem de estoque insuficiente. A aula acontece, alguém faz o **check-in**, o **estoque baixa automaticamente**, e a **coordenação** abre um relatório com taxa de ocupação e consumo do período — tudo isso em mais de uma unidade, com cada gestor enxergando apenas a sua.

## 4. Objetivos e métricas de sucesso

| Objetivo | Métrica | Meta no piloto |
|---|---|---|
| Eliminar conflito de agendamento | Reservas aprovadas em choque de horário | **0** |
| Evitar aula sem insumo | Aulas com check-in reportando falta de material | < 5% |
| Dar visibilidade de ocupação | Laboratórios com taxa de ocupação calculada | 100% dos cadastrados |
| Reduzir o ciclo de aprovação | Tempo mediano entre solicitação e decisão | < 24h úteis |
| Rastrear consumo | Aulas realizadas com baixa de estoque registrada | > 90% |
| Provar o multi-unidade | Unidades operando em paralelo sem alteração de código | ≥ 2 |

**Métricas de saúde do projeto acadêmico:** todas as sprints encerradas com demonstração ao vivo em ambiente publicado; nenhuma branch com mais de cinco dias sem merge; Definition of Done cumprida em 100% dos itens aceitos.

## 5. Personas e perfis de acesso

| Perfil | Quem é | O que precisa fazer | Escopo de dados |
|---|---|---|---|
| **Administrador Master** | Gestão do grupo / holding | Criar unidades, auditar, ver relatórios consolidados | Todas as unidades |
| **Administrador de Unidade** | Coordenador local ou gestor de laboratório | Aprovar e rejeitar reservas, cadastrar salas, gerir estoque local, emitir relatórios | Apenas a sua unidade |
| **Docente** | Professor | Solicitar reserva, vincular disciplina e turma, requisitar insumos, confirmar realização | Apenas a sua unidade; edita apenas as próprias reservas |
| **Técnico de Laboratório** | Almoxarife ou técnico local | Preparar kits, dar baixa no estoque, registrar manutenção, fazer check-in | Apenas a sua unidade |

**Regra transversal:** toda verificação de permissão acontece no servidor. Esconder um botão na interface não é controle de acesso.

## 6. Escopo

### 6.1 Dentro do MVP

| Épico | Requisitos do ERS | Sprint |
|---|---|---|
| E1 — Identidade, acesso e multi-unidade | RBAC, RN03, RNF01 | S1 |
| E2 — Cadastros de infraestrutura | RF01, RF02, RF03 | S1–S2 |
| E3 — Calendário, reserva e aprovação | RF04, RF05, RF06, RF07, RF08, RN01 | S2–S3 |
| E4 — Estoque e vínculo com a reserva | RF10, RF12, RF14, RN02 | S4 |
| E5 — Execução da aula | RF09, RF13 | S5 |
| E6 — Manutenção e ocorrências | RF15, RF16 | S5 |
| E7 — Indicadores e exportação | RF17, RF18, RF20 | S6 |
| E8 — Plataforma e conformidade | RNF03, RNF04, RNF05 | S2, S5, S6 |

### 6.2 Fora do MVP

| Item | Requisito | Motivo |
|---|---|---|
| Lote e validade de insumos | RF11 | Duplica a modelagem de estoque — saldo por item vira saldo por lote — e puxa junto o alerta de vencimento. |
| Alerta de vencimento | RF14 (parte) | Depende de RF11. O alerta de estoque mínimo permanece no MVP. |
| Relatório de perdas | RF19 | Exige tipificação de descarte, quebra e avaria; só faz sentido com histórico real de uso. |
| Recorrência semanal do semestre | RF05 (parte) | Multiplica a verificação anti-conflito e traz cancelamento em série, exceção de feriado e edição parcial. |
| SSO corporativo | RNF02 | Depende de liberação da TI do grupo — risco externo ao time. A autenticação já nasce preparada para plugar o provedor. |
| Integração com ferramenta de BI | RF20 (parte) | Exportação em CSV e PDF resolve o caso de uso real do piloto. |
| Notificação por e-mail e push | RF07, RF14 | Notificação in-app cobre o workflow sem exigir fila e infraestrutura de entrega. |

**Regra do piloto:** nenhum item desta tabela entra em uma sprint sem que outro item de escopo saia no lugar. A troca é decidida pelo PO na planning e registrada no board.

## 7. Jornadas principais

### 7.1 Jornada do docente — da necessidade à aula realizada

1. Abre o calendário da unidade e vê a ocupação da semana.
2. Escolhe laboratório, data e faixa de horário livres.
3. Preenche disciplina, turma, número de alunos previstos e a lista de insumos.
4. O sistema valida a antecedência mínima (RN01) e registra a solicitação.
5. Recebe aviso da decisão do gestor — aprovação, rejeição com justificativa ou pedido de ajuste.
6. No dia da aula, faz o check-in dentro da janela do horário.
7. Confirma as quantidades realmente consumidas.

### 7.2 Jornada do gestor — da fila de solicitações à decisão

1. Recebe aviso de nova solicitação.
2. Abre a solicitação e vê, na mesma tela: conflito de horário, saldo de insumo disponível na data e estado dos equipamentos do laboratório.
3. Aprova — o horário é travado e o insumo, reservado. Ou rejeita com justificativa obrigatória. Ou devolve pedindo ajuste.
4. Acompanha o painel de alertas de estoque mínimo e de chamados abertos.

### 7.3 Jornada do técnico — do preparo à baixa

1. Vê a lista de aulas do dia com os kits a preparar.
2. Faz o check-in quando a aula começa.
3. Ajusta as quantidades consumidas e justifica a diferença.
4. Abre chamado de manutenção quando um equipamento falha.

---

## 8. Requisitos funcionais detalhados

Formato: história de usuário + critérios de aceite. `CA` = critério de aceite verificável.

### E1 — Identidade, acesso e multi-unidade

#### E1.1 · Autenticação `RBAC`
**Como** usuário do sistema, **quero** entrar com e-mail e senha **para** acessar apenas o que meu perfil permite.

- **CA1** — Senha armazenada com hash forte; a senha em texto claro nunca é persistida nem registrada em log.
- **CA2** — Após cinco tentativas malsucedidas, a conta é bloqueada por 15 minutos.
- **CA3** — A sessão expira após 8 horas de inatividade.
- **CA4** — A camada de autenticação é isolada atrás de uma interface, de modo que trocar por um provedor externo (RNF02) não exija mudar as regras de negócio.

#### E1.2 · Perfis e permissões `RBAC`
**Como** administrador, **quero** que cada perfil tenha um conjunto fixo de permissões **para** garantir a governança da rede.

- **CA1** — Os quatro perfis existem: Master, Administrador de Unidade, Docente, Técnico.
- **CA2** — Toda rota da API valida o perfil no servidor antes de executar.
- **CA3** — Requisição sem permissão retorna 403 e é registrada na trilha de auditoria.

#### E1.3 · Segregação de dados por unidade `RN03` `RNF01`
**Como** grupo educacional, **quero** que cada unidade só enxergue os próprios dados **para** cumprir a governança multi-campus.

- **CA1** — Toda entidade de negócio carrega o vínculo com a unidade.
- **CA2** — Usuário de outra unidade recebe 403 ao acessar o recurso por URL direta, e não uma lista vazia.
- **CA3** — Existe teste automatizado de vazamento entre unidades; ele não pode ser removido do conjunto de testes.
- **CA4** — Incluir uma faculdade nova é inserir um registro, sem alteração de código.

### E2 — Cadastros de infraestrutura

#### E2.1 · Unidades e blocos `RF01`
**Como** Administrador Master, **quero** cadastrar campi e seus blocos **para** organizar a estrutura física da rede.

- **CA1** — CRUD completo de unidade e de bloco.
- **CA2** — Unidade com laboratório vinculado não pode ser excluída; é desativada.

#### E2.2 · Ficha do laboratório `RF02`
**Como** Administrador de Unidade, **quero** cadastrar a ficha completa do laboratório **para** que o docente saiba o que aquele espaço oferece e exige.

- **CA1** — Registra área do conhecimento, capacidade máxima de alunos, regras específicas de uso e EPIs obrigatórios.
- **CA2** — Equipamentos fixos são cadastrados com identificação e estado operacional.
- **CA3** — Um equipamento pode ser marcado como **essencial**: sem ele o laboratório não pode ser agendado.
- **CA4** — Reserva com número de alunos acima da capacidade máxima é bloqueada na solicitação.

#### E2.3 · Grade horária `RF03`
**Como** Administrador de Unidade, **quero** configurar turnos e faixas de horário **para** refletir a realidade da minha unidade.

- **CA1** — Turnos matutino, vespertino e noturno, com faixas de horário configuráveis por unidade.
- **CA2** — Nenhum horário está fixo no código.
- **CA3** — Faixa de horário em uso por reserva futura não pode ser excluída.

### E3 — Calendário, reserva e aprovação

#### E3.1 · Calendário de ocupação `RF04`
**Como** docente, **quero** ver a ocupação dos laboratórios **para** escolher um horário livre antes de solicitar.

- **CA1** — Visões de dia, semana e mês.
- **CA2** — Filtros por unidade, laboratório e área do conhecimento.
- **CA3** — Estados visualmente distintos: livre, solicitado, aprovado, realizado, bloqueado por manutenção.
- **CA4** — Funciona em tela de 360px de largura.

#### E3.2 · Solicitação de reserva `RF05`
**Como** docente, **quero** solicitar um laboratório informando o contexto da aula **para** que o gestor tenha tudo o que precisa para decidir.

- **CA1** — Campos obrigatórios: unidade, laboratório, data, faixa de horário, disciplina, turma, número de alunos previstos.
- **CA2** — Lista de insumos com quantidade, opcional.
- **CA3** — A solicitação nasce no estado `SOLICITADA`.
- **CA4** — Recorrência semestral está fora do MVP; cada reserva é um evento único.

#### E3.3 · Trava anti-conflito `RF06`
**Como** gestor, **quero** que o sistema torne impossível aprovar duas reservas no mesmo laboratório e horário **para** que a agenda seja confiável.

- **CA1** — A garantia é uma **restrição de unicidade no banco de dados**, não apenas validação na aplicação.
- **CA2** — Duas aprovações simultâneas para o mesmo espaço, data e faixa: uma sucede, a outra falha com mensagem clara.
- **CA3** — Reserva cancelada ou rejeitada libera o horário imediatamente.
- **CA4** — Existe teste de concorrência automatizado para este cenário.

#### E3.4 · Workflow de aprovação `RF07`
**Como** Administrador de Unidade, **quero** aprovar, rejeitar ou pedir ajuste **para** controlar o uso dos meus laboratórios.

- **CA1** — Nova solicitação gera aviso in-app para os gestores da unidade.
- **CA2** — Rejeição exige justificativa preenchida; sem ela a ação é bloqueada.
- **CA3** — Pedido de ajuste devolve a reserva ao docente no estado `AJUSTE_SOLICITADO`, editável.
- **CA4** — Toda mudança de estado gera aviso ao solicitante e registro de quem decidiu, quando e por quê.

#### E3.5 · Cancelamento `RF08`
**Como** docente ou gestor, **quero** cancelar uma reserva **para** liberar o espaço para outra turma.

- **CA1** — O horário é liberado na grade imediatamente após o cancelamento.
- **CA2** — O insumo reservado retorna ao saldo disponível.
- **CA3** — Fica registrado quem cancelou, quando e o motivo.

#### E3.6 · Antecedência mínima `RN01`
**Como** unidade, **quero** exigir prazo mínimo para reservas com insumo **para** dar tempo ao almoxarifado.

- **CA1** — Prazo em dias configurável por unidade.
- **CA2** — Aplicado apenas quando a solicitação inclui insumos.
- **CA3** — Ao bloquear, a mensagem informa a primeira data válida.

### E4 — Estoque e vínculo com a reserva

#### E4.1 · Catálogo de insumos `RF10`
**Como** gestor, **quero** um catálogo categorizado **para** padronizar a requisição dos docentes.

- **CA1** — Categorias: reagente, descartável, ferramenta, componente eletrônico, vidraria, EPI, outro.
- **CA2** — Cada insumo tem unidade de medida e preço unitário — o preço é o que viabiliza o relatório de custo (RF18).
- **CA3** — O catálogo é do grupo; o saldo é por unidade.

#### E4.2 · Saldo e entrada de estoque `RF10`
**Como** técnico, **quero** registrar entrada de material **para** manter o saldo fiel.

- **CA1** — Saldo mantido por par insumo × unidade.
- **CA2** — Toda entrada gera movimento com autor, quantidade e data.
- **CA3** — O saldo nunca é sobrescrito sem que o movimento correspondente seja gravado.

#### E4.3 · Reserva de insumo na aprovação `RF12`
**Como** gestor, **quero** que aprovar a reserva bloqueie o insumo **para** que ele não seja prometido duas vezes.

- **CA1** — Aprovação move a quantidade de disponível para reservado.
- **CA2** — Cancelamento ou rejeição devolve a quantidade ao disponível.
- **CA3** — Reserva de insumo e aprovação acontecem na mesma transação: se uma falha, nenhuma vale.

#### E4.4 · Validação de saldo disponível `RN02`
**Como** gestor, **quero** ser impedido de aprovar acima do saldo **para** não inviabilizar a aula.

- **CA1** — A validação bloqueia a **aprovação**, não a solicitação.
- **CA2** — Considera o saldo disponível na data da aula, já descontado o que outras reservas seguram.
- **CA3** — A mensagem informa o insumo em falta, o saldo atual e o solicitado.

#### E4.5 · Alerta de estoque mínimo `RF14`
**Como** gestor e técnico, **quero** ser avisado quando um insumo chega ao mínimo **para** repor a tempo.

- **CA1** — Quantidade mínima configurável por insumo e unidade.
- **CA2** — Painel de alertas com os itens no ou abaixo do mínimo.
- **CA3** — O alerta é reavaliado a cada movimento de estoque.

### E5 — Execução da aula

#### E5.1 · Check-in `RF09`
**Como** docente ou técnico, **quero** confirmar a realização da aula **para** registrar o uso efetivo do laboratório.

- **CA1** — Permitido de 30 minutos antes até o fim da faixa de horário. A janela é configurável.
- **CA2** — Reserva aprovada sem check-in até o fim do dia é marcada `NAO_REALIZADA`.
- **CA3** — O check-in registra o autor e o instante.

#### E5.2 · Baixa de estoque `RF13`
**Como** técnico, **quero** que o consumo seja baixado no check-in e possa ser corrigido **para** refletir o que foi realmente usado.

- **CA1** — O check-in converte a quantidade reservada em consumo efetivo.
- **CA2** — O consumo pode ser ajustado para mais ou para menos, com justificativa obrigatória na diferença.
- **CA3** — Todo ajuste gera movimento de estoque e entrada na trilha de auditoria.

### E6 — Manutenção e ocorrências

#### E6.1 · Equipamento inoperante `RF15`
**Como** técnico, **quero** sinalizar equipamento quebrado **para** impedir que o laboratório seja agendado sem ele.

- **CA1** — Marcar um equipamento **essencial** como inoperante bloqueia novas reservas do laboratório.
- **CA2** — Reservas já aprovadas não são apagadas: são sinalizadas ao gestor para decisão.
- **CA3** — O calendário mostra o laboratório como bloqueado, com o motivo.

#### E6.2 · Chamados de manutenção `RF16`
**Como** docente ou técnico, **quero** abrir chamado de reparo ou calibração **para** que o problema seja rastreado.

- **CA1** — Estados: aberto, em atendimento, resolvido, cancelado.
- **CA2** — Chamado pode ser vinculado a um equipamento ou ao laboratório.
- **CA3** — Fechar o chamado do último equipamento essencial inoperante libera o laboratório.

### E7 — Indicadores e exportação

#### E7.1 · Taxa de ocupação `RF17`
**Como** coordenação, **quero** ver o percentual de uso **para** decidir sobre investimento e realocação.

- **CA1** — Percentual por laboratório, curso, disciplina, turno e unidade.
- **CA2** — Período selecionável.
- **CA3** — Base de cálculo: faixas ocupadas por reserva realizada ÷ faixas disponíveis na grade.

#### E7.2 · Consumo e custo `RF18`
**Como** coordenação, **quero** o consumo de insumo por aula e por curso **para** calcular o custo da prática por aluno.

- **CA1** — Volume consumido agregado por aula, disciplina, curso e unidade.
- **CA2** — Custo derivado do preço unitário vigente do insumo.
- **CA3** — Custo por aluno = custo total da aula ÷ alunos previstos.

#### E7.3 · Exportação `RF20`
**Como** coordenação, **quero** exportar os relatórios **para** levar o dado a reuniões e a outras ferramentas.

- **CA1** — CSV e PDF de qualquer relatório.
- **CA2** — A exportação respeita exatamente os filtros aplicados na tela.
- **CA3** — Integração direta com ferramenta de BI está fora do MVP.

### E8 — Plataforma e conformidade

#### E8.1 · Responsividade `RNF03`
- **CA1** — Testado em 360px, 768px e 1280px.
- **CA2** — Nenhuma barra de rolagem horizontal no corpo da página.
- **CA3** — Alvos de toque com no mínimo 44px.

#### E8.2 · Trilha de auditoria `RNF04`
- **CA1** — Registra exclusão e cancelamento de reserva, ajuste manual de estoque, alteração de permissão, mudança de estado de equipamento e acesso negado.
- **CA2** — Cada entrada guarda usuário, ação, entidade afetada, data, hora e IP.
- **CA3** — A trilha é **somente inserção**: não há rota de edição nem de exclusão.

#### E8.3 · Conformidade com a LGPD `RNF05`
- **CA1** — Coleta mínima: nome, e-mail institucional, perfil e unidade.
- **CA2** — Senha com hash; nenhum dado pessoal em log de aplicação.
- **CA3** — Política de privacidade publicada e rota de exclusão de conta com anonimização do histórico.

---

## 9. Regras de negócio consolidadas

| ID | Regra | Onde é garantida |
|---|---|---|
| **RN01** | Reserva com insumo exige antecedência mínima em dias, configurável por unidade. | Serviço, na solicitação |
| **RN02** | Aprovação é bloqueada se a quantidade solicitada exceder o saldo disponível na data. | Serviço, em transação, na aprovação |
| **RN03** | Administrador de Unidade só vê e altera dados da própria unidade. | Middleware de escopo + teste automatizado |
| **RN04** | Apenas reservas nos estados `APROVADA` e `REALIZADA` ocupam o horário. `SOLICITADA` não bloqueia. | Restrição de unicidade no banco |
| **RN05** | Número de alunos previstos não pode exceder a capacidade do laboratório. | Serviço, na solicitação |
| **RN06** | Laboratório com equipamento essencial inoperante não aceita nova reserva. | Serviço, na solicitação e na aprovação |
| **RN07** | Rejeição e cancelamento exigem justificativa preenchida. | Validação de entrada |
| **RN08** | Saldo de estoque nunca muda sem movimento correspondente gravado. | Transação de banco |
| **RN09** | Reserva aprovada sem check-in até o fim do dia vira `NAO_REALIZADA`. | Rotina diária |

> **Nota de projeto sobre a RN04.** Deixar a solicitação pendente sem ocupar o horário permite que vários docentes concorram pelo mesmo espaço e o gestor escolha — mais realista que ordem de chegada. O custo é que o gestor precisa ver as solicitações concorrentes na tela de decisão, e aprovar uma delas deve rejeitar as demais na mesma transação. Isso é escopo da E3.4.

## 10. Requisitos não-funcionais

| ID | Requisito | Critério verificável no MVP |
|---|---|---|
| **RNF01** | Arquitetura multi-unidade | Nova unidade entra por cadastro, sem deploy |
| **RNF02** | SSO corporativo | *Fora do MVP.* Autenticação isolada atrás de interface |
| **RNF03** | Responsividade | Funciona de 360px a 1280px |
| **RNF04** | Trilha de auditoria | Ações críticas com usuário, data, hora e IP |
| **RNF05** | LGPD | Coleta mínima, hash de senha, política publicada |
| **RNF06** | Desempenho | Calendário da semana carrega em menos de 2s com 8 laboratórios e 500 reservas |
| **RNF07** | Disponibilidade do piloto | Ambiente publicado desde a Sprint 0, com deploy automático |

## 11. Modelo de domínio

### 11.1 Estados da reserva

```
SOLICITADA ──aprovar──> APROVADA ──check-in──> REALIZADA
    │  │                    │
    │  │                    └──cancelar──> CANCELADA
    │  │                    └──sem check-in até o fim do dia──> NAO_REALIZADA
    │  ├──rejeitar──> REJEITADA
    │  └──pedir ajuste──> AJUSTE_SOLICITADO ──reenviar──> SOLICITADA
    └──cancelar──> CANCELADA
```

Ocupam o horário: `APROVADA` e `REALIZADA`. Todos os demais estados liberam o slot.

### 11.2 Movimentos de estoque

| Tipo | Quando ocorre | Efeito no saldo |
|---|---|---|
| `ENTRADA` | Compra ou recebimento | Total ↑ |
| `RESERVA` | Aprovação da reserva | Reservado ↑ |
| `LIBERACAO_RESERVA` | Cancelamento ou rejeição | Reservado ↓ |
| `BAIXA` | Check-in da aula | Total ↓ e Reservado ↓ |
| `AJUSTE` | Correção manual com justificativa | Total ↑ ou ↓ |

Saldo disponível = total − reservado.

### 11.3 Entidades

Unidade · Bloco · Laboratorio · Equipamento · BlocoHorario · Usuario · Curso · Disciplina · Turma · Reserva · ReservaInsumo · Insumo · EstoqueItem · MovimentoEstoque · ChamadoManutencao · Notificacao · LogAuditoria

A implementação está em [`prisma/schema.prisma`](../prisma/schema.prisma).

## 12. Fora de escopo do produto

Não faz parte do SIGEL, nem no MVP nem na v2: gestão de matrícula ou nota, controle de ponto de docente, compra e cotação com fornecedor, reserva de sala de aula comum não laboratorial, aplicativo móvel nativo.

## 13. Dependências e premissas

- **Premissa** — o cadastro de cursos, disciplinas e turmas é alimentado manualmente no piloto; integração com o sistema acadêmico é v2.
- **Premissa** — o preço unitário do insumo é mantido pelo gestor da unidade; não há integração com compras.
- **Dependência** — banco de dados relacional com suporte a restrição de unicidade e transação. A RN04 e a RN08 não são implementáveis com segurança sem isso.
- **Dependência externa** — nenhuma. O SSO, único ponto de dependência de terceiros, foi deliberadamente removido do MVP.

## 14. Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Escopo aberto — tentativa de entregar os 20 RFs | Alto | Frase de aceite visível; troca de escopo só com item saindo |
| Integração adiada para o fim | Alto | Fatia vertical por sprint; nenhuma branch com mais de cinco dias |
| Concorrência mal resolvida na RN04 | Alto | Restrição no banco desde a Sprint 3 + teste de concorrência na DoD |
| `unidade_id` adicionado tarde | Médio | Presente no modelo desde a Sprint 1 |
| Disponibilidade desigual entre alunos | Médio | Rodízio de papéis, revisão cruzada, peso individual na avaliação |

## 15. Questões em aberto

| # | Questão | Responsável | Prazo |
|---|---|---|---|
| Q1 | Qual a antecedência mínima padrão em dias para reserva com insumo? | PO | Sprint 3 |
| Q2 | A janela de check-in de 30 minutos antes é adequada à realidade da UniBRAS? | PO + técnicos | Sprint 5 |
| Q3 | O custo por aluno usa alunos previstos ou presença efetiva? | PO | Sprint 6 |
| Q4 | Aprovar uma reserva deve rejeitar automaticamente as concorrentes ou apenas sinalizá-las? | PO | Sprint 3 |

## 16. Glossário

| Termo | Significado |
|---|---|
| **Unidade** | Campus ou faculdade da rede. Raiz do isolamento de dados. |
| **Faixa de horário** | Bloco agendável dentro de um turno, configurável por unidade. |
| **Slot** | Combinação de laboratório + data + faixa de horário. Unidade de conflito. |
| **Equipamento essencial** | Item sem o qual o laboratório não pode operar. |
| **Saldo reservado** | Quantidade comprometida com reservas aprovadas ainda não realizadas. |
| **Check-in** | Confirmação de que a aula prática de fato aconteceu. |
| **Slot key** | Chave derivada que materializa a trava anti-conflito no banco. |
