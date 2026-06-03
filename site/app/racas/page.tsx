import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";

export default function IndiceRacas() {
  const racas = carregarEntidades()
    .filter((e) => e.tipo === "raca")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Raças de Arton</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>
          {racas.length} {racas.length === 1 ? "raça" : "raças"} do Livro Básico
        </p>
        <div className="indice-lista">
          {racas.map((r) => {
            const imagem = r.imagens[0];
            return (
              <Link key={r.id} href={`/ficha/raca/${r.id}`} className="indice-linha">
                {imagem && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagem} alt={r.nome} className="indice-thumb" />
                )}
                <span className="indice-nome">{r.nome}</span>
                <span className="indice-resumo">{r.resumo}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
