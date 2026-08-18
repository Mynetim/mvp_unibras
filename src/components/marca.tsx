/**
 * Marca do SIGEL.
 *
 * O símbolo é uma grade 3×3 com uma célula preenchida: o slot ocupado —
 * a unidade de conflito do sistema (PRD §16, glossário). O vocabulário do
 * produto vira o desenho da marca, em vez de um ícone genérico de laboratório.
 */
export function SimboloSigel({ className }: { className?: string }) {
  const celulas = [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ];
  const ocupada = [1, 1];

  return (
    <svg
      viewBox="0 0 34 34"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {celulas.map(([x, y]) => {
        const estaOcupada = x === ocupada[0] && y === ocupada[1];
        return (
          <rect
            key={`${x}-${y}`}
            x={1 + x * 11}
            y={1 + y * 11}
            width="10"
            height="10"
            rx="1.5"
            fill={estaOcupada ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            opacity={estaOcupada ? 1 : 0.45}
          />
        );
      })}
    </svg>
  );
}

export function Marca({
  className = "",
  tamanho = "md",
}: {
  className?: string;
  tamanho?: "sm" | "md";
}) {
  const escala = tamanho === "sm" ? "size-6" : "size-8";
  const texto = tamanho === "sm" ? "text-xl" : "text-2xl";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <SimboloSigel className={`${escala} text-accent`} />
      <span
        className={`font-display ${texto} font-semibold tracking-[0.18em] leading-none`}
      >
        SIGEL
      </span>
    </span>
  );
}
