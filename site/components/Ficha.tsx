import type { Entidade } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

export function Ficha({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as Record<string, string | number>;
  const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 8px" };
  return (
    <article style={{ maxWidth: 620, margin: "0 auto", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.6)" }}>
      <header style={{ background: "radial-gradient(120% 140% at 50% 0%, #6a1421 0%, transparent 70%), linear-gradient(180deg,#4a0f18,#320a11)", padding: "18px 22px 12px", textAlign: "center", borderBottom: "2px solid var(--borda)" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700 }}>{entidade.tipo}</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 38, margin: "2px 0 0" }}>{entidade.nome}</h1>
        <Divisor />
      </header>
      <div style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", color: "var(--tinta)", padding: "18px 24px 22px" }}>
        {Object.keys(m).length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
            {Object.entries(m).map(([k, v]) => (
              <span key={k} style={{ textAlign: "center", background: "var(--pergaminho-stat)", border: "1px solid var(--borda)", borderRadius: 10, padding: "8px 12px" }}>
                <span style={{ display: "block", fontFamily: "var(--serifa)", fontSize: 18, color: "var(--carmesim)", fontWeight: 800 }}>{String(v)}</span>
                <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--tinta-suave)" }}>{k}</span>
              </span>
            ))}
          </div>
        )}
        {entidade.secoes.map((s, i) => (
          <section key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.7, marginBottom: 12 }}>
            <h2 style={h2}>{s.titulo}</h2>
            <p><TextoRico texto={s.texto} registro={registro} descricoes={descricoes} /></p>
          </section>
        ))}
        {entidade.relacoes.length > 0 && (
          <section>
            <h2 style={h2}>Relações</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {entidade.relacoes.map((r, i) => (
                <span key={i} style={{ fontSize: 11, padding: "4px 11px", borderRadius: 20, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)" }}>
                  <LinkEntidade alvoId={r.alvoId} alvoTipo={r.alvoTipo} rotulo={r.rotulo} />
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
