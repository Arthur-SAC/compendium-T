import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { PoderMecanica } from "@/lib/schema";

const ORDEM_GRUPOS = ["combate", "destino", "magia", "concedido", "tormenta"] as const;

const ROTULOS_GRUPO: Record<string, string> = {
  combate: "Combate",
  destino: "Destino",
  magia: "Magia",
  concedido: "Concedidos",
  tormenta: "Tormenta",
};

export default function IndicePoderes() {
  const entidades = carregarEntidades();
  const poderes = entidades.filter((e) => e.tipo === "poder");
  const regra = entidades.find((e) => e.id === "poderes-como-funcionam");

  // Agrupar por grupo
  const grupos: Record<string, typeof poderes> = {};
  for (const p of poderes) {
    const m = p.mecanica as unknown as PoderMecanica;
    const g = m.grupo ?? "outros";
    if (!grupos[g]) grupos[g] = [];
    grupos[g].push(p);
  }

  // Ordenar cada grupo por nome
  for (const g of Object.keys(grupos)) {
    grupos[g].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Poderes</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 12px", fontFamily: "var(--serifa)" }}>
          {poderes.length} {poderes.length === 1 ? "poder" : "poderes"} do Livro Básico
        </p>

        {regra && (
          <section style={{ background: "rgba(177,39,58,.06)", border: "1px solid var(--borda-suave)", borderRadius: 12, padding: "16px 20px", margin: "16px 0 28px" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--vermelho)", fontWeight: 700, marginBottom: 6 }}>Como funcionam os Poderes</div>
            <ul style={{ fontFamily: "var(--serifa)", color: "var(--tinta)", lineHeight: 1.6, fontSize: 14, margin: "0 0 10px", paddingLeft: 18 }}>
              <li>Poderes gerais podem ser escolhidos por <strong style={{ color: "var(--carmesim)" }}>qualquer personagem</strong>, independentemente de sua classe.</li>
              <li>Sempre que você recebe um <strong style={{ color: "var(--carmesim)" }}>poder de classe</strong>, pode trocá-lo por um poder geral.</li>
              <li>Cada poder pode ter <strong style={{ color: "var(--carmesim)" }}>pré-requisitos</strong> de atributo, perícia ou outro poder.</li>
            </ul>
            <Link href={`/ficha/${regra.tipo}/${regra.id}`} style={{ color: "var(--carmesim)", textDecoration: "none", fontFamily: "var(--serifa)", fontSize: 13, borderBottom: "1px solid var(--borda-suave)" }}>
              Ver as regras completas dos Poderes →
            </Link>
          </section>
        )}

        {ORDEM_GRUPOS.map((grupo) => {
          const lista = grupos[grupo];
          if (!lista || lista.length === 0) return null;
          return (
            <section key={grupo} style={{ marginBottom: 8 }}>
              <h3 className="indice-grupo-titulo" style={{ fontSize: 16 }}>{ROTULOS_GRUPO[grupo]} ({lista.length})</h3>
              <div className="indice-lista">
                {lista.map((p) => {
                  const m = p.mecanica as unknown as PoderMecanica;
                  return (
                    <Link key={p.id} href={`/ficha/poder/${p.id}`} className="indice-linha">
                      <span className="indice-nome">{p.nome}</span>
                      {m.prerequisito && <span className="indice-resumo">Pré-req.: {m.prerequisito}</span>}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
