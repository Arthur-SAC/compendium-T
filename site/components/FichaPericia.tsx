import type { Entidade, PericiaMecanica } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 8px" };

function Chips({ itens }: { itens: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
      {itens.map((t, i) => (
        <span key={i} style={{ fontFamily: "var(--serifa)", fontSize: 13, color: "var(--carmesim)", padding: "3px 10px", borderRadius: 8, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)" }}>{t}</span>
      ))}
    </div>
  );
}

export function FichaPericia({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as unknown as PericiaMecanica;
  const selos: string[] = [];
  if (m.treinada) selos.push("Somente Treinada");
  if (m.penalidadeArmadura) selos.push("Penalidade de armadura");

  return (
    <article style={{ maxWidth: 760, margin: "0 auto", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.6)" }}>
      <header style={{ background: "radial-gradient(120% 140% at 50% 0%, #6a1421 0%, transparent 70%), linear-gradient(180deg,#4a0f18,#320a11)", padding: "20px 24px 14px", textAlign: "center", borderBottom: "2px solid var(--borda)" }}>
        <div style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700 }}>Perícia</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 50, margin: "4px 0 0", lineHeight: 1 }}>{entidade.nome}</h1>
        <div style={{ marginTop: 8, fontSize: 15, fontFamily: "var(--serifa)", color: "var(--ouro)", letterSpacing: 1 }}>{m.atributoChave}</div>
        {selos.length > 0 && <Chips itens={selos} />}
        <Divisor />
      </header>

      <div style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", color: "var(--tinta)" }}>
        {entidade.resumo && (
          <p style={{ fontFamily: "var(--serifa)", fontStyle: "italic", color: "var(--tinta-suave)", maxWidth: 560, margin: "0 auto", padding: "16px 24px 0", lineHeight: 1.55, textAlign: "center" }}>
            {entidade.resumo}
          </p>
        )}

        <div style={{ padding: "18px 24px 0" }}>
          {/* Descrição geral */}
          {m.descricao && (
            <p style={{ fontFamily: "var(--serifa)", lineHeight: 1.6, margin: "0 0 16px" }}>
              <TextoRico texto={m.descricao} registro={registro} descricoes={descricoes} />
            </p>
          )}

          {/* Usos */}
          {m.usos && m.usos.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Usos</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {m.usos.map((uso, i) => (
                  <div key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--carmesim)", fontWeight: 800 }}>{uso.nome}</span>
                    {uso.cd && <span style={{ color: "var(--tinta-suave)", fontSize: 13 }}> (CD {uso.cd})</span>}
                    {uso.apenasTreinado && <span style={{ color: "var(--tinta-suave)", fontSize: 13 }}> (Apenas Treinado)</span>}
                    {". "}
                    <TextoRico texto={uso.descricao} registro={registro} descricoes={descricoes} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Seções de flavor */}
          {entidade.secoes.map((s, i) => (
            <section key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.7, marginBottom: 12 }}>
              <h2 style={h2}>{s.titulo}</h2>
              <p><TextoRico texto={s.texto} registro={registro} descricoes={descricoes} /></p>
            </section>
          ))}

          {/* Relações */}
          {entidade.relacoes.length > 0 && (
            <section>
              <h2 style={h2}>Relações</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {entidade.relacoes.map((r, i) => (
                  <span key={i} style={{ fontSize: 11, padding: "4px 11px", borderRadius: 20, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)" }}>
                    <LinkEntidade alvoId={r.alvoId} alvoTipo={r.alvoTipo} rotulo={r.rotulo} />
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Proveniência */}
          <p style={{ marginTop: 20, fontSize: 11, color: "var(--tinta-suave)", fontStyle: "italic", paddingBottom: 22 }}>
            Fonte: {entidade.fonte.livro}, p. {entidade.fonte.pagina}
          </p>
        </div>
      </div>
    </article>
  );
}
