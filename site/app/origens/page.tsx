import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";

export default function IndiceOrigens() {
  const entidades = carregarEntidades();
  const origens = entidades
    .filter((e) => e.tipo === "origem")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  const regra = entidades.find((e) => e.id === "construcao-origens");

  return (
    <main style={{ padding: 48, maxWidth: 980, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Origens de Arton</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 24px", fontFamily: "var(--serifa)" }}>
        {origens.length} {origens.length === 1 ? "origem" : "origens"} do Livro Básico
      </p>

      {regra && (
        <section style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, padding: "16px 20px", margin: "0 0 28px", boxShadow: "0 10px 28px rgba(0,0,0,.4)" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700, marginBottom: 6 }}>Como funcionam as Origens</div>
          <ul style={{ fontFamily: "var(--serifa)", color: "var(--tinta)", lineHeight: 1.6, fontSize: 14, margin: "0 0 10px", paddingLeft: 18 }}>
            <li>Você começa com os <strong style={{ color: "var(--carmesim)" }}>Itens</strong> da origem sem pagar por eles.</li>
            <li>Escolha <strong style={{ color: "var(--carmesim)" }}>dois benefícios</strong> da lista: duas perícias, dois poderes, ou uma perícia e um poder (para regras mais rápidas, só perícias).</li>
            <li>O <strong style={{ color: "var(--carmesim)" }}>Poder Único</strong> da origem pode ser um desses dois — e só quem tem a origem pode escolhê-lo.</li>
            <li>Você pode <strong style={{ color: "var(--carmesim)" }}>customizar</strong> (ou criar) sua origem com o mestre.</li>
          </ul>
          <Link href={`/ficha/${regra.tipo}/${regra.id}`} style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", fontSize: 13, borderBottom: "1px solid rgba(232,192,106,.4)" }}>
            Ver as regras completas das Origens →
          </Link>
        </section>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {origens.map((o) => (
          <Link
            key={o.id}
            href={`/ficha/origem/${o.id}`}
            style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
          >
            <div style={{ padding: "14px 14px 12px", background: "radial-gradient(120% 90% at 50% 0%, rgba(155,28,46,.08), transparent 70%)", borderBottom: "1px solid var(--borda)" }}>
              <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 22, letterSpacing: ".5px" }}>{o.nome}</strong>
              <p style={{ fontFamily: "var(--serifa)", fontSize: 12.5, color: "var(--tinta-suave)", lineHeight: 1.45, margin: "4px 0 0" }}>{o.resumo}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
