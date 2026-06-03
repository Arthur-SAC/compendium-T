import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { Entidade } from "@/lib/schema";

// As três seções macro do Capítulo 9 (Mundo de Arton), na ordem do livro.
const ORDEM_SECOES = ["Mundo de Arton", "O Reinado", "Além do Reinado"] as const;

function secaoDe(e: Entidade): string {
  const s = (e.mecanica as Record<string, unknown>).secao;
  return typeof s === "string" ? s : "Além do Reinado";
}

function LinhaRegiao({ regiao }: { regiao: Entidade }) {
  const m = regiao.mecanica as Record<string, unknown>;
  const epiteto = typeof m.epiteto === "string" ? m.epiteto : null;
  return (
    <Link href={`/ficha/regiao/${regiao.id}`} className="indice-linha">
      <span className="indice-nome">{regiao.nome}</span>
      {epiteto && <span className="indice-meta" style={{ fontStyle: "italic" }}>{epiteto}</span>}
      <span className="indice-resumo">{regiao.resumo}</span>
    </Link>
  );
}

export default function IndiceMundo() {
  const entidades = carregarEntidades();
  const regioes = entidades.filter((e) => e.tipo === "regiao");
  const ordenarPagina = (a: Entidade, b: Entidade) => a.fonte.pagina - b.fonte.pagina;

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Mundo de Arton</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 24px", fontFamily: "var(--serifa)" }}>
          {regioes.length} {regioes.length === 1 ? "região" : "regiões"} — O Reinado e Além do Reinado · Livro Básico
        </p>

        {ORDEM_SECOES.map((secao) => {
          const sublista = regioes.filter((r) => secaoDe(r) === secao).sort(ordenarPagina);
          if (sublista.length === 0) return null;
          return (
            <section key={secao} style={{ marginBottom: 8 }}>
              <h3 className="indice-grupo-titulo" style={{ fontSize: 14 }}>
                {secao} ({sublista.length})
              </h3>
              <div className="indice-lista">
                {sublista.map((r) => <LinhaRegiao key={r.id} regiao={r} />)}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
