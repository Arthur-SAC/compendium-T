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

export const ATRIBUTOS = ["Força", "Destreza", "Constituição", "Inteligência", "Sabedoria", "Carisma"] as const;

export const ModificadorAtributoSchema = z.object({
  atributo: z.enum(ATRIBUTOS).optional(),
  valor: z.number().int(),
  escolha: z.boolean().default(false),
  quantidade: z.number().int().positive().optional(),
  observacao: z.string().optional(),
});
export type ModificadorAtributo = z.infer<typeof ModificadorAtributoSchema>;

export const HabilidadeRacialSchema = z.object({
  nome: z.string(),
  descricao: z.string(),
  efeito: z.string().optional(),
});
export type HabilidadeRacial = z.infer<typeof HabilidadeRacialSchema>;

export const RacaMecanicaSchema = z.object({
  modificadores: z.array(ModificadorAtributoSchema).default([]),
  tamanho: z.string(),
  deslocamento: z.number().int().positive(),
  deslocamentoUnidade: z.string().default("m"),
  nota: z.string().optional(),
  habilidades: z.array(HabilidadeRacialSchema).default([]),
});
export type RacaMecanica = z.infer<typeof RacaMecanicaSchema>;

export const ProgressaoNivelSchema = z.object({
  nivel: z.number().int().min(1).max(20),
  habilidades: z.array(z.string()).default([]),
});
export type ProgressaoNivel = z.infer<typeof ProgressaoNivelSchema>;

export const HabilidadeClasseSchema = z.object({
  nome: z.string(),
  nivel: z.number().int().optional(),
  descricao: z.string(),
  custo: z.string().optional(),
  prerequisito: z.string().optional(),
  efeito: z.string().optional(),
});
export type HabilidadeClasse = z.infer<typeof HabilidadeClasseSchema>;

export const PoderClasseSchema = z.object({
  nome: z.string(),
  descricao: z.string(),
  prerequisito: z.string().optional(),
  custo: z.string().optional(),
});
export type PoderClasse = z.infer<typeof PoderClasseSchema>;

export const PericiasClasseSchema = z.object({
  quantidade: z.number().int().min(0),
  fixas: z.array(z.string()).default([]),
  lista: z.array(z.string()).default([]),
  texto: z.string(),
});
export type PericiasClasse = z.infer<typeof PericiasClasseSchema>;

export const ClasseMecanicaSchema = z.object({
  atributoChave: z.string(),
  pvInicial: z.number().int().positive(),
  pvPorNivel: z.number().int().positive(),
  pmPorNivel: z.number().int().min(0),
  pericias: PericiasClasseSchema,
  proficiencias: z.array(z.string()).default([]),
  progressao: z.array(ProgressaoNivelSchema).default([]),
  habilidades: z.array(HabilidadeClasseSchema).default([]),
  poderes: z.array(PoderClasseSchema).default([]),
});
export type ClasseMecanica = z.infer<typeof ClasseMecanicaSchema>;

export const EntidadeSchema = z
  .object({
    id: z.string(),
    tipo: z.enum(TIPOS_ENTIDADE),
    nome: z.string(),
    resumo: z.string().default(""),
    fonte: FonteSchema,
    imagens: z.array(z.string()).default([]),
    secoes: z.array(SecaoSchema).default([]),
    relacoes: z.array(RelacaoSchema).default([]),
    mecanica: z.record(z.string(), z.unknown()).default({}),
  })
  .superRefine((ent, ctx) => {
    if (ent.tipo === "raca") {
      const r = RacaMecanicaSchema.safeParse(ent.mecanica);
      if (!r.success) {
        ctx.addIssue({
          code: "custom",
          path: ["mecanica"],
          message: `mecânica de raça inválida: ${r.error.issues.map((i) => i.message).join("; ")}`,
        });
      }
    } else if (ent.tipo === "classe") {
      const r = ClasseMecanicaSchema.safeParse(ent.mecanica);
      if (!r.success) {
        ctx.addIssue({
          code: "custom",
          path: ["mecanica"],
          message: `mecânica de classe inválida: ${r.error.issues.map((i) => i.message).join("; ")}`,
        });
      }
    }
  });
export type Entidade = z.infer<typeof EntidadeSchema>;

export const TermoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  descricao: z.string(),
  fonte: FonteSchema.optional(),
});
export type Termo = z.infer<typeof TermoSchema>;
