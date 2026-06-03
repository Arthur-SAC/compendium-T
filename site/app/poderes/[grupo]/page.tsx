import Link from "next/link";
import { notFound } from "next/navigation";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import { SubNav } from "@/components/SubNav";
import type { Entidade, PoderMecanica } from "@/lib/schema";

export const dynamicParams = false;

const GRUPOS = [
  { slug: "combate", rotulo: "Combate" },
  { slug: "destino", rotulo: "Destino" },
  { slug: "magia", rotulo: "Magia" },
  { slug: "concedido", rotulo: "Concedidos" },
  { slug: "tormenta", rotulo: "Tormenta" },
];

function mec(p: Entidade): PoderMecanica {
  return p.mecanica as unknown as PoderMecanica;
}

export function generateStaticParams() {
  return GRUPOS.map((g) => ({ grupo: g.slug }));
}

export default async function PaginaGrupoPoderes({ params }: { params: Promise<{ grupo: string }> }) {
  const { grupo } = await params;
  const def = GRUPOS.find((g) => g.slug === grupo);
  if (!def) notFound();
  const lista = carregarEntidades()
    .filter((e) => e.tipo === "poder" && mec(e).grupo === grupo)
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 44, textAlign: "center" }}>Poderes de {def.rotulo}</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 18px", fontFamily: "var(--serifa)" }}>
          {lista.length} {lista.length === 1 ? "poder" : "poderes"}
        </p>
        <SubNav base="/poderes" itens={GRUPOS} atual={grupo} voltarRotulo="Todos os grupos" />

        <div className="indice-lista">
          {lista.map((p) => {
            const m = mec(p);
            return (
              <Link key={p.id} href={`/ficha/poder/${p.id}`} className="indice-linha">
                <span className="indice-nome">{p.nome}</span>
                {m.prerequisito && <span className="indice-meta">Pré-req.: {m.prerequisito}</span>}
                {p.resumo && <span className="indice-resumo">{p.resumo}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
