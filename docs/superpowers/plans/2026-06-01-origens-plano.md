# Origens do Livro Básico — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Tarefas com checkbox (`- [ ]`).

**Goal:** Completar a categoria **Origens** do Livro Básico — estender o schema para `origem`, exibir uma
`FichaOrigem`, adicionar o índice `/origens`, e extrair as **35 origens** (texto puro, visão 2 passadas),
com build estático verde.

**Architecture:** Reusa o pipeline de entidades (Raças/Classes). Origens são **texto puro** (sem ilustração
por origem — a arte do capítulo é compartilhada). Schema ganha `OrigemMecanicaSchema` (aditivo). `FichaOrigem`
nova. Índice `/origens` espelha `/classes`. Extração em blocos, cada bloco com validação independente.

**Tech Stack:** Next.js 16 + TS + Zod v4 + Vitest/Testing Library; poppler (só `pdftotext`/`pdftoppm` p/ conferir). Export estático.

---

## Convenções
- Raiz: `C:\Users\ASCalderon\Desktop\compendium tormenta 20`. Comandos de site em `site/`. Node no PATH: PowerShell `$env:Path += ";C:\Program Files\nodejs"`; Bash `export PATH="$PATH:/c/Program Files/nodejs"`. Aspas em caminhos com espaço.
- **Commit caminhos específicos, nunca `git add -A`. Sem push.**
- poppler (env `POPPLER_BIN` NÃO fica setada — usar literal): `C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin`. PDF: `pdfs/T20 - Livro Básico.pdf`. Offset **PDF = impressa + 6**.
- Texto integral já em `extracao/cache/basico-full.txt`. **Nunca inventar dados.** Editou JSON em `data/`? reiniciar o dev server.

## Escopo / descoberta (Tabela 1-19: Origens, impressa 86; capítulo impressas ~85–91 = PDF 91–97)
**35 origens** (ordem alfabética): Acólito, Amigo dos Animais, Amnésico, Aristocrata, Artesão, Artista,
Assistente de Laboratório, Batedor, Capanga, Charlatão, Circense, Criminoso, Curandeiro, Eremita, Escravo,
Estudioso, Fazendeiro, Forasteiro, Gladiador, Guarda, Herdeiro, Herói Camponês, Marujo, Mateiro,
Membro de Guilda, Mercador, Minerador, Nômade, Pivete, Refugiado, Seguidor, Selvagem, Soldado, Taverneiro,
Trabalhador.

**Estrutura de cada origem** (fiel ao livro):
- **Flavor** (descrição) → `secoes[]` ("Descrição").
- **Itens.** linha de itens iniciais (pode ter escolhas "ou", valores em T$) → `mecanica.itensTexto` (literal) + `mecanica.itens[]` (itens individuais quando claramente separáveis).
- **Benefícios.** perícias + poderes (escolhe 2 da lista) → `mecanica.beneficios { pericias[], poderes[], texto }`. Alguns casos especiais: **Amnésico** (uma perícia e um poder à escolha do mestre + poder Lembranças Graduais), **Assistente de Laboratório** (inclui "um poder da Tormenta a sua escolha"), **Capanga/Gladiador/Guarda/Soldado** ("um poder de combate a sua escolha") — capturar no `texto`.
- **Poder Único** (exclusivo da origem, descrito após os benefícios) → `mecanica.poderesUnicos[] { nome, descricao }`. Pode haver mais de um descrito; capturar todos os descritos inline.

Regras gerais do capítulo (impressa 85, "Itens de Origem"/"Benefícios de Origem"/"Poder Único") → uma entidade-resumo opcional NÃO; basta capturar fielmente por origem. As perícias e poderes gerais citados são definidos no Capítulo 2 (futuro) — aqui só os nomes (viram links/tooltips depois).

---

## Task O1: Código — schema `origem` + `FichaOrigem` + índice `/origens`

**Files:** Modify `site/lib/schema.ts`, `site/app/ficha/[tipo]/[id]/page.tsx`, `site/app/page.tsx`; Create `site/components/FichaOrigem.tsx`, `site/app/origens/page.tsx`; Tests `site/test/schema.test.ts`, `site/test/fichaorigem.test.tsx`, `site/test/origens-indice.test.tsx`.

