import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import IndicePoderes from "@/app/poderes/page";

test("índice de poderes lista Ataque Poderoso com link para a ficha", () => {
  render(<IndicePoderes />);
  // `^Ataque Poderoso` evita casar cards cujo PRÉ-REQUISITO é "Ataque Poderoso"
  // (ex.: Quebrar Aprimorado, Trespassar), cujo nome acessível começa por outro nome.
  const link = screen.getByRole("link", { name: /^Ataque Poderoso/ });
  expect(link).toHaveAttribute("href", "/ficha/poder/ataque-poderoso");
});
