import type { Entidade } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

// Forma estruturada da mecânica de uma Raça (spike — espelha o RacaMecanicaSchema do design).
type ModificadorAtributo = {
  atributo?: string;
  valor: number;
  escolha?: boolean;
  quantidade?: number;
  observacao?: string;
};
type HabilidadeRacial = { nome: string; descricao: string; efeito?: string };
type RacaMecanica = {
  modificadores?: ModificadorAtributo[];
  tamanho?: string;
  deslocamento?: number;
  deslocamentoUnidade?: string;
  nota?: string;
  habilidades?: HabilidadeRacial[];
};

function rotuloModificador(m: ModificadorAtributo): string {
  if (m.escolha) return `${m.valor > 0 ? "+" : ""}${m.valor} em ${m.quantidade ?? ""} atributos`;
  return `${m.valor > 0 ? "+" : ""}${m.valor} ${m.atributo ?? ""}`.trim();
}

const SEPIA = "#ffaad4";

function StatBox({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <span style={{ textAlign: "center", background: "rgba(220,40,120,.12)", border: "1px solid var(--borda-clara)", borderRadius: 10, padding: "8px 14px" }}>
      <span style={{ display: "block", fontFamily: "var(--serifa)", fontSize: 18, color: SEPIA, fontWeight: 800 }}>{valor}</span>
      <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--texto-suave)" }}>{rotulo}</span>
    </span>
  );
}

export function FichaRaca({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as RacaMecanica;
  const imagem = entidade.imagens[0];
  const deslocamento = m.deslocamento != null ? `${m.deslocamento}${m.deslocamentoUnidade ?? ""}` : null;

  return (
    <article style={{ maxWidth: 760, margin: "0 auto", background: "var(--fundo-card)", border: "2px solid var(--borda)", borderRadius: 18, overflow: "hidden", boxShadow: "0 14px 50px rgba(160,20,90,.35)" }}>
      <header style={{ padding: "18px 24px 10px", textAlign: "center", borderBottom: "1px solid var(--borda-clara)" }}>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--texto-suave)" }}>Raça</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 36, margin: "2px 0 0" }}>{entidade.nome}</h1>
        <Divisor />
        {entidade.resumo && (
          <p style={{ fontFamily: "var(--serifa)", fontStyle: "italic", color: "var(--texto-suave)", maxWidth: 560, margin: "6px auto 0", lineHeight: 1.5 }}>
            {entidade.resumo}
          </p>
        )}
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 20 }}>
        {/* Coluna da ilustração */}
        {imagem && (
          <div style={{ flex: "1 1 240px", minWidth: 220, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagem}
              alt={`Ilustração de ${entidade.nome}`}
              style={{ width: "100%", maxWidth: 300, height: "auto", filter: "drop-shadow(0 10px 24px rgba(0,0,0,.6))" }}
            />
          </div>
        )}

        {/* Coluna mecânica */}
        <div style={{ flex: "2 1 320px", minWidth: 280 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            {m.tamanho && <StatBox valor={m.tamanho} rotulo="Tamanho" />}
            {deslocamento && <StatBox valor={deslocamento} rotulo="Deslocamento" />}
          </div>

          {m.modificadores && m.modificadores.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: "var(--destaque)", borderBottom: "1px solid var(--borda)", paddingBottom: 4 }}>
                Modificadores de Atributo
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {m.modificadores.map((mod, i) => (
                  <span key={i} style={{ fontFamily: "var(--serifa)", fontWeight: 700, fontSize: 14, color: SEPIA, padding: "4px 11px", borderRadius: 8, background: "rgba(220,40,120,.14)", border: "1px solid var(--borda-clara)" }}>
                    {rotuloModificador(mod)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {m.habilidades && m.habilidades.length > 0 && (
            <section>
              <h2 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: "var(--destaque)", borderBottom: "1px solid var(--borda)", paddingBottom: 4 }}>
                Habilidades de Raça
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                {m.habilidades.map((h, i) => (
                  <div key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.55 }}>
                    <span style={{ color: SEPIA, fontWeight: 800 }}>{h.nome}.</span>{" "}
                    <TextoRico texto={h.descricao} registro={registro} descricoes={descricoes} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Descrição e relações em largura total */}
      <div style={{ padding: "0 24px 22px" }}>
        {entidade.secoes.map((s, i) => (
          <section key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.65, marginBottom: 12 }}>
            <h2 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: "var(--destaque)", borderBottom: "1px solid var(--borda)", paddingBottom: 4 }}>{s.titulo}</h2>
            <p><TextoRico texto={s.texto} registro={registro} descricoes={descricoes} /></p>
          </section>
        ))}
        {entidade.relacoes.length > 0 && (
          <section>
            <h2 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: "var(--destaque)" }}>Relações</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {entidade.relacoes.map((r, i) => (
                <span key={i} style={{ fontSize: 11, padding: "4px 11px", borderRadius: 20, background: "rgba(220,40,120,.14)", border: "1px solid var(--borda-clara)" }}>
                  <LinkEntidade alvoId={r.alvoId} alvoTipo={r.alvoTipo} rotulo={r.rotulo} />
                </span>
              ))}
            </div>
          </section>
        )}

        {m.nota && (
          <p style={{ marginTop: 16, fontSize: 11, color: "var(--texto-suave)", fontStyle: "italic" }}>{m.nota}</p>
        )}
      </div>
    </article>
  );
}
