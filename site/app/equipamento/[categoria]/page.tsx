import Link from "next/link";
import { notFound } from "next/navigation";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import { SubNav } from "@/components/SubNav";
import { CATEGORIAS_EQUIP, statsDoItem } from "@/lib/equipamento-categorias";
import type { Entidade, ItemMecanica } from "@/lib/schema";

export const dynamicParams = false;

const ITENS_NAV = CATEGORIAS_EQUIP.map((c) => ({ slug: c.slug, rotulo: c.rotulo }));

function mec(it: Entidade): ItemMecanica {
  return it.mecanica as unknown as ItemMecanica;
}

export function generateStaticParams() {
  return CATEGORIAS_EQUIP.map((c) => ({ categoria: c.slug }));
}

function LinhaItem({ it }: { it: Entidade }) {
  const m = mec(it);
  const stats = statsDoItem(m);
  const habilidades = m.arma?.habilidades ?? [];
  return (
    <Link href={`/ficha/item/${it.id}`} className="indice-linha" style={{ alignItems: "flex-start" }}>
      <span className="indice-nome" style={{ paddingTop: 1 }}>{it.nome}</span>
      <span style={{ flex: "1 1 auto", minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        {stats.length > 0 && (
          <span style={{ fontFamily: "var(--serifa)", fontSize: 12.5, color: "var(--vermelho)" }}>{stats.join(" · ")}</span>
        )}
        {it.resumo && (
          <span style={{ fontFamily: "var(--serifa)", fontSize: 13, color: "var(--tinta-suave)", lineHeight: 1.4 }}>{it.resumo}</span>
        )}
        {habilidades.length > 0 && (
          <span style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 1 }}>
            {habilidades.map((h, i) => (
              <span key={i} style={{ fontFamily: "var(--serifa)", fontSize: 11, color: "var(--carmesim)", border: "1px solid var(--borda-suave)", borderRadius: 8, padding: "1px 8px" }}>{h}</span>
            ))}
          </span>
        )}
      </span>
    </Link>
  );
}

export default async function PaginaCategoriaEquip({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const def = CATEGORIAS_EQUIP.find((c) => c.slug === categoria);
  if (!def) notFound();
  const ordenar = (a: Entidade, b: Entidade) => a.nome.localeCompare(b.nome, "pt-BR");
  const lista = carregarEntidades()
    .filter((e) => e.tipo === "item" && def.chaves.includes(mec(e).categoria ?? "outros"))
    .sort(ordenar);

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 44, textAlign: "center" }}>{def.rotulo}</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 18px", fontFamily: "var(--serifa)" }}>
          {lista.length} {lista.length === 1 ? "item" : "itens"}
        </p>
        <SubNav base="/equipamento" itens={ITENS_NAV} atual={categoria} voltarRotulo="Todas as categorias" />

        {def.subgrupos ? (
          def.subgrupos.map((sg) => {
            const sublista = lista.filter((it) => sg.filtro(mec(it)));
            if (sublista.length === 0) return null;
            return (
              <section key={sg.rotulo} style={{ marginBottom: 8 }}>
                <h3 className="indice-grupo-titulo" style={{ fontSize: 14 }}>{sg.rotulo} ({sublista.length})</h3>
                <div className="indice-lista">
                  {sublista.map((it) => <LinhaItem key={it.id} it={it} />)}
                </div>
              </section>
            );
          })
        ) : (
          <div className="indice-lista">
            {lista.map((it) => <LinhaItem key={it.id} it={it} />)}
          </div>
        )}
      </div>
    </main>
  );
}
