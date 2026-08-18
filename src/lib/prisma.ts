import { PrismaClient } from "@prisma/client";

/**
 * Cliente único do Prisma.
 *
 * Em desenvolvimento o Next recarrega os módulos a cada alteração. Sem guardar
 * a instância no escopo global, cada recarga abriria um novo pool de conexões
 * até o Postgres recusar novas ligações.
 */
const globalParaPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalParaPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}
