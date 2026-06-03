import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { Entidade, MagiaMecanica } from "@/lib/schema";

// Ordenação: 1º ao 5º círculo
const ORDEM_CIRCULOS = [1, 2, 3, 4, 5] as const;

// Subgrupos de tipo dentro de cada círculo
const ORDEM_TIPOS: { chave: string; rotulo: string }[] = [
  { chave: "arcana", rotulo: "Arcanas" },
  { chave: "divina", rotulo: "Divinas" },
  { chave: "universal", rotulo: "Universais" },
];

const ORDINAL: Record<number, string> = {
  1: "1º", 2: "2º", 3: "3º", 4: "4º", 5: "5º",
};

function mec(m: Entidade): MagiaMecanica {
  return m.mecanica as unknown as MagiaMecanica;
}

function LinhaMagia({ magia }: { magia: Entidade }) {
  const m = mec(magia);
  return (
    <Link href={`/ficha/magia/${magia.id}`} className="indice-linha">
      <span className="indice-nome">{magia.nome}</span>
      {m.escola && <span className="indice-meta">{m.escola}</span>}
      {magia.resumo && <span className="indice-resumo">{magia.resumo}</span>}
    </Link>
  );
}

function Grade({ magias }: { magias: Entidade[] }) {
  return (
    <div className="indice-lista">
      {magias.map((m) => (
        <LinhaMagia key={m.id} magia={m} />
      ))}
    </div>
  );
}

export default function IndiceMagias() {
  const entidades = carregarEntidades();
  const magias = entidades.filter((e) => e.tipo === "magia");
  const regra = entidades.find((e) => e.id === "magia-como-funciona");

  const ordenar = (a: Entidade, b: Entidade) => a.nome.localeCompare(b.nome, "pt-BR");

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Magias</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 12px", fontFamily: "var(--serifa)" }}>
          {magias.length} {magias.length === 1 ? "magia" : "magias"} do Livro Básico
        </p>

        {regra && (
          <section style={{ background: "rgba(177,39,58,.06)", border: "1px solid var(--borda-suave)", borderRadius: 12, padding: "16px 20px", margin: "16px 0 28px" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--vermelho)", fontWeight: 700, marginBottom: 6 }}>Como funciona a Magia</div>
            <ul style={{ fontFamily: "var(--serifa)", color: "var(--tinta)", lineHeight: 1.6, fontSize: 14, margin: "0 0 10px", paddingLeft: 18 }}>
              <li>Magias são classificadas em <strong style={{ color: "var(--carmesim)" }}>tipos</strong> (arcana ou divina) e <strong style={{ color: "var(--carmesim)" }}>círculos</strong> (do 1º ao 5º).</li>
              <li>Lançar uma magia exige gastar uma <strong style={{ color: "var(--carmesim)" }}>ação</strong> e <strong style={{ color: "var(--carmesim)" }}>pontos de mana (PM)</strong> de acordo com o círculo.</li>
              <li>Magias podem ter <strong style={{ color: "var(--carmesim)" }}>aprimoramentos</strong> — gastar PM extra para aumentar o efeito.</li>
            </ul>
            <Link href={`/ficha/${regra.tipo}/${regra.id}`} style={{ color: "var(--carmesim)", textDecoration: "none", fontFamily: "var(--serifa)", fontSize: 13, borderBottom: "1px solid var(--borda-suave)" }}>
              Ver as regras completas de Magia →
            </Link>
          </section>
        )}

        {ORDEM_CIRCULOS.map((circulo) => {
          const doCirculo = magias.filter((m) => mec(m).circulo === circulo).sort(ordenar);
          if (doCirculo.length === 0) return null;
          return (
            <section key={circulo} style={{ marginBottom: 8 }}>
              <h3 className="indice-grupo-titulo" style={{ fontSize: 16 }}>{ORDINAL[circulo]} Círculo</h3>
              {ORDEM_TIPOS.map(({ chave, rotulo }) => {
                const sublista = doCirculo.filter((m) => mec(m).tipo === chave);
                if (sublista.length === 0) return null;
                return (
                  <div key={chave}>
                    <h4 className="indice-grupo-titulo" style={{ fontSize: 12, marginTop: 18, borderBottomWidth: 1 }}>
                      {rotulo} ({sublista.length})
                    </h4>
                    <Grade magias={sublista} />
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </main>
  );
}
