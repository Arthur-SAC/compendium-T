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

function CardMagia({ magia }: { magia: Entidade }) {
  const m = mec(magia);
  return (
    <Link
      href={`/ficha/magia/${magia.id}`}
      style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
    >
      <div style={{ padding: "13px 14px 11px", background: "radial-gradient(120% 90% at 50% 0%, rgba(155,28,46,.08), transparent 70%)", borderBottom: "1px solid var(--borda)" }}>
        <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 20, letterSpacing: ".5px" }}>{magia.nome}</strong>
        <p style={{ fontFamily: "var(--serifa)", fontSize: 12, color: "var(--tinta-suave)", lineHeight: 1.4, margin: "3px 0 0" }}>
          {m.escola}{magia.resumo ? ` · ${magia.resumo}` : ""}
        </p>
      </div>
    </Link>
  );
}

function Grade({ magias }: { magias: Entidade[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
      {magias.map((m) => (
        <CardMagia key={m.id} magia={m} />
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
    <main style={{ padding: 48, maxWidth: 1480, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Magias</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 12px", fontFamily: "var(--serifa)" }}>
        {magias.length} {magias.length === 1 ? "magia" : "magias"} do Livro Básico
      </p>

      {regra && (
        <section style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, padding: "16px 20px", margin: "0 0 28px", boxShadow: "0 10px 28px rgba(0,0,0,.4)" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700, marginBottom: 6 }}>Como funciona a Magia</div>
          <ul style={{ fontFamily: "var(--serifa)", color: "var(--tinta)", lineHeight: 1.6, fontSize: 14, margin: "0 0 10px", paddingLeft: 18 }}>
            <li>Magias são classificadas em <strong style={{ color: "var(--carmesim)" }}>tipos</strong> (arcana ou divina) e <strong style={{ color: "var(--carmesim)" }}>círculos</strong> (do 1º ao 5º).</li>
            <li>Lançar uma magia exige gastar uma <strong style={{ color: "var(--carmesim)" }}>ação</strong> e <strong style={{ color: "var(--carmesim)" }}>pontos de mana (PM)</strong> de acordo com o círculo.</li>
            <li>Magias podem ter <strong style={{ color: "var(--carmesim)" }}>aprimoramentos</strong> — gastar PM extra para aumentar o efeito.</li>
          </ul>
          <Link href={`/ficha/${regra.tipo}/${regra.id}`} style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", fontSize: 13, borderBottom: "1px solid rgba(232,192,106,.4)" }}>
            Ver as regras completas de Magia →
          </Link>
        </section>
      )}

      {ORDEM_CIRCULOS.map((circulo) => {
        const doCirculo = magias.filter((m) => mec(m).circulo === circulo).sort(ordenar);
        if (doCirculo.length === 0) return null;
        return (
          <section key={circulo} style={{ marginBottom: 32 }}>
            <h2 className="titulo-grimorio" style={{ fontSize: 28, margin: "0 0 14px", color: "var(--ouro)" }}>
              {ORDINAL[circulo]} Círculo
            </h2>
            {ORDEM_TIPOS.map(({ chave, rotulo }) => {
              const sublista = doCirculo.filter((m) => mec(m).tipo === chave);
              if (sublista.length === 0) return null;
              return (
                <div key={chave} style={{ marginBottom: 18 }}>
                  <h3 style={{ fontFamily: "var(--serifa)", fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 12px" }}>
                    {rotulo} <span style={{ color: "var(--tinta-suave)", fontWeight: 400 }}>({sublista.length})</span>
                  </h3>
                  <Grade magias={sublista} />
                </div>
              );
            })}
          </section>
        );
      })}
    </main>
  );
}
