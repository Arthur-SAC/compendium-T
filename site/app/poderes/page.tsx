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
    <main style={{ padding: 48, maxWidth: 1060, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Poderes</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 12px", fontFamily: "var(--serifa)" }}>
        {poderes.length} {poderes.length === 1 ? "poder" : "poderes"} do Livro Básico
      </p>

      {regra && (
        <section style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, padding: "16px 20px", margin: "0 0 28px", boxShadow: "0 10px 28px rgba(0,0,0,.4)" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700, marginBottom: 6 }}>Como funcionam os Poderes</div>
          <ul style={{ fontFamily: "var(--serifa)", color: "var(--tinta)", lineHeight: 1.6, fontSize: 14, margin: "0 0 10px", paddingLeft: 18 }}>
            <li>Poderes gerais podem ser escolhidos por <strong style={{ color: "var(--carmesim)" }}>qualquer personagem</strong>, independentemente de sua classe.</li>
            <li>Sempre que você recebe um <strong style={{ color: "var(--carmesim)" }}>poder de classe</strong>, pode trocá-lo por um poder geral.</li>
            <li>Cada poder pode ter <strong style={{ color: "var(--carmesim)" }}>pré-requisitos</strong> de atributo, perícia ou outro poder.</li>
          </ul>
          <Link href={`/ficha/${regra.tipo}/${regra.id}`} style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", fontSize: 13, borderBottom: "1px solid rgba(232,192,106,.4)" }}>
            Ver as regras completas dos Poderes →
          </Link>
        </section>
      )}

      {ORDEM_GRUPOS.map((grupo) => {
        const lista = grupos[grupo];
        if (!lista || lista.length === 0) return null;
        return (
          <section key={grupo} style={{ marginBottom: 32 }}>
            <h2 className="titulo-grimorio" style={{ fontSize: 28, margin: "0 0 14px", color: "var(--ouro)" }}>{ROTULOS_GRUPO[grupo]}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {lista.map((p) => {
                const m = p.mecanica as unknown as PoderMecanica;
                return (
                  <Link
                    key={p.id}
                    href={`/ficha/poder/${p.id}`}
                    style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
                  >
                    <div style={{ padding: "13px 14px 11px", background: "radial-gradient(120% 90% at 50% 0%, rgba(155,28,46,.08), transparent 70%)", borderBottom: "1px solid var(--borda)" }}>
                      <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 20, letterSpacing: ".5px" }}>{p.nome}</strong>
                      {m.prerequisito && (
                        <p style={{ fontFamily: "var(--serifa)", fontSize: 12, color: "var(--tinta-suave)", lineHeight: 1.4, margin: "3px 0 0" }}>Pré-req.: {m.prerequisito}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
