// Config declarativa da navegação. Sem React aqui — só dados + helpers puros.
// Consumido por NavGlobal (esquerda) e BarraContexto (direita).

export type Categoria = { id: string; rotulo: string; rota: string };

export const CATEGORIAS: Categoria[] = [
  { id: "personagem", rotulo: "Personagem", rota: "/personagem" },
  { id: "racas", rotulo: "Raças", rota: "/racas" },
  { id: "classes", rotulo: "Classes", rota: "/classes" },
  { id: "origens", rotulo: "Origens", rota: "/origens" },
  { id: "pericias", rotulo: "Perícias", rota: "/pericias" },
  { id: "poderes", rotulo: "Poderes", rota: "/poderes" },
  { id: "equipamento", rotulo: "Equipamento", rota: "/equipamento" },
  { id: "itens-magicos", rotulo: "Itens Mágicos", rota: "/itens-magicos" },
  { id: "magias", rotulo: "Magias", rota: "/magias" },
  { id: "deuses", rotulo: "Deuses", rota: "/deuses" },
  { id: "bestiario", rotulo: "Bestiário", rota: "/bestiario" },
  { id: "mundo", rotulo: "Mundo", rota: "/mundo" },
  { id: "regras", rotulo: "Regras", rota: "/regras" },
];

// Mapa de tipo de entidade → área (para fichas /ficha/<tipo>/<id>).
const TIPO_PARA_AREA: Record<string, string> = {
  raca: "racas",
  classe: "classes",
  origem: "origens",
  pericia: "pericias",
  poder: "poderes",
  item: "equipamento",
  "item-magico": "itens-magicos",
  magia: "magias",
  divindade: "deuses",
  criatura: "bestiario",
  regiao: "mundo",
  "regra-de-criacao": "regras",
};

/** Deriva a área (id de categoria) a partir do pathname. "" se nenhuma. */
export function areaDoPath(pathname: string): string {
  if (pathname.startsWith("/ficha/")) {
    const tipo = pathname.split("/")[2] ?? "";
    return TIPO_PARA_AREA[tipo] ?? "";
  }
  const seg = pathname.split("/").filter(Boolean)[0] ?? "";
  return CATEGORIAS.some((c) => c.id === seg) ? seg : "";
}

// Sub-seções por área (links de âncora dentro do índice da área).
// Magias/Poderes/Equipamento/Bestiário agora têm páginas próprias por grupo (menu no índice),
// então não usam mais âncoras aqui.
export type SubSecao = { id: string; rotulo: string };
export const SUBSECOES: Record<string, SubSecao[]> = {};

export function subsecoesDaArea(area: string): SubSecao[] {
  return SUBSECOES[area] ?? [];
}

// Regras tagueadas por área (fonte única em /regras; referência multi-área).
export const REGRAS_POR_AREA: Record<string, string[]> = {
  personagem: ["construcao-de-personagem", "atributos", "caracteristicas-derivadas", "nome-idade-e-envelhecimento", "alinhamento", "evolucao-de-personagem"],
  racas: ["caracteristicas-das-racas"],
  classes: ["classes-como-funcionam", "evolucao-de-personagem"],
  origens: ["construcao-origens"],
  pericias: ["pericias-como-funcionam"],
  poderes: ["poderes-como-funcionam"],
  equipamento: ["regras-de-armas", "regras-de-armaduras", "itens-superiores", "itens-magicos", "regras-de-itens-especiais", "riqueza-e-equipamento"],
  "itens-magicos": ["itens-magicos", "itens-superiores", "tesouros"],
  magias: ["magia-como-funciona", "caracteristicas-das-magias", "aprimoramentos-de-magia"],
  deuses: ["devocao-como-funciona", "deuses-menores"],
  bestiario: ["construindo-combates", "perigos", "fichas-de-npcs"],
  mundo: ["mundo-de-arton", "linha-do-tempo", "nomes-em-arton"],
};

export function regrasDaArea(area: string): string[] {
  return REGRAS_POR_AREA[area] ?? [];
}

// Rótulos legíveis das regras (usado client-side na BarraContexto, sem carregar os dados).
export const ROTULOS_REGRA: Record<string, string> = {
  "construcao-de-personagem": "Construção de Personagem",
  atributos: "Atributos",
  "caracteristicas-derivadas": "Características Derivadas",
  "nome-idade-e-envelhecimento": "Nome, Idade e Envelhecimento",
  alinhamento: "Alinhamento",
  "evolucao-de-personagem": "Evolução de Personagem",
  "caracteristicas-das-racas": "Características das Raças",
  "classes-como-funcionam": "Como Funcionam as Classes",
  "construcao-origens": "Como Funcionam as Origens",
  "pericias-como-funcionam": "Como Funcionam as Perícias",
  "poderes-como-funcionam": "Como Funcionam os Poderes",
  "regras-de-armas": "Regras de Armas",
  "regras-de-armaduras": "Regras de Armaduras",
  "itens-superiores": "Itens Superiores",
  "itens-magicos": "Itens Mágicos",
  "regras-de-itens-especiais": "Itens Especiais (venenos, pratos…)",
  "riqueza-e-equipamento": "Riqueza & Equipamento",
  tesouros: "Tesouros",
  "magia-como-funciona": "Como Funciona a Magia",
  "caracteristicas-das-magias": "Características das Magias",
  "aprimoramentos-de-magia": "Aprimoramentos de Magia",
  "devocao-como-funciona": "Devoção",
  "deuses-menores": "Deuses Menores",
  "construindo-combates": "Construindo Combates",
  perigos: "Perigos",
  "fichas-de-npcs": "Fichas de NPCs",
  "mundo-de-arton": "Mundo de Arton (Cosmologia)",
  "linha-do-tempo": "Linha do Tempo",
  "nomes-em-arton": "Nomes em Arton",
};

export function rotuloRegra(id: string): string {
  return ROTULOS_REGRA[id] ?? id;
}