- [ ] **Schema (TDD):** adicionar, **antes** de `EntidadeSchema`:
```ts
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
```
e, no `superRefine` de `EntidadeSchema`, acrescentar um ramo `else if (ent.tipo === "origem")` validando `OrigemMecanicaSchema` (espelhando o ramo de `classe`). Testes: origem válida passa; origem sem `beneficios` falha.

- [ ] **FichaOrigem (TDD):** novo componente espelhando `FichaClasse`/`FichaRaca` (mesmos tokens de tema, `TextoRico`, `Divisor`, cabeçalho com `imagens[0]` se houver — origens normalmente não têm). Renderiza: título + resumo; **Itens** (de `itensTexto`/`itens`); **Benefícios** (perícias e poderes como chips/listas, com `texto` quando houver); **Poder Único** (cada `poderesUnicos` com nome em carmesim + descrição via `TextoRico`); seções de flavor. Proveniência (fonte) no rodapé como nas outras fichas. Teste verifica que mostra "Itens", "Benefícios", o nome do poder único e uma perícia.

- [ ] **Wiring:** em `app/ficha/[tipo]/[id]/page.tsx`, importar `FichaOrigem` e adicionar ramo `entidade.tipo === "origem" ? <FichaOrigem .../> :` antes do fallback `Ficha`.

- [ ] **Índice `/origens`:** espelhar `app/classes/page.tsx` (grid de cards; origens sem imagem → card só com nome + resumo). Teste: lista uma origem conhecida com link `/ficha/origem/<slug>`. Adicionar atalho "Ver todas as origens →" na home (`app/page.tsx`).

- [ ] **Verde + commit:** `npm test` (todos) e `npx tsc --noEmit`. Commit:
```
git add site/lib/schema.ts site/components/FichaOrigem.tsx "site/app/origens/" site/app/ficha site/app/page.tsx site/test/
git commit -m "feat(origens): schema origem + FichaOrigem + indice /origens"
```

## Task O2: Spike — extrair **Acólito** (1ª origem) end-to-end
- [ ] Render/leitura de PDF 91 (impressa 85) + texto; criar `data/livro-basico/origens/acolito.json` (`tipo:"origem"`, `fonte.pagina:85`, sem `imagens`), preenchendo `mecanica` conforme O1. Poder Único do Acólito = **Membro da Igreja**. `npm test` verde (carregador valida). Conferir a ficha. Commit `feat(origens): spike Acólito`.

## Task O3: Extração das 35 origens (visão/texto, 2 passadas) — por blocos
- [ ] Blocos de ~6–8 origens. Passada 1 (extrator) preenche cada JSON a partir do texto (`basico-full.txt`) **conferindo pela imagem renderizada** quando o layout em colunas confundir o `pdftotext` (origens têm caixas e arte que intercalam colunas). Passada 2 (revisor independente) relê e corrige: flavor íntegro, Itens, Benefícios (perícias+poderes exatos da Tabela 1-19 e do corpo), Poder(es) Único(s) com descrição, casos especiais (Amnésico, Assistente, "poder de combate a sua escolha"). `npm test` verde + commit por bloco.

## Task O4: Tooltips/links citados nas origens
- [ ] Perícias e poderes citados viram **links** quando essas categorias existirem; por ora, garantir que termos de regra citados (ex.: "parceiro", "patamar veterano/heroico/lenda", "T$/tibar") tenham tooltip se já não existirem em `data/referencia/`. Adicionar só os achados com proveniência; não inventar.

## Task O5: Integração final
- [ ] `npm test` verde; `npm run build` gera `/origens` + uma `/ficha/origem/<slug>` para as 35. Conferir 3–4 fichas (reiniciar dev pois há dados novos). Atualizar `PROGRESSO.md` (Origens ✅; próxima categoria) e commitar.

---

## Encerramento
Ao fim: 35 origens extraídas e validadas, schema com `origem`, `FichaOrigem`, índice `/origens`, busca/auto-link/tooltips e build estático OK. Próxima fatia: **Perícias** ou **Poderes Gerais** (Capítulo 2, impressa 112+) — destrava os links das origens e classes — ou **Magias**.
