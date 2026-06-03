import { expect, test } from "vitest";
import { areaDoPath, regrasDaArea, subsecoesDaArea, CATEGORIAS } from "@/lib/navegacao";

test("areaDoPath identifica a área pela rota", () => {
  expect(areaDoPath("/equipamento")).toBe("equipamento");
  expect(areaDoPath("/ficha/criatura/glop")).toBe("bestiario");
  expect(areaDoPath("/ficha/item/adaga")).toBe("equipamento");
  expect(areaDoPath("/ficha/item-magico/espada-baronial")).toBe("itens-magicos");
  expect(areaDoPath("/ficha/regra-de-criacao/combate")).toBe("regras");
  expect(areaDoPath("/")).toBe("");
});

test("regras de equipamento incluem fabricação de itens mágicos e superiores", () => {
  expect(regrasDaArea("equipamento")).toContain("itens-magicos");
  expect(regrasDaArea("equipamento")).toContain("itens-superiores");
});

test("equipamento tem sub-seções, incluindo armas à distância e fabricação", () => {
  const ids = subsecoesDaArea("equipamento").map((s) => s.id);
  expect(ids).toContain("armas-a-distancia");
  expect(ids).toContain("fabricacao");
});

test("CATEGORIAS tem as áreas principais com rota e rótulo", () => {
  const ids = CATEGORIAS.map((c) => c.id);
  expect(ids).toEqual(expect.arrayContaining(["equipamento", "magias", "bestiario", "regras"]));
  expect(CATEGORIAS.find((c) => c.id === "magias")?.rota).toBe("/magias");
});
