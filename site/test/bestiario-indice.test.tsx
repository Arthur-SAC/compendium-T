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

test("índice do bestiário mostra o tema Os Dragões com o Dragão-Rei", () => {
  render(<IndiceBestiario />);
  expect(screen.getByRole("heading", { name: /Os Dragões/ })).toBeInTheDocument();
  const link = screen.getByRole("link", { name: /Dragão-Rei/ });
  expect(link).toHaveAttribute("href", "/ficha/criatura/dragao-rei");
});

test("índice do bestiário traz o painel de Regras de Ameaças (Cap. 7)", () => {
  render(<IndiceBestiario />);
  const link = screen.getByRole("link", { name: /Construindo Combates/ });
  expect(link).toHaveAttribute("href", "/ficha/regra-de-criacao/construindo-combates");
  expect(screen.getByRole("link", { name: /Perigos/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Fichas de NPCs/ })).toBeInTheDocument();
});
