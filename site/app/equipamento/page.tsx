import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";
import type { Entidade, ItemMecanica } from "@/lib/schema";

// Subgrupo opcional dentro de um grupo (ex.: armas por proficiência).
type Subgrupo = { rotulo: string; filtro: (m: ItemMecanica) => boolean };

const ORDEM_CATEGORIAS: { chaves: string[]; rotulo: string; subgrupos?: Subgrupo[] }[] = [
  {
    chaves: ["arma"],
    rotulo: "Armas",
    subgrupos: [
      { rotulo: "Simples", filtro: (m) => m.arma?.proficiencia === "simples" },
      { rotulo: "Marciais", filtro: (m) => m.arma?.proficiencia === "marcial" },
      { rotulo: "Exóticas", filtro: (m) => m.arma?.proficiencia === "exótica" },
      { rotulo: "De Fogo", filtro: (m) => m.arma?.proficiencia === "fogo" },
    ],
  },
  {
    chaves: ["armadura", "escudo"],
    rotulo: "Armaduras & Escudos",
    subgrupos: [
      { rotulo: "Armaduras Leves", filtro: (m) => m.categoria === "armadura" && m.protecao?.subcategoria === "leve" },
      { rotulo: "Armaduras Pesadas", filtro: (m) => m.categoria === "armadura" && m.protecao?.subcategoria === "pesada" },
      { rotulo: "Escudos", filtro: (m) => m.categoria === "escudo" },
    ],
  },
  { chaves: ["municao"], rotulo: "Munições" },
  { chaves: ["item-aventura"], rotulo: "Equipamento de Aventura" },
  { chaves: ["ferramenta"], rotulo: "Ferramentas" },
  { chaves: ["vestuario"], rotulo: "Vestuário" },
  { chaves: ["esoterico"], rotulo: "Esotéricos" },
  { chaves: ["alquimico"], rotulo: "Alquímicos" },
  { chaves: ["alimentacao"], rotulo: "Alimentação" },
  { chaves: ["animal"], rotulo: "Animais" },
  { chaves: ["veiculo"], rotulo: "Veículos" },
  { chaves: ["servico"], rotulo: "Serviços" },
];

function mec(it: Entidade): ItemMecanica {
  return it.mecanica as unknown as ItemMecanica;
}

function subtitulo(m: ItemMecanica): string {
  if (m.arma) return `Dano ${m.arma.dano} · Crít. ${m.arma.critico}`;
  if (m.protecao) return `Defesa +${m.protecao.bonusDefesa} · Pen. ${m.protecao.penalidadeArmadura}`;
  return m.preco ?? "";
}

function CardItem({ it }: { it: Entidade }) {
  const m = mec(it);
  return (
    <Link
      href={`/ficha/item/${it.id}`}
      style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
    >
      <div style={{ padding: "13px 14px 11px", background: "radial-gradient(120% 90% at 50% 0%, rgba(155,28,46,.08), transparent 70%)", borderBottom: "1px solid var(--borda)" }}>
        <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 20, letterSpacing: ".5px" }}>{it.nome}</strong>
        <p style={{ fontFamily: "var(--serifa)", fontSize: 12, color: "var(--tinta-suave)", lineHeight: 1.4, margin: "3px 0 0" }}>{subtitulo(m)}</p>
      </div>
    </Link>
  );
}

function Grade({ itens }: { itens: Entidade[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
      {itens.map((it) => (
        <CardItem key={it.id} it={it} />
      ))}
    </div>
  );
}

export default function IndiceEquipamento() {
  const entidades = carregarEntidades();
  const itens = entidades.filter((e) => e.tipo === "item");
  const regra = entidades.find((e) => e.id === "riqueza-e-equipamento");

  const grupos: Record<string, Entidade[]> = {};
  for (const it of itens) {
    const cat = mec(it).categoria ?? "outros";
    (grupos[cat] ??= []).push(it);
  }
  const ordenar = (a: Entidade, b: Entidade) => a.nome.localeCompare(b.nome, "pt-BR");

  return (
    <main style={{ padding: 48, maxWidth: 1060, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Equipamento</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 12px", fontFamily: "var(--serifa)" }}>
        {itens.length} {itens.length === 1 ? "item" : "itens"} do Livro Básico
      </p>

      {regra && (
        <section style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, padding: "16px 20px", margin: "0 0 28px", boxShadow: "0 10px 28px rgba(0,0,0,.4)" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700, marginBottom: 6 }}>Como funciona o Equipamento</div>
          <ul style={{ fontFamily: "var(--serifa)", color: "var(--tinta)", lineHeight: 1.6, fontSize: 14, margin: "0 0 10px", paddingLeft: 18 }}>
            <li>A moeda padrão do Reinado é o <strong style={{ color: "var(--carmesim)" }}>Tibar (T$)</strong>, uma peça de prata. 1 TO (ouro) = T$ 10; 1 T$ = 10 TC (cobre).</li>
            <li>Você pode <strong style={{ color: "var(--carmesim)" }}>carregar 10 + 2×Força espaços</strong>; ultrapassar o limite deixa você sobrecarregado.</li>
            <li>Você pode <strong style={{ color: "var(--carmesim)" }}>empunhar até 2 itens</strong> ao mesmo tempo e receber benefícios de no máximo <strong style={{ color: "var(--carmesim)" }}>4 itens vestidos</strong>.</li>
          </ul>
          <Link href={`/ficha/${regra.tipo}/${regra.id}`} style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", fontSize: 13, borderBottom: "1px solid rgba(232,192,106,.4)" }}>
            Ver as regras completas de Equipamento →
          </Link>
        </section>
      )}

      {ORDEM_CATEGORIAS.map(({ chaves, rotulo, subgrupos }) => {
        const lista = chaves.flatMap((c) => grupos[c] ?? []).sort(ordenar);
        if (lista.length === 0) return null;
        return (
          <section key={rotulo} style={{ marginBottom: 32 }}>
            <h2 className="titulo-grimorio" style={{ fontSize: 28, margin: "0 0 14px", color: "var(--ouro)" }}>{rotulo}</h2>
            {subgrupos ? (
              subgrupos.map((sg) => {
                const sublista = lista.filter((it) => sg.filtro(mec(it)));
                if (sublista.length === 0) return null;
                return (
                  <div key={sg.rotulo} style={{ marginBottom: 18 }}>
                    <h3 style={{ fontFamily: "var(--serifa)", fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 12px" }}>
                      {sg.rotulo} <span style={{ color: "var(--tinta-suave)", fontWeight: 400 }}>({sublista.length})</span>
                    </h3>
                    <Grade itens={sublista} />
                  </div>
                );
              })
            ) : (
              <Grade itens={lista} />
            )}
          </section>
        );
      })}
    </main>
  );
}
