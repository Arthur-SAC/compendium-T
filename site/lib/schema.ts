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

export const EfeitoPoderSchema = z.object({
  nome: z.string(),
  custo: z.string(),
  descricao: z.string(),
});
export type EfeitoPoder = z.infer<typeof EfeitoPoderSchema>;

export const PoderClasseSchema = z.object({
  nome: z.string(),
  descricao: z.string(),
  prerequisito: z.string().optional(),
  custo: z.string().optional(),
  efeitos: z.array(EfeitoPoderSchema).optional(), // ex.: efeitos do Golpe Pessoal (renderizados como tabela)
});
export type PoderClasse = z.infer<typeof PoderClasseSchema>;

export const PericiasClasseSchema = z.object({
  quantidade: z.number().int().min(0),
  fixas: z.array(z.string()).default([]),
  lista: z.array(z.string()).default([]),
  texto: z.string(),
});
export type PericiasClasse = z.infer<typeof PericiasClasseSchema>;

export const ConjuracaoSchema = z.object({
  tipo: z.string(),
  atributoChave: z.string(),
  descricao: z.string().optional(),
});
export type Conjuracao = z.infer<typeof ConjuracaoSchema>;

export const CaminhoClasseSchema = z.object({
  nome: z.string(),
  descricao: z.string(),
  habilidades: z.array(HabilidadeClasseSchema).default([]),
});
export type CaminhoClasse = z.infer<typeof CaminhoClasseSchema>;

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
  conjuracao: ConjuracaoSchema.optional(),
  caminhos: z.array(CaminhoClasseSchema).default([]),
});
export type ClasseMecanica = z.infer<typeof ClasseMecanicaSchema>;

export const PoderOrigemSchema = z.object({ nome: z.string(), descricao: z.string() });
export type PoderOrigem = z.infer<typeof PoderOrigemSchema>;

export const BeneficiosOrigemSchema = z.object({
  pericias: z.array(z.string()).default([]),
  poderes: z.array(z.string()).default([]),
  texto: z.string().optional(),
});
export type BeneficiosOrigem = z.infer<typeof BeneficiosOrigemSchema>;

export const OrigemMecanicaSchema = z.object({
  itens: z.array(z.string()).default([]),
  itensTexto: z.string().optional(),
  beneficios: BeneficiosOrigemSchema,
  poderesUnicos: z.array(PoderOrigemSchema).default([]),
});
export type OrigemMecanica = z.infer<typeof OrigemMecanicaSchema>;

export const UsoPericiaSchema = z.object({
  nome: z.string(),
  cd: z.string().optional(),
  apenasTreinado: z.boolean().default(false),
  descricao: z.string(),
});
export type UsoPericia = z.infer<typeof UsoPericiaSchema>;

export const PericiaMecanicaSchema = z.object({
  atributoChave: z.string(),
  treinada: z.boolean().default(false),
  penalidadeArmadura: z.boolean().default(false),
  descricao: z.string().optional(),
  usos: z.array(UsoPericiaSchema).default([]),
});
export type PericiaMecanica = z.infer<typeof PericiaMecanicaSchema>;

export const PoderMecanicaSchema = z.object({
  grupo: z.string(),            // "combate" | "destino" | "magia" | "concedido" | "tormenta"
  prerequisito: z.string().optional(),
  custo: z.string().optional(),
  descricao: z.string(),
});
export type PoderMecanica = z.infer<typeof PoderMecanicaSchema>;

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
    } else if (ent.tipo === "origem") {
      const r = OrigemMecanicaSchema.safeParse(ent.mecanica);
      if (!r.success) {
        ctx.addIssue({
          code: "custom",
          path: ["mecanica"],
          message: `mecânica de origem inválida: ${r.error.issues.map((i) => i.message).join("; ")}`,
        });
      }
    } else if (ent.tipo === "pericia") {
      const r = PericiaMecanicaSchema.safeParse(ent.mecanica);
      if (!r.success) {
        ctx.addIssue({
          code: "custom",
          path: ["mecanica"],
          message: `mecânica de perícia inválida: ${r.error.issues.map((i) => i.message).join("; ")}`,
        });
      }
    } else if (ent.tipo === "poder") {
      const r = PoderMecanicaSchema.safeParse(ent.mecanica);
      if (!r.success) {
        ctx.addIssue({
          code: "custom",
          path: ["mecanica"],
          message: `mecânica de poder inválida: ${r.error.issues.map((i) => i.message).join("; ")}`,
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
