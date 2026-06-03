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

function LinhaItem({ it }: { it: Entidade }) {
  const m = mec(it);
  const meta = subtitulo(m);
  return (
    <Link href={`/ficha/item/${it.id}`} className="indice-linha">
      <span className="indice-nome">{it.nome}</span>
      {meta && <span className="indice-meta">{meta}</span>}
    </Link>
  );
}

function Lista({ itens }: { itens: Entidade[] }) {
  return (
    <div className="indice-lista">
      {itens.map((it) => (
        <LinhaItem key={it.id} it={it} />
      ))}
    </div>
  );
}

const REGRAS_EQUIPAMENTO: { id: string; rotulo: string }[] = [
  { id: "riqueza-e-equipamento", rotulo: "Riqueza & Moedas" },
  { id: "regras-de-armas", rotulo: "Regras de Armas" },
  { id: "regras-de-armaduras", rotulo: "Armaduras & Escudos" },
  { id: "regras-de-itens-especiais", rotulo: "Venenos, Pratos & Instrumentos" },
  { id: "itens-superiores", rotulo: "Itens Superiores & Materiais" },
];

export default function IndiceEquipamento() {
  const entidades = carregarEntidades();
  const itens = entidades.filter((e) => e.tipo === "item");
  const regra = entidades.find((e) => e.id === "riqueza-e-equipamento");
  const regras = REGRAS_EQUIPAMENTO.map((r) => ({ ...r, ent: entidades.find((e) => e.id === r.id) })).filter((r) => r.ent);

  const grupos: Record<string, Entidade[]> = {};
  for (const it of itens) {
    const cat = mec(it).categoria ?? "outros";
    (grupos[cat] ??= []).push(it);
  }
  const ordenar = (a: Entidade, b: Entidade) => a.nome.localeCompare(b.nome, "pt-BR");

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Equipamento</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 12px", fontFamily: "var(--serifa)" }}>
          {itens.length} {itens.length === 1 ? "item" : "itens"} do Livro Básico
        </p>

        {regra && (
          <section style={{ background: "rgba(177,39,58,.06)", border: "1px solid var(--borda-suave)", borderRadius: 12, padding: "16px 20px", margin: "0 0 28px" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--vermelho)", fontWeight: 700, marginBottom: 6 }}>Como funciona o Equipamento</div>
            <ul style={{ fontFamily: "var(--serifa)", color: "var(--tinta)", lineHeight: 1.6, fontSize: 14, margin: "0 0 10px", paddingLeft: 18 }}>
              <li>A moeda padrão do Reinado é o <strong style={{ color: "var(--carmesim)" }}>Tibar (T$)</strong>, uma peça de prata. 1 TO (ouro) = T$ 10; 1 T$ = 10 TC (cobre).</li>
              <li>Você pode <strong style={{ color: "var(--carmesim)" }}>carregar 10 + 2×Força espaços</strong>; ultrapassar o limite deixa você sobrecarregado.</li>
              <li>Você pode <strong style={{ color: "var(--carmesim)" }}>empunhar até 2 itens</strong> ao mesmo tempo e receber benefícios de no máximo <strong style={{ color: "var(--carmesim)" }}>4 itens vestidos</strong>.</li>
            </ul>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 4 }}>
              <span style={{ fontFamily: "var(--serifa)", fontSize: 13, color: "var(--tinta-suave)" }}>Regras completas:</span>
              {regras.map((r, i) => (
                <span key={r.id} style={{ fontFamily: "var(--serifa)", fontSize: 13 }}>
                  <Link href={`/ficha/${r.ent!.tipo}/${r.ent!.id}`} style={{ color: "var(--carmesim)", textDecoration: "none", borderBottom: "1px solid var(--borda-suave)" }}>{r.rotulo}</Link>
                  {i < regras.length - 1 ? <span style={{ color: "var(--tinta-suave)" }}> · </span> : null}
                </span>
              ))}
            </div>
          </section>
        )}

        {ORDEM_CATEGORIAS.map(({ chaves, rotulo, subgrupos }) => {
          const lista = chaves.flatMap((c) => grupos[c] ?? []).sort(ordenar);
          if (lista.length === 0) return null;
          return (
            <section key={rotulo} style={{ marginBottom: 32 }}>
              <h3 className="indice-grupo-titulo" style={{ fontSize: 16 }}>{rotulo}</h3>
              {subgrupos ? (
                subgrupos.map((sg) => {
                  const sublista = lista.filter((it) => sg.filtro(mec(it)));
                  if (sublista.length === 0) return null;
                  return (
                    <div key={sg.rotulo}>
                      <h4 className="indice-grupo-titulo" style={{ fontSize: 12, marginTop: 18, borderBottomWidth: 1 }}>
                        {sg.rotulo} ({sublista.length})
                      </h4>
                      <Lista itens={sublista} />
                    </div>
                  );
                })
              ) : (
                <Lista itens={lista} />
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
