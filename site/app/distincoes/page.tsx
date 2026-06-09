import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { Entidade } from "@/lib/schema";

// resumo do card: usa o `resumo`; se faltar, cai para o início da "Descrição".
function resumoCard(e: Entidade): string {
  if (e.resumo?.trim()) return e.resumo;
  const desc = e.secoes.find((s) => /descri[çc][ãa]o/i.test(s.titulo))?.texto ?? e.secoes[0]?.texto ?? "";
  const t = desc.trim();
  return t.length > 160 ? t.slice(0, 160).trimEnd() + "…" : t;
}

export default function IndiceDistincoes() {
  const distincoes = carregarEntidades()
    .filter((e) => e.tipo === "distincao")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Distinções</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>
          {distincoes.length} {distincoes.length === 1 ? "distinção" : "distinções"} — arquétipos, ordens e caminhos especiais de Arton
        </p>
        <div className="indice-cards">
          {distincoes.map((r) => {
            const imagem = r.imagens[0];
            return (
              <Link key={r.id} href={`/ficha/distincao/${r.id}`} className="indice-card">
                <span className="indice-card-fig">
                  {imagem && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagem} alt={r.nome} loading="lazy" decoding="async" />
                  )}
                </span>
                <span className="indice-card-body">
                  <span className="indice-card-nome">{r.nome}</span>
                  <span className="indice-card-resumo">{resumoCard(r)}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
