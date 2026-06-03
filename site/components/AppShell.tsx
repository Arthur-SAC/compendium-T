import { NavGlobal } from "./NavGlobal";
import { BarraContexto } from "./BarraContexto";
import type { Indice } from "@/lib/busca";

/** Casca de 3 colunas: nav global (esq.) · conteúdo (centro) · contexto + busca (dir.).
 *  O conteúdo mantém o estilo de cada página (índices na folha; fichas em pergaminho). */
export function AppShell({ children, indice }: { children: React.ReactNode; indice: Indice }) {
  return (
    <div className="app-shell">
      <NavGlobal />
      <div className="conteudo">{children}</div>
      <BarraContexto indice={indice} />
    </div>
  );
}
