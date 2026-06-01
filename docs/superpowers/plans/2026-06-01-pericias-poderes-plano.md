# Capítulo 2 — Perícias & Poderes — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Tarefas com checkbox (`- [ ]`).
> Executar em DUAS ondas: **Perícias** (P1–P5) e depois **Poderes Gerais** (PP1–PP5).

**Goal:** Categoria **Perícias** (29) e **Poderes Gerais** (5 grupos) do Livro Básico, com schema próprio,
fichas, índices `/pericias` e `/poderes`, e — efeito-chave — **acender os LINKS** que Origens e Classes já
citam (cada perícia/poder citado vira link clicável). Build estático verde.

**Architecture:** Reusa o pipeline de entidades. Perícias e Poderes são **texto puro** (sem ilustração por
entrada). Schema ganha `PericiaMecanicaSchema` e `PoderMecanicaSchema` (aditivos). Extração em blocos, 2 passadas.

**Tech Stack:** Next.js 16 + TS + Zod v4 + Vitest; poppler (só `pdftotext`/`pdftoppm` p/ conferir). Export estático.

---

## Convenções (idênticas às fatias anteriores)
- poppler literal (env não setada): `C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin`. Offset **PDF = impressa + 6**. PDF: `pdfs/T20 - Livro Básico.pdf`. Texto: `extracao/cache/basico-full.txt`.
- Node no PATH: PowerShell `$env:Path += ";C:\Program Files\nodejs"`. Commit caminhos específicos, **sem push**.
- 2 passadas (extrator + revisor independente). **Editou JSON em `data/`? reiniciar o dev server.** Nunca inventar.

## Descoberta (escopo)
- **Perícias:** 29 (Tabela 2-1, impressa 114), impressas **114–123** (PDF 120–129). Cada perícia: atributo-chave,
  flags **Somente Treinada?** e **Penalidade de Armadura?**, descrição geral e uma lista de **usos** (cada uso:
  nome, **CD** quando houver, flag **"Apenas Treinado"**, descrição). Lista (atributo-chave; treinada; armadura):
  Acrobacia (Des; —; arm), Adestramento (Car; trein; —), Atletismo (For; —; —), Atuação (Car; trein; —),
  Cavalgar (Des; —; —), Conhecimento (Int; trein; —), Cura (Sab; —; —), Diplomacia (Car; —; —),
  Enganação (Car; —; —), Fortitude (Con; —; —), Furtividade (Des; —; arm), Guerra (Int; trein; —),
  Iniciativa (Des; —; —), Intimidação (Car; —; —), Intuição (Sab; —; —), Investigação (Int; —; —),
  Jogatina (Car; trein; —), Ladinagem (Des; trein; arm), Luta (For; —; —), Misticismo (Int; trein; —),
  Nobreza (Int; trein; —), Ofício (Int; trein; —), Percepção (Sab; —; —), Pilotagem (Des; trein; —),
  Pontaria (Des; —; —), Reflexos (Des; —; —), Religião (Sab; trein; —), Sobrevivência (Sab; —; —),
  Vontade (Sab; —; —). **Confirmar flags pela Tabela 2-1 na imagem** (o pdftotext embaralha a tabela).
- Há também o quadro de regras gerais (impressa 114): **Usando Perícias / Valor de Perícia / Treinamento e testes /
  Penalidade de Armadura** → vira uma entidade `regra` "Perícias: como funcionam" (igual fizemos com Origens).
- **Poderes Gerais:** impressas **124–136** (PDF 130–142), 5 grupos: **Combate** (124), **Destino** (129),
  **Magia** (131), **Concedidos** (132), **Tormenta** (136). Cada poder: nome, descrição, pré-requisito (quando há),
  grupo. (Detalhar a contagem por grupo na onda 2.)

---

## ONDA 1 — PERÍCIAS

