import { NavGlobal } from "./NavGlobal";
import { BarraContexto } from "./BarraContexto";

/** Casca de 3 colunas: nav global (esq.) · conteúdo (centro) · contexto (dir.).
 *  O conteúdo mantém o estilo de cada página (índices na casca; fichas em pergaminho).
 *  Páginas que quiserem o fundo "Página de Livro" usam a classe .pagina-pergaminho. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <NavGlobal />
      <div className="conteudo">{children}</div>
      <BarraContexto />
    </div>
  );
}
