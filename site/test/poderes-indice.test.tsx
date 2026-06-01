import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import IndicePoderes from "@/app/poderes/page";

test("índice de poderes lista Ataque Poderoso com link para a ficha", () => {
  render(<IndicePoderes />);
  const link = screen.getByRole("link", { name: /Ataque Poderoso/ });
  expect(link).toHaveAttribute("href", "/ficha/poder/ataque-poderoso");
});
