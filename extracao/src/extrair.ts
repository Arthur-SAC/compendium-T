import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildPagePaths } from "./util.js";
import { extrairTexto, renderizarPagina } from "./poppler.js";

// uso: tsx src/extrair.ts "<pdf>" <livroSlug> <pagInicial> <pagFinal>
const [pdf, livro, ini, fim] = process.argv.slice(2);
if (!pdf || !livro || !ini || !fim) {
  console.error('uso: tsx src/extrair.ts "<pdf>" <livroSlug> <pagInicial> <pagFinal>');
  process.exit(1);
}
const cache = join(process.cwd(), "cache");
for (let p = Number(ini); p <= Number(fim); p++) {
  const caminhos = buildPagePaths(cache, livro, p);
  mkdirSync(caminhos.dir, { recursive: true });
  writeFileSync(caminhos.texto, extrairTexto(pdf, p), "utf8");
  renderizarPagina(pdf, p, caminhos.prefixoImagem);
  console.log(`pág ${p}: texto + imagem em ${caminhos.dir}`);
}
