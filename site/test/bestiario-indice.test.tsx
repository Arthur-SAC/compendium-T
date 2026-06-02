import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import IndiceBestiario from "@/app/bestiario/page";

test("índice do bestiário lista o Glop com link e ND", () => {
  render(<IndiceBestiario />);
  const link = screen.getByRole("link", { name: /Glop/ });
  expect(link).toHaveAttribute("href", "/ficha/criatura/glop");
});

test("índice do bestiário mostra o tema Masmorras", () => {
  render(<IndiceBestiario />);
  expect(screen.getByRole("heading", { name: /Masmorras/ })).toBeInTheDocument();
});
