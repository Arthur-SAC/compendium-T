import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { EntidadeSchema, TermoSchema, type Entidade, type Termo } from "./schema";

const RAIZ_DADOS = join(process.cwd(), "..", "data");

function listarJson(dir: string): string[] {
  const out: string[] = [];
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) out.push(...listarJson(caminho));
    else if (nome.endsWith(".json")) out.push(caminho);
  }
  return out;
}

export function carregarEntidades(): Entidade[] {
  const dirs = ["livro-basico"]; // Fase 1+ adiciona outras fontes aqui (ou lê de sources.json)
  const ents: Entidade[] = [];
  for (const d of dirs) {
    const base = join(RAIZ_DADOS, d);
    for (const arq of listarJson(base)) {
      ents.push(EntidadeSchema.parse(JSON.parse(readFileSync(arq, "utf8"))));
    }
  }
  return ents;
}

export function carregarTermos(): Termo[] {
  const arquivos = ["referencia/condicoes.json", "referencia/glossario.json"];
  const termos: Termo[] = [];
  for (const a of arquivos) {
    const arr = JSON.parse(readFileSync(join(RAIZ_DADOS, a), "utf8"));
    for (const t of arr) termos.push(TermoSchema.parse(t));
  }
  return termos;
}
