import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";

export default function IndiceClasses() {
  const classes = carregarEntidades()
    .filter((e) => e.tipo === "classe")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Classes de Arton</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>
          {classes.length} {classes.length === 1 ? "classe" : "classes"} do Livro Básico
        </p>
        <div className="indice-lista">
          {classes.map((r) => {
            const imagem = r.imagens[0];
            return (
              <Link key={r.id} href={`/ficha/classe/${r.id}`} className="indice-linha">
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
