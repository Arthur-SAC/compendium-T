// Extrai os retratos das Lendas do Guia de NPCs (cor+smask via pdfimages → comporComMascara).
// Heurística: em cada página do intervalo da Lenda, acha o par (image, smask) de dimensões
// casadas que NÃO seja o fundo (1243x1688) nem barra fina; escolhe o de maior área.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { comporComMascara } from "../src/imagens.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..");
const POPPLER = "C:\\Users\\ASCalderon\\Desktop\\Projeto-Tormenta\\poppler-bin\\poppler-24.08.0\\Library\\bin";
const PDFIMAGES = `"${POPPLER}\\pdfimages.exe"`;
const PDF = path.resolve(RAIZ, "../pdfs/T20-Guia-de-NPCs-v1.1.pdf");
const DATA = path.resolve(RAIZ, "../data/guia-de-npcs/criaturas");
const OUT = path.resolve(RAIZ, "../site/public/criaturas");
const TMP = path.resolve(RAIZ, "cache/npc-art");
const OFFSET = 2; // PDF = impressa + 2

const EXCLUIR = new Set(["guarda-costas-de-elite", "presuntador", "molosso-deheoni"]);

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

// 1) Lendas (id + pagina), ordenadas, sem companheiros
const lendas: { id: string; pagina: number }[] = [];
for (const f of fs.readdirSync(DATA)) {
  const j = JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
  if ((j.mecanica?.tema ?? "") === "Lendas de Arton" && !EXCLUIR.has(j.id)) {
    lendas.push({ id: j.id, pagina: j.fonte.pagina });
  }
}
lendas.sort((a, b) => a.pagina - b.pagina);

// 2) intervalo impresso de cada Lenda = [pagina, prox.pagina-1]
type Cand = { page: number; idx: number; w: number; h: number };
function listarPagina(pdfPage: number): { type: string; w: number; h: number }[] {
  const out = execSync(`${PDFIMAGES} -list -f ${pdfPage} -l ${pdfPage} "${PDF}"`, { encoding: "utf8" });
  const linhas = out.split("\n").slice(2).filter((l) => l.trim());
  return linhas.map((l) => {
    const c = l.trim().split(/\s+/);
    return { type: c[2], w: parseInt(c[3], 10), h: parseInt(c[4], 10) };
  });
}
function acharPar(rows: { type: string; w: number; h: number }[]): number | null {
  // retorna o índice (0-based na página) da melhor imagem-retrato; o smask é idx+1
  let best: number | null = null, bestArea = 0;
  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i], b = rows[i + 1];
    if (a.type === "image" && b.type === "smask" && a.w === b.w && a.h === b.h) {
      if (a.w >= 300 && a.h >= 300 && !(a.w === 1243 && a.h === 1688)) {
        const area = a.w * a.h;
        if (area > bestArea) { bestArea = area; best = i; }
      }
    }
  }
  return best;
}

const feitos: string[] = [];
const semArte: string[] = [];
for (let k = 0; k < lendas.length; k++) {
  const l = lendas[k];
  const fimImpressa = k + 1 < lendas.length ? lendas[k + 1].pagina - 1 : l.pagina;
  let escolha: Cand | null = null;
  for (let imp = l.pagina; imp <= fimImpressa; imp++) {
    const pdfPage = imp + OFFSET;
    let rows;
    try { rows = listarPagina(pdfPage); } catch { continue; }
    const idx = acharPar(rows);
    if (idx != null) {
      const a = rows[idx];
      if (!escolha || a.w * a.h > escolha.w * escolha.h) escolha = { page: pdfPage, idx, w: a.w, h: a.h };
    }
  }
  if (!escolha) { semArte.push(l.id); continue; }
  // extrai as imagens da página escolhida e compõe
  const root = path.join(TMP, `${l.id}`);
  execSync(`${PDFIMAGES} -png -f ${escolha.page} -l ${escolha.page} "${PDF}" "${root}"`);
  const cor = `${root}-${String(escolha.idx).padStart(3, "0")}.png`;
  const mask = `${root}-${String(escolha.idx + 1).padStart(3, "0")}.png`;
  await comporComMascara(cor, mask, path.join(OUT, `${l.id}.png`));
  feitos.push(`${l.id} (p${escolha.page}, ${escolha.w}x${escolha.h})`);
}

console.log(`FEITOS (${feitos.length}):\n  ` + feitos.join("\n  "));
console.log(`SEM ARTE (${semArte.length}): ${semArte.join(", ") || "nenhum"}`);
