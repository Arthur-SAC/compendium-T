# Fase 0 — Fundação (Compêndio Tormenta 20) — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Erguer a fundação do projeto — app Next.js animado no tema "Grimório/Tormenta" que renderiza uma entidade real com tooltips, links navegáveis e busca, mais a ferramenta de extração de PDF funcionando — provando a fatia vertical ponta a ponta.

**Architecture:** Três camadas (pipeline de extração → dados JSON → site Next.js estático). Esta fase entrega o esqueleto de todas as três, validado com dados-semente reais, e o motor de auto-link/tooltip que é o coração da navegação. A Fase 1 (extração completa do Livro Básico) é um plano separado que reusa tudo daqui.

**Tech Stack:** Node 24, Next.js 15 (App Router) + TypeScript, Tailwind CSS v4, Framer Motion, Zod (schema), Vitest + Testing Library (testes), poppler (`pdftotext`/`pdftoppm`/`pdfimages`) para extração.

**Convenções:**
- Diretório do site: `site/`. Comandos de site rodam dentro de `site/`.
- Diretório de extração: `extracao/`. Dados: `data/`. PDFs: `pdfs/`.
- O caminho do projeto tem espaços (`compendium tormenta 20`) — sempre citar caminhos entre aspas em comandos de shell.
- poppler já existe em `C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin`. O pipeline lê o caminho da env `POPPLER_BIN` (com esse valor como padrão).

---

## Estrutura de arquivos (mapa desta fase)

```
compendium tormenta 20/
├── .gitignore
├── pdfs/                              # 8 PDFs movidos da raiz
├── data/
│   ├── sources.json                  # manifesto de livros
│   ├── referencia/condicoes.json     # seed de condições (tooltips)
│   ├── referencia/glossario.json     # seed de termos de regra
│   └── livro-basico/criaturas/sucubo.json  # NOTA: seed de teste; na Fase 1 o Súcubo vem de Ameaças
├── extracao/
│   ├── package.json
│   ├── src/poppler.ts                 # wrappers de pdftotext/pdftoppm/pdfimages
│   ├── src/util.ts                    # slugify, parsePdfimagesList, buildPagePaths
│   ├── src/extrair.ts                 # CLI: extrai texto+imagem+ilustrações de um livro
│   └── test/util.test.ts
└── site/
    ├── package.json, next.config.ts, vitest.config.ts, tsconfig.json
    ├── app/globals.css                # tokens do tema (paleta Tormenta)
    ├── app/layout.tsx, app/page.tsx   # home com busca
    ├── app/ficha/[tipo]/[id]/page.tsx # página de ficha (rota dinâmica)
    ├── lib/schema.ts                  # tipos + Zod de todas as entidades
    ├── lib/dados.ts                   # carregamento dos JSON
    ├── lib/autolink.ts                # motor de auto-link/tooltip (núcleo)
    ├── lib/busca.ts                   # índice e função de busca
    ├── components/Tooltip.tsx
    ├── components/LinkEntidade.tsx
    ├── components/TextoRico.tsx        # aplica autolink ao texto
    ├── components/Ficha.tsx            # layout de ficha (tema grimório)
    ├── components/Busca.tsx            # caixa/paleta de busca
    └── test/                           # testes espelhando lib/ e components/
```

---

## Task 1: Inicializar repositório e estrutura

**Files:**
- Create: `.gitignore`
- Create (dirs): `pdfs/`, `data/referencia/`, `data/livro-basico/criaturas/`, `extracao/`
- Move: 8 PDFs da raiz para `pdfs/`

- [ ] **Step 1: Inicializar git e criar pastas**

Run (na raiz do projeto):
```bash
git init
mkdir -p pdfs data/referencia data/livro-basico/criaturas extracao
```
Expected: repositório criado; pastas existem.

- [ ] **Step 2: Mover os PDFs para `pdfs/`**

Run:
```bash
mv *.pdf pdfs/
ls pdfs/
```
Expected: os 8 arquivos `.pdf` listados dentro de `pdfs/`.

- [ ] **Step 3: Criar `.gitignore`**

```gitignore
# dependências
node_modules/
# build do site
site/.next/
site/out/
# cache de extração (páginas renderizadas / imagens)
extracao/cache/
data/**/imagens/
# companion de brainstorm
.superpowers/
# SO
Thumbs.db
.DS_Store
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore docs/
git commit -m "chore: inicializa repo, estrutura de pastas e move PDFs"
```
Nota: os PDFs ficam fora do commit por enquanto (grandes); decidir versionamento/LFS depois. Eles permanecem em `pdfs/` localmente.

---

## Task 2: Scaffold do site (Next.js + Tailwind + Vitest)

**Files:**
- Create: `site/` (via create-next-app), `site/vitest.config.ts`, `site/test/smoke.test.ts`

- [ ] **Step 1: Criar o app Next.js**

Run (na raiz):
```bash
export PATH="$PATH:/c/Program Files/nodejs"
npx create-next-app@latest site --ts --tailwind --app --eslint --src-dir=false --import-alias "@/*" --no-turbopack --yes
```
Expected: `site/` criado com Next.js 15, TypeScript, Tailwind v4, App Router.

- [ ] **Step 2: Instalar dependências do projeto e de teste**

Run:
```bash
cd site && npm install framer-motion zod && npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Expected: instalação sem erros.

- [ ] **Step 3: Configurar Vitest**

Create `site/vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

