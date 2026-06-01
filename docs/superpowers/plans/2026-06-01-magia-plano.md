# Capítulo 4 — Magia — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Tarefas com checkbox.
> Mapa de descoberta: `docs/superpowers/plans/magias-lista.md`. Executar em ONDAS.

**Goal:** Categoria **Magia** (~197 magias únicas, 1º–5º círculo, arcanas/divinas/universais) + as **regras de magia**
do Cap. 4, com schema `magia`, `FichaMagia`, índice `/magias` agrupado, e build verde. **Destrava a conjuração**
das 4 classes conjuradoras (Arcanista/Bardo/Clérigo/Druida).

**Architecture:** Reusa o pipeline de entidades. Magias são **texto** (sem ilustração por magia). Schema `magia`
pragmático (cabeçalho + descrição + aprimoramentos). Regras do capítulo como entidades `regra`. Extração das
descrições (A–Z, impressas 178–211) em blocos por faixa de página, 2 passadas. **Universais** (aparecem nas listas
arcana e divina) = 1 entrada com `tipo:"universal"`.

**Stack:** Next.js 16 + TS + Zod v4 + Vitest; poppler. Export estático.

---

## Convenções (idênticas)
- Imagens já em `extracao/cache/discMag/p-174.png … p-217.png` (impressas 168–211); texto `extracao/cache/discMag/magia.txt`.
- Offset PDF = impressa + 6. Node no PATH; commit caminhos específicos. 2 passadas. **Confirmar pela IMAGEM** (índice em 3 colunas; quadros de regra).

## Schema (pragmático)
```ts
export const AprimoramentoMagiaSchema = z.object({
  custo: z.string(),               // "+1 PM", "+2 PM" (ou "Truque" tratado à parte) — string p/ casos como "+1 PM por alvo"
  efeito: z.string(),
  requisitoCirculo: z.number().int().optional(),
});
export const MagiaMecanicaSchema = z.object({
  tipo: z.string(),                // "arcana" | "divina" | "universal"
  circulo: z.number().int().min(1).max(5),
  escola: z.string(),              // abjuração/adivinhação/convocação/encantamento/evocação/ilusão/necromancia/transmutação
  execucao: z.string(),
  alcance: z.string(),
  alvo: z.string().optional(),
  area: z.string().optional(),
  efeito: z.string().optional(),
  duracao: z.string(),
  resistencia: z.string().optional(),
  custoPM: z.number().int(),       // base do círculo: 1/3/6/10/15
  custoEspecial: z.string().optional(),
  truque: z.string().optional(),
  descricao: z.string(),
  aprimoramentos: z.array(AprimoramentoMagiaSchema).default([]),
});
```
Ramo `else if (ent.tipo === "magia")` no `superRefine`. `nome`/`resumo` na entidade; `descricao`/cabeçalho/aprimoramentos na `mecanica`.

---

## ONDA A — Código (schema + FichaMagia + índice + regras)
- [ ] **A1 schema `magia`** (TDD): schemas acima + ramo no `superRefine`. Testes: magia válida; sem `circulo` falha.
- [ ] **A2 `FichaMagia`** (TDD): cabeçalho com selo **tipo + Xº círculo + escola**; bloco de stats (Execução, Alcance, Alvo/Área/Efeito, Duração, Resistência, **Custo X PM**); descrição via `TextoRico`; lista de **Aprimoramentos** (custo + efeito, + "Requer Xº círculo"); Truque. Wiring no `ficha/[tipo]/[id]`. Teste: mostra círculo/escola, custo e um aprimoramento.
- [ ] **A3 índice `/magias`** + atalho na home + regra: agrupar por **círculo (1º–5º)** e, dentro, por **tipo** (Arcanas / Divinas / Universais) ou por escola; filtro/abas. Painel "Como funciona a Magia" → regra. Spike: extrair 1 magia (ex.: **Bola de Fogo**) para o índice/teste.
- [ ] Regras (entidades `regra-de-criacao`): `magia-como-funciona` (Classificação arcana/divina, círculos, custo em PM + Tabela 4-1, atributo-chave, aprender/lançar magias, gestos e palavras, concentração, armaduras e magia arcana, anular magias — impressas 169–170); `caracteristicas-das-magias` (Escolas, Execução, Alcance, Efeito/Alvo/Área, Duração, Resistência, Custos Especiais — impressas 172–173); `aprimoramentos-de-magia` (definição, cumulativos, mudam magias, Truque, pré-requisitos — impressas 170–171).

## ONDA B — Extração das magias (A–Z, impressas 178–211) — por blocos
- [ ] As descrições estão em **ordem alfabética global** (arcanas+divinas+universais juntas), impressas 178–211. Dividir em ~8–10 blocos por faixa de página (~3–4 págs/bloco, ~20 magias). Cada magia: cabeçalho (tipo/círculo/escola/execução/alcance/alvo|área|efeito/duração/resistência/custoPM/custoEspecial), descrição integral, **aprimoramentos** (cada `+X PM:` → item; "Requer Xº círculo" → `requisitoCirculo`), `truque` quando houver. `resumo` = frase do índice (pp. 174–177). **Universais:** `tipo:"universal"` (cruzar índice arcano+divino). 2 passadas. Commit por bloco.
- [ ] **Casos especiais:** Aprisionamento (formas de prisão), Animar Objetos (tabela por tamanho), Muralha de Ossos (anomalia de círculo arcano 4 / divino 3 — capturar como o livro traz na descrição). Magias que mudam execução via aprimoramento: manter `execucao` base e descrever no aprimoramento.

## ONDA C — Integração + links
- [ ] `npm test` + `npm run build` (gera `/magias` + uma ficha por magia). **Acender links:** a habilidade "Magias" das 4 conjuradoras, os Poderes Concedidos que ensinam magias (ex.: "aprende Toque Vampírico") e itens (catalisadores) passam a linkar para as fichas de magia (auto-link por nome). Atualizar PROGRESSO (Magia ✅; próxima: Deuses ou Construção de Personagem — ver pendências). Commit.

---

## Encerramento
Ao fim: ~197 magias + regras de magia no site, schema `magia`, `FichaMagia`, índice `/magias`, build verde, e a
conjuração das classes finalmente clicável. Próximas fatias (pendentes registradas no PROGRESSO): **Deuses**,
**Construção de Personagem/Atributos**, **Combate & Jogando**, **Mundo**, **Mestrar**.
