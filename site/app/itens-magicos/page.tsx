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

function CardItem({ item }: { item: Entidade }) {
  const m = mec(item);
  return (
    <Link
      href={`/ficha/item-magico/${item.id}`}
      style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
    >
      <div style={{ padding: "12px 14px 12px", background: "radial-gradient(120% 90% at 50% 0%, rgba(155,28,46,.08), transparent 70%)", borderBottom: "1px solid var(--borda)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 17, letterSpacing: ".3px" }}>{item.nome}</strong>
          {m.categoria && <span style={{ flexShrink: 0, fontSize: 9.5, letterSpacing: 1, textTransform: "uppercase", color: "var(--ouro)", border: "1px solid var(--ouro)", borderRadius: 12, padding: "1px 7px", fontWeight: 700 }}>{m.categoria}</span>}
        </div>
        {m.preco && <p style={{ fontFamily: "var(--serifa)", fontSize: 12, color: "var(--ouro)", margin: "3px 0 0" }}>{m.preco}</p>}
        {item.resumo && <p style={{ fontFamily: "var(--serifa)", fontSize: 12, color: "var(--tinta-suave)", lineHeight: 1.4, margin: "4px 0 0" }}>{item.resumo}</p>}
      </div>
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
    <main style={{ padding: 48, maxWidth: 1480, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Itens Mágicos</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 24px", fontFamily: "var(--serifa)" }}>
        {itens.length} {itens.length === 1 ? "item mágico" : "itens mágicos"} — Livro Básico
      </p>

      <section style={{ marginBottom: 30 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700, marginBottom: 10 }}>Regras de Recompensas (Cap. 8)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {[
            { id: "pontos-de-experiencia", t: "Pontos de Experiência", d: "Como ganhar XP e subir de nível." },
            { id: "tesouros", t: "Tesouros", d: "Tesouro por ND, riquezas e recompensas." },
            { id: "itens-magicos", t: "Itens Mágicos (regras)", d: "Usar, identificar, fabricar e encantar itens." },
          ].filter((r) => entidades.some((e) => e.id === r.id && e.tipo === "regra-de-criacao")).map((r) => (
            <Link key={r.id} href={`/ficha/regra-de-criacao/${r.id}`} style={{ display: "block", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, padding: "14px 16px", boxShadow: "0 8px 22px rgba(0,0,0,.4)" }}>
              <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 17 }}>{r.t}</strong>
              <p style={{ fontFamily: "var(--serifa)", fontSize: 12.5, color: "var(--tinta-suave)", lineHeight: 1.45, margin: "4px 0 0" }}>{r.d}</p>
            </Link>
          ))}
        </div>
      </section>

      {tipos.map((tipo) => {
        const sublista = itens.filter((i) => mec(i).tipoItem === tipo).sort(ordenar);
        if (sublista.length === 0) return null;
        return (
          <section key={tipo} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "var(--serifa)", fontSize: 14, textTransform: "uppercase", letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 14px" }}>
              {tipo} <span style={{ color: "var(--tinta-suave)", fontWeight: 400 }}>({sublista.length})</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
              {sublista.map((i) => <CardItem key={i.id} item={i} />)}
            </div>
          </section>
        );
      })}
    </main>
  );
}
