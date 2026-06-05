import { expect, test } from "vitest";
import { carregarEntidades, carregarTermos } from "@/lib/dados";
import { carregarFontes, tituloFonte } from "@/lib/dados";

test("carrega todas as entidades do data/ e encontra o Súcubo", () => {
  const ents = carregarEntidades();
  const sucubo = ents.find((e) => e.id === "sucubo");
  expect(sucubo?.nome).toBe("Súcubo");
});

test("carrega os termos (condições + glossário + ações)", () => {
  const termos = carregarTermos();
  expect(termos.some((t) => t.id === "medo")).toBe(true);
  expect(termos.some((t) => t.id === "nd")).toBe(true);
  // ações/manobras entram como termos marcados com exigeMaiuscula
  const atropelar = termos.find((t) => t.id === "atropelar");
  expect(atropelar?.exigeMaiuscula).toBe(true);
  expect(atropelar?.descricao).toMatch(/criatura/);
});

test("carregarEntidades memoiza (mesma referência entre chamadas)", () => {
  expect(carregarEntidades()).toBe(carregarEntidades());
});

test("carregarTermos memoiza (mesma referência entre chamadas)", () => {
  expect(carregarTermos()).toBe(carregarTermos());
});

test("carregarFontes lê sources.json em ordem (Básico primeiro)", () => {
  const fontes = carregarFontes();
  expect(fontes[0].slug).toBe("livro-basico");
  expect(fontes.some((f) => f.slug === "ameacas-de-arton")).toBe(true);
});

test("tituloFonte mapeia slug -> título; desconhecido cai no próprio slug", () => {
  expect(tituloFonte("livro-basico")).toBe("Livro Básico");
  expect(tituloFonte("ameacas-de-arton")).toBe("Ameaças de Arton");
  expect(tituloFonte("inexistente")).toBe("inexistente");
});
