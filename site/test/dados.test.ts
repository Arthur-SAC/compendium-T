import { expect, test } from "vitest";
import { carregarEntidades, carregarTermos } from "@/lib/dados";

test("carrega todas as entidades do data/ e encontra o Súcubo", () => {
  const ents = carregarEntidades();
  const sucubo = ents.find((e) => e.id === "sucubo");
  expect(sucubo?.nome).toBe("Súcubo");
});

test("carrega os termos (condições + glossário)", () => {
  const termos = carregarTermos();
  expect(termos.some((t) => t.id === "medo")).toBe(true);
  expect(termos.some((t) => t.id === "nd")).toBe(true);
});
