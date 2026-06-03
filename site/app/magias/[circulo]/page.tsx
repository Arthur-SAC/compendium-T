import Link from "next/link";
import { notFound } from "next/navigation";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import { SubNav } from "@/components/SubNav";
import type { Entidade, MagiaMecanica } from "@/lib/schema";

export const dynamicParams = false;

const CIRCULOS = ["1", "2", "3", "4", "5"] as const;
const ORDINAL: Record<string, string> = { "1": "1º", "2": "2º", "3": "3º", "4": "4º", "5": "5º" };
const ORDEM_TIPOS = [
  { chave: "arcana", rotulo: "Arcanas" },
  { chave: "divina", rotulo: "Divinas" },
  { chave: "universal", rotulo: "Universais" },
];
const ITENS_NAV = CIRCULOS.map((c) => ({ slug: c, rotulo: `${ORDINAL[c]} Círculo` }));

function mec(m: Entidade): MagiaMecanica {
  return m.mecanica as unknown as MagiaMecanica;
}

export function generateStaticParams() {
  return CIRCULOS.map((circulo) => ({ circulo }));
}

export default async function PaginaCirculo({ params }: { params: Promise<{ circulo: string }> }) {
  const { circulo } = await params;
  if (!(CIRCULOS as readonly string[]).includes(circulo)) notFound();
  const c = Number(circulo);
  const magias = carregarEntidades()
    .filter((e) => e.tipo === "magia" && mec(e).circulo === c)
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 44, textAlign: "center" }}>{ORDINAL[circulo]} Círculo</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 18px", fontFamily: "var(--serifa)" }}>
          {magias.length} {magias.length === 1 ? "magia" : "magias"}
        </p>
        <SubNav base="/magias" itens={ITENS_NAV} atual={circulo} voltarRotulo="Todos os círculos" />

        {ORDEM_TIPOS.map(({ chave, rotulo }) => {
          const lista = magias.filter((m) => mec(m).tipo === chave);
          if (lista.length === 0) return null;
          return (
            <section key={chave} style={{ marginBottom: 8 }}>
              <h3 className="indice-grupo-titulo" style={{ fontSize: 14 }}>{rotulo} ({lista.length})</h3>
              <div className="indice-lista">
                {lista.map((m) => (
                  <Link key={m.id} href={`/ficha/magia/${m.id}`} className="indice-linha">
                    <span className="indice-nome">{m.nome}</span>
                    {mec(m).escola && <span className="indice-meta">{mec(m).escola}</span>}
                    {m.resumo && <span className="indice-resumo">{m.resumo}</span>}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
