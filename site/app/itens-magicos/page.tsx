import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { Entidade, ItemMagicoMecanica } from "@/lib/schema";

// Ordem dos tipos de item mágico, conforme o Cap. 8 do livro.
const ORDEM_TIPOS = [
  "Encanto de Arma", "Arma Específica", "Encanto de Armadura", "Armadura Específica",
  "Escudo Específico", "Poção", "Pergaminho", "Acessório", "Artefato",
] as const;

// Ordem das categorias de raridade (para subordenar dentro de um tipo).
const ORDEM_CATEGORIA: Record<string, number> = { "Menor": 1, "Médio": 2, "Maior": 3, "Artefato": 4 };

function mec(e: Entidade): ItemMagicoMecanica {
  return e.mecanica as unknown as ItemMagicoMecanica;
}

function LinhaItem({ item }: { item: Entidade }) {
  const m = mec(item);
  return (
    <Link href={`/ficha/item-magico/${item.id}`} className="indice-linha">
      <span className="indice-nome" style={{ fontSize: 18 }}>{item.nome}</span>
      {m.categoria && <span style={{ flexShrink: 0, fontSize: 9.5, letterSpacing: 1, textTransform: "uppercase", color: "var(--vermelho)", border: "1px solid var(--borda)", borderRadius: 12, padding: "1px 7px", fontWeight: 700 }}>{m.categoria}</span>}
      {m.preco && <span className="indice-meta">{m.preco}</span>}
      {item.resumo && <span className="indice-resumo">{item.resumo}</span>}
    </Link>
  );
}

export default function IndiceItensMagicos() {
  const entidades = carregarEntidades();
  const itens = entidades.filter((e) => e.tipo === "item-magico");
  const tipos = [...ORDEM_TIPOS, ...new Set(itens.map((i) => mec(i).tipoItem).filter((t): t is string => !!t && !ORDEM_TIPOS.includes(t as typeof ORDEM_TIPOS[number])))];
  const ordenar = (a: Entidade, b: Entidade) =>
    (ORDEM_CATEGORIA[mec(a).categoria ?? ""] ?? 9) - (ORDEM_CATEGORIA[mec(b).categoria ?? ""] ?? 9) ||
    a.nome.localeCompare(b.nome, "pt-BR");

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Itens Mágicos</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 24px", fontFamily: "var(--serifa)" }}>
          {itens.length} {itens.length === 1 ? "item mágico" : "itens mágicos"} — Livro Básico
        </p>

        <section style={{ background: "rgba(177,39,58,.06)", border: "1px solid var(--borda-suave)", borderRadius: 12, padding: "16px 20px", margin: "0 0 28px" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--vermelho)", fontWeight: 700, marginBottom: 4 }}>Regras de Recompensas (Cap. 8)</div>
          <div className="indice-lista">
            {[
              { id: "pontos-de-experiencia", t: "Pontos de Experiência", d: "Como ganhar XP e subir de nível." },
              { id: "tesouros", t: "Tesouros", d: "Tesouro por ND, riquezas e recompensas." },
              { id: "itens-magicos", t: "Itens Mágicos (regras)", d: "Usar, identificar, fabricar e encantar itens." },
            ].filter((r) => entidades.some((e) => e.id === r.id && e.tipo === "regra-de-criacao")).map((r) => (
              <Link key={r.id} href={`/ficha/regra-de-criacao/${r.id}`} className="indice-linha">
                <span className="indice-nome">{r.t}</span>
                <span className="indice-resumo">{r.d}</span>
              </Link>
            ))}
          </div>
        </section>

        {tipos.map((tipo) => {
          const sublista = itens.filter((i) => mec(i).tipoItem === tipo).sort(ordenar);
          if (sublista.length === 0) return null;
          return (
            <section key={tipo} style={{ marginBottom: 8 }}>
              <h3 className="indice-grupo-titulo" style={{ fontSize: 14 }}>
                {tipo} ({sublista.length})
              </h3>
              <div className="indice-lista">
                {sublista.map((i) => <LinhaItem key={i.id} item={i} />)}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
