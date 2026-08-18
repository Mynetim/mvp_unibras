"use client";

import { useActionState, useId, useState } from "react";
import { autenticar } from "./actions";
import { ESTADO_INICIAL_LOGIN } from "./estado";

export function FormularioLogin({ destino }: { destino?: string }) {
  const [estado, acao, pendente] = useActionState(
    autenticar,
    ESTADO_INICIAL_LOGIN,
  );
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const idEmail = useId();
  const idSenha = useId();
  const idErroEmail = `${idEmail}-erro`;
  const idErroSenha = `${idSenha}-erro`;

  return (
    <form action={acao} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="destino" value={destino ?? ""} />

      {estado.falha ? (
        <p
          role="alert"
          className="border-l-2 border-danger bg-danger-soft px-4 py-3 text-sm text-ink-2"
        >
          {estado.falha}
        </p>
      ) : null}

      {estado.sucesso ? (
        <p
          role="status"
          className="border-l-2 border-teal bg-surface-2 px-4 py-3 text-sm text-ink-2"
        >
          {estado.sucesso}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label
          htmlFor={idEmail}
          className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-3"
        >
          E-mail institucional
        </label>
        <input
          id={idEmail}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoFocus
          defaultValue={estado.email}
          placeholder="nome@unibras.edu.br"
          aria-invalid={estado.erros.email ? true : undefined}
          aria-describedby={estado.erros.email ? idErroEmail : undefined}
          className="min-h-11 border border-rule bg-surface px-3 py-2.5 text-ink placeholder:text-ink-3/70 transition-colors focus:border-accent aria-[invalid]:border-danger"
        />
        {estado.erros.email ? (
          <p id={idErroEmail} role="alert" className="text-sm text-danger">
            {estado.erros.email}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={idSenha}
          className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-3"
        >
          Senha
        </label>
        <div className="relative">
          <input
            id={idSenha}
            name="senha"
            type={senhaVisivel ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={estado.erros.senha ? true : undefined}
            aria-describedby={estado.erros.senha ? idErroSenha : undefined}
            className="min-h-11 w-full border border-rule bg-surface py-2.5 pl-3 pr-24 text-ink transition-colors focus:border-accent aria-[invalid]:border-danger"
          />
          <button
            type="button"
            onClick={() => setSenhaVisivel((v) => !v)}
            aria-pressed={senhaVisivel}
            className="absolute inset-y-0 right-0 px-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-3 transition-colors hover:text-accent"
          >
            {senhaVisivel ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {estado.erros.senha ? (
          <p id={idErroSenha} role="alert" className="text-sm text-danger">
            {estado.erros.senha}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pendente}
        className="min-h-11 bg-accent px-5 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pendente ? "Entrando…" : "Entrar"}
      </button>

      <p className="text-sm text-ink-3">
        Esqueceu a senha? Procure o administrador da sua unidade — a
        recuperação por e-mail ainda não faz parte do piloto.
      </p>
    </form>
  );
}