Create `site/test/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Adicionar script de teste**

Modify `site/package.json` (campo `scripts`): adicionar a linha `"test": "vitest run"` e `"test:watch": "vitest"`.

- [ ] **Step 5: Teste-fumaça**

Create `site/test/smoke.test.ts`:
```ts
import { expect, test } from "vitest";
test("ambiente de teste funciona", () => {
  expect(1 + 1).toBe(2);
});
```

- [ ] **Step 6: Rodar testes (verde) e o dev server**

Run:
```bash
npm test
```
Expected: 1 teste passa.

Run (verificação manual, depois Ctrl+C):
```bash
npm run dev
```
Expected: dev server sobe em http://localhost:3000 sem erros.

- [ ] **Step 7: Commit**

```bash
cd .. && git add site/ && git commit -m "chore: scaffold Next.js + Tailwind + Vitest"
```

---

## Task 3: Tema "Grimório/Tormenta" (design system base)

**Files:**
- Modify: `site/app/globals.css`
- Create: `site/components/Divisor.tsx`, `site/app/estilo/page.tsx` (página-vitrine), `site/test/divisor.test.tsx`

- [ ] **Step 1: Definir tokens do tema**

Modify `site/app/globals.css` — após a linha `@import "tailwindcss";`, adicionar:
```css
:root {
  --fundo: #120318;
  --fundo-card: #1b0820;
  --borda: #7a1f63;
  --borda-clara: #c0306e;
  --texto: #f3d9f0;
  --texto-suave: #d98fc4;
  --destaque: #ff6ab0;
  --destaque-forte: #ff2e88;
  --serifa: Georgia, "Times New Roman", serif;
}
body {
  background:
    radial-gradient(120% 80% at 50% -10%, #3a0c3e 0%, transparent 60%),
    linear-gradient(180deg, #1b0820, #120318);
  color: var(--texto);
  min-height: 100vh;
}
.titulo-grimorio {
  font-family: var(--serifa);
  color: #fff;
  text-shadow: 0 0 22px rgba(255, 40, 140, 0.55);
}
```

- [ ] **Step 2: Escrever teste do componente Divisor**

Create `site/test/divisor.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Divisor } from "@/components/Divisor";

test("Divisor renderiza com papel decorativo", () => {
  render(<Divisor />);
  expect(screen.getByTestId("divisor")).toBeInTheDocument();
});
```

- [ ] **Step 3: Rodar teste (vermelho)**

Run: `npm test -- divisor`
Expected: FAIL — módulo `@/components/Divisor` não existe.

- [ ] **Step 4: Implementar Divisor**

Create `site/components/Divisor.tsx`:
```tsx
export function Divisor() {
  return (
    <div
      data-testid="divisor"
      aria-hidden
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--destaque)", opacity: 0.8 }}
    >
      <span style={{ height: 1, width: 90, background: "linear-gradient(90deg,transparent,var(--destaque))" }} />
      <span style={{ width: 7, height: 7, background: "var(--destaque)", transform: "rotate(45deg)" }} />
      <span style={{ height: 1, width: 90, background: "linear-gradient(90deg,var(--destaque),transparent)" }} />
    </div>
  );
}
```

- [ ] **Step 5: Rodar teste (verde)**

Run: `npm test -- divisor`
Expected: PASS.

- [ ] **Step 6: Página-vitrine do tema**

Create `site/app/estilo/page.tsx`:
```tsx
import { Divisor } from "@/components/Divisor";

export default function Estilo() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 40 }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 34, textAlign: "center" }}>
        Compêndio de Arton
      </h1>
      <Divisor />
      <p style={{ fontFamily: "var(--serifa)", lineHeight: 1.7, marginTop: 20 }}>
        Vitrine do tema. Fundo, tipografia serifada e acentos em magenta da Tormenta.
      </p>
    </main>
  );
}
```
Verificação manual: `npm run dev` → abrir `/estilo`, confirmar o visual escuro com magenta.

- [ ] **Step 7: Commit**

```bash
cd .. && git add site/ && git commit -m "feat: tema base Grimório/Tormenta + Divisor"
```

---

## Task 4: Schema das entidades (Zod + tipos)

**Files:**
- Create: `site/lib/schema.ts`, `site/test/schema.test.ts`

- [ ] **Step 1: Escrever os testes do schema**

Create `site/test/schema.test.ts`:
```ts
import { expect, test } from "vitest";
import { EntidadeSchema, RelacaoSchema } from "@/lib/schema";

const baseValida = {
  id: "sucubo",
  tipo: "criatura",
  nome: "Súcubo",
  resumo: "Sedutora abissal que devora almas.",
  fonte: { livro: "ameacas-de-arton", pagina: 120 },
  imagens: [],
  secoes: [{ titulo: "Habilidades", texto: "Beijo Vampírico." }],
  relacoes: [{ tipo: "serve", alvoId: "sszzaas", alvoTipo: "divindade", rotulo: "serve Sszzaas" }],
  mecanica: { nd: "5", pv: 140, defesa: 21 },
};

test("aceita entidade válida", () => {
  expect(() => EntidadeSchema.parse(baseValida)).not.toThrow();
});

test("rejeita entidade sem fonte (provtência obrigatória)", () => {
  const { fonte, ...semFonte } = baseValida;
  expect(() => EntidadeSchema.parse(semFonte)).toThrow();
});

test("rejeita tipo desconhecido", () => {
  expect(() => EntidadeSchema.parse({ ...baseValida, tipo: "banana" })).toThrow();
});

test("relação exige alvoId e tipo", () => {
  expect(() => RelacaoSchema.parse({ tipo: "serve" })).toThrow();
});
```

- [ ] **Step 2: Rodar testes (vermelho)**

Run: `npm test -- schema`
Expected: FAIL — `@/lib/schema` não existe.

- [ ] **Step 3: Implementar o schema**

Create `site/lib/schema.ts`:
```ts
import { z } from "zod";

