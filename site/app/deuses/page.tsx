import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { Entidade, DivindadeMecanica } from "@/lib/schema";

// Agrupa por energia canalizada.
const ORDEM_ENERGIA: { chave: string; rotulo: string }[] = [
  { chave: "Positiva", rotulo: "Energia Positiva" },
  { chave: "Negativa", rotulo: "Energia Negativa" },
  { chave: "Qualquer", rotulo: "Qualquer Energia" },
];

function mec(d: Entidade): DivindadeMecanica {
  return d.mecanica as unknown as DivindadeMecanica;
}

function CardDivindade({ divindade }: { divindade: Entidade }) {
  const m = mec(divindade);
  return (
    <Link
      href={`/ficha/divindade/${divindade.id}`}
      style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
    >
      <div style={{ padding: "13px 14px 11px", background: "radial-gradient(120% 90% at 50% 0%, rgba(155,28,46,.08), transparent 70%)", borderBottom: "1px solid var(--borda)" }}>
        <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 20, letterSpacing: ".5px" }}>{divindade.nome}</strong>
        <p style={{ fontFamily: "var(--serifa)", fontSize: 12, color: "var(--tinta-suave)", lineHeight: 1.4, margin: "3px 0 0" }}>
          {divindade.resumo}
        </p>
      </div>
    </Link>
  );
}

export default function IndiceDeuses() {
  const entidades = carregarEntidades();
  const divindades = entidades.filter((e) => e.tipo === "divindade");
  const regra = entidades.find((e) => e.id === "devocao-como-funciona");
  const ordenar = (a: Entidade, b: Entidade) => a.nome.localeCompare(b.nome, "pt-BR");

  return (
    <main style={{ padding: 48, maxWidth: 1060, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Deuses</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 12px", fontFamily: "var(--serifa)" }}>
        {divindades.length} {divindades.length === 1 ? "divindade do Panteão" : "divindades do Panteão"} — Livro Básico
      </p>

      {regra && (
        <section style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, padding: "16px 20px", margin: "0 0 28px", boxShadow: "0 10px 28px rgba(0,0,0,.4)" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700, marginBottom: 6 }}>Como funciona a devoção</div>
          <ul style={{ fontFamily: "var(--serifa)", color: "var(--tinta)", lineHeight: 1.6, fontSize: 14, margin: "0 0 10px", paddingLeft: 18 }}>
            <li>Servir a uma divindade torna você um <strong style={{ color: "var(--carmesim)" }}>devoto</strong>: em troca de seguir as <strong style={{ color: "var(--carmesim)" }}>Obrigações &amp; Restrições</strong>, recebe <strong style={{ color: "var(--carmesim)" }}>Poderes Concedidos</strong>.</li>
            <li>Cada deus <strong style={{ color: "var(--carmesim)" }}>canaliza energia</strong> Positiva, Negativa ou Qualquer, define sua <strong style={{ color: "var(--carmesim)" }}>arma preferida</strong> e quem pode ser seu devoto.</li>
            <li>Quebrar os votos faz perder os poderes até cumprir <strong style={{ color: "var(--carmesim)" }}>penitência</strong> (perícia Religião).</li>
          </ul>
          <Link href={`/ficha/${regra.tipo}/${regra.id}`} style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", fontSize: 13, borderBottom: "1px solid rgba(232,192,106,.4)" }}>
            Ver as regras completas de devoção →
          </Link>
        </section>
      )}

      {ORDEM_ENERGIA.map(({ chave, rotulo }) => {
        const sublista = divindades.filter((d) => mec(d).canalizaEnergia === chave).sort(ordenar);
        if (sublista.length === 0) return null;
        return (
          <section key={chave} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--serifa)", fontSize: 14, textTransform: "uppercase", letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 14px" }}>
              {rotulo} <span style={{ color: "var(--tinta-suave)", fontWeight: 400 }}>({sublista.length})</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {sublista.map((d) => <CardDivindade key={d.id} divindade={d} />)}
            </div>
          </section>
        );
      })}
    </main>
  );
}
