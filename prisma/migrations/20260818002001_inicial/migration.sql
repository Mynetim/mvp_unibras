-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('MASTER', 'ADMIN_UNIDADE', 'DOCENTE', 'TECNICO');

-- CreateEnum
CREATE TYPE "AreaConhecimento" AS ENUM ('SAUDE', 'TECNOLOGIA', 'ENGENHARIAS', 'CIENCIAS_EXATAS', 'CIENCIAS_AGRARIAS', 'CIENCIAS_HUMANAS', 'OUTRA');

-- CreateEnum
CREATE TYPE "Turno" AS ENUM ('MATUTINO', 'VESPERTINO', 'NOTURNO');

-- CreateEnum
CREATE TYPE "StatusReserva" AS ENUM ('SOLICITADA', 'AJUSTE_SOLICITADO', 'APROVADA', 'REJEITADA', 'CANCELADA', 'REALIZADA', 'NAO_REALIZADA');

-- CreateEnum
CREATE TYPE "StatusEquipamento" AS ENUM ('OPERANTE', 'EM_MANUTENCAO', 'INOPERANTE', 'BAIXADO');

-- CreateEnum
CREATE TYPE "CategoriaInsumo" AS ENUM ('REAGENTE', 'DESCARTAVEL', 'FERRAMENTA', 'COMPONENTE_ELETRONICO', 'VIDRARIA', 'EPI', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoMovimento" AS ENUM ('ENTRADA', 'RESERVA', 'LIBERACAO_RESERVA', 'BAIXA', 'AJUSTE');

-- CreateEnum
CREATE TYPE "StatusChamado" AS ENUM ('ABERTO', 'EM_ATENDIMENTO', 'RESOLVIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "PrioridadeChamado" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "TipoNotificacao" AS ENUM ('RESERVA_SOLICITADA', 'RESERVA_APROVADA', 'RESERVA_REJEITADA', 'RESERVA_AJUSTE_SOLICITADO', 'RESERVA_CANCELADA', 'ESTOQUE_MINIMO', 'CHAMADO_ABERTO', 'CHAMADO_RESOLVIDO', 'LABORATORIO_BLOQUEADO');

-- CreateEnum
CREATE TYPE "AcaoAuditoria" AS ENUM ('RESERVA_CANCELADA', 'RESERVA_EXCLUIDA', 'ESTOQUE_AJUSTADO', 'PERMISSAO_ALTERADA', 'EQUIPAMENTO_ESTADO_ALTERADO', 'ACESSO_NEGADO', 'USUARIO_CRIADO', 'USUARIO_DESATIVADO');

-- CreateTable
CREATE TABLE "unidades" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "antecedenciaMinimaDias" INTEGER NOT NULL DEFAULT 3,
    "janelaCheckinMinutos" INTEGER NOT NULL DEFAULT 30,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocos" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratorios" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "blocoId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "area" "AreaConhecimento" NOT NULL,
    "capacidadeMaxima" INTEGER NOT NULL,
    "regrasDeUso" TEXT,
    "episObrigatorios" TEXT[],
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "bloqueado" BOOLEAN NOT NULL DEFAULT false,
    "motivoBloqueio" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laboratorios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipamentos" (
    "id" TEXT NOT NULL,
    "laboratorioId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "patrimonio" TEXT,
    "status" "StatusEquipamento" NOT NULL DEFAULT 'OPERANTE',
    "essencial" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocos_horario" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "turno" "Turno" NOT NULL,
    "ordem" INTEGER NOT NULL,
    "horaInicio" VARCHAR(5) NOT NULL,
    "horaFim" VARCHAR(5) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "blocos_horario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "tentativasLogin" INTEGER NOT NULL DEFAULT 0,
    "bloqueadoAte" TIMESTAMP(3),
    "ultimoAcessoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplinas" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "periodo" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turmas" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "identificacao" TEXT NOT NULL,
    "semestreLetivo" TEXT NOT NULL,
    "qtdAlunos" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "laboratorioId" TEXT NOT NULL,
    "blocoHorarioId" TEXT NOT NULL,
    "disciplinaId" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "solicitanteId" TEXT NOT NULL,
    "data" DATE NOT NULL,
    "qtdAlunosPrevistos" INTEGER NOT NULL,
    "observacoes" TEXT,
    "status" "StatusReserva" NOT NULL DEFAULT 'SOLICITADA',
    "slotKey" TEXT,
    "decisorId" TEXT,
    "decididoEm" TIMESTAMP(3),
    "justificativa" TEXT,
    "checkinPorId" TEXT,
    "checkinEm" TIMESTAMP(3),
    "canceladoEm" TIMESTAMP(3),
    "motivoCancelamento" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva_insumos" (
    "id" TEXT NOT NULL,
    "reservaId" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "qtdSolicitada" DECIMAL(12,3) NOT NULL,
    "qtdReservada" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "qtdConsumida" DECIMAL(12,3),
    "justificativaAjuste" TEXT,
    "precoUnitarioNoConsumo" DECIMAL(12,2),

    CONSTRAINT "reserva_insumos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insumos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" "CategoriaInsumo" NOT NULL,
    "unidadeMedida" TEXT NOT NULL,
    "precoUnitario" DECIMAL(12,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insumos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estoque_itens" (
    "id" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "saldoTotal" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "saldoReservado" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "quantidadeMinima" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "localizacao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estoque_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentos_estoque" (
    "id" TEXT NOT NULL,
    "estoqueItemId" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "reservaId" TEXT,
    "tipo" "TipoMovimento" NOT NULL,
    "quantidade" DECIMAL(12,3) NOT NULL,
    "justificativa" TEXT,
    "saldoTotalApos" DECIMAL(12,3) NOT NULL,
    "saldoReservadoApos" DECIMAL(12,3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentos_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chamados_manutencao" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "laboratorioId" TEXT NOT NULL,
    "equipamentoId" TEXT,
    "solicitanteId" TEXT NOT NULL,
    "responsavelId" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "StatusChamado" NOT NULL DEFAULT 'ABERTO',
    "prioridade" "PrioridadeChamado" NOT NULL DEFAULT 'MEDIA',
    "resolvidoEm" TIMESTAMP(3),
    "solucaoAplicada" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chamados_manutencao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "tipo" "TipoNotificacao" NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "link" TEXT,
    "lidaEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_auditoria" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "unidadeId" TEXT,
    "acao" "AcaoAuditoria" NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" TEXT,
    "dadosAntes" JSONB,
    "dadosDepois" JSONB,
    "ip" VARCHAR(45),
    "userAgent" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unidades_codigo_key" ON "unidades"("codigo");

-- CreateIndex
CREATE INDEX "blocos_unidadeId_idx" ON "blocos"("unidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "blocos_unidadeId_nome_key" ON "blocos"("unidadeId", "nome");

-- CreateIndex
CREATE INDEX "laboratorios_unidadeId_area_idx" ON "laboratorios"("unidadeId", "area");

-- CreateIndex
CREATE INDEX "laboratorios_blocoId_idx" ON "laboratorios"("blocoId");

-- CreateIndex
CREATE UNIQUE INDEX "laboratorios_unidadeId_codigo_key" ON "laboratorios"("unidadeId", "codigo");

-- CreateIndex
CREATE INDEX "equipamentos_laboratorioId_status_idx" ON "equipamentos"("laboratorioId", "status");

-- CreateIndex
CREATE INDEX "blocos_horario_unidadeId_turno_ordem_idx" ON "blocos_horario"("unidadeId", "turno", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "blocos_horario_unidadeId_turno_horaInicio_key" ON "blocos_horario"("unidadeId", "turno", "horaInicio");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_unidadeId_perfil_idx" ON "usuarios"("unidadeId", "perfil");

-- CreateIndex
CREATE INDEX "cursos_unidadeId_idx" ON "cursos"("unidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_unidadeId_codigo_key" ON "cursos"("unidadeId", "codigo");

-- CreateIndex
CREATE INDEX "disciplinas_cursoId_idx" ON "disciplinas"("cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "disciplinas_unidadeId_codigo_key" ON "disciplinas"("unidadeId", "codigo");

-- CreateIndex
CREATE INDEX "turmas_unidadeId_idx" ON "turmas"("unidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "turmas_unidadeId_cursoId_identificacao_semestreLetivo_key" ON "turmas"("unidadeId", "cursoId", "identificacao", "semestreLetivo");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_slotKey_key" ON "reservas"("slotKey");

-- CreateIndex
CREATE INDEX "reservas_laboratorioId_data_idx" ON "reservas"("laboratorioId", "data");

-- CreateIndex
CREATE INDEX "reservas_unidadeId_status_data_idx" ON "reservas"("unidadeId", "status", "data");

-- CreateIndex
CREATE INDEX "reservas_laboratorioId_data_blocoHorarioId_status_idx" ON "reservas"("laboratorioId", "data", "blocoHorarioId", "status");

-- CreateIndex
CREATE INDEX "reservas_disciplinaId_data_idx" ON "reservas"("disciplinaId", "data");

-- CreateIndex
CREATE INDEX "reservas_solicitanteId_idx" ON "reservas"("solicitanteId");

-- CreateIndex
CREATE INDEX "reserva_insumos_insumoId_idx" ON "reserva_insumos"("insumoId");

-- CreateIndex
CREATE UNIQUE INDEX "reserva_insumos_reservaId_insumoId_key" ON "reserva_insumos"("reservaId", "insumoId");

-- CreateIndex
CREATE UNIQUE INDEX "insumos_codigo_key" ON "insumos"("codigo");

-- CreateIndex
CREATE INDEX "insumos_categoria_idx" ON "insumos"("categoria");

-- CreateIndex
CREATE INDEX "estoque_itens_unidadeId_idx" ON "estoque_itens"("unidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "estoque_itens_insumoId_unidadeId_key" ON "estoque_itens"("insumoId", "unidadeId");

-- CreateIndex
CREATE INDEX "movimentos_estoque_estoqueItemId_criadoEm_idx" ON "movimentos_estoque"("estoqueItemId", "criadoEm");

-- CreateIndex
CREATE INDEX "movimentos_estoque_unidadeId_tipo_criadoEm_idx" ON "movimentos_estoque"("unidadeId", "tipo", "criadoEm");

-- CreateIndex
CREATE INDEX "movimentos_estoque_reservaId_idx" ON "movimentos_estoque"("reservaId");

-- CreateIndex
CREATE INDEX "chamados_manutencao_unidadeId_status_idx" ON "chamados_manutencao"("unidadeId", "status");

-- CreateIndex
CREATE INDEX "chamados_manutencao_laboratorioId_status_idx" ON "chamados_manutencao"("laboratorioId", "status");

-- CreateIndex
CREATE INDEX "chamados_manutencao_equipamentoId_idx" ON "chamados_manutencao"("equipamentoId");

-- CreateIndex
CREATE INDEX "notificacoes_usuarioId_lidaEm_criadoEm_idx" ON "notificacoes"("usuarioId", "lidaEm", "criadoEm");

-- CreateIndex
CREATE INDEX "logs_auditoria_unidadeId_criadoEm_idx" ON "logs_auditoria"("unidadeId", "criadoEm");

-- CreateIndex
CREATE INDEX "logs_auditoria_entidade_entidadeId_idx" ON "logs_auditoria"("entidade", "entidadeId");

-- CreateIndex
CREATE INDEX "logs_auditoria_usuarioId_criadoEm_idx" ON "logs_auditoria"("usuarioId", "criadoEm");

-- AddForeignKey
ALTER TABLE "blocos" ADD CONSTRAINT "blocos_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratorios" ADD CONSTRAINT "laboratorios_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratorios" ADD CONSTRAINT "laboratorios_blocoId_fkey" FOREIGN KEY ("blocoId") REFERENCES "blocos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamentos" ADD CONSTRAINT "equipamentos_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "laboratorios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocos_horario" ADD CONSTRAINT "blocos_horario_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplinas" ADD CONSTRAINT "disciplinas_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplinas" ADD CONSTRAINT "disciplinas_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "laboratorios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_blocoHorarioId_fkey" FOREIGN KEY ("blocoHorarioId") REFERENCES "blocos_horario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_decisorId_fkey" FOREIGN KEY ("decisorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_checkinPorId_fkey" FOREIGN KEY ("checkinPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_insumos" ADD CONSTRAINT "reserva_insumos_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_insumos" ADD CONSTRAINT "reserva_insumos_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "insumos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque_itens" ADD CONSTRAINT "estoque_itens_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "insumos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque_itens" ADD CONSTRAINT "estoque_itens_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "movimentos_estoque_estoqueItemId_fkey" FOREIGN KEY ("estoqueItemId") REFERENCES "estoque_itens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "movimentos_estoque_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "insumos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "movimentos_estoque_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "movimentos_estoque_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentos_estoque" ADD CONSTRAINT "movimentos_estoque_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamados_manutencao" ADD CONSTRAINT "chamados_manutencao_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamados_manutencao" ADD CONSTRAINT "chamados_manutencao_laboratorioId_fkey" FOREIGN KEY ("laboratorioId") REFERENCES "laboratorios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamados_manutencao" ADD CONSTRAINT "chamados_manutencao_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "equipamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamados_manutencao" ADD CONSTRAINT "chamados_manutencao_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamados_manutencao" ADD CONSTRAINT "chamados_manutencao_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