export const TIPOS_ENTIDADE = [
  "raca", "classe", "origem", "poder", "magia", "pericia", "item",
  "condicao", "divindade", "criatura", "npc", "regiao", "distincao",
  "variante-classe", "linhagem", "termo", "regra", "regra-de-criacao",
] as const;
export type TipoEntidade = (typeof TIPOS_ENTIDADE)[number];

export const FonteSchema = z.object({
  livro: z.string(),       // slug da fonte (ex.: "livro-basico")
  pagina: z.number().int().positive(),
});

export const RelacaoSchema = z.object({
  tipo: z.string(),                       // ex.: "serve", "habitaEm", "requer"
  alvoId: z.string(),
  alvoTipo: z.enum(TIPOS_ENTIDADE),
  rotulo: z.string(),                     // texto exibido no chip
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
  // campos mecânicos livres (legíveis por máquina; base para os geradores da Fase 3)
  mecanica: z.record(z.string(), z.unknown()).default({}),
});
export type Entidade = z.infer<typeof EntidadeSchema>;

// Condição/termo para tooltips: forma enxuta
export const TermoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  descricao: z.string(),
  fonte: FonteSchema.optional(),
});
export type Termo = z.infer<typeof TermoSchema>;
```

- [ ] **Step 4: Rodar testes (verde)**

Run: `npm test -- schema`
Expected: PASS (4 testes).

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/ && git commit -m "feat: schema Zod das entidades + provtência"
```

---

## Task 5: Dados-semente (seed) validados

**Files:**
- Create: `data/sources.json`, `data/referencia/condicoes.json`, `data/referencia/glossario.json`, `data/livro-basico/criaturas/sucubo.json`
- Create: `site/test/seed.test.ts`

- [ ] **Step 1: Criar o manifesto de fontes**

Create `data/sources.json`:
```json
{
  "fontes": [
    { "slug": "livro-basico", "titulo": "Livro Básico", "arquivo": "T20 - Livro Básico.pdf", "ordem": 1 },
    { "slug": "ameacas-de-arton", "titulo": "Ameaças de Arton", "arquivo": "Ameacas-de-Arton-v1.0-17-11-2023.pdf", "ordem": 2 }
  ]
}
```

- [ ] **Step 2: Criar seed de condições (tooltips)**

Create `data/referencia/condicoes.json`:
```json
[
  { "id": "medo", "nome": "Medo", "descricao": "O personagem sofre −2 em testes de perícia, ataques e Defesa enquanto puder ver a fonte do medo. Não acumula com outras fontes de medo.", "fonte": { "livro": "livro-basico", "pagina": 318 } },
  { "id": "atordoado", "nome": "Atordoado", "descricao": "O personagem não pode fazer ações e fica desprevenido.", "fonte": { "livro": "livro-basico", "pagina": 318 } }
]
```
> Nota: páginas são provisórias; serão confirmadas na Fase 1 (releitura do PDF). O seed serve para o motor e os testes.

- [ ] **Step 3: Criar seed de glossário**

Create `data/referencia/glossario.json`:
```json
[
  { "id": "nd", "nome": "ND", "descricao": "Nível de Desafio — mede o poder de uma criatura ou encontro." },
  { "id": "pm", "nome": "PM", "descricao": "Pontos de Mana — recurso gasto para conjurar magias e usar habilidades." }
]
```

- [ ] **Step 4: Criar seed de criatura (Súcubo)**

Create `data/livro-basico/criaturas/sucubo.json`:
```json
{
  "id": "sucubo",
  "tipo": "criatura",
  "nome": "Súcubo",
  "resumo": "Belíssima e cruel, a súcubo seduz mortais para devorar-lhes a alma.",
  "fonte": { "livro": "ameacas-de-arton", "pagina": 120 },
  "imagens": [],
  "secoes": [
    { "titulo": "Descrição", "texto": "Sua vítima precisa resistir ou fica tomada de Medo, incapaz de reagir à altura." },
    { "titulo": "Habilidades", "texto": "Beijo Vampírico. Causa 4d6 de dano e a súcubo recupera PV igual ao dano." }
  ],
  "relacoes": [
    { "tipo": "serve", "alvoId": "sszzaas", "alvoTipo": "divindade", "rotulo": "serve Sszzaas" }
  ],
  "mecanica": { "nd": "5", "pv": 140, "defesa": 21 }
}
```

- [ ] **Step 5: Escrever teste que valida todo o seed contra o schema**

Create `site/test/seed.test.ts`:
```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import { EntidadeSchema, TermoSchema } from "@/lib/schema";

const RAIZ = join(__dirname, "..", "..", "data");

test("Súcubo (seed) é uma entidade válida", () => {
  const json = JSON.parse(readFileSync(join(RAIZ, "livro-basico/criaturas/sucubo.json"), "utf8"));
  expect(() => EntidadeSchema.parse(json)).not.toThrow();
});

test("condições do seed são termos válidos", () => {
  const arr = JSON.parse(readFileSync(join(RAIZ, "referencia/condicoes.json"), "utf8"));
  for (const t of arr) expect(() => TermoSchema.parse(t)).not.toThrow();
});
```

- [ ] **Step 6: Rodar testes (verde)**

Run: `npm test -- seed`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
cd .. && git add data/ site/ && git commit -m "feat: dados-semente (sources, condições, glossário, Súcubo) validados"
```

---

## Task 6: Motor de auto-link / tooltip (núcleo)

Transforma um texto em uma lista de pedaços (`tokens`): texto puro, termo-com-tooltip, ou link-de-entidade. É o que faz "Medo" virar tooltip e "Sszzaas" virar link automaticamente.

**Files:**
- Create: `site/lib/autolink.ts`, `site/test/autolink.test.ts`

- [ ] **Step 1: Escrever os testes do motor**

Create `site/test/autolink.test.ts`:
```ts
import { expect, test } from "vitest";
import { construirRegistro, tokenizar } from "@/lib/autolink";

