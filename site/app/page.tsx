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
    <main className="folha-main">
      <div className="folha" style={{ maxWidth: 1040, margin: "18px auto" }}>
        <h1 className="titulo-grimorio" style={{ fontSize: 52, textAlign: "center" }}>Compêndio de Arton</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>
          Tormenta 20 — wiki de mesa. Use os menus laterais para navegar, ou busque abaixo.
        </p>
        <Busca indice={indice} />

        <div className="indice-lista" style={{ marginTop: 30 }}>
          {DESTAQUES.map((d) => (
            <Link key={d.href} href={d.href} className="indice-linha">
              <span className="indice-nome">{d.titulo}</span>
              <span className="indice-resumo">{d.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
