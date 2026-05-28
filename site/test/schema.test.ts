import { expect, test } from "vitest";
import { EntidadeSchema, RelacaoSchema } from "@/lib/schema";

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
