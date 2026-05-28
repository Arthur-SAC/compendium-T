import { carregarEntidades } from "@/lib/dados";
import { construirIndice } from "@/lib/busca";
import { Busca } from "@/components/Busca";
import { Divisor } from "@/components/Divisor";

export default function Home() {
  const ents = carregarEntidades();
  const indice = construirIndice(ents.map((e) => ({ id: e.id, tipo: e.tipo, nome: e.nome, resumo: e.resumo })));
  return (
    <main style={{ padding: 48 }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 40, textAlign: "center" }}>Compêndio de Arton</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-suave)", margin: "12px 0 28px" }}>Tormenta 20 — wiki de mesa</p>
      <Busca indice={indice} />
    </main>
  );
}
