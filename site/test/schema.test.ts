import { expect, test } from "vitest";
import { EntidadeSchema, RelacaoSchema, RacaMecanicaSchema } from "@/lib/schema";

const baseValida = {
  id: "sucubo",
  tipo: "criatura",
  nome: "Súcubo",
  resumo: "Sedutora abissal que devora almas.",
  fonte: { livro: "ameacas-de-arton", pagina: 120 },
  imagens: [],
  secoes: [{ titulo: "Habilidades", texto: "Beijo Vampírico." }],
  relacoes: [{ tipo: "serve", alvoId: "sszzaas", alvoTipo: "divindade", rotulo: "serve Sszzaas" }],
  mecanica: { nd: "5", pv: 140, defesa: 21 },
};

test("aceita entidade válida", () => {
  expect(() => EntidadeSchema.parse(baseValida)).not.toThrow();
});

test("rejeita entidade sem fonte (provtência obrigatória)", () => {
  const { fonte, ...semFonte } = baseValida;
  expect(() => EntidadeSchema.parse(semFonte)).toThrow();
});

test("rejeita tipo desconhecido", () => {
  expect(() => EntidadeSchema.parse({ ...baseValida, tipo: "banana" })).toThrow();
});

test("relação exige alvoId e tipo", () => {
  expect(() => RelacaoSchema.parse({ tipo: "serve" })).toThrow();
});

const racaValida = {
  id: "humano", tipo: "raca", nome: "Humano", resumo: "O povo mais versátil.",
  fonte: { livro: "livro-basico", pagina: 19 },
  imagens: [], secoes: [], relacoes: [],
  mecanica: {
    modificadores: [{ valor: 1, escolha: true, quantidade: 3 }],
    tamanho: "Médio", deslocamento: 9,
    habilidades: [{ nome: "Versátil", descricao: "Você se torna treinado em duas perícias." }],
  },
};

test("RacaMecanicaSchema aceita modificador fixo e de escolha", () => {
  expect(() =>
    RacaMecanicaSchema.parse({
      modificadores: [{ atributo: "Força", valor: 2 }, { valor: 1, escolha: true, quantidade: 3 }],
      tamanho: "Médio", deslocamento: 9, habilidades: [],
    })
  ).not.toThrow();
});

test("RacaMecanicaSchema rejeita atributo fora do enum", () => {
  expect(() =>
    RacaMecanicaSchema.parse({ modificadores: [{ atributo: "Sorte", valor: 1 }], tamanho: "Médio", deslocamento: 9, habilidades: [] })
  ).toThrow();
});

test("entidade tipo raca aceita mecânica de raça válida", () => {
  expect(() => EntidadeSchema.parse(racaValida)).not.toThrow();
});

test("entidade tipo raca rejeita mecânica sem tamanho", () => {
  const ruim = { ...racaValida, mecanica: { modificadores: [], deslocamento: 9, habilidades: [] } };
  expect(() => EntidadeSchema.parse(ruim)).toThrow();
});
