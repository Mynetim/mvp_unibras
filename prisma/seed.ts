import { PrismaClient, PerfilUsuario } from "@prisma/client";
import { gerarHashSenha } from "../src/lib/senha";

/**
 * Semente do banco.
 *
 * Idempotente: roda quantas vezes for preciso sem duplicar registro. As
 * credenciais vêm do ambiente, nunca do código — Definition of Done, "nenhuma
 * senha, chave ou string de conexão dentro do repositório".
 */
const prisma = new PrismaClient();

function exigir(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(
      `Variável ${nome} não definida. Copie .env.example para .env e preencha antes de rodar a semente.`,
    );
  }
  return valor;
}

async function main() {
  const emailAdmin = exigir("SEED_ADMIN_EMAIL").toLowerCase().trim();
  const senhaAdmin = exigir("SEED_ADMIN_SENHA");

  // Unidade-sede do piloto. O Administrador Master enxerga a rede inteira
  // (unidadeId nulo), mas sem ao menos uma unidade não há o que administrar.
  const unidade = await prisma.unidade.upsert({
    where: { codigo: "MTB" },
    update: {},
    create: {
      codigo: "MTB",
      nome: "UniBRAS Montes Belos",
      cidade: "São Luís de Montes Belos",
      uf: "GO",
    },
  });

  const admin = await prisma.usuario.upsert({
    where: { email: emailAdmin },
    update: {
      perfil: PerfilUsuario.MASTER,
      ativo: true,
      senhaHash: await gerarHashSenha(senhaAdmin),
    },
    create: {
      email: emailAdmin,
      nome: "Guilherme Nogueira de Jesus",
      perfil: PerfilUsuario.MASTER,
      senhaHash: await gerarHashSenha(senhaAdmin),
      // MASTER não pertence a uma unidade: a visão é do grupo (PRD §5).
      unidadeId: null,
    },
  });

  console.log(`✓ Unidade  ${unidade.codigo} — ${unidade.nome}`);
  console.log(`✓ Usuário  ${admin.email} — perfil ${admin.perfil}`);
}

main()
  .catch((erro) => {
    console.error("Falha ao semear o banco:", erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
