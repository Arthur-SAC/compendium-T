import { z } from "zod";

export const TIPOS_ENTIDADE = [
  "raca", "classe", "origem", "poder", "magia", "pericia", "item",
  "condicao", "divindade", "criatura", "npc", "regiao", "distincao",
  "variante-classe", "linhagem", "termo", "regra", "regra-de-criacao",
] as const;
export type TipoEntidade = (typeof TIPOS_ENTIDADE)[number];

export const FonteSchema = z.object({
  livro: z.string(),
  pagina: z.number().int().positive(),
});

export const RelacaoSchema = z.object({
  tipo: z.string(),
  alvoId: z.string(),
  alvoTipo: z.enum(TIPOS_ENTIDADE),
  rotulo: z.string(),
});
export type Relacao = z.infer<typeof RelacaoSchema>;

export const SecaoSchema = z.object({
  titulo: z.string(),
  texto: z.string(),
});

export const EntidadeSchema = z.object({
  id: z.string(),
  tipo: z.enum(TIPOS_ENTIDADE),
  nome: z.string(),
  resumo: z.string().default(""),
  fonte: FonteSchema,
  imagens: z.array(z.string()).default([]),
  secoes: z.array(SecaoSchema).default([]),
  relacoes: z.array(RelacaoSchema).default([]),
  mecanica: z.record(z.string(), z.unknown()).default({}),
});
export type Entidade = z.infer<typeof EntidadeSchema>;

export const TermoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  descricao: z.string(),
  fonte: FonteSchema.optional(),
});
export type Termo = z.infer<typeof TermoSchema>;
