import type { Entidade, ItemMecanica } from "@/lib/schema";
import { CATEGORIAS_EQUIP } from "@/lib/equipamento-categorias";

// Tabelas de equipamento DINÂMICAS para as páginas de regra. Geram uma string no formato
// pipe-table que o TextoBlocos.tsx renderiza (legenda + cabeçalho + grupos "--- X ---" + linhas).
// Listam TODOS os itens (tipo "item") de TODAS as fontes — auto-incluindo livros futuros —
// com uma coluna "Fonte" marcando a origem de cada linha. Nada é inventado: tudo vem das entidades.

// Rótulo curto da fonte de um item (slug do livro → nome curto). Fallback: o próprio slug.
const FONTE_CURTA: Record<string, string> = {
  "livro-basico": "Básico",
  "ameacas-de-arton": "Ameaças",
};
function fonteCurta(livro: string): string {
  return FONTE_CURTA[livro] ?? livro;
}

const mec = (e: Entidade): ItemMecanica => e.mecanica as unknown as ItemMecanica;
const ordenar = (a: Entidade, b: Entidade) => a.nome.localeCompare(b.nome, "pt-BR");
const v = (x: string | number | undefined | null): string =>
  x === undefined || x === null || x === "" ? "—" : String(x);

// Monta a string pipe-table a partir de uma legenda, cabeçalho e grupos (rótulo + linhas de células).
function montarPipe(caption: string, header: string[], grupos: { rotulo: string; linhas: string[][] }[]): string {
  const out: string[] = [caption, header.join(" | ")];
  for (const g of grupos) {
    if (g.linhas.length === 0) continue;
    out.push(`--- ${g.rotulo} ---`);
    for (const cels of g.linhas) out.push(cels.join(" | "));
  }
  return out.join("\n");
}

// Subgrupos de proficiência das armas (combina simples/marciais/exóticas/fogo numa só tabela).
const GRUPOS_ARMAS: { rotulo: string; proficiencia: string }[] = [
  { rotulo: "Armas Simples", proficiencia: "simples" },
  { rotulo: "Armas Marciais", proficiencia: "marcial" },
  { rotulo: "Armas Exóticas", proficiencia: "exótica" },
  { rotulo: "Armas de Fogo", proficiencia: "fogo" },
];

/**
 * Retorna uma tabela pipe (formato TextoBlocos) para a categoria de equipamento `slug`,
 * listando TODOS os itens (tipo "item") que casam, de TODAS as fontes, agrupados e ordenados
 * por nome (pt-BR). Inclui coluna "Fonte". Slugs suportados: "armaduras-escudos" e "armas".
 * Slug desconhecido → string vazia (marcador inofensivo).
 */
export function tabelaEquipamentoPipe(slug: string, entidades: Entidade[]): string {
  const itens = entidades.filter((e) => e.tipo === "item");

  if (slug === "armaduras-escudos") {
    const def = CATEGORIAS_EQUIP.find((c) => c.slug === "armaduras-escudos");
    const subgrupos = def?.subgrupos ?? [];
    const caption = `Tabela: ${def?.rotulo ?? "Armaduras & Escudos"}`;
    const header = ["Item", "Fonte", "Bônus na Defesa", "Penalidade", "Espaços", "Preço"];
    const grupos = subgrupos.map((sg) => ({
      rotulo: sg.rotulo,
      linhas: itens
        .filter((e) => sg.filtro(mec(e)))
        .sort(ordenar)
        .map((e) => {
          const m = mec(e);
          const bonus = m.protecao ? `+${m.protecao.bonusDefesa}` : "—";
          const pen = m.protecao ? String(m.protecao.penalidadeArmadura) : "—";
          return [e.nome, fonteCurta(e.fonte.livro), bonus, pen, v(m.espacos), v(m.preco)];
        }),
    }));
    return montarPipe(caption, header, grupos);
  }

  if (slug === "armas") {
    const caption = "Tabela: Armas";
    const header = ["Item", "Fonte", "Dano", "Crítico", "Tipo", "Alcance", "Espaços", "Preço"];
    const grupos = GRUPOS_ARMAS.map((g) => ({
      rotulo: g.rotulo,
      linhas: itens
        .filter((e) => {
          const m = mec(e);
          return m.categoria === "arma" && m.arma?.proficiencia === g.proficiencia;
        })
        .sort(ordenar)
        .map((e) => {
          const m = mec(e);
          const a = m.arma;
          return [
            e.nome,
            fonteCurta(e.fonte.livro),
            v(a?.dano),
            v(a?.critico),
            v(a?.tipoDano),
            v(a?.alcance ?? "—"),
            v(m.espacos),
            v(m.preco),
          ];
        }),
    }));
    return montarPipe(caption, header, grupos);
  }

  return "";
}
