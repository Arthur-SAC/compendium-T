import { posix } from "node:path";

export function slugify(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export type ImagemInfo = { page: number; num: number; width: number; height: number };

export function parsePdfimagesList(saida: string): ImagemInfo[] {
  const linhas = saida.split("\n").map((l) => l.trim()).filter(Boolean);
  const out: ImagemInfo[] = [];
  for (const l of linhas) {
    if (l.startsWith("page") || l.startsWith("---")) continue;
    const c = l.split(/\s+/);
    const page = Number(c[0]), num = Number(c[1]);
    const width = Number(c[3]), height = Number(c[4]);
    if (Number.isFinite(page) && Number.isFinite(num)) out.push({ page, num, width, height });
  }
  return out;
}

export function caminhoImagemRaca(raizProjeto: string, slug: string): string {
  return posix.join(raizProjeto, "site", "public", "racas", `${slug}.png`);
}

export function buildPagePaths(cacheDir: string, livro: string, pagina: number) {
  const pad = String(pagina).padStart(4, "0");
  const base = posix.join(cacheDir, livro);
  // NOTA: pdftoppm anexa "-<pagina>" ao prefixo de saída (ex.: p0041-41.png).
  // `imagem` é o caminho base nominal/previsível; `prefixoImagem` é o prefixo a passar ao pdftoppm.
  return {
    dir: base,
    texto: posix.join(base, `p${pad}.txt`),
    imagem: posix.join(base, `p${pad}.png`),
    prefixoImagem: posix.join(base, `p${pad}`),
  };
}
