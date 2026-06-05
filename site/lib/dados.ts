import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { EntidadeSchema, TermoSchema, type Entidade, type Termo } from "./schema";

const RAIZ_DADOS = join(process.cwd(), "..", "data");

export type Fonte = { slug: string; titulo: string; arquivo?: string; ordem: number };

let _fontes: Fonte[] | null = null;
export function carregarFontes(): Fonte[] {
  if (_fontes) return _fontes;
  const raw = JSON.parse(readFileSync(join(RAIZ_DADOS, "sources.json"), "utf8")) as { fontes: Fonte[] };
  _fontes = [...raw.fontes].sort((a, b) => a.ordem - b.ordem);
  return _fontes;
}

export function tituloFonte(slug: string): string {
  return carregarFontes().find((f) => f.slug === slug)?.titulo ?? slug;
}

function listarJson(dir: string): string[] {
  const out: string[] = [];
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) out.push(...listarJson(caminho));
    else if (nome.endsWith(".json")) out.push(caminho);
  }
  return out;
}

let _entidades: Entidade[] | null = null;

export function carregarEntidades(): Entidade[] {
  if (_entidades) return _entidades;
  const ents: Entidade[] = [];
  // Ordem das fontes (Básico antes) garante first-wins do auto-link a favor do Básico.
  for (const fonte of carregarFontes()) {
    const base = join(RAIZ_DADOS, fonte.slug);
    if (!existsSync(base)) continue; // fonte listada mas ainda não extraída
    for (const arq of listarJson(base)) {
      ents.push(EntidadeSchema.parse(JSON.parse(readFileSync(arq, "utf8"))));
    }
  }
  _entidades = ents;
  return ents;
}

let _termos: Termo[] | null = null;

export function carregarTermos(): Termo[] {
  if (_termos) return _termos;
  const arquivos = ["referencia/condicoes.json", "referencia/glossario.json", "referencia/acoes.json"];
  const termos: Termo[] = [];
  for (const a of arquivos) {
    const arr = JSON.parse(readFileSync(join(RAIZ_DADOS, a), "utf8"));
    for (const t of arr) termos.push(TermoSchema.parse(t));
  }
  _termos = termos;
  return termos;
}
