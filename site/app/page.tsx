import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { construirIndice } from "@/lib/busca";
import { Busca } from "@/components/Busca";
import { Divisor } from "@/components/Divisor";

const DESTAQUES = [
  { href: "/personagem", titulo: "Criar um Personagem", desc: "Os 9 passos da construção, do conceito aos toques finais." },
  { href: "/regras", titulo: "Todas as Regras", desc: "Do combate à magia, da criação ao mestrar — reunidas." },
  { href: "/bestiario", titulo: "Bestiário", desc: "Criaturas, perigos e fichas de ameaça para o mestre." },
  { href: "/mundo", titulo: "Mundo de Arton", desc: "Regiões, cosmologia e a linha do tempo do Reinado." },
];

export default function Home() {
  const ents = carregarEntidades();
  const indice = construirIndice(ents.map((e) => ({ id: e.id, tipo: e.tipo, nome: e.nome, resumo: e.resumo })));
  return (
    <main style={{ padding: "48px 40px", maxWidth: 1040, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 52, textAlign: "center" }}>Compêndio de Arton</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>
        Tormenta 20 — wiki de mesa. Use o menu à esquerda para navegar, ou busque abaixo.
      </p>
      <Busca indice={indice} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16, marginTop: 36 }}>
        {DESTAQUES.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            style={{ display: "block", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, padding: "16px 18px", boxShadow: "0 10px 28px rgba(0,0,0,.4)" }}
          >
            <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 19 }}>{d.titulo}</strong>
            <p style={{ fontFamily: "var(--serifa)", fontSize: 13, color: "var(--tinta-suave)", lineHeight: 1.45, margin: "5px 0 0" }}>{d.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
