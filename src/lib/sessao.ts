import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Sessão do usuário. PRD §8 E1.1 CA3 — expira em 8 horas.
 *
 * A sessão é um JWT assinado guardado em cookie httpOnly. Assinado, não
 * criptografado: o conteúdo é legível por quem tiver o cookie, então guarda
 * só identificação e escopo — nunca senha, hash ou dado pessoal sensível.
 *
 * O que impede adulteração é a assinatura: trocar o perfil para MASTER no
 * payload invalida o token. Ainda assim, toda rota confere a permissão no
 * servidor (E1.2 CA2); o cookie diz quem é a pessoa, não o que ela pode.
 */

export const NOME_COOKIE_SESSAO = "sigel_sessao";
const DURACAO_HORAS = 8;

export type Sessao = {
  usuarioId: string;
  nome: string;
  email: string;
  perfil: string;
  unidadeId: string | null;
  unidadeNome: string | null;
};

/**
 * Lê o segredo de assinatura. Falha alto e cedo se estiver ausente ou fraco —
 * um segredo curto torna a assinatura quebrável por força bruta, e um erro
 * silencioso aqui viraria uma falha de autenticação em produção.
 */
export function segredoDaSessao(): Uint8Array {
  const segredo = process.env.SESSION_SECRET;
  if (!segredo || segredo.length < 32) {
    throw new Error(
      "SESSION_SECRET ausente ou com menos de 32 caracteres. Gere um com: node -e \"console.log(require('crypto').randomBytes(48).toString('base64url'))\"",
    );
  }
  return new TextEncoder().encode(segredo);
}

export async function assinarSessao(dados: Sessao): Promise<string> {
  return new SignJWT({ ...dados })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACAO_HORAS}h`)
    .sign(segredoDaSessao());
}

export async function verificarSessao(token: string): Promise<Sessao | null> {
  try {
    const { payload } = await jwtVerify(token, segredoDaSessao());
    return {
      usuarioId: String(payload.usuarioId),
      nome: String(payload.nome),
      email: String(payload.email),
      perfil: String(payload.perfil),
      unidadeId: payload.unidadeId ? String(payload.unidadeId) : null,
      unidadeNome: payload.unidadeNome ? String(payload.unidadeNome) : null,
    };
  } catch {
    // Token expirado, adulterado ou assinado com outro segredo.
    return null;
  }
}

export async function criarSessao(dados: Sessao): Promise<void> {
  const token = await assinarSessao(dados);
  const armazem = await cookies();

  armazem.set(NOME_COOKIE_SESSAO, token, {
    httpOnly: true, // JavaScript da página não alcança o cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // barra o envio em requisição de outro site
    path: "/",
    maxAge: DURACAO_HORAS * 60 * 60,
  });
}

export async function lerSessao(): Promise<Sessao | null> {
  const armazem = await cookies();
  const token = armazem.get(NOME_COOKIE_SESSAO)?.value;
  if (!token) return null;
  return verificarSessao(token);
}

export async function encerrarSessao(): Promise<void> {
  const armazem = await cookies();
  armazem.delete(NOME_COOKIE_SESSAO);
}
