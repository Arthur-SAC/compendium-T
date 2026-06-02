import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { Entidade } from "@/lib/schema";

// As três seções macro do Capítulo 9 (Mundo de Arton), na ordem do livro.
const ORDEM_SECOES = ["Mundo de Arton", "O Reinado", "Além do Reinado"] as const;

function secaoDe(e: Entidade): string {
  const s = (e.mecanica as Record<string, unknown>).secao;
  return typeof s === "string" ? s : "Além do Reinado";
}

function CardRegiao({ regiao }: { regiao: Entidade }) {
  const m = regiao.mecanica as Record<string, unknown>;
  const epiteto = typeof m.epiteto === "string" ? m.epiteto : null;
  return (
    <Link
      href={`/ficha/regiao/${regiao.id}`}
      style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
    >
      <div style={{ padding: "13px 14px 12px", background: "radial-gradient(120% 90% at 50% 0%, rgba(155,28,46,.08), transparent 70%)", borderBottom: "1px solid var(--borda)" }}>
        <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 20, letterSpacing: ".5px" }}>{regiao.nome}</strong>
        {epiteto && (
          <span style={{ display: "block", fontFamily: "var(--serifa)", fontStyle: "italic", fontSize: 12, color: "var(--ouro)", margin: "1px 0 0" }}>{epiteto}</span>
        )}
        <p style={{ fontFamily: "var(--serifa)", fontSize: 12, color: "var(--tinta-suave)", lineHeight: 1.4, margin: "5px 0 0" }}>
          {regiao.resumo}
        </p>
      </div>
    </Link>
  );
}

export default function IndiceMundo() {
  const entidades = carregarEntidades();
  const regioes = entidades.filter((e) => e.tipo === "regiao");
  const ordenarPagina = (a: Entidade, b: Entidade) => a.fonte.pagina - b.fonte.pagina;

  return (
    <main style={{ padding: 48, maxWidth: 1060, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Mundo de Arton</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 24px", fontFamily: "var(--serifa)" }}>
        {regioes.length} {regioes.length === 1 ? "região" : "regiões"} — O Reinado e Além do Reinado · Livro Básico
      </p>

      {ORDEM_SECOES.map((secao) => {
        const sublista = regioes.filter((r) => secaoDe(r) === secao).sort(ordenarPagina);
        if (sublista.length === 0) return null;
        return (
          <section key={secao} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--serifa)", fontSize: 14, textTransform: "uppercase", letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 14px" }}>
              {secao} <span style={{ color: "var(--tinta-suave)", fontWeight: 400 }}>({sublista.length})</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
              {sublista.map((r) => <CardRegiao key={r.id} regiao={r} />)}
            </div>
          </section>
        );
      })}
    </main>
  );
}
