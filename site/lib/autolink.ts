import type { TipoEntidade } from "./schema";

export type Token =
  | { tipo: "texto"; valor: string }
  | { tipo: "tooltip"; termoId: string; valor: string }
  | { tipo: "link"; alvoId: string; alvoTipo: TipoEntidade; valor: string };

type TermoEntrada = { id: string; nome: string; descricao: string };
type EntidadeEntrada = { id: string; nome: string; tipo: TipoEntidade };

type Entrada =
  | { kind: "tooltip"; termoId: string; nome: string }
  | { kind: "link"; alvoId: string; alvoTipo: TipoEntidade; nome: string };

export type Registro = {
  entradas: Entrada[];
  porNome: Map<string, Entrada>;
};

export function construirRegistro(dados: {
  termos: TermoEntrada[];
  entidades: EntidadeEntrada[];
}): Registro {
  const entradas: Registro["entradas"] = [
    ...dados.termos.map((t) => ({ kind: "tooltip" as const, termoId: t.id, nome: t.nome })),
    ...dados.entidades.map((e) => ({ kind: "link" as const, alvoId: e.id, alvoTipo: e.tipo, nome: e.nome })),
  ];
  entradas.sort((a, b) => b.nome.length - a.nome.length);
  const porNome = new Map<string, Entrada>();
  for (const entrada of entradas) {
    const chave = entrada.nome.toLowerCase();
    if (!porNome.has(chave)) porNome.set(chave, entrada);
  }
  return { entradas, porNome };
}

function escaparRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function tokenizar(texto: string, registro: Registro): Token[] {
  if (registro.entradas.length === 0) return [{ tipo: "texto", valor: texto }];
  const alternativas = registro.entradas.map((e) => escaparRegex(e.nome)).join("|");
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${alternativas})(?![\\p{L}\\p{N}])`, "giu");

  const tokens: Token[] = [];
  let ultimo = 0;
  for (const m of texto.matchAll(re)) {
    const inicio = m.index!;
    const casado = m[0];
    if (inicio > ultimo) tokens.push({ tipo: "texto", valor: texto.slice(ultimo, inicio) });
    const entrada = registro.porNome.get(casado.toLowerCase());
    if (!entrada) {
      tokens.push({ tipo: "texto", valor: casado });
    } else if (entrada.kind === "tooltip") {
      tokens.push({ tipo: "tooltip", termoId: entrada.termoId, valor: casado });
    } else {
      tokens.push({ tipo: "link", alvoId: entrada.alvoId, alvoTipo: entrada.alvoTipo, valor: casado });
    }
    ultimo = inicio + casado.length;
  }
  if (ultimo < texto.length) tokens.push({ tipo: "texto", valor: texto.slice(ultimo) });
  return tokens.length ? tokens : [{ tipo: "texto", valor: texto }];
}
