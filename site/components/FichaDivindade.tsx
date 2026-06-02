import Link from "next/link";
import type { Entidade, DivindadeMecanica } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 8px" };
const chipBase = { fontFamily: "var(--serifa)", fontSize: 13, color: "var(--carmesim)", padding: "3px 10px", borderRadius: 8, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)" } as const;
const rotuloCampo = { fontSize: 11, textTransform: "uppercase" as const, letterSpacing: 1.5, color: "var(--tinta-suave)", fontWeight: 700, marginBottom: 2 };
const cartaoAside = { background: "var(--pergaminho-stat)", border: "1px solid var(--borda)", borderRadius: 12, padding: "12px 14px" };

// Cor do selo conforme a energia canalizada.
function corEnergia(e: string): string {
  const v = e.toLowerCase();
  if (v.startsWith("pos")) return "var(--ouro)";
  if (v.startsWith("neg")) return "var(--carmesim)";
  return "var(--vermelho)";
}

export function FichaDivindade({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as unknown as DivindadeMecanica;
  const imagem = entidade.imagens[0];

  return (
    <article style={{ maxWidth: 1140, margin: "0 auto", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.6)" }}>
      <header style={{ background: "radial-gradient(120% 140% at 50% 0%, #6a1421 0%, transparent 70%), linear-gradient(180deg,#4a0f18,#320a11)", padding: "20px 24px 14px", textAlign: "center", borderBottom: "2px solid var(--borda)" }}>
        <div style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700 }}>Divindade</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 50, margin: "4px 0 0", lineHeight: 1 }}>{entidade.nome}</h1>
        <Divisor />
        <span style={{ display: "inline-block", marginTop: 6, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: corEnergia(m.canalizaEnergia), border: `1px solid ${corEnergia(m.canalizaEnergia)}`, borderRadius: 20, padding: "3px 12px" }}>
          Energia {m.canalizaEnergia}
        </span>
      </header>

      <div style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", color: "var(--tinta)", padding: "20px 26px 24px" }}>
        {entidade.resumo && (
          <p style={{ fontFamily: "var(--serifa)", fontStyle: "italic", color: "var(--tinta-suave)", maxWidth: 620, margin: "0 auto 20px", lineHeight: 1.55, textAlign: "center" }}>
            {entidade.resumo}
          </p>
        )}

        <div className="ficha-corpo">
          <div className="ficha-main">
            {/* Flavor (seções sem título do livro) */}
            {entidade.secoes.map((s, i) => (
              <section key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.7, marginBottom: 12 }}>
                {s.titulo ? <h2 style={h2}>{s.titulo}</h2> : null}
                <p style={{ margin: 0 }}><TextoRico texto={s.texto} registro={registro} descricoes={descricoes} /></p>
              </section>
            ))}

            {/* Crenças e Objetivos */}
            <section style={{ marginBottom: 14, fontFamily: "var(--serifa)", lineHeight: 1.7 }}>
              <h2 style={h2}>Crenças e Objetivos</h2>
              <p style={{ margin: 0 }}><TextoRico texto={m.crencasObjetivos} registro={registro} descricoes={descricoes} /></p>
            </section>

            {/* Obrigações e Restrições */}
            <section style={{ marginBottom: 14, fontFamily: "var(--serifa)", lineHeight: 1.7 }}>
              <h2 style={h2}>Obrigações &amp; Restrições</h2>
              <p style={{ margin: 0 }}><TextoRico texto={m.obrigacoesRestricoes} registro={registro} descricoes={descricoes} /></p>
            </section>

            {/* Poderes Concedidos (chips que linkam) */}
            {m.poderesConcedidos?.length > 0 && (
              <section style={{ marginBottom: 14 }}>
                <h2 style={h2}>Poderes Concedidos</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  {m.poderesConcedidos.map((p, i) => {
                    const entrada = registro.porNome.get(p.toLowerCase());
                    if (entrada && entrada.kind === "link") {
                      return <Link key={i} href={`/ficha/${entrada.alvoTipo}/${entrada.alvoId}`} style={{ ...chipBase, textDecoration: "none", borderColor: "var(--ouro)" }}>{p}</Link>;
                    }
                    return <span key={i} style={chipBase}>{p}</span>;
                  })}
                </div>
              </section>
            )}

            <p style={{ marginTop: 20, fontSize: 11, color: "var(--tinta-suave)", fontStyle: "italic" }}>
              Fonte: {entidade.fonte.livro}, p. {entidade.fonte.pagina}
            </p>
          </div>

          <aside className="ficha-aside">
            {imagem && (
              <div style={{ ...cartaoAside, display: "flex", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagem} alt={`Símbolo de ${entidade.nome}`} style={{ width: "100%", maxWidth: 220, height: "auto", filter: "drop-shadow(0 8px 18px rgba(60,30,10,.4))" }} />
              </div>
            )}

            {/* Bloco de campos curtos */}
            <div style={{ ...cartaoAside, display: "flex", flexDirection: "column", gap: 10 }}>
              <Campo rotulo="Símbolo Sagrado" texto={m.simboloSagrado} registro={registro} descricoes={descricoes} />
              <Campo rotulo="Arma Preferida" texto={m.armaPreferida} registro={registro} descricoes={descricoes} />
              <Campo rotulo="Devotos" texto={m.devotos} registro={registro} descricoes={descricoes} />
            </div>

            {/* Relações */}
            {entidade.relacoes.length > 0 && (
              <div style={cartaoAside}>
                <h2 style={h2}>Relações</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  {entidade.relacoes.map((r, i) => (
                    <span key={i} style={{ fontSize: 11, padding: "4px 11px", borderRadius: 20, background: "var(--pergaminho-1)", border: "1px solid var(--borda)" }}>
                      <LinkEntidade alvoId={r.alvoId} alvoTipo={r.alvoTipo} rotulo={r.rotulo} />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}

function Campo({ rotulo, texto, registro, descricoes }: { rotulo: string; texto: string; registro: Registro; descricoes: Record<string, string> }) {
  return (
    <div>
      <div style={rotuloCampo}>{rotulo}</div>
      <div style={{ fontFamily: "var(--serifa)", fontSize: 14, lineHeight: 1.5 }}>
        <TextoRico texto={texto} registro={registro} descricoes={descricoes} />
      </div>
    </div>
  );
}