### Task P1: Schema `pericia` + regra "como funcionam" (TDD)
- [ ] Em `site/lib/schema.ts`, adicionar (antes de `EntidadeSchema`):
```ts
export const UsoPericiaSchema = z.object({
  nome: z.string(), cd: z.string().optional(), apenasTreinado: z.boolean().default(false), descricao: z.string(),
});
export const PericiaMecanicaSchema = z.object({
  atributoChave: z.string(),
  treinada: z.boolean().default(false),
  penalidadeArmadura: z.boolean().default(false),
  descricao: z.string().optional(),
  usos: z.array(UsoPericiaSchema).default([]),
});
export type PericiaMecanica = z.infer<typeof PericiaMecanicaSchema>;
```
e ramo `else if (ent.tipo === "pericia")` no `superRefine` (espelhar `origem`). Testes: perícia válida passa; sem `atributoChave` falha.

### Task P2: `FichaPericia` (TDD)
- [ ] `site/components/FichaPericia.tsx` espelhando `FichaOrigem`. Cabeçalho com **atributo-chave** + selos "Treinada"/"Penalidade de armadura" quando true; descrição; lista de **usos** (nome em carmesim + CD/Apenas Treinado + descrição via `TextoRico`). Wiring em `app/ficha/[tipo]/[id]/page.tsx` (ramo `pericia`). Teste: mostra atributo-chave e um uso.

### Task P3: Índice `/pericias` + atalho na home + painel de regras
- [ ] `site/app/pericias/page.tsx` (grid alfabético, espelha `/origens`) + painel "Como funcionam as Perícias" (link p/ a regra). Atalho na home. Teste de índice. Regra `data/livro-basico/regras/pericias-como-funcionam.json` (impressa 114).

### Task P4: Extração das 29 perícias (2 passadas) — por blocos
- [ ] Render impressas 114–123 (PDF 120–129). Blocos de ~7. Cada perícia: atributoChave + flags (Tabela 2-1, conferir imagem), descrição, **todos os usos** (nome, CD, Apenas Treinado, descrição integral). `tipo:"pericia"`, `fonte.pagina` impressa. Passada 2 independente. `npm test` verde; commit por bloco.

### Task P5: Integração Perícias
- [ ] `npm test` + `npm run build` (gera `/pericias` + 29 fichas). Conferir que **as perícias citadas em Origens/Classes viram links** (auto-link casa por nome). Atualizar PROGRESSO. Commit.

---

## ONDA 2 — PODERES GERAIS

### Task PP1: Schema `poder` (TDD)
- [ ] `PoderMecanicaSchema = { grupo: z.enum(["combate","destino","magia","concedido","tormenta"]) | z.string(), prerequisito: z.string().optional(), descricao: z.string(), efeitos?: ... }` + ramo `poder` no `superRefine`. (Reaproveitar `PoderClasseSchema` como referência.)
- [ ] **Descoberta detalhada** dos grupos: render impressas 124–136, listar todos os poderes por grupo.

### Task PP2: `FichaPoder` + índice `/poderes` (com filtro por grupo) + painel de regras
- [ ] Componente + índice agrupado por **Combate/Destino/Magia/Concedidos/Tormenta**. Regra "Poderes: como funcionam" (impressa 124).

### Task PP3: Extração dos poderes por grupo (2 passadas)
- [ ] Um bloco por grupo. Cada poder: nome, grupo, pré-requisito, descrição integral. Poderes da Tormenta podem ter regra própria (custo em Carisma). 2 passadas; commit por grupo.

### Task PP4: Tooltips/links + dívidas pendentes
- [ ] Agora que Perícias e Poderes existem, **revisar Origens e Classes**: os nomes citados viram links automaticamente (auto-link). Adicionar ao `data/referencia/` termos de regra avulsos ainda faltantes (parceiro, patamares).

### Task PP5: Integração final
- [ ] `npm test` + `npm run build` (gera `/poderes` + todas as fichas de poder). Atualizar PROGRESSO (Cap. 2 concluído; próxima: Magia ou Equipamento). Commit.

---

## Encerramento
Ao fim: Perícias (29) e Poderes Gerais (5 grupos) extraídos e validados, schema com `pericia`/`poder`, fichas e
índices `/pericias` e `/poderes`, regras "como funcionam", e os **links** de Origens/Classes acesos. Próxima fatia
sugerida: **Magia** (Cap. 4 — destrava a conjuração das classes) ou **Equipamento** (Cap. 3).
