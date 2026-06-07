import { expect, test } from "vitest";
import { carregarEntidades } from "@/lib/dados";
import { tabelaEquipamentoPipe } from "@/lib/equipamento-tabela";

test("tabela de armaduras inclui itens do Básico e de Ameaças (multi-fonte)", () => {
  const t = tabelaEquipamentoPipe("armaduras-escudos", carregarEntidades());
  expect(t).toContain("Armadura Acolchoada"); // Básico
  expect(t).toContain("Armadura de Ossos"); // Ameaças
  // marca a fonte de cada linha
  expect(t).toContain("Básico");
  expect(t).toContain("Ameaças");
  // formato pipe-table: legenda + cabeçalho + separadores de grupo
  expect(t).toContain("Tabela: Armaduras & Escudos");
  expect(t).toContain("--- Armaduras Leves ---");
  expect(t).toContain("Bônus na Defesa");
});

test("tabela de armas inclui uma arma de Ameaças (Bacamarte) agrupada por proficiência", () => {
  const t = tabelaEquipamentoPipe("armas", carregarEntidades());
  expect(t).toContain("Bacamarte"); // Ameaças, arma de fogo
  expect(t).toContain("--- Armas de Fogo ---");
  expect(t).toContain("Tabela: Armas");
});

test("slug desconhecido retorna string vazia (marcador inofensivo)", () => {
  expect(tabelaEquipamentoPipe("inexistente", carregarEntidades())).toBe("");
});
