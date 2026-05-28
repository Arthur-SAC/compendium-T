import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import { EntidadeSchema, TermoSchema } from "@/lib/schema";

const RAIZ = join(__dirname, "..", "..", "data");

test("Súcubo (seed) é uma entidade válida", () => {
  const json = JSON.parse(readFileSync(join(RAIZ, "livro-basico/criaturas/sucubo.json"), "utf8"));
  expect(() => EntidadeSchema.parse(json)).not.toThrow();
});

test("condições do seed são termos válidos", () => {
  const arr = JSON.parse(readFileSync(join(RAIZ, "referencia/condicoes.json"), "utf8"));
  for (const t of arr) expect(() => TermoSchema.parse(t)).not.toThrow();
});
