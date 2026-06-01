import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import IndiceMagias from "@/app/magias/page";

test("índice de magias lista Bola de Fogo com link para a ficha", () => {
  render(<IndiceMagias />);
  const link = screen.getByRole("link", { name: /^Bola de Fogo/ });
  expect(link).toHaveAttribute("href", "/ficha/magia/bola-de-fogo");
});
