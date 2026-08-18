import bcrypt from "bcryptjs";

/**
 * Hash e verificação de senha. PRD §8 E1.1 CA1 e §8 E8.3 CA2.
 *
 * Custo 12: cerca de 250 ms por verificação em hardware comum. Alto o
 * suficiente para tornar a força bruta cara, baixo o suficiente para não
 * virar um vetor de negação de serviço no login.
 */
const CUSTO_BCRYPT = 12;

export async function gerarHashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, CUSTO_BCRYPT);
}

export async function conferirSenha(
  senha: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}

/**
 * Hash descartável usado quando o e-mail informado não existe.
 *
 * Sem isso, o login responde muito mais rápido para e-mail inexistente do que
 * para e-mail válido com senha errada — e essa diferença de tempo permite
 * descobrir quem tem conta no sistema. Comparar contra um hash real iguala o
 * custo das duas respostas.
 */
const HASH_FALSO =
  "$2b$12$C6UzMDM.H6dfI/f/IKcEe.gLKtQnCV/3rB.oNPQx0mAr6MJ4CQwjS";

export async function consumirTempoDeVerificacao(senha: string): Promise<void> {
  await bcrypt.compare(senha, HASH_FALSO);
}
