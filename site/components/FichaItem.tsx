import type { Entidade, ItemMecanica } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 8px" };

const ROTULOS_CATEGORIA: Record<string, string> = {
  arma: "Arma",
  armadura: "Armadura",
  escudo: "Escudo",
  municao: "Munição",
  "item-aventura": "Equipamento de Aventura",
  ferramenta: "Ferramenta",
  vestuario: "Vestuário",
  esoterico: "Esotérico",
  alquimico: "Item Alquímico",
  alimentacao: "Alimentação",
  animal: "Animal",
  veiculo: "Veículo",
  servico: "Serviço",
};

function StatLinha({ rotulo, valor }: { rotulo: string; valor: string | number }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 6 }}>
      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--tinta-suave)", fontWeight: 700, minWidth: 120, flexShrink: 0 }}>{rotulo}</span>
      <span style={{ fontFamily: "var(--serifa)", color: "var(--carmesim)", fontWeight: 700 }}>{valor}</span>
    </div>
  );
}

export function FichaItem({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as unknown as ItemMecanica;
  const rotuloCategoria = ROTULOS_CATEGORIA[m.categoria] ?? m.categoria;

  return (
    <article style={{ maxWidth: 760, margin: "0 auto", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.6)" }}>
      <header style={{ background: "radial-gradient(120% 140% at 50% 0%, #6a1421 0%, transparent 70%), linear-gradient(180deg,#4a0f18,#320a11)", padding: "20px 24px 14px", textAlign: "center", borderBottom: "2px solid var(--borda)" }}>
        <div style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700 }}>{rotuloCategoria}</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 50, margin: "4px 0 0", lineHeight: 1 }}>{entidade.nome}</h1>
        {(m.preco || m.espacos) && (
          <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 20, fontFamily: "var(--serifa)", fontSize: 14, color: "var(--ouro)" }}>
            {m.preco && <span>Preço: <strong>{m.preco}</strong></span>}
            {m.espacos && <span>Espaços: <strong>{m.espacos}</strong></span>}
          </div>
        )}
        <Divisor />
      </header>

      <div style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", color: "var(--tinta)" }}>
        {entidade.resumo && (
          <p style={{ fontFamily: "var(--serifa)", fontStyle: "italic", color: "var(--tinta-suave)", maxWidth: 560, margin: "0 auto", padding: "16px 24px 0", lineHeight: 1.55, textAlign: "center" }}>
            {entidade.resumo}
          </p>
        )}

        <div style={{ padding: "18px 24px 0" }}>
          {/* Bloco de stats de arma */}
          {m.arma && (
            <section style={{ marginBottom: 16, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)", borderRadius: 10, padding: "12px 16px" }}>
              <h2 style={h2}>Estatísticas de Arma</h2>
              <StatLinha rotulo="Dano" valor={m.arma.dano} />
              <StatLinha rotulo="Crítico" valor={m.arma.critico} />
              <StatLinha rotulo="Tipo de Dano" valor={m.arma.tipoDano} />
              {m.arma.alcance && <StatLinha rotulo="Alcance" valor={m.arma.alcance} />}
              <StatLinha rotulo="Empunhadura" valor={m.arma.empunhadura} />
              <StatLinha rotulo="Proficiência" valor={m.arma.proficiencia} />
              {m.arma.habilidades && m.arma.habilidades.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--tinta-suave)", fontWeight: 700 }}>Habilidades: </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                    {m.arma.habilidades.map((h, i) => (
                      <span key={i} style={{ fontFamily: "var(--serifa)", fontSize: 13, color: "var(--carmesim)", padding: "3px 10px", borderRadius: 8, background: "var(--pergaminho-1)", border: "1px solid var(--borda)", fontStyle: "italic" }}>{h}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Bloco de stats de proteção (armadura/escudo) */}
          {m.protecao && (
            <section style={{ marginBottom: 16, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)", borderRadius: 10, padding: "12px 16px" }}>
              <h2 style={h2}>Estatísticas de {m.categoria === "escudo" ? "Escudo" : "Armadura"}</h2>
              <StatLinha rotulo="Subcategoria" valor={m.protecao.subcategoria} />
              <StatLinha rotulo="Bônus de Defesa" valor={`+${m.protecao.bonusDefesa}`} />
              <StatLinha rotulo="Penalidade de Armadura" valor={m.protecao.penalidadeArmadura} />
              {m.protecao.danoAtaque && <StatLinha rotulo="Dano (Ataque)" valor={m.protecao.danoAtaque} />}
            </section>
          )}

          {/* Especial */}
          {m.especial && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Especial</h2>
              <p style={{ fontFamily: "var(--serifa)", lineHeight: 1.6, margin: 0 }}>
                <TextoRico texto={m.especial} registro={registro} descricoes={descricoes} />
              </p>
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
