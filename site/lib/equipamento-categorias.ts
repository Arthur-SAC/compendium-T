import type { ItemMecanica } from "@/lib/schema";

// Subgrupo opcional dentro de uma categoria (ex.: armas por proficiência).
export type Subgrupo = { rotulo: string; filtro: (m: ItemMecanica) => boolean };
export type CategoriaEquip = { slug: string; rotulo: string; chaves: string[]; subgrupos?: Subgrupo[] };

export const CATEGORIAS_EQUIP: CategoriaEquip[] = [
  {
    slug: "armas",
    rotulo: "Armas",
    chaves: ["arma"],
    subgrupos: [
      { rotulo: "Simples", filtro: (m) => m.arma?.proficiencia === "simples" },
      { rotulo: "Marciais", filtro: (m) => m.arma?.proficiencia === "marcial" },
      { rotulo: "Exóticas", filtro: (m) => m.arma?.proficiencia === "exótica" },
      { rotulo: "De Fogo", filtro: (m) => m.arma?.proficiencia === "fogo" },
    ],
  },
  {
    slug: "armaduras-escudos",
    rotulo: "Armaduras & Escudos",
    chaves: ["armadura", "escudo"],
    subgrupos: [
      { rotulo: "Armaduras Leves", filtro: (m) => m.categoria === "armadura" && m.protecao?.subcategoria === "leve" },
      { rotulo: "Armaduras Pesadas", filtro: (m) => m.categoria === "armadura" && m.protecao?.subcategoria === "pesada" },
      { rotulo: "Escudos", filtro: (m) => m.categoria === "escudo" },
    ],
  },
  { slug: "municoes", rotulo: "Munições", chaves: ["municao"] },
  { slug: "aventura", rotulo: "Equipamento de Aventura", chaves: ["item-aventura"] },
  { slug: "ferramentas", rotulo: "Ferramentas", chaves: ["ferramenta"] },
  { slug: "vestuario", rotulo: "Vestuário", chaves: ["vestuario"] },
  { slug: "esotericos", rotulo: "Esotéricos", chaves: ["esoterico"] },
  { slug: "alquimicos", rotulo: "Alquímicos", chaves: ["alquimico"] },
  { slug: "alimentacao", rotulo: "Alimentação", chaves: ["alimentacao"] },
  { slug: "animais", rotulo: "Animais", chaves: ["animal"] },
  { slug: "veiculos", rotulo: "Veículos", chaves: ["veiculo"] },
  { slug: "servicos", rotulo: "Serviços", chaves: ["servico"] },
];

// Reúne todas as informações mecânicas do item (menos as explicações das habilidades).
export function statsDoItem(m: ItemMecanica): string[] {
  const partes: string[] = [];
  if (m.arma) {
    partes.push(`Dano ${m.arma.dano}`, `Crít. ${m.arma.critico}`, m.arma.tipoDano, m.arma.empunhadura);
    if (m.arma.alcance) partes.push(`Alcance ${m.arma.alcance}`);
  } else if (m.protecao) {
    partes.push(`Defesa +${m.protecao.bonusDefesa}`, `Penalidade ${m.protecao.penalidadeArmadura}`);
    if (m.protecao.danoAtaque) partes.push(`Dano ${m.protecao.danoAtaque}`);
  }
  if (m.espacos) partes.push(`${m.espacos} ${m.espacos === "1" ? "espaço" : "espaços"}`);
  if (m.preco) partes.push(m.preco);
  return partes.filter(Boolean);
}
