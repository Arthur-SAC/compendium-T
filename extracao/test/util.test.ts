import { expect, test } from "vitest";
import { slugify, parsePdfimagesList, buildPagePaths, caminhoImagemRaca } from "../src/util";

test("slugify normaliza acentos e espaços", () => {
  expect(slugify("Súcubo da Tormenta")).toBe("sucubo-da-tormenta");
  expect(slugify("Ataque de Oportunidade!")).toBe("ataque-de-oportunidade");
});

test("parsePdfimagesList extrai número e tamanho das imagens", () => {
  const saida = [
    "page   num  type   width height color comp bpc  enc interp  object ID x-ppi y-ppi size ratio",
    "--------------------------------------------------------------------------------------------",
    "  40     0 image    1243  1688  cmyk    4   8  jpx    no      1848  0   150   150 51.6K 0.6%",
    "  40     1 image    1113    77  cmyk    4   8  jpeg   no      1876  0   150   151 71.9K  21%",
  ].join("\n");
  const r = parsePdfimagesList(saida);
  expect(r).toHaveLength(2);
  expect(r[0]).toMatchObject({ page: 40, num: 0, width: 1243, height: 1688 });
});

test("buildPagePaths gera caminhos previsíveis por livro e página", () => {
  const p = buildPagePaths("/cache", "livro-basico", 41);
  expect(p.texto).toBe("/cache/livro-basico/p0041.txt");
  expect(p.imagem).toBe("/cache/livro-basico/p0041.png");
});

test("caminhoImagemRaca aponta para site/public/racas/<slug>.png", () => {
  expect(caminhoImagemRaca("/proj", "anao")).toBe("/proj/site/public/racas/anao.png");
});
