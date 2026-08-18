/**
 * Estado do formulário de login.
 *
 * Mora fora de `actions.ts` de propósito: um módulo marcado com `"use server"`
 * só pode exportar funções assíncronas. Exportar de lá um objeto — como o
 * estado inicial — não gera erro de compilação, mas o valor chega `undefined`
 * no cliente e a tela quebra na renderização. Tipos podem ficar no módulo de
 * ação, porque somem na compilação; valores, não.
 */

export type EstadoLogin = {
  erros: { email?: string; senha?: string };
  /** Falha de autenticação ou indisponibilidade. Renderizado como erro. */
  falha: string | null;
  /** Confirmação de identidade. Renderizada como sucesso. */
  sucesso: string | null;
  /** Preservado para o campo não esvaziar quando a validação falha. */
  email: string;
};

export const ESTADO_INICIAL_LOGIN: EstadoLogin = {
  erros: {},
  falha: null,
  sucesso: null,
  email: "",
};
