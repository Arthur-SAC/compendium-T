import { carregarEntidades } from "@/lib/dados";
import { construirIndice } from "@/lib/busca";
import { Busca } from "@/components/Busca";
import { Divisor } from "@/components/Divisor";

export default function Home() {
  const ents = carregarEntidades();
  const indice = construirIndice(ents.map((e) => ({ id: e.id, tipo: e.tipo, nome: e.nome, resumo: e.resumo })));
  return (
    <main className="folha-main">
      <div className="folha" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 className="titulo-grimorio" style={{ fontSize: 56, textAlign: "center" }}>Compêndio de Arton</h1>
        <Divisor />
        <div style={{ marginTop: 28 }}>
          <Busca indice={indice} />
        </div>
      </div>
    </main>
  );
}
