import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { Entidade, CriaturaMecanica } from "@/lib/schema";

// Ordem dos temas do bestiário (Cap. 7), conforme o livro.
const ORDEM_TEMAS = [
  "Masmorras", "Ermos", "Os Puristas", "Reino dos Mortos", "Os Duyshidakk",
  "Os Sszzaazitas", "Os Trolls Nobres", "Os Dragões", "A Tormenta",
] as const;

function mec(e: Entidade): CriaturaMecanica {
  return e.mecanica as unknown as CriaturaMecanica;
}

// ND como valor numérico para ordenar ("1/4" < "1/2" < "1" < "2"...).
function ndValor(nd: string): number {
  const s = (nd ?? "").trim();
  if (s.includes("/")) {
    const [a, b] = s.split("/").map((x) => parseFloat(x));
    return b ? a / b : 99;
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 99;
}

function CardCriatura({ criatura }: { criatura: Entidade }) {
  const m = mec(criatura);
  return (
    <Link
      href={`/ficha/criatura/${criatura.id}`}
      style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
    >
      <div style={{ padding: "12px 14px 12px", background: "radial-gradient(120% 90% at 50% 0%, rgba(155,28,46,.08), transparent 70%)", borderBottom: "1px solid var(--borda)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 18, letterSpacing: ".3px" }}>{criatura.nome}</strong>
          <span style={{ flexShrink: 0, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "var(--ouro)", border: "1px solid var(--ouro)", borderRadius: 12, padding: "1px 8px", fontWeight: 700 }}>ND {m.nd}</span>
        </div>
        <p style={{ fontFamily: "var(--serifa)", fontSize: 12, color: "var(--tinta-suave)", lineHeight: 1.4, margin: "4px 0 0" }}>
          {[m.tamanho, m.tipo].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}

export default function IndiceBestiario() {
  const entidades = carregarEntidades();
  // Bestiário do Livro Básico: exclui seeds de outras fontes (ex.: Súcubo, de Ameaças de Arton).
  const criaturas = entidades.filter((e) => e.tipo === "criatura" && e.fonte?.livro === "livro-basico");
  const ordenar = (a: Entidade, b: Entidade) => ndValor(mec(a).nd) - ndValor(mec(b).nd) || a.nome.localeCompare(b.nome, "pt-BR");
  const temas = [...ORDEM_TEMAS, ...new Set(criaturas.map((c) => mec(c).tema).filter((t): t is string => !!t && !ORDEM_TEMAS.includes(t as typeof ORDEM_TEMAS[number])))];

  return (
    <main style={{ padding: 48, maxWidth: 1480, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Bestiário</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 24px", fontFamily: "var(--serifa)" }}>
        {criaturas.length} {criaturas.length === 1 ? "criatura" : "criaturas"} — Livro Básico
      </p>

      {temas.map((tema) => {
        const sublista = criaturas.filter((c) => mec(c).tema === tema).sort(ordenar);
        if (sublista.length === 0) return null;
        return (
          <section key={tema} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--serifa)", fontSize: 14, textTransform: "uppercase", letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 14px" }}>
              {tema} <span style={{ color: "var(--tinta-suave)", fontWeight: 400 }}>({sublista.length})</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
              {sublista.map((c) => <CardCriatura key={c.id} criatura={c} />)}
            </div>
          </section>
        );
      })}
    </main>
  );
}
