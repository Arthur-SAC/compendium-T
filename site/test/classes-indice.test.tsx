import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import IndiceClasses from "@/app/classes/page";

test("índice de classes lista o Guerreiro com link para a ficha", () => {
  render(<IndiceClasses />);
  const link = screen.getByRole("link", { name: /Guerreiro/ });
  expect(link).toHaveAttribute("href", "/ficha/classe/guerreiro");
});
