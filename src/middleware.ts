import { NextResponse, type NextRequest } from "next/server";
import { NOME_COOKIE_SESSAO, verificarSessao } from "@/lib/sessao";

/**
 * Porteiro das rotas. PRD §8 E1.1 CA3 e E1.2 CA2.
 *
 * O middleware só decide "tem sessão válida?" — é a primeira barreira, não a
 * única. Cada rota continua responsável por conferir se AQUELE perfil pode
 * fazer AQUILO, e por filtrar os dados pela unidade (RN03). Confiar apenas
 * nesta camada deixaria qualquer autenticado ver tudo.
 *
 * Roda no runtime edge: nada de Prisma nem bcrypt aqui, só a verificação da
 * assinatura do token, que o `jose` faz com a Web Crypto API.
 */

const ROTAS_PROTEGIDAS = ["/painel"];
const ROTAS_DE_ENTRADA = ["/login"];

export async function middleware(requisicao: NextRequest) {
  const { pathname } = requisicao.nextUrl;
  const token = requisicao.cookies.get(NOME_COOKIE_SESSAO)?.value;
  const sessao = token ? await verificarSessao(token) : null;

  const ehProtegida = ROTAS_PROTEGIDAS.some(
    (rota) => pathname === rota || pathname.startsWith(`${rota}/`),
  );

  if (ehProtegida && !sessao) {
    const destino = new URL("/login", requisicao.url);
    // Guarda para onde a pessoa queria ir, para devolvê-la ao lugar certo.
    destino.searchParams.set("de", pathname);
    const resposta = NextResponse.redirect(destino);
    // Cookie expirado ou adulterado não deve sobreviver ao redirecionamento.
    if (token) resposta.cookies.delete(NOME_COOKIE_SESSAO);
    return resposta;
  }

  // Quem já entrou não precisa ver a tela de login de novo.
  if (ROTAS_DE_ENTRADA.includes(pathname) && sessao) {
    return NextResponse.redirect(new URL("/painel", requisicao.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
