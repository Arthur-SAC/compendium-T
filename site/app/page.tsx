import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { construirIndice } from "@/lib/busca";
import { Busca } from "@/components/Busca";
import { Divisor } from "@/components/Divisor";

export default function Home() {
  const ents = carregarEntidades();
  const indice = construirIndice(ents.map((e) => ({ id: e.id, tipo: e.tipo, nome: e.nome, resumo: e.resumo })));
  return (
    <main style={{ padding: 48 }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 52, textAlign: "center" }}>Compêndio de Arton</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>Tormenta 20 — wiki de mesa</p>
      <Busca indice={indice} />
      <div style={{ textAlign: "center", marginTop: 28, display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/racas" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Ver todas as raças →
        </Link>
        <Link href="/classes" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Ver todas as classes →
        </Link>
        <Link href="/origens" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Ver todas as origens →
        </Link>
        <Link href="/pericias" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Ver todas as perícias →
        </Link>
        <Link href="/poderes" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Ver todos os poderes →
        </Link>
        <Link href="/equipamento" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Ver o equipamento →
        </Link>
        <Link href="/magias" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Ver todas as magias →
        </Link>
        <Link href="/deuses" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Ver os deuses do Panteão →
        </Link>
        <Link href="/personagem" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Como criar um personagem (9 passos) →
        </Link>
        <Link href="/regras" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Todas as regras do jogo →
        </Link>
      </div>
    </main>
  );
}
