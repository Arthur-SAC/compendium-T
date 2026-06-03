import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { carregarEntidades } from "@/lib/dados";
import IndiceMagias from "@/app/magias/page";
import PaginaCirculo from "@/app/magias/[circulo]/page";

test("menu de magias lista os círculos com link próprio", () => {
  render(<IndiceMagias />);
  expect(screen.getByRole("link", { name: /1º Círculo/ })).toHaveAttribute("href", "/magias/1");
});

test("sub-página do círculo lista Bola de Fogo com link para a ficha", async () => {
  const bf = carregarEntidades().find((e) => e.id === "bola-de-fogo" && e.tipo === "magia");
  const circulo = String((bf!.mecanica as { circulo: number }).circulo);
  render(await PaginaCirculo({ params: Promise.resolve({ circulo }) }));
  expect(screen.getByRole("link", { name: /^Bola de Fogo/ })).toHaveAttribute("href", "/ficha/magia/bola-de-fogo");
});
