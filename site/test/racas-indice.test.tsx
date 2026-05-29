import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import IndiceRacas from "@/app/racas/page";

test("índice de raças lista o Humano com link para a ficha", () => {
  render(<IndiceRacas />);
  const link = screen.getByRole("link", { name: /Humano/ });
  expect(link).toHaveAttribute("href", "/ficha/raca/humano");
});
