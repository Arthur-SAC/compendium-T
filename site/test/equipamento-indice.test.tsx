import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import IndiceEquipamento from "@/app/equipamento/page";
import PaginaCategoria from "@/app/equipamento/[categoria]/page";

test("menu de equipamento lista a categoria Armas com link próprio", () => {
  render(<IndiceEquipamento />);
  expect(screen.getByRole("link", { name: /^Armas/ })).toHaveAttribute("href", "/equipamento/armas");
});

test("categoria de armas lista Espada Longa com link para a ficha", async () => {
  render(await PaginaCategoria({ params: Promise.resolve({ categoria: "armas" }) }));
  expect(screen.getByRole("link", { name: /Espada Longa/ })).toHaveAttribute("href", "/ficha/item/espada-longa");
});

test("categoria armaduras-escudos lista Cota de Malha com link para a ficha", async () => {
  render(await PaginaCategoria({ params: Promise.resolve({ categoria: "armaduras-escudos" }) }));
  expect(screen.getByRole("link", { name: /Cota de Malha/ })).toHaveAttribute("href", "/ficha/item/cota-de-malha");
});
