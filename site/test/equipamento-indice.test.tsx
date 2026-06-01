import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import IndiceEquipamento from "@/app/equipamento/page";

test("índice de equipamento lista Espada Longa com link para a ficha", () => {
  render(<IndiceEquipamento />);
  const link = screen.getByRole("link", { name: /Espada Longa/ });
  expect(link).toHaveAttribute("href", "/ficha/item/espada-longa");
});

test("índice de equipamento lista Cota de Malha com link para a ficha", () => {
  render(<IndiceEquipamento />);
  const link = screen.getByRole("link", { name: /Cota de Malha/ });
  expect(link).toHaveAttribute("href", "/ficha/item/cota-de-malha");
});
