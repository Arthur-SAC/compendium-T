import type { Entidade } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

// Rótulo legível a partir de uma chave snake_case ("tabela_custo_pm" → "tabela custo pm").
const rotular = (k: string) => k.replace(/_/g, " ");
const ehPrimitivo = (v: unknown) => v === null || typeof v !== "object";
// Texto plano de um valor qualquer (arrays e objetos achatam recursivamente) — nunca "[object Object]".
function valorPlano(v: unknown): string {
  if (Array.isArray(v)) return v.map(valorPlano).join(", ");
  if (v && typeof v === "object") return Object.entries(v).map(([k, val]) => `${rotular(k)}: ${valorPlano(val)}`).join("; ");
  return String(v);
}

export function Ficha({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as Record<string, unknown>;
  const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 8px" };
  const rotuloBloco = { ...h2, fontSize: 11, margin: "16px 0 8px" };
  // Particiona a mecânica (freeform nas regras) por forma: primitivos viram chips;
  // arrays de objetos viram tabela; arrays simples viram chips rotulados; mapas viram lista.
  const entradas = Object.entries(m);
  const primitivos = entradas.filter(([, v]) => ehPrimitivo(v));
  const arraysSimples = entradas.filter(([, v]) => Array.isArray(v) && (v as unknown[]).every(ehPrimitivo) && (v as unknown[]).length > 0);
  const tabelas = entradas.filter(([, v]) => Array.isArray(v) && (v as unknown[]).some((x) => x && typeof x === "object")) as [string, Record<string, unknown>[]][];
  const mapas = entradas.filter(([, v]) => v && typeof v === "object" && !Array.isArray(v)) as [string, Record<string, unknown>][];
  const chipBox = { textAlign: "center" as const, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)", borderRadius: 10, padding: "8px 12px" };
  const chipMini = { fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)" };
  return (
    <article style={{ maxWidth: 620, margin: "0 auto", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.6)" }}>
      <header style={{ background: "radial-gradient(120% 140% at 50% 0%, #6a1421 0%, transparent 70%), linear-gradient(180deg,#4a0f18,#320a11)", padding: "18px 22px 12px", textAlign: "center", borderBottom: "2px solid var(--borda)" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700 }}>{entidade.tipo}</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 38, margin: "2px 0 0" }}>{entidade.nome}</h1>
        <Divisor />
      </header>
      <div style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", color: "var(--tinta)", padding: "18px 24px 22px" }}>
        {primitivos.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
            {primitivos.map(([k, v]) => (
              <span key={k} style={chipBox}>
                <span style={{ display: "block", fontFamily: "var(--serifa)", fontSize: 18, color: "var(--carmesim)", fontWeight: 800 }}>{String(v)}</span>
                <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--tinta-suave)" }}>{rotular(k)}</span>
              </span>
            ))}
          </div>
        )}
        {arraysSimples.map(([k, v]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <h3 style={rotuloBloco}>{rotular(k)}</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(v as unknown[]).map((x, i) => <span key={i} style={chipMini}>{String(x)}</span>)}
            </div>
          </div>
        ))}
        {tabelas.map(([k, linhas]) => {
          const cols = [...new Set(linhas.flatMap((o) => Object.keys(o)))];
          return (
            <div key={k} style={{ marginBottom: 12 }}>
              <h3 style={rotuloBloco}>{rotular(k)}</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--serifa)", fontSize: 14 }}>
                <thead>
                  <tr>{cols.map((c) => <th key={c} style={{ textAlign: "left", padding: "4px 8px", borderBottom: "1px solid var(--borda)", color: "var(--vermelho)", textTransform: "capitalize", fontSize: 12 }}>{rotular(c)}</th>)}</tr>
                </thead>
                <tbody>
                  {linhas.map((o, i) => (
                    <tr key={i}>{cols.map((c) => <td key={c} style={{ padding: "4px 8px", borderBottom: "1px solid var(--borda-suave, var(--borda))" }}>{c in o ? valorPlano(o[c]) : "—"}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
        {mapas.map(([k, obj]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <h3 style={rotuloBloco}>{rotular(k)}</h3>
            <dl style={{ margin: 0, fontFamily: "var(--serifa)", fontSize: 14, lineHeight: 1.6 }}>
              {Object.entries(obj).map(([ck, cv]) => (
                <div key={ck} style={{ display: "flex", gap: 8 }}>
                  <dt style={{ fontWeight: 700, textTransform: "capitalize", minWidth: 120 }}>{rotular(ck)}</dt>
                  <dd style={{ margin: 0 }}>{valorPlano(cv)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
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
