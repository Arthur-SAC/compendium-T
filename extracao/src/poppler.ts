import { execFileSync } from "node:child_process";
import { join } from "node:path";

// poppler vive dentro do próprio projeto (baixado em extracao/poppler-bin/).
// Os scripts de extração rodam a partir de `extracao/`, então o padrão é relativo ao cwd.
// Pode ser sobrescrito pela env POPPLER_BIN.
const POPPLER_BIN = process.env.POPPLER_BIN ||
  join(process.cwd(), "poppler-bin", "poppler-26.02.0", "Library", "bin");

function bin(nome: string): string {
  return join(POPPLER_BIN, nome);
}

export function extrairTexto(pdf: string, pagina: number): string {
  return execFileSync(bin("pdftotext"),
    ["-f", String(pagina), "-l", String(pagina), "-layout", "-enc", "UTF-8", pdf, "-"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

export function renderizarPagina(pdf: string, pagina: number, prefixoSaida: string, dpi = 150): void {
  execFileSync(bin("pdftoppm"),
    ["-f", String(pagina), "-l", String(pagina), "-png", "-r", String(dpi), pdf, prefixoSaida]);
}

export function listarImagens(pdf: string, pagina: number): string {
  return execFileSync(bin("pdfimages"),
    ["-f", String(pagina), "-l", String(pagina), "-list", pdf], { encoding: "utf8" });
}

export function extrairImagens(pdf: string, pagina: number, prefixoSaida: string): void {
  execFileSync(bin("pdfimages"),
    ["-f", String(pagina), "-l", String(pagina), "-png", pdf, prefixoSaida]);
}
