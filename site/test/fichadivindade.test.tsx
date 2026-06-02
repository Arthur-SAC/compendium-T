import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { FichaDivindade } from "@/components/FichaDivindade";
import { construirRegistro } from "@/lib/autolink";
import type { Entidade } from "@/lib/schema";

const registro = construirRegistro({
  termos: [],
  entidades: [{ id: "coragem-total", nome: "Coragem Total", tipo: "poder" }],
});

const khalmyr = {
  id: "khalmyr", tipo: "divindade", nome: "Khalmyr", resumo: "O Deus da Justiça.",
  fonte: { livro: "livro-basico", pagina: 99 }, imagens: [],
  secoes: [{ titulo: "", texto: "Antigo líder do Panteão." }], relacoes: [],
  mecanica: {
    crencasObjetivos: "Praticar a caridade e o altruísmo.",
    simboloSagrado: "Espada sobre uma balança.",
    canalizaEnergia: "Positiva",
    armaPreferida: "Espada longa",
    devotos: "Anões, paladinos.",
    poderesConcedidos: ["Coragem Total", "Espada Justiceira"],
    obrigacoesRestricoes: "Nunca minta.",
  },
} as unknown as Entidade;

test("mostra a energia canalizada e os campos principais", () => {
  const { container } = render(<FichaDivindade entidade={khalmyr} registro={registro} descricoes={{}} />);
  const txt = container.textContent ?? "";
  expect(txt).toContain("Positiva");
  expect(txt).toContain("Espada longa");
  expect(txt).toContain("Praticar a caridade");
  expect(txt).toContain("Nunca minta");
});

test("poder concedido conhecido vira link; desconhecido fica chip de texto", () => {
  const { container } = render(<FichaDivindade entidade={khalmyr} registro={registro} descricoes={{}} />);
  const link = container.querySelector('a[href="/ficha/poder/coragem-total"]');
  expect(link?.textContent).toBe("Coragem Total");
  // "Espada Justiceira" não está no registro → não vira link
  expect(container.querySelector('a[href="/ficha/poder/espada-justiceira"]')).toBeNull();
  expect(container.textContent).toContain("Espada Justiceira");
});
