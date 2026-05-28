import type { Entidade } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

export function Ficha({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as Record<string, string | number>;
  return (
    <article style={{ maxWidth: 560, margin: "0 auto", background: "var(--fundo-card)", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 14px 50px rgba(160,20,90,.35)" }}>
      <header style={{ padding: "16px 22px 10px", textAlign: "center", borderBottom: "1px solid var(--borda-clara)" }}>
        <h1 className="titulo-grimorio" style={{ fontSize: 30, margin: 0 }}>{entidade.nome}</h1>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--texto-suave)" }}>{entidade.tipo}</div>
        <Divisor />
      </header>
      <div style={{ padding: "18px 24px 22px" }}>
        {Object.keys(m).length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
            {Object.entries(m).map(([k, v]) => (
              <span key={k} style={{ textAlign: "center", background: "rgba(220,40,120,.12)", border: "1px solid var(--borda-clara)", borderRadius: 10, padding: "8px 12px" }}>
                <span style={{ display: "block", fontFamily: "var(--serifa)", fontSize: 18, color: "#ffaad4", fontWeight: 800 }}>{String(v)}</span>
                <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--texto-suave)" }}>{k}</span>
              </span>
            ))}
          </div>
        )}
        {entidade.secoes.map((s, i) => (
          <section key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.65, marginBottom: 12 }}>
            <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: "var(--destaque)", borderBottom: "1px solid var(--borda)", paddingBottom: 4 }}>{s.titulo}</h2>
            <p><TextoRico texto={s.texto} registro={registro} descricoes={descricoes} /></p>
          </section>
        ))}
        {entidade.relacoes.length > 0 && (
          <section>
            <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: "var(--destaque)" }}>Relações</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {entidade.relacoes.map((r, i) => (
                <span key={i} style={{ fontSize: 11, padding: "4px 11px", borderRadius: 20, background: "rgba(220,40,120,.14)", border: "1px solid var(--borda-clara)" }}>
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
