import type { Entidade, ClasseMecanica } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 8px" };

function StatBox({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <span style={{ textAlign: "center", background: "var(--pergaminho-stat)", border: "1px solid var(--borda)", borderRadius: 10, padding: "8px 14px" }}>
      <span style={{ display: "block", fontFamily: "var(--serifa)", fontSize: 18, color: "var(--carmesim)", fontWeight: 800 }}>{valor}</span>
      <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--tinta-suave)" }}>{rotulo}</span>
    </span>
  );
}

function Chips({ itens }: { itens: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
      {itens.map((t, i) => (
        <span key={i} style={{ fontFamily: "var(--serifa)", fontSize: 13, color: "var(--carmesim)", padding: "3px 10px", borderRadius: 8, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)" }}>{t}</span>
      ))}
    </div>
  );
}

export function FichaClasse({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as unknown as ClasseMecanica;
  const imagem = entidade.imagens[0];
  return (
    <article style={{ maxWidth: 820, margin: "0 auto", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.6)" }}>
      <header style={{ background: "radial-gradient(120% 140% at 50% 0%, #6a1421 0%, transparent 70%), linear-gradient(180deg,#4a0f18,#320a11)", padding: "20px 24px 14px", textAlign: "center", borderBottom: "2px solid var(--borda)" }}>
        <div style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700 }}>Classe</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 50, margin: "4px 0 0", lineHeight: 1 }}>{entidade.nome}</h1>
        <Divisor />
      </header>

      <div style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", color: "var(--tinta)" }}>
        {entidade.resumo && (
          <p style={{ fontFamily: "var(--serifa)", fontStyle: "italic", color: "var(--tinta-suave)", maxWidth: 620, margin: "0 auto", padding: "16px 24px 0", lineHeight: 1.55, textAlign: "center" }}>{entidade.resumo}</p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, padding: "18px 22px 8px" }}>
          {imagem && (
            <div style={{ flex: "1 1 240px", minWidth: 220, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagem} alt={`Ilustração de ${entidade.nome}`} style={{ width: "100%", maxWidth: 300, height: "auto", filter: "drop-shadow(0 8px 18px rgba(60,30,10,.4))" }} />
            </div>
          )}
          <div style={{ flex: "2 1 360px", minWidth: 300 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <StatBox valor={m.atributoChave} rotulo="Atributo-chave" />
              <StatBox valor={String(m.pvInicial)} rotulo="PV inicial" />
              <StatBox valor={`+${m.pvPorNivel}`} rotulo="PV / nível" />
              <StatBox valor={`+${m.pmPorNivel}`} rotulo="PM / nível" />
            </div>
            <section style={{ marginBottom: 12 }}>
              <h2 style={h2}>Perícias</h2>
              <p style={{ fontFamily: "var(--serifa)", lineHeight: 1.55, margin: "0 0 4px" }}>{m.pericias.texto}</p>
              {m.pericias.fixas.length > 0 && <Chips itens={m.pericias.fixas} />}
            </section>
            {m.proficiencias.length > 0 && (
              <section>
                <h2 style={h2}>Proficiências</h2>
                <Chips itens={m.proficiencias} />
              </section>
            )}
          </div>
        </div>

        <div style={{ padding: "8px 24px 22px" }}>
          {m.progressao.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Progressão (1º–20º nível)</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--serifa)", fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--carmesim)", borderBottom: "2px solid var(--borda)", width: 64 }}>Nível</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--carmesim)", borderBottom: "2px solid var(--borda)" }}>Habilidades</th>
                  </tr>
                </thead>
                <tbody>
                  {m.progressao.map((p) => (
                    <tr key={p.nivel}>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--borda)", fontWeight: 700, color: "var(--carmesim)" }}>{p.nivel}º</td>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--borda)" }}>{p.habilidades.join(", ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          {m.habilidades.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Habilidades de Classe</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {m.habilidades.map((h, i) => (
                  <div key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--carmesim)", fontWeight: 800 }}>{h.nome}{h.nivel ? ` (${h.nivel}º)` : ""}{h.custo ? ` — ${h.custo}` : ""}.</span>{" "}
                    <TextoRico texto={h.descricao} registro={registro} descricoes={descricoes} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {m.poderes.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Poderes de Classe</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {m.poderes.map((p, i) => (
                  <div key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--carmesim)", fontWeight: 800 }}>{p.nome}{p.prerequisito ? ` (${p.prerequisito})` : ""}.</span>{" "}
                    <TextoRico texto={p.descricao} registro={registro} descricoes={descricoes} />
                  </div>
                ))}
              </div>
            </section>
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
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {entidade.relacoes.map((r, i) => (
                  <span key={i} style={{ fontSize: 11, padding: "4px 11px", borderRadius: 20, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)" }}>
                    <LinkEntidade alvoId={r.alvoId} alvoTipo={r.alvoTipo} rotulo={r.rotulo} />
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
