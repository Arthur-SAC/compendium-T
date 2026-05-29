import type { ReactNode } from "react";
import type { Entidade, ClasseMecanica, ProgressaoNivel, EfeitoPoder } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 8px" };
const thBase = { textAlign: "left" as const, padding: "5px 8px", color: "var(--carmesim)", borderBottom: "2px solid var(--borda)" };
const tdBase = { padding: "5px 8px", borderBottom: "1px solid var(--borda)", verticalAlign: "top" as const };

function StatBox({ valor, rotulo }: { valor: ReactNode; rotulo: string }) {
  return (
    <span style={{ textAlign: "center", background: "var(--pergaminho-stat)", border: "1px solid var(--borda)", borderRadius: 10, padding: "8px 14px", minWidth: 86 }}>
      <span style={{ display: "block", fontFamily: "var(--serifa)", fontSize: 18, color: "var(--carmesim)", fontWeight: 800 }}>{valor}</span>
      <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--tinta-suave)" }}>{rotulo}</span>
    </span>
  );
}

// "Força ou Destreza" empilhado (um sobre o outro), deixando a caixa estreita.
function AtributoChave({ texto }: { texto: string }) {
  const partes = texto.split(/\s+ou\s+/i);
  if (partes.length === 1) return <>{texto}</>;
  return (
    <span style={{ fontSize: 15, lineHeight: 1.12 }}>
      {partes.map((p, i) => (
        <span key={i} style={{ display: "block" }}>
          {i > 0 && <span style={{ display: "block", fontSize: 9, fontWeight: 400, color: "var(--tinta-suave)" }}>ou</span>}
          {p}
        </span>
      ))}
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

function PreRequisito({ texto }: { texto: string }) {
  return (
    <span style={{ display: "block", marginTop: 4, fontSize: 11.5, fontWeight: 700, fontStyle: "italic", color: "var(--carmesim)" }}>
      Pré-requisito: {texto}
    </span>
  );
}

function TabelaProgressao({ linhas }: { linhas: ProgressaoNivel[] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--serifa)", fontSize: 13 }}>
      <thead>
        <tr>
          <th style={{ ...thBase, width: 56 }}>Nível</th>
          <th style={thBase}>Habilidades</th>
        </tr>
      </thead>
      <tbody>
        {linhas.map((p) => (
          <tr key={p.nivel}>
            <td style={{ ...tdBase, fontWeight: 700, color: "var(--carmesim)" }}>{p.nivel}º</td>
            <td style={tdBase}>{p.habilidades.join(", ") || "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TabelaEfeitos({ titulo, efeitos, registro, descricoes }: { titulo: string; efeitos: EfeitoPoder[]; registro: Registro; descricoes: Record<string, string> }) {
  if (efeitos.length === 0) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--vermelho)", fontWeight: 700, marginBottom: 4 }}>{titulo}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--serifa)", fontSize: 12.5 }}>
        <thead>
          <tr>
            <th style={{ ...thBase, whiteSpace: "nowrap" }}>Efeito</th>
            <th style={{ ...thBase, whiteSpace: "nowrap" }}>Custo</th>
            <th style={thBase}>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {efeitos.map((ef, j) => (
            <tr key={j}>
              <td style={{ ...tdBase, fontWeight: 700, whiteSpace: "nowrap" }}>{ef.nome}</td>
              <td style={{ ...tdBase, color: "var(--carmesim)", fontWeight: 700, whiteSpace: "nowrap" }}>{ef.custo}</td>
              <td style={tdBase}><TextoRico texto={ef.descricao} registro={registro} descricoes={descricoes} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FichaClasse({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as unknown as ClasseMecanica;
  const imagem = entidade.imagens[0];
  const metade = Math.ceil(m.progressao.length / 2);
  const progPrimeira = m.progressao.slice(0, metade);
  const progSegunda = m.progressao.slice(metade);
  // "Pontos de Vida e Mana" sai do bloco de seções e vai para a coluna direita (abaixo de Proficiências)
  const secaoPVMana = entidade.secoes.find((s) => /pontos de vida e mana/i.test(s.titulo));
  const outrasSecoes = entidade.secoes.filter((s) => s !== secaoPVMana);

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

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, padding: "16px 22px 8px" }}>
          {imagem && (
            <div style={{ flex: "1 1 240px", minWidth: 220, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagem} alt={`Ilustração de ${entidade.nome}`} style={{ width: "100%", maxWidth: 300, height: "auto", filter: "drop-shadow(0 8px 18px rgba(60,30,10,.4))" }} />
            </div>
          )}
          <div style={{ flex: "2 1 360px", minWidth: 300 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <StatBox valor={<AtributoChave texto={m.atributoChave} />} rotulo="Atributo-chave" />
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
              <section style={{ marginBottom: 12 }}>
                <h2 style={h2}>Proficiências</h2>
                <Chips itens={m.proficiencias} />
              </section>
            )}
            {secaoPVMana && (
              <section style={{ fontFamily: "var(--serifa)", lineHeight: 1.6 }}>
                <h2 style={h2}>{secaoPVMana.titulo}</h2>
                <p style={{ margin: 0 }}><TextoRico texto={secaoPVMana.texto} registro={registro} descricoes={descricoes} /></p>
              </section>
            )}
          </div>
        </div>

        <div style={{ padding: "8px 24px 22px" }}>
          {m.progressao.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Progressão (1º–20º nível)</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flex: "1 1 280px", minWidth: 260 }}><TabelaProgressao linhas={progPrimeira} /></div>
                {progSegunda.length > 0 && <div style={{ flex: "1 1 280px", minWidth: 260 }}><TabelaProgressao linhas={progSegunda} /></div>}
              </div>
            </section>
          )}

          {m.habilidades.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Habilidades de Classe</h2>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {m.habilidades.map((h, i) => (
                  <div key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.6, padding: "8px 0", borderBottom: i < m.habilidades.length - 1 ? "1px solid var(--borda)" : "none" }}>
                    <div style={{ color: "var(--carmesim)", fontWeight: 800, fontSize: 15 }}>{h.nome}{h.nivel ? ` (${h.nivel}º)` : ""}{h.custo ? ` — ${h.custo}` : ""}</div>
                    <div style={{ marginTop: 2 }}><TextoRico texto={h.descricao} registro={registro} descricoes={descricoes} /></div>
                    {h.prerequisito && <PreRequisito texto={h.prerequisito} />}
                  </div>
                ))}
              </div>
            </section>
          )}

          {m.poderes.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Poderes de Classe</h2>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {m.poderes.map((p, i) => (
                  <div key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.6, padding: "10px 0", borderBottom: i < m.poderes.length - 1 ? "1px solid var(--borda)" : "none" }}>
                    <div style={{ color: "var(--carmesim)", fontWeight: 800, fontSize: 15 }}>{p.nome}{p.custo ? ` — ${p.custo}` : ""}</div>
                    <div style={{ marginTop: 2 }}><TextoRico texto={p.descricao} registro={registro} descricoes={descricoes} /></div>
                    {p.prerequisito && <PreRequisito texto={p.prerequisito} />}
                    {p.efeitos && p.efeitos.length > 0 && (
                      <>
                        <TabelaEfeitos titulo="Efeitos que aumentam o custo" efeitos={p.efeitos.filter((e) => !e.custo.trim().startsWith("–") && !e.custo.trim().startsWith("-"))} registro={registro} descricoes={descricoes} />
                        <TabelaEfeitos titulo="Efeitos que reduzem o custo" efeitos={p.efeitos.filter((e) => e.custo.trim().startsWith("–") || e.custo.trim().startsWith("-"))} registro={registro} descricoes={descricoes} />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {outrasSecoes.map((s, i) => (
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
