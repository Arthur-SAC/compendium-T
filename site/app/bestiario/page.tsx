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

function LinhaCriatura({ criatura }: { criatura: Entidade }) {
  const m = mec(criatura);
  return (
    <Link href={`/ficha/criatura/${criatura.id}`} className="indice-linha">
      <span className="indice-nome" style={{ minWidth: 170 }}>{criatura.nome}</span>
      <span style={{ flexShrink: 0, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "var(--vermelho)", border: "1px solid var(--borda)", borderRadius: 12, padding: "1px 8px", fontWeight: 700 }}>ND {m.nd}</span>
      <span className="indice-resumo">{[m.tamanho, m.tipo].filter(Boolean).join(" · ")}</span>
    </Link>
  );
}

// Regras do Cap. 7 (Ameaças) que acompanham o bestiário.
const REGRAS_AMEACAS: { id: string; titulo: string; desc: string }[] = [
  { id: "construindo-combates", titulo: "Construindo Combates", desc: "Nível de desafio, papéis (solo/lacaio/especial), vários inimigos e tipos de criatura." },
  { id: "perigos", titulo: "Perigos", desc: "Armadilhas, doenças e perigos ambientais — ameaças que não são criaturas." },
  { id: "fichas-de-npcs", titulo: "Fichas de NPCs", desc: "Criar fichas de ameaça por ND, com a Tabela 7-2 de estatísticas." },
];

export default function IndiceBestiario() {
  const entidades = carregarEntidades();
  // Bestiário do Livro Básico: exclui seeds de outras fontes (ex.: Súcubo, de Ameaças de Arton).
  const criaturas = entidades.filter((e) => e.tipo === "criatura" && e.fonte?.livro === "livro-basico");
  const ordenar = (a: Entidade, b: Entidade) => ndValor(mec(a).nd) - ndValor(mec(b).nd) || a.nome.localeCompare(b.nome, "pt-BR");
  const temas = [...ORDEM_TEMAS, ...new Set(criaturas.map((c) => mec(c).tema).filter((t): t is string => !!t && !ORDEM_TEMAS.includes(t as typeof ORDEM_TEMAS[number])))];
  const idsRegras = new Set(entidades.filter((e) => e.tipo === "regra-de-criacao").map((e) => e.id));

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Bestiário</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 24px", fontFamily: "var(--serifa)" }}>
          {criaturas.length} {criaturas.length === 1 ? "criatura" : "criaturas"} — Livro Básico
        </p>

        <section style={{ background: "rgba(177,39,58,.06)", border: "1px solid var(--borda-suave)", borderRadius: 12, padding: "16px 20px", margin: "0 0 28px" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--vermelho)", fontWeight: 700, marginBottom: 4 }}>Regras de Ameaças (Cap. 7)</div>
          <div className="indice-lista">
            {REGRAS_AMEACAS.filter((r) => idsRegras.has(r.id)).map((r) => (
              <Link key={r.id} href={`/ficha/regra-de-criacao/${r.id}`} className="indice-linha">
                <span className="indice-nome">{r.titulo}</span>
                <span className="indice-resumo">{r.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {temas.map((tema) => {
          const sublista = criaturas.filter((c) => mec(c).tema === tema).sort(ordenar);
          if (sublista.length === 0) return null;
          return (
            <section key={tema} style={{ marginBottom: 8 }}>
              <h3 className="indice-grupo-titulo" style={{ fontSize: 14 }}>
                {tema} ({sublista.length})
              </h3>
              <div className="indice-lista">
                {sublista.map((c) => <LinhaCriatura key={c.id} criatura={c} />)}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