const registro = construirRegistro({
  termos: [{ id: "medo", nome: "Medo", descricao: "−2 em testes…" }],
  entidades: [{ id: "sszzaas", nome: "Sszzaas", tipo: "divindade" }],
});

test("texto sem termos vira um único token de texto", () => {
  const t = tokenizar("um texto qualquer", registro);
  expect(t).toEqual([{ tipo: "texto", valor: "um texto qualquer" }]);
});

test("reconhece um termo (tooltip)", () => {
  const t = tokenizar("fica com Medo agora", registro);
  expect(t).toEqual([
    { tipo: "texto", valor: "fica com " },
    { tipo: "tooltip", termoId: "medo", valor: "Medo" },
    { tipo: "texto", valor: " agora" },
  ]);
});

test("reconhece uma entidade (link)", () => {
  const t = tokenizar("serve Sszzaas fielmente", registro);
  expect(t).toEqual([
    { tipo: "texto", valor: "serve " },
    { tipo: "link", alvoId: "sszzaas", alvoTipo: "divindade", valor: "Sszzaas" },
    { tipo: "texto", valor: " fielmente" },
  ]);
});

test("é case-insensitive mas preserva o texto original", () => {
  const t = tokenizar("MEDO total", registro);
  expect(t[0]).toEqual({ tipo: "tooltip", termoId: "medo", valor: "MEDO" });
});

test("casa só palavra inteira (não casa dentro de outra palavra)", () => {
  const t = tokenizar("amedontrado", registro); // contém 'medo' no meio
  expect(t).toEqual([{ tipo: "texto", valor: "amedontrado" }]);
});

test("prioriza o termo mais longo quando há sobreposição", () => {
  const reg2 = construirRegistro({
    termos: [
      { id: "ataque", nome: "ataque", descricao: "..." },
      { id: "ataque-de-oportunidade", nome: "ataque de oportunidade", descricao: "..." },
    ],
    entidades: [],
  });
  const t = tokenizar("sofre ataque de oportunidade hoje", reg2);
  expect(t).toContainEqual({ tipo: "tooltip", termoId: "ataque-de-oportunidade", valor: "ataque de oportunidade" });
});
```

- [ ] **Step 2: Rodar testes (vermelho)**

Run: `npm test -- autolink`
Expected: FAIL — `@/lib/autolink` não existe.

- [ ] **Step 3: Implementar o motor**

Create `site/lib/autolink.ts`:
```ts
import type { TipoEntidade } from "./schema";

export type Token =
  | { tipo: "texto"; valor: string }
  | { tipo: "tooltip"; termoId: string; valor: string }
  | { tipo: "link"; alvoId: string; alvoTipo: TipoEntidade; valor: string };

type TermoEntrada = { id: string; nome: string; descricao: string };
type EntidadeEntrada = { id: string; nome: string; tipo: TipoEntidade };

export type Registro = {
  // entradas ordenadas por nome decrescente (mais longo primeiro)
  entradas: Array<
    | { kind: "tooltip"; termoId: string; nome: string }
    | { kind: "link"; alvoId: string; alvoTipo: TipoEntidade; nome: string }
  >;
};

export function construirRegistro(dados: {
  termos: TermoEntrada[];
  entidades: EntidadeEntrada[];
}): Registro {
  const entradas: Registro["entradas"] = [
    ...dados.termos.map((t) => ({ kind: "tooltip" as const, termoId: t.id, nome: t.nome })),
    ...dados.entidades.map((e) => ({ kind: "link" as const, alvoId: e.id, alvoTipo: e.tipo, nome: e.nome })),
  ];
  // mais longo primeiro → garante prioridade do termo composto
  entradas.sort((a, b) => b.nome.length - a.nome.length);
  return { entradas };
}

function escaparRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function tokenizar(texto: string, registro: Registro): Token[] {
  if (registro.entradas.length === 0) return [{ tipo: "texto", valor: texto }];
  // uma regex única com alternâncias, bordas de palavra unicode-aware simplificadas
  const alternativas = registro.entradas.map((e) => escaparRegex(e.nome)).join("|");
  // (?<![\p{L}]) e (?![\p{L}]) = não estar colado a outra letra
  const re = new RegExp(`(?<![\\p{L}])(${alternativas})(?![\\p{L}])`, "giu");

  const tokens: Token[] = [];
  let ultimo = 0;
  for (const m of texto.matchAll(re)) {
    const inicio = m.index!;
    const casado = m[0];
    if (inicio > ultimo) tokens.push({ tipo: "texto", valor: texto.slice(ultimo, inicio) });
    const entrada = registro.entradas.find((e) => e.nome.toLowerCase() === casado.toLowerCase());
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
```
> Observação: `matchAll` com regex global percorre da esquerda p/ direita; como a alternância lista o nome mais longo primeiro, em posições iguais o mais longo casa antes. O teste de sobreposição cobre isso.

- [ ] **Step 4: Rodar testes (verde)**

Run: `npm test -- autolink`
Expected: PASS (6 testes). Se o teste de "palavra inteira" falhar por lookbehind unicode, confirmar Node ≥ 20 (temos 24) — `\p{L}` com flag `u` é suportado.

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/ && git commit -m "feat: motor de auto-link e tooltip (núcleo da navegação)"
```

---

## Task 7: Componentes Tooltip, LinkEntidade e TextoRico

**Files:**
- Create: `site/components/Tooltip.tsx`, `site/components/LinkEntidade.tsx`, `site/components/TextoRico.tsx`
- Create: `site/test/textorico.test.tsx`

- [ ] **Step 1: Escrever teste do TextoRico**

Create `site/test/textorico.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { TextoRico } from "@/components/TextoRico";
import { construirRegistro } from "@/lib/autolink";

const registro = construirRegistro({
  termos: [{ id: "medo", nome: "Medo", descricao: "−2 em testes, ataques e Defesa." }],
  entidades: [{ id: "sszzaas", nome: "Sszzaas", tipo: "divindade" }],
});

test("renderiza termo como gatilho de tooltip e entidade como link", async () => {
  render(<TextoRico texto="fica com Medo e serve Sszzaas" registro={registro} />);
  const termo = screen.getByText("Medo");
  expect(termo).toHaveAttribute("data-tooltip", "medo");
  const link = screen.getByRole("link", { name: "Sszzaas" });
  expect(link).toHaveAttribute("href", "/ficha/divindade/sszzaas");
});

test("a descrição da tooltip aparece ao focar/hover", async () => {
  render(<TextoRico texto="com Medo" registro={registro} descricoes={{ medo: "−2 em testes, ataques e Defesa." }} />);
  await userEvent.hover(screen.getByText("Medo"));
  expect(await screen.findByText(/−2 em testes/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Rodar teste (vermelho)**

Run: `npm test -- textorico`
Expected: FAIL — componentes não existem.

- [ ] **Step 3: Implementar Tooltip**

Create `site/components/Tooltip.tsx`:
```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Tooltip({ rotulo, descricao, termoId }: { rotulo: string; descricao?: string; termoId: string }) {
  const [aberto, setAberto] = useState(false);
  return (
    <span
      data-tooltip={termoId}
      tabIndex={0}
      onMouseEnter={() => setAberto(true)}
      onMouseLeave={() => setAberto(false)}
      onFocus={() => setAberto(true)}
      onBlur={() => setAberto(false)}
      style={{ position: "relative", borderBottom: "2px dotted var(--destaque)", color: "#ff8fc4", fontWeight: 700, cursor: "help" }}
    >
      {rotulo}
      <AnimatePresence>
        {aberto && descricao && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute", left: "50%", bottom: "135%", transform: "translateX(-50%)",
              width: 240, background: "var(--fundo-card)", color: "var(--texto)",
              border: "1px solid var(--borda-clara)", borderRadius: 10, padding: "11px 13px",
              font: "400 11.5px/1.5 system-ui", boxShadow: "0 12px 40px rgba(0,0,0,.7)", zIndex: 50,
            }}
          >
            <b style={{ color: "#ff8fc4" }}>{rotulo}</b>
            <br />
            {descricao}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
```

- [ ] **Step 4: Implementar LinkEntidade**

Create `site/components/LinkEntidade.tsx`:
```tsx
import Link from "next/link";
import type { TipoEntidade } from "@/lib/schema";

export function LinkEntidade({ alvoId, alvoTipo, rotulo }: { alvoId: string; alvoTipo: TipoEntidade; rotulo: string }) {
  return (
    <Link
      href={`/ficha/${alvoTipo}/${alvoId}`}
      style={{ color: "var(--destaque)", textDecoration: "none", borderBottom: "1px solid transparent" }}
    >
      {rotulo}
    </Link>
  );
}
```

- [ ] **Step 5: Implementar TextoRico**

Create `site/components/TextoRico.tsx`:
```tsx
import { Fragment } from "react";
import { tokenizar, type Registro } from "@/lib/autolink";
import { Tooltip } from "./Tooltip";
import { LinkEntidade } from "./LinkEntidade";

export function TextoRico({
  texto, registro, descricoes = {},
}: { texto: string; registro: Registro; descricoes?: Record<string, string> }) {
  const tokens = tokenizar(texto, registro);
  return (
    <>
      {tokens.map((tk, i) => {
        if (tk.tipo === "texto") return <Fragment key={i}>{tk.valor}</Fragment>;
        if (tk.tipo === "tooltip")
          return <Tooltip key={i} termoId={tk.termoId} rotulo={tk.valor} descricao={descricoes[tk.termoId]} />;
        return <LinkEntidade key={i} alvoId={tk.alvoId} alvoTipo={tk.alvoTipo} rotulo={tk.valor} />;
      })}
    </>
  );
}
```

- [ ] **Step 6: Rodar teste (verde)**

Run: `npm test -- textorico`
Expected: PASS (2 testes).

- [ ] **Step 7: Commit**

```bash
cd .. && git add site/ && git commit -m "feat: componentes Tooltip, LinkEntidade e TextoRico"
```

---

## Task 8: Carregamento de dados + página de ficha

**Files:**
- Create: `site/lib/dados.ts`, `site/components/Ficha.tsx`, `site/app/ficha/[tipo]/[id]/page.tsx`
- Create: `site/test/dados.test.ts`

- [ ] **Step 1: Escrever teste do carregador**

Create `site/test/dados.test.ts`:
```ts
import { expect, test } from "vitest";
import { carregarEntidades, carregarTermos } from "@/lib/dados";

test("carrega todas as entidades do data/ e encontra o Súcubo", () => {
  const ents = carregarEntidades();
  const sucubo = ents.find((e) => e.id === "sucubo");
  expect(sucubo?.nome).toBe("Súcubo");
});

test("carrega os termos (condições + glossário)", () => {
  const termos = carregarTermos();
  expect(termos.some((t) => t.id === "medo")).toBe(true);
  expect(termos.some((t) => t.id === "nd")).toBe(true);
});
```

- [ ] **Step 2: Rodar teste (vermelho)**

Run: `npm test -- dados`
Expected: FAIL — `@/lib/dados` não existe.

- [ ] **Step 3: Implementar o carregador**

Create `site/lib/dados.ts`:
```ts
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
```

- [ ] **Step 4: Rodar teste (verde)**

Run: `npm test -- dados`
Expected: PASS (2 testes).

- [ ] **Step 5: Implementar Ficha (layout grimório)**

Create `site/components/Ficha.tsx`:
```tsx
import type { Entidade } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

export function Ficha({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as Record<string, string | number>;
  return (
    <article style={{ maxWidth: 560, margin: "0 auto", background: "var(--fundo-card)", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 14px 50px rgba(160,20,90,.35)" }}>
      <header style={{ padding: "16px 22px 10px", textAlign: "center", borderBottom: "1px solid var(--borda-clara)" }}>
        <h1 className="titulo-grimorio" style={{ fontSize: 30, margin: 0 }}>{entidade.nome}</h1>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--texto-suave)" }}>{entidade.tipo}</div>
        <Divisor />
      </header>
      <div style={{ padding: "18px 24px 22px" }}>
        {Object.keys(m).length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
            {Object.entries(m).map(([k, v]) => (
              <span key={k} style={{ textAlign: "center", background: "rgba(220,40,120,.12)", border: "1px solid var(--borda-clara)", borderRadius: 10, padding: "8px 12px" }}>
                <span style={{ display: "block", fontFamily: "var(--serifa)", fontSize: 18, color: "#ffaad4", fontWeight: 800 }}>{String(v)}</span>
                <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--texto-suave)" }}>{k}</span>
              </span>
            ))}
          </div>
        )}
        {entidade.secoes.map((s, i) => (
          <section key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.65, marginBottom: 12 }}>
            <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: "var(--destaque)", borderBottom: "1px solid var(--borda)", paddingBottom: 4 }}>{s.titulo}</h2>
            <p><TextoRico texto={s.texto} registro={registro} descricoes={descricoes} /></p>
          </section>
        ))}
        {entidade.relacoes.length > 0 && (
          <section>
            <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 2, color: "var(--destaque)" }}>Relações</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {entidade.relacoes.map((r, i) => (
                <span key={i} style={{ fontSize: 11, padding: "4px 11px", borderRadius: 20, background: "rgba(220,40,120,.14)", border: "1px solid var(--borda-clara)" }}>
                  <LinkEntidade alvoId={r.alvoId} alvoTipo={r.alvoTipo} rotulo={r.rotulo} />
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
```

- [ ] **Step 6: Criar a rota de ficha**

Create `site/app/ficha/[tipo]/[id]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { carregarEntidades, carregarTermos } from "@/lib/dados";
import { construirRegistro } from "@/lib/autolink";
import { Ficha } from "@/components/Ficha";

export function generateStaticParams() {
  return carregarEntidades().map((e) => ({ tipo: e.tipo, id: e.id }));
}

export default async function PaginaFicha({ params }: { params: Promise<{ tipo: string; id: string }> }) {
  const { tipo, id } = await params;
  const entidades = carregarEntidades();
  const termos = carregarTermos();
  const entidade = entidades.find((e) => e.id === id && e.tipo === tipo);
  if (!entidade) notFound();

  const registro = construirRegistro({
    termos: termos.map((t) => ({ id: t.id, nome: t.nome, descricao: t.descricao })),
    entidades: entidades.map((e) => ({ id: e.id, nome: e.nome, tipo: e.tipo })),
  });
  const descricoes = Object.fromEntries(termos.map((t) => [t.id, t.descricao]));

  return (
    <main style={{ padding: 40 }}>
      <Ficha entidade={entidade} registro={registro} descricoes={descricoes} />
    </main>
  );
}
```

- [ ] **Step 7: Verificação manual**

Run: `npm run dev` → abrir `/ficha/criatura/sucubo`.
Expected: ficha do Súcubo no tema grimório; "Medo" mostra tooltip ao passar o mouse; chip "serve Sszzaas" é um link (leva a 404 por enquanto — Sszzaas ainda não existe; OK nesta fase).

- [ ] **Step 8: Commit**

```bash
cd .. && git add site/ && git commit -m "feat: carregador de dados + página de ficha no tema grimório"
```

---

## Task 9: Busca

**Files:**
- Create: `site/lib/busca.ts`, `site/components/Busca.tsx`, `site/app/page.tsx` (substitui a home padrão)
- Create: `site/test/busca.test.ts`

- [ ] **Step 1: Escrever testes da busca**

Create `site/test/busca.test.ts`:
```ts
import { expect, test } from "vitest";
import { construirIndice, buscar } from "@/lib/busca";

const indice = construirIndice([
  { id: "sucubo", tipo: "criatura", nome: "Súcubo", resumo: "abissal que devora almas" },
  { id: "khalmyr", tipo: "divindade", nome: "Khalmyr", resumo: "deus da justiça" },
]);

test("encontra por nome ignorando acento e caixa", () => {
  expect(buscar("sucubo", indice).map((r) => r.id)).toContain("sucubo");
  expect(buscar("SÚCUBO", indice).map((r) => r.id)).toContain("sucubo");
});

test("encontra por palavra do resumo", () => {
  expect(buscar("justiça", indice).map((r) => r.id)).toContain("khalmyr");
});

test("filtra por tipo", () => {
  const r = buscar("a", indice, { tipo: "divindade" });
  expect(r.every((x) => x.tipo === "divindade")).toBe(true);
});

test("consulta vazia não retorna nada", () => {
  expect(buscar("", indice)).toEqual([]);
});
```

- [ ] **Step 2: Rodar testes (vermelho)**

Run: `npm test -- busca`
Expected: FAIL — `@/lib/busca` não existe.

- [ ] **Step 3: Implementar a busca**

Create `site/lib/busca.ts`:
```ts
import type { TipoEntidade } from "./schema";

export type ItemIndice = { id: string; tipo: TipoEntidade; nome: string; resumo: string };
type Entrada = ItemIndice & { chave: string };
export type Indice = Entrada[];

function normalizar(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function construirIndice(itens: ItemIndice[]): Indice {
  return itens.map((it) => ({ ...it, chave: normalizar(`${it.nome} ${it.resumo}`) }));
}

export function buscar(consulta: string, indice: Indice, opcoes?: { tipo?: TipoEntidade }): ItemIndice[] {
  const q = normalizar(consulta.trim());
  if (!q) return [];
  return indice
    .filter((e) => (opcoes?.tipo ? e.tipo === opcoes.tipo : true))
    .map((e) => {
      const nomeNorm = normalizar(e.nome);
      let pontos = 0;
      if (nomeNorm === q) pontos = 100;
      else if (nomeNorm.startsWith(q)) pontos = 50;
      else if (e.chave.includes(q)) pontos = 10;
      return { e, pontos };
    })
    .filter((x) => x.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .map((x) => x.e);
}
```

- [ ] **Step 4: Rodar testes (verde)**

Run: `npm test -- busca`
Expected: PASS (4 testes).

- [ ] **Step 5: Implementar o componente de busca**

Create `site/components/Busca.tsx`:
```tsx
"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { buscar, type ItemIndice, type Indice } from "@/lib/busca";

export function Busca({ indice }: { indice: Indice }) {
  const [q, setQ] = useState("");
  const resultados = useMemo(() => buscar(q, indice).slice(0, 20), [q, indice]);
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar em Arton…"
        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "var(--fundo-card)", border: "1px solid var(--borda-clara)", color: "var(--texto)", fontSize: 16 }}
      />
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {resultados.map((r: ItemIndice, i) => (
          <motion.div key={r.tipo + r.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <Link href={`/ficha/${r.tipo}/${r.id}`} style={{ display: "block", padding: "10px 14px", borderRadius: 10, background: "var(--fundo-card)", border: "1px solid var(--borda)", color: "var(--texto)", textDecoration: "none" }}>
              <strong style={{ color: "var(--destaque)" }}>{r.nome}</strong>
              <span style={{ float: "right", fontSize: 10, textTransform: "uppercase", color: "var(--texto-suave)" }}>{r.tipo}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Home com a busca**

Replace `site/app/page.tsx`:
```tsx
import { carregarEntidades } from "@/lib/dados";
import { construirIndice } from "@/lib/busca";
import { Busca } from "@/components/Busca";
import { Divisor } from "@/components/Divisor";

export default function Home() {
  const ents = carregarEntidades();
  const indice = construirIndice(ents.map((e) => ({ id: e.id, tipo: e.tipo, nome: e.nome, resumo: e.resumo })));
  return (
    <main style={{ padding: 48 }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 40, textAlign: "center" }}>Compêndio de Arton</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-suave)", margin: "12px 0 28px" }}>Tormenta 20 — wiki de mesa</p>
      <Busca indice={indice} />
    </main>
  );
}
```

- [ ] **Step 7: Verificação manual + build estático**

Run: `npm run dev` → na home, buscar "súcubo" → clicar no resultado → cai na ficha.
Run: `npm run build`
Expected: build conclui (confirma que `generateStaticParams` e o carregamento de dados funcionam em produção/estático).

- [ ] **Step 8: Commit**

```bash
cd .. && git add site/ && git commit -m "feat: busca global + home"
```

---

## Task 10: Ferramenta de extração (pipeline base)

Wrappers determinísticos sobre o poppler, com provtência. Os helpers puros são testados; o CLI é validado manualmente em páginas reais do Livro Básico.

**Files:**
- Create: `extracao/package.json`, `extracao/tsconfig.json`, `extracao/src/util.ts`, `extracao/src/poppler.ts`, `extracao/src/extrair.ts`, `extracao/test/util.test.ts`

- [ ] **Step 1: Inicializar o pacote de extração**

Run (na raiz):
```bash
cd extracao && npm init -y && npm install -D typescript tsx vitest @types/node
```
Create `extracao/tsconfig.json`:
```json
{ "compilerOptions": { "target": "ES2022", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "esModuleInterop": true, "skipLibCheck": true } }
```
Modify `extracao/package.json` scripts: adicionar `"test": "vitest run"`, `"extrair": "tsx src/extrair.ts"`.

- [ ] **Step 2: Escrever testes dos helpers puros**

Create `extracao/test/util.test.ts`:
```ts
import { expect, test } from "vitest";
import { slugify, parsePdfimagesList, buildPagePaths } from "../src/util";

test("slugify normaliza acentos e espaços", () => {
  expect(slugify("Súcubo da Tormenta")).toBe("sucubo-da-tormenta");
  expect(slugify("Ataque de Oportunidade!")).toBe("ataque-de-oportunidade");
});

test("parsePdfimagesList extrai número e tamanho das imagens", () => {
  const saida = [
    "page   num  type   width height color comp bpc  enc interp  object ID x-ppi y-ppi size ratio",
    "--------------------------------------------------------------------------------------------",
    "  40     0 image    1243  1688  cmyk    4   8  jpx    no      1848  0   150   150 51.6K 0.6%",
    "  40     1 image    1113    77  cmyk    4   8  jpeg   no      1876  0   150   151 71.9K  21%",
  ].join("\n");
  const r = parsePdfimagesList(saida);
  expect(r).toHaveLength(2);
  expect(r[0]).toMatchObject({ page: 40, num: 0, width: 1243, height: 1688 });
});

test("buildPagePaths gera caminhos previsíveis por livro e página", () => {
  const p = buildPagePaths("/cache", "livro-basico", 41);
  expect(p.texto).toBe("/cache/livro-basico/p0041.txt");
  expect(p.imagem).toBe("/cache/livro-basico/p0041.png");
});
```

- [ ] **Step 3: Rodar testes (vermelho)**

Run: `npm test`
Expected: FAIL — `../src/util` não existe.

- [ ] **Step 4: Implementar os helpers**

Create `extracao/src/util.ts`:
```ts
import { join } from "node:path";

export function slugify(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export type ImagemInfo = { page: number; num: number; width: number; height: number };

export function parsePdfimagesList(saida: string): ImagemInfo[] {
  const linhas = saida.split("\n").map((l) => l.trim()).filter(Boolean);
  const out: ImagemInfo[] = [];
  for (const l of linhas) {
    if (l.startsWith("page") || l.startsWith("---")) continue;
    const c = l.split(/\s+/);
    const page = Number(c[0]), num = Number(c[1]);
    const width = Number(c[3]), height = Number(c[4]);
    if (Number.isFinite(page) && Number.isFinite(num)) out.push({ page, num, width, height });
  }
  return out;
}

export function buildPagePaths(cacheDir: string, livro: string, pagina: number) {
  const pad = String(pagina).padStart(4, "0");
  const base = join(cacheDir, livro);
  return { dir: base, texto: join(base, `p${pad}.txt`), imagem: join(base, `p${pad}.png`) };
}
```

- [ ] **Step 5: Rodar testes (verde)**

Run: `npm test`
Expected: PASS (3 testes).

- [ ] **Step 6: Implementar os wrappers do poppler**

Create `extracao/src/poppler.ts`:
```ts
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const POPPLER_BIN = process.env.POPPLER_BIN ||
  "C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin";

function bin(nome: string): string {
  return join(POPPLER_BIN, nome);
}

export function extrairTexto(pdf: string, pagina: number): string {
  return execFileSync(bin("pdftotext"),
    ["-f", String(pagina), "-l", String(pagina), "-layout", "-enc", "UTF-8", pdf, "-"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

export function renderizarPagina(pdf: string, pagina: number, prefixoSaida: string, dpi = 150): void {
  execFileSync(bin("pdftoppm"),
    ["-f", String(pagina), "-l", String(pagina), "-png", "-r", String(dpi), pdf, prefixoSaida]);
}

export function listarImagens(pdf: string, pagina: number): string {
  return execFileSync(bin("pdfimages"),
    ["-f", String(pagina), "-l", String(pagina), "-list", pdf], { encoding: "utf8" });
}

export function extrairImagens(pdf: string, pagina: number, prefixoSaida: string): void {
  execFileSync(bin("pdfimages"),
    ["-f", String(pagina), "-l", String(pagina), "-png", pdf, prefixoSaida]);
}
```

- [ ] **Step 7: Implementar o CLI de extração**

Create `extracao/src/extrair.ts`:
```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildPagePaths } from "./util.js";
import { extrairTexto, renderizarPagina } from "./poppler.js";

// uso: tsx src/extrair.ts "<pdf>" <livroSlug> <pagInicial> <pagFinal>
const [pdf, livro, ini, fim] = process.argv.slice(2);
if (!pdf || !livro || !ini || !fim) {
  console.error('uso: tsx src/extrair.ts "<pdf>" <livroSlug> <pagInicial> <pagFinal>');
  process.exit(1);
}
const cache = join(process.cwd(), "cache");
for (let p = Number(ini); p <= Number(fim); p++) {
  const caminhos = buildPagePaths(cache, livro, p);
  mkdirSync(caminhos.dir, { recursive: true });
  writeFileSync(caminhos.texto, extrairTexto(pdf, p), "utf8");
  renderizarPagina(pdf, p, caminhos.imagem.replace(/\.png$/, ""));
  console.log(`pág ${p}: texto + imagem em ${caminhos.dir}`);
}
```

- [ ] **Step 8: Validação manual em páginas reais**

Run (na pasta `extracao/`):
```bash
export POPPLER_BIN="C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin"
npm run extrair -- "../pdfs/T20 - Livro Básico.pdf" livro-basico 41 42
```
Expected: cria `extracao/cache/livro-basico/p0041.txt` (texto com acentos corretos) e `p0041-41.png` (página renderizada). Abrir o `.txt` e confirmar acentuação UTF-8 correta.

- [ ] **Step 9: Commit**

```bash
cd .. && git add extracao/ && git commit -m "feat: ferramenta de extração (poppler + provtência + CLI)"
```

---

## Encerramento da Fase 0

Ao fim, o projeto tem:
- App Next.js no tema Grimório/Tormenta, com home + busca + página de ficha animada.
- Motor de auto-link/tooltip funcionando (Medo → tooltip, Sszzaas → link), testado.
- Schema Zod com provtência, dados-semente validados.
- Ferramenta de extração rodando em páginas reais do Livro Básico.
- Build estático passando (`npm run build`).

**A Fase 1** (extração completa e validada do Livro Básico — todas as categorias, regras de combate/magia/mestrar, regras de criação, trilhas de Jogador e Mestre) recebe um plano próprio, escrito após a Fase 0, reusando schema, componentes e pipeline daqui.
