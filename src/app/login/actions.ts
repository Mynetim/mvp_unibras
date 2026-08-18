"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { conferirSenha, consumirTempoDeVerificacao } from "@/lib/senha";
import { criarSessao } from "@/lib/sessao";
import type { EstadoLogin } from "./estado";

/**
 * PRD §8 E1.1 — autenticação.
 *
 * Este módulo só exporta funções assíncronas — restrição do `"use server"`.
 * O estado inicial vive em `./estado`.
 */

/** CA2 — bloqueio após cinco tentativas malsucedidas. */
const TENTATIVAS_ATE_BLOQUEIO = 5;
const MINUTOS_DE_BLOQUEIO = 15;

/**
 * O login confere identidade; não é o lugar de exigir composição de senha.
 * Regra de tamanho mínimo pertence ao fluxo de DEFINIR senha — aqui ela só
 * vazaria a política para quem ainda não autenticou e travaria quem tem
 * senha antiga.
 */
const esquemaLogin = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Informe seu e-mail institucional.")
    .pipe(z.email("Digite um e-mail válido, como nome@unibras.edu.br.")),
  senha: z.string().min(1, "Informe sua senha."),
  destino: z.string().optional(),
});

/** Mesma resposta para e-mail inexistente e para senha errada: quem não
 *  autenticou não descobre quem tem conta no sistema. */
const CREDENCIAL_INVALIDA = "E-mail ou senha incorretos.";

export async function autenticar(
  _estadoAnterior: EstadoLogin,
  dados: FormData,
): Promise<EstadoLogin> {
  const email = String(dados.get("email") ?? "");
  const senha = String(dados.get("senha") ?? "");
  const destinoBruto = String(dados.get("destino") ?? "");
  const base = { erros: {}, falha: null, sucesso: null, email };

  const resultado = esquemaLogin.safeParse({ email, senha, destino: destinoBruto });

  if (!resultado.success) {
    const erros: EstadoLogin["erros"] = {};
    for (const problema of resultado.error.issues) {
      const campo = problema.path[0];
      if (campo === "email" && !erros.email) erros.email = problema.message;
      if (campo === "senha" && !erros.senha) erros.senha = problema.message;
    }
    return { ...base, erros };
  }

  const credencial = resultado.data;

  // O redirecionamento precisa acontecer FORA do try: `redirect()` sinaliza
  // lançando uma exceção especial, e um catch genérico a engoliria — o usuário
  // autenticaria e continuaria parado na tela de login.
  let autenticou = false;
  let falha: string | null = null;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email: credencial.email },
      include: { unidade: { select: { id: true, nome: true } } },
    });

    if (!usuario || !usuario.ativo) {
      // Gasta o mesmo tempo de uma verificação real, para que a demora da
      // resposta não denuncie a existência da conta.
      await consumirTempoDeVerificacao(credencial.senha);
      falha = CREDENCIAL_INVALIDA;
    } else if (usuario.bloqueadoAte && usuario.bloqueadoAte > new Date()) {
      const minutos = Math.max(
        1,
        Math.ceil((usuario.bloqueadoAte.getTime() - Date.now()) / 60_000),
      );
      falha = `Conta bloqueada por tentativas seguidas. Tente de novo em ${minutos} min.`;
    } else if (!(await conferirSenha(credencial.senha, usuario.senhaHash))) {
      const tentativas = usuario.tentativasLogin + 1;
      const atingiuLimite = tentativas >= TENTATIVAS_ATE_BLOQUEIO;

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          tentativasLogin: atingiuLimite ? 0 : tentativas,
          bloqueadoAte: atingiuLimite
            ? new Date(Date.now() + MINUTOS_DE_BLOQUEIO * 60_000)
            : null,
        },
      });

      falha = atingiuLimite
        ? `Conta bloqueada por ${MINUTOS_DE_BLOQUEIO} minutos após ${TENTATIVAS_ATE_BLOQUEIO} tentativas.`
        : CREDENCIAL_INVALIDA;
    } else {
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          tentativasLogin: 0,
          bloqueadoAte: null,
          ultimoAcessoEm: new Date(),
        },
      });

      await criarSessao({
        usuarioId: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        unidadeId: usuario.unidade?.id ?? null,
        unidadeNome: usuario.unidade?.nome ?? null,
      });

      autenticou = true;
    }
  } catch (erro) {
    // Nunca vaza detalhe de infraestrutura para a tela; o diagnóstico fica no
    // log do servidor.
    console.error("[login] falha ao autenticar:", erro);
    falha =
      "Não foi possível conectar ao banco de dados. Confira a DATABASE_URL e se o banco está no ar.";
  }

  if (autenticou) {
    // Só aceita caminho interno: um destino como "https://site-falso" viraria
    // redirecionamento aberto, usado para phishing logo após o login legítimo.
    const destino =
      credencial.destino?.startsWith("/") && !credencial.destino.startsWith("//")
        ? credencial.destino
        : "/painel";
    redirect(destino);
  }

  return { ...base, falha };
}
