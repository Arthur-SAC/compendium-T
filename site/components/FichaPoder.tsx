import type { Entidade, PoderMecanica } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 8px" };

const ROTULOS_GRUPO: Record<string, string> = {
  combate: "Poder de Combate",
  destino: "Poder de Destino",
  magia: "Poder de Magia",
  concedido: "Poder Concedido",
  tormenta: "Poder da Tormenta",
};

export function FichaPoder({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as unknown as PoderMecanica;
  const rotuloGrupo = ROTULOS_GRUPO[m.grupo] ?? m.grupo;

  return (
    <article style={{ maxWidth: 760, margin: "0 auto", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.6)" }}>
      <header style={{ background: "radial-gradient(120% 140% at 50% 0%, #6a1421 0%, transparent 70%), linear-gradient(180deg,#4a0f18,#320a11)", padding: "20px 24px 14px", textAlign: "center", borderBottom: "2px solid var(--borda)" }}>
        <div style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700 }}>{rotuloGrupo}</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 50, margin: "4px 0 0", lineHeight: 1 }}>{entidade.nome}</h1>
        <Divisor />
      </header>

      <div style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", color: "var(--tinta)" }}>
        {entidade.resumo && (
          <p style={{ fontFamily: "var(--serifa)", fontStyle: "italic", color: "var(--tinta-suave)", maxWidth: 560, margin: "0 auto", padding: "16px 24px 0", lineHeight: 1.55, textAlign: "center" }}>
            {entidade.resumo}
          </p>
        )}

        <div style={{ padding: "18px 24px 0" }}>
          {/* Pré-requisito */}
          {m.prerequisito && (
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--tinta-suave)", fontWeight: 700 }}>Pré-requisito: </span>
              <span style={{ fontFamily: "var(--serifa)", color: "var(--carmesim)", fontWeight: 700 }}>{m.prerequisito}</span>
            </div>
          )}

          {/* Custo */}
          {m.custo && (
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--tinta-suave)", fontWeight: 700 }}>Custo: </span>
              <span style={{ fontFamily: "var(--serifa)", color: "var(--carmesim)", fontWeight: 700 }}>{m.custo}</span>
            </div>
          )}

          {/* Descrição */}
          <p style={{ fontFamily: "var(--serifa)", lineHeight: 1.6, margin: "0 0 16px" }}>
            <TextoRico texto={m.descricao} registro={registro} descricoes={descricoes} />
          </p>

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
