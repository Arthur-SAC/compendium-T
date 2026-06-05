import Link from "next/link";
import { carregarEntidades, tituloFonte } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import { SeloFonte } from "@/components/SeloFonte";

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
          {racas.length} {racas.length === 1 ? "raça" : "raças"} de Arton
        </p>
        <div className="indice-cards">
          {racas.map((r) => {
            const imagem = r.imagens[0];
            return (
              <Link key={r.id} href={`/ficha/raca/${r.id}`} className="indice-card">
                <span className="indice-card-fig">
                  {imagem && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagem} alt={r.nome} />
                  )}
                </span>
                <span className="indice-card-body">
                  <span className="indice-card-nome">{r.nome}</span>
                  <span className="indice-card-resumo">{r.resumo}</span>
                  <span style={{ marginTop: 6 }}><SeloFonte titulo={tituloFonte(r.fonte.livro)} /></span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
