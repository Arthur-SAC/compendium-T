# Raças Ponta a Ponta — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Levar a categoria **Raças** do Livro Básico 100% ponta a ponta — todas as raças extraídas com rigor (texto+visão, validadas), em JSON estruturado, exibidas em fichas dedicadas + índice `/racas`, com imagens, tooltips e auto-link reais, indexadas na busca, com export estático e suíte verde.

**Architecture:** Três camadas já existentes (extração poppler → JSON em `data/` → site Next.js). Este plano formaliza o **spike aprovado** (commit `de361b4`: `FichaRaca`, `/racas`, Humano + ilustração) adicionando rigor: schema Zod de Raça com testes, extração das demais raças pela abordagem de **visão em duas passadas**, tooltips extraídos com proveniência, pipeline de imagens, export estático e endurecimento da fundação.

**Tech Stack:** Next.js 16 (App Router, React 19), TypeScript, Tailwind v4, framer-motion, Zod v4, Vitest + Testing Library (jsdom). Extração: Node + poppler (`pdftotext`/`pdftoppm`/`pdfimages`) + `sharp` (composição de imagem). Visão do agente para ler páginas renderizadas.

**Documentos:** Spec aprovada em `docs/superpowers/specs/2026-05-29-racas-ponta-a-ponta-design.md`. Visão geral em `docs/superpowers/specs/2026-05-28-wiki-tormenta-20-design.md`.

---

## Convenções e quirks (ler antes)

- Caminho do projeto tem espaços (`compendium tormenta 20`) — sempre citar entre aspas.
- **Node não está no PATH** por padrão: no Bash use `export PATH="$PATH:/c/Program Files/nodejs"`; no PowerShell use `$env:Path += ";C:\Program Files\nodejs"`.
- **poppler** em `C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin` (env `POPPLER_BIN`, default no código de `extracao/`).
- Comandos de site rodam dentro de `site/`; testes via `npm test` (vitest run). `extracao/` tem sua própria suíte.
- **Commitar caminhos específicos** (`git add site/ data/ …`), **NUNCA `git add -A`** (já vazou PDFs).
- **Não dar push** até o usuário pedir.
- **Nunca inventar dados** — tudo vem do PDF; o que não existir fica vazio/omitido. A 2ª passada de validação é gate obrigatório.
- `extracao/cache/` é gitignored (páginas/recortes intermediários) — não commitar.

## Refinamento da spec (decisão deste plano)

A spec §4/§9 propunha imagens em `data/livro-basico/imagens/`. Por causa do **export estático** (`output: "export"`), o site só serve assets de `site/public/`. Portanto: **as ilustrações ficam em `site/public/racas/<slug>.png`** (versionadas no git, servidas como `/racas/<slug>.png`, referenciadas em `entidade.imagens[]`). Não é preciso alterar o `.gitignore` (a linha `data/**/imagens/` permanece; não usaremos `data/.../imagens`). Isso já é o que o spike fez.

## Estado herdado do spike (commit `de361b4`)

Já existem e funcionam (build verde, 25 testes site + 3 extração):
- `site/components/FichaRaca.tsx` — ficha dedicada (layout aprovado). **Ainda sem testes.**
- `site/app/racas/page.tsx` — índice. **Ainda sem testes.**
- `site/app/ficha/[tipo]/[id]/page.tsx` — escolhe `FichaRaca` quando `tipo === "raca"`.
- `data/livro-basico/racas/humano.json` — Humano extraído (pág. impressa 19), com `mecanica` estruturada.
- `site/public/racas/humano.png` — ilustração (Drikka) composta com `sharp`.
- Glossário **revertido ao original** (os termos do tooltip do spike eram inventados e foram removidos).

`site/lib/dados.ts` carrega recursivamente `data/livro-basico/`. `site/lib/autolink.ts` usa `Map porNome` + regex montada em `tokenizar`. `site/lib/schema.ts` tem `EntidadeSchema` com `mecanica: z.record(...)` (sem validação por tipo ainda).

---

## File Structure (mapa deste plano)

```
site/
├── next.config.ts                       # MOD: output:"export" + images.unoptimized
├── lib/schema.ts                        # MOD: + RacaMecanicaSchema e validação por tipo "raca"
├── lib/dados.ts                         # MOD: memoização (cache de módulo)
├── lib/autolink.ts                      # MOD: regex pré-compilada no Registro
├── app/ficha/[tipo]/[id]/page.tsx       # MOD: + export const dynamicParams = false
├── components/FichaRaca.tsx             # (existe) — sem mudança de código; ganha testes
├── app/racas/page.tsx                   # (existe) — sem mudança de código; ganha teste
├── public/racas/<slug>.png              # NOVO: ilustrações das raças (versionadas)
└── test/
    ├── schema.test.ts                   # MOD: + casos de Raça
    ├── dados.test.ts                    # MOD: + memoização
    ├── autolink.test.ts                 # MOD: + regex pré-compilada
    ├── fichraca.test.tsx                # NOVO
    └── racas-indice.test.tsx            # NOVO
extracao/
├── src/imagens.ts                       # NOVO: composição cor+máscara (sharp) → PNG transparente
├── src/util.ts                          # MOD: + helper de caminho de imagem de raça (testado)
└── test/util.test.ts                    # MOD: + teste do helper
data/livro-basico/racas/<slug>.json      # NOVO: uma raça por arquivo (16 além do Humano)
data/referencia/{glossario,condicoes}.json # MOD: termos citados nas raças, extraídos c/ proveniência
docs/superpowers/plans/racas-paginas.md   # NOVO: mapa raça→página PDF (artefato da descoberta)
```

---

## Task 1: Schema Zod de Raça + validação por tipo

**Files:**
- Modify: `site/lib/schema.ts`
- Test: `site/test/schema.test.ts`

- [ ] **Step 1: Escrever os testes (vermelho)**

Adicionar ao fim de `site/test/schema.test.ts`:

```ts
import { RacaMecanicaSchema } from "@/lib/schema";

const racaValida = {
  id: "humano", tipo: "raca", nome: "Humano", resumo: "O povo mais versátil.",
  fonte: { livro: "livro-basico", pagina: 19 },
  imagens: [], secoes: [], relacoes: [],
  mecanica: {
    modificadores: [{ valor: 1, escolha: true, quantidade: 3 }],
    tamanho: "Médio", deslocamento: 9,
    habilidades: [{ nome: "Versátil", descricao: "Você se torna treinado em duas perícias." }],
  },
};

test("RacaMecanicaSchema aceita modificador fixo e de escolha", () => {
  expect(() =>
    RacaMecanicaSchema.parse({
      modificadores: [{ atributo: "Força", valor: 2 }, { valor: 1, escolha: true, quantidade: 3 }],
      tamanho: "Médio", deslocamento: 9, habilidades: [],
    })
  ).not.toThrow();
});

test("RacaMecanicaSchema rejeita atributo fora do enum", () => {
  expect(() =>
    RacaMecanicaSchema.parse({ modificadores: [{ atributo: "Sorte", valor: 1 }], tamanho: "Médio", deslocamento: 9, habilidades: [] })
  ).toThrow();
});

test("entidade tipo raca aceita mecânica de raça válida", () => {
  expect(() => EntidadeSchema.parse(racaValida)).not.toThrow();
});

test("entidade tipo raca rejeita mecânica sem tamanho", () => {
  const ruim = { ...racaValida, mecanica: { modificadores: [], deslocamento: 9, habilidades: [] } };
  expect(() => EntidadeSchema.parse(ruim)).toThrow();
});
```

- [ ] **Step 2: Rodar (vermelho)**

Run (em `site/`): `npm test -- schema`
Expected: FAIL — `RacaMecanicaSchema` não existe / entidade raca não é validada.

- [ ] **Step 3: Implementar o schema de Raça**

Em `site/lib/schema.ts`, **antes** de `export const EntidadeSchema`, inserir:

```ts
export const ATRIBUTOS = ["Força", "Destreza", "Constituição", "Inteligência", "Sabedoria", "Carisma"] as const;

export const ModificadorAtributoSchema = z.object({
  atributo: z.enum(ATRIBUTOS).optional(),   // ausente quando escolha=true
  valor: z.number().int(),
  escolha: z.boolean().default(false),       // true = "em N atributos à sua escolha"
  quantidade: z.number().int().positive().optional(),
  observacao: z.string().optional(),          // texto literal quando a regra for atípica (ex.: "exceto Car")
});
export type ModificadorAtributo = z.infer<typeof ModificadorAtributoSchema>;

export const HabilidadeRacialSchema = z.object({
  nome: z.string(),
  descricao: z.string(),
  efeito: z.string().optional(),              // campo mecânico legível por máquina (p/ geradores), quando houver
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
```

Depois, substituir a declaração de `EntidadeSchema` por uma versão com `superRefine` que valida a mecânica quando `tipo === "raca"`:

```ts
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
    }
  });
export type Entidade = z.infer<typeof EntidadeSchema>;
```

> Nota: `.superRefine` mantém `EntidadeSchema.parse(...)` funcionando (usado em `dados.ts`); `z.infer` continua válido. O `code: "custom"` (string) é compatível com Zod v4.

- [ ] **Step 4: Rodar (verde) e validar o Humano real**

Run (em `site/`): `npm test -- schema`
Expected: PASS (casos antigos + 4 novos).

Run a suíte completa para garantir que `dados.test`/`seed.test` (que carregam `humano.json`) seguem válidos: `npm test`
Expected: tudo verde.

- [ ] **Step 5: Commit**

```bash
git add site/lib/schema.ts site/test/schema.test.ts
git commit -m "feat(schema): mecânica estruturada de Raça com validação Zod por tipo"
```

---

## Task 2: Memoização do carregamento de dados

**Files:**
- Modify: `site/lib/dados.ts`
- Test: `site/test/dados.test.ts`

- [ ] **Step 1: Escrever o teste (vermelho)**

Adicionar ao fim de `site/test/dados.test.ts`:

```ts
test("carregarEntidades memoiza (mesma referência entre chamadas)", () => {
  expect(carregarEntidades()).toBe(carregarEntidades());
});

test("carregarTermos memoiza (mesma referência entre chamadas)", () => {
  expect(carregarTermos()).toBe(carregarTermos());
});
```

- [ ] **Step 2: Rodar (vermelho)**

Run (em `site/`): `npm test -- dados`
Expected: FAIL — cada chamada retorna um array novo (`.toBe` falha).

- [ ] **Step 3: Implementar a memoização**

Em `site/lib/dados.ts`, adicionar caches de módulo e usá-los:

```ts
let _entidades: Entidade[] | null = null;
let _termos: Termo[] | null = null;

export function carregarEntidades(): Entidade[] {
  if (_entidades) return _entidades;
  const dirs = ["livro-basico"]; // Fase 1+ adiciona outras fontes aqui (ou lê de sources.json)
  const ents: Entidade[] = [];
  for (const d of dirs) {
    const base = join(RAIZ_DADOS, d);
    for (const arq of listarJson(base)) {
      ents.push(EntidadeSchema.parse(JSON.parse(readFileSync(arq, "utf8"))));
    }
  }
  _entidades = ents;
  return ents;
}

export function carregarTermos(): Termo[] {
  if (_termos) return _termos;
  const arquivos = ["referencia/condicoes.json", "referencia/glossario.json"];
  const termos: Termo[] = [];
  for (const a of arquivos) {
    const arr = JSON.parse(readFileSync(join(RAIZ_DADOS, a), "utf8"));
    for (const t of arr) termos.push(TermoSchema.parse(t));
  }
  _termos = termos;
  return termos;
}
```

- [ ] **Step 4: Rodar (verde)**

Run (em `site/`): `npm test -- dados`
Expected: PASS (testes antigos + 2 novos).

- [ ] **Step 5: Commit**

```bash
git add site/lib/dados.ts site/test/dados.test.ts
git commit -m "perf(dados): memoiza carregamento de entidades e termos"
```

---

## Task 3: Regex pré-compilada no auto-link

**Files:**
- Modify: `site/lib/autolink.ts`
- Test: `site/test/autolink.test.ts`

- [ ] **Step 1: Escrever o teste (vermelho)**

Adicionar ao fim de `site/test/autolink.test.ts`:

```ts
test("construirRegistro pré-compila a regex e tokeniza igual em chamadas repetidas", () => {
  const reg = construirRegistro({
    termos: [{ id: "medo", nome: "Medo", descricao: "x" }],
    entidades: [],
  });
  expect(reg.re).toBeInstanceOf(RegExp);
  const a = tokenizar("fica com Medo agora", reg);
  const b = tokenizar("fica com Medo agora", reg);
  expect(b).toEqual(a); // reuso da mesma regex não corrompe resultado
});
```

- [ ] **Step 2: Rodar (vermelho)**

Run (em `site/`): `npm test -- autolink`
Expected: FAIL — `reg.re` é `undefined`.

- [ ] **Step 3: Implementar a pré-compilação**

Em `site/lib/autolink.ts`:

1. Acrescentar `re` ao tipo `Registro`:

```ts
export type Registro = {
  entradas: Entrada[];
  porNome: Map<string, Entrada>;
  re: RegExp | null;
};
```

2. No fim de `construirRegistro`, antes do `return`, montar a regex uma única vez:

```ts
  const re =
    entradas.length === 0
      ? null
      : new RegExp(
          `(?<![\\p{L}\\p{N}])(${entradas.map((e) => escaparRegex(e.nome)).join("|")})(?![\\p{L}\\p{N}])`,
          "giu"
        );
  return { entradas, porNome, re };
```

(Mover a função `escaparRegex` para antes de `construirRegistro` se necessário, para estar no escopo.)

3. Em `tokenizar`, usar a regex do registro em vez de remontar:

```ts
export function tokenizar(texto: string, registro: Registro): Token[] {
  if (!registro.re) return [{ tipo: "texto", valor: texto }];
  const tokens: Token[] = [];
  let ultimo = 0;
  for (const m of texto.matchAll(registro.re)) {
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
```

> `String.prototype.matchAll` opera sobre uma cópia interna da regex global, então reusar `registro.re` em chamadas sucessivas é seguro (não há vazamento de `lastIndex`).

- [ ] **Step 4: Rodar (verde)**

Run (em `site/`): `npm test -- autolink`
Expected: PASS (9 testes antigos + 1 novo).

- [ ] **Step 5: Commit**

```bash
git add site/lib/autolink.ts site/test/autolink.test.ts
git commit -m "perf(autolink): pré-compila a regex no Registro"
```

---

## Task 4: Export estático

**Files:**
- Modify: `site/next.config.ts`
- Modify: `site/app/ficha/[tipo]/[id]/page.tsx`

- [ ] **Step 1: Configurar export estático**

Substituir o conteúdo de `site/next.config.ts` por:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 2: Fixar params estáticos na rota de ficha**

Em `site/app/ficha/[tipo]/[id]/page.tsx`, adicionar após os imports (junto de `generateStaticParams`):

```ts
export const dynamicParams = false;
```

- [ ] **Step 3: Build estático**

Run (em `site/`): `npm run build`
Expected: build conclui; gera `out/` com `out/index.html`, `out/racas/index.html` e `out/ficha/raca/humano/index.html`. Entidades inexistentes (ex.: `/ficha/divindade/valkaria`) produzem 404 (não estão em `generateStaticParams`).

- [ ] **Step 4: Rodar a suíte (garantia de não-regressão)**

Run (em `site/`): `npm test`
Expected: tudo verde.

- [ ] **Step 5: Commit**

```bash
git add site/next.config.ts "site/app/ficha/"
git commit -m "feat(site): export estático (output export) + dynamicParams=false"
```

---

## Task 5: Testes do componente FichaRaca

O componente já existe (spike). Adicionamos testes que travam o comportamento (render estruturado + ilustração).

**Files:**
- Test (create): `site/test/fichraca.test.tsx`

- [ ] **Step 1: Escrever os testes (vermelho)**

Create `site/test/fichraca.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { FichaRaca } from "@/components/FichaRaca";
import { construirRegistro } from "@/lib/autolink";
import type { Entidade } from "@/lib/schema";

const registro = construirRegistro({ termos: [], entidades: [] });

const humano = {
  id: "humano", tipo: "raca", nome: "Humano", resumo: "O povo mais versátil de Arton.",
  fonte: { livro: "livro-basico", pagina: 19 },
  imagens: ["/racas/humano.png"],
  secoes: [{ titulo: "Descrição", texto: "O povo mais numeroso em Arton." }],
  relacoes: [],
  mecanica: {
    modificadores: [{ valor: 1, escolha: true, quantidade: 3 }],
    tamanho: "Médio", deslocamento: 9, deslocamentoUnidade: "m",
    habilidades: [{ nome: "Versátil", descricao: "Você se torna treinado em duas perícias." }],
  },
} as unknown as Entidade;

test("FichaRaca exibe nome, tamanho, deslocamento e habilidade", () => {
  render(<FichaRaca entidade={humano} registro={registro} descricoes={{}} />);
  expect(screen.getByText("Humano")).toBeInTheDocument();
  expect(screen.getByText("Médio")).toBeInTheDocument();
  expect(screen.getByText("9m")).toBeInTheDocument();
  expect(screen.getByText(/Versátil/)).toBeInTheDocument();
});

test("FichaRaca renderiza a ilustração com alt acessível", () => {
  render(<FichaRaca entidade={humano} registro={registro} descricoes={{}} />);
  expect(screen.getByRole("img", { name: /Ilustração de Humano/ })).toHaveAttribute("src", "/racas/humano.png");
});
```

- [ ] **Step 2: Rodar (verde)**

Run (em `site/`): `npm test -- fichraca`
Expected: PASS (2 testes). Se algum seletor falhar, ajustar o teste ao texto real renderizado por `FichaRaca.tsx` (não alterar o componente, salvo bug real).

- [ ] **Step 3: Commit**

```bash
git add site/test/fichraca.test.tsx
git commit -m "test(fichraca): trava render estruturado e ilustração da ficha de raça"
```

---

## Task 6: Teste do índice /racas

**Files:**
- Test (create): `site/test/racas-indice.test.tsx`

- [ ] **Step 1: Escrever o teste (vermelho)**

Create `site/test/racas-indice.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import IndiceRacas from "@/app/racas/page";

test("índice de raças lista o Humano com link para a ficha", () => {
  render(<IndiceRacas />);
  const link = screen.getByRole("link", { name: /Humano/ });
  expect(link).toHaveAttribute("href", "/ficha/raca/humano");
});
```

> Observação: `IndiceRacas` é um Server Component síncrono que lê o `data/` via `carregarEntidades()`; em Vitest o `process.cwd()` é `site/`, então a leitura funciona, como já ocorre em `dados.test.ts`.

- [ ] **Step 2: Rodar (verde)**

Run (em `site/`): `npm test -- racas-indice`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add site/test/racas-indice.test.tsx
git commit -m "test(racas): índice lista as raças com link para a ficha"
```

---

## Task 7: Pipeline de imagens (composição cor+máscara)

Formaliza o script `sharp` ad-hoc do spike numa ferramenta reutilizável em `extracao/`, para extrair a ilustração de cada raça como PNG transparente.

**Files:**
- Create: `extracao/src/imagens.ts`
- Modify: `extracao/src/util.ts`
- Test: `extracao/test/util.test.ts`
- Dependency: instalar `sharp` em `extracao/`

- [ ] **Step 1: Instalar sharp em extracao/**

Run (em `extracao/`): `npm install sharp`
Expected: instala sem erro.

- [ ] **Step 2: Escrever teste do helper de caminho (vermelho)**

Adicionar ao fim de `extracao/test/util.test.ts`:

```ts
import { caminhoImagemRaca } from "../src/util";

test("caminhoImagemRaca aponta para site/public/racas/<slug>.png", () => {
  expect(caminhoImagemRaca("/proj", "anao")).toBe("/proj/site/public/racas/anao.png");
});
```

- [ ] **Step 3: Rodar (vermelho)**

Run (em `extracao/`): `npm test`
Expected: FAIL — `caminhoImagemRaca` não existe.

- [ ] **Step 4: Implementar o helper**

Adicionar a `extracao/src/util.ts`:

```ts
import { posix } from "node:path";

export function caminhoImagemRaca(raizProjeto: string, slug: string): string {
  return posix.join(raizProjeto, "site", "public", "racas", `${slug}.png`);
}
```

(Se `posix` já estiver importado de `node:path`, reutilizar o import existente.)

- [ ] **Step 5: Rodar (verde)**

Run (em `extracao/`): `npm test`
Expected: PASS (testes antigos + 1 novo).

- [ ] **Step 6: Implementar a composição (sharp)**

Create `extracao/src/imagens.ts`:

```ts
import sharp from "sharp";

// Compõe a imagem de cor (CMYK/RGB exportada pelo pdfimages) com sua máscara (smask, em cinza)
// num PNG RGBA com transparência, aparando as bordas vazias.
export async function comporComMascara(corPath: string, maskPath: string, saidaPath: string): Promise<void> {
  const cor = sharp(corPath).toColourspace("srgb");
  const { data, info } = await cor.raw().toBuffer({ resolveWithObject: true });
  const mask = await sharp(maskPath).resize(info.width, info.height).greyscale().raw().toBuffer();
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    rgba[i * 4 + 0] = data[i * info.channels + 0];
    rgba[i * 4 + 1] = data[i * info.channels + 1];
    rgba[i * 4 + 2] = data[i * info.channels + 2];
    rgba[i * 4 + 3] = mask[i];
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim()
    .png()
    .toFile(saidaPath);
}
```

> Uso (manual, por raça, durante a extração — Task 9): extrair os XObjects da página com `pdfimages -f P -l P -png "<pdf>" cache/h`, identificar pela passada de visão qual par imagem/smask é a ilustração da raça, e chamar `comporComMascara(corPng, maskPng, caminhoImagemRaca(raiz, slug))`. Quando a ilustração não tiver smask, copiar/converter a imagem diretamente para PNG. Raças sem ilustração própria ficam com `imagens: []`.

- [ ] **Step 7: Commit**

```bash
git add extracao/src/imagens.ts extracao/src/util.ts extracao/test/util.test.ts extracao/package.json extracao/package-lock.json
git commit -m "feat(extracao): composição de ilustração (cor+máscara) e caminho de imagem de raça"
```

---

## Task 8: Descoberta — mapa raça → página PDF

Produz o artefato que guia a extração. As raças do Livro Básico (Tabela 1-2, pág. impressa 18) são, em ordem do livro: **Humano** (feito), Anão, Dahllan, Elfo, Goblin, Lefou, Minotauro, Qareen, Golem, Hynne, Kliren, Medusa, Osteon, Sereia/Tritão, Sílfide, Suraggel, Trog. (Offset confirmado: página PDF = impressa + 6; Humano em PDF 25 / impressa 19.)

**Files:**
- Create: `docs/superpowers/plans/racas-paginas.md`

- [ ] **Step 1: Extrair o texto completo (referência)**

Run (em `extracao/`, Bash):
```bash
export POPPLER_BIN="C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin"
"$POPPLER_BIN/pdftotext.exe" -layout -enc UTF-8 "../pdfs/T20 - Livro Básico.pdf" cache/basico-full.txt
```
Expected: gera `extracao/cache/basico-full.txt` (gitignored).

- [ ] **Step 2: Localizar cada raça e montar o mapa**

Para cada raça da lista, achar o header (coluna esquerda) no texto e/ou renderizar páginas candidatas (`pdftoppm -f P -l P -png -r 150`) e confirmar visualmente. Registrar em `docs/superpowers/plans/racas-paginas.md` uma tabela: `slug | nome | página(s) PDF | página impressa | observações (caixas/linhagens/variações)`. Marcar casos especiais conhecidos: **Suraggel** (heranças *aggelus*/*sulfure*), **Sereia/Tritão** (formas), raças **Pequeno** (conferir tamanho/deslocamento), **Osteon/Golem** (traços de morto-vivo/construto).

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/racas-paginas.md
git commit -m "docs(racas): mapa raça→página PDF para a extração"
```

---

## Task 9: Extração das raças (visão, duas passadas) — procedimento por raça

Aplicar o procedimento abaixo a **cada raça** do mapa (Task 8), exceto Humano. Trabalhar em **blocos** (ex.: 3–4 raças por subagente de extração), um arquivo JSON por raça. **Cada raça só é dada como concluída após a passada 2.**

**Files (por raça):**
- Create: `data/livro-basico/racas/<slug>.json`
- Create (se houver ilustração): `site/public/racas/<slug>.png`

- [ ] **Passada 1 — estruturação (por raça):**
  1. Renderizar a(s) página(s) da raça: `pdftoppm -f P -l P -png -r 150 "<pdf>" cache/racas/<slug>`.
  2. Ter o texto da(s) página(s) (`pdftotext -layout -enc UTF-8 -f P -l P`).
  3. Com **imagem + texto juntos**, preencher o JSON conforme o schema (Task 1):
     - `id` (slug), `tipo: "raca"`, `nome`, `resumo` (1–2 frases fiéis), `fonte { livro: "livro-basico", pagina: <impressa> }`.
     - `mecanica.modificadores` (da Tabela 1-2 e/ou do bloco da raça; usar `escolha/quantidade/observacao` para casos como "+1 em três atributos diferentes (exceto X)").
     - `mecanica.tamanho` e `mecanica.deslocamento` (do bloco da raça; se não declarado, usar o padrão Médio/9m e registrar em `mecanica.nota` que vem da regra geral).
     - `mecanica.habilidades[]` (nome + descrição **fiel ao texto**; `efeito` opcional quando o efeito mecânico for claro).
     - `secoes[]` com a prosa de flavor (fiel; sem parafrasear números/nomes).
     - `relacoes[]` quando o texto citar entidades (divindade, região), mesmo que a ficha-alvo ainda não exista.
     - **Capturar caixas/sidebars coloridas e tabelas** vistas na imagem. **Não inventar.**
  4. Ilustração: extrair imagens da página (`pdfimages -f P -l P -png`), identificar pela visão o par cor/smask da ilustração da raça e compor com `comporComMascara(...)` → `site/public/racas/<slug>.png`; setar `imagens: ["/racas/<slug>.png"]`. Sem ilustração própria → `imagens: []`.

- [ ] **Passada 2 — validação de completude (por raça, outro revisor):**
  - Reler a(s) página(s) renderizada(s) contra o JSON e conferir: nenhuma habilidade faltando; toda caixa colorida/tabela capturada; modificadores corretos (bater com a Tabela 1-2); tamanho/deslocamento corretos; proveniência (página) correta; grafia/acentos fiéis ao `pdftotext`. Corrigir e revalidar até completo.

- [ ] **Verificação por bloco:**
  - Run (em `site/`): `npm test` (o carregador valida cada JSON novo contra o schema; falha de schema = corrigir).
  - Conferir visualmente no app (`npm run dev`) algumas fichas do bloco.

- [ ] **Commit por bloco:**

```bash
git add data/livro-basico/racas/ site/public/racas/
git commit -m "feat(racas): extrai <raças do bloco> (visão 2 passadas, validadas)"
```

(Repetir Task 9 até todas as 16 raças restantes estarem extraídas e validadas.)

---

## Task 10: Tooltips/glossário citados nas raças (extraídos com proveniência)

Os termos de regra citados nos textos das raças devem virar tooltip a partir de definições **extraídas do livro** (não inventadas).

**Files:**
- Modify: `data/referencia/glossario.json`
- Modify: `data/referencia/condicoes.json`
- Test: `site/test/seed.test.ts` (já valida termos contra `TermoSchema`; manter verde)

- [ ] **Step 1: Levantar os termos**

A partir dos textos das raças extraídas (Task 9), listar os termos de regra recorrentes (ex.: *treinado*, *perícia(s)*, *poder geral*, *deslocamento*, abreviações de atributo, nomes de condições citadas). Para cada um, localizar a definição no Livro Básico (capítulos de regras/glossário) via `pdftotext`/visão e anotar a página.

- [ ] **Step 2: Adicionar ao glossário/condições (vermelho→verde)**

Para cada termo, acrescentar um objeto ao arquivo apropriado seguindo o `TermoSchema`:
```json
{ "id": "<slug>", "nome": "<como aparece no texto>", "descricao": "<definição fiel ao livro>", "fonte": { "livro": "livro-basico", "pagina": <pág. impressa> } }
```
- Condições (ex.: termos com estado de jogo) vão em `condicoes.json`; termos gerais em `glossario.json`.
- O `nome` deve casar com a forma usada nos textos das raças (ex.: plural "perícias") para o auto-link pegar; adicionar variantes como entradas separadas quando necessário.

Run (em `site/`): `npm test -- seed` e depois `npm test`
Expected: termos válidos; suíte verde. Conferir no app que os termos viram tooltip nos textos das raças.

- [ ] **Step 3: Commit**

```bash
git add data/referencia/glossario.json data/referencia/condicoes.json
git commit -m "feat(referencia): termos citados nas raças com proveniência (tooltips reais)"
```

---

## Task 11: Integração final da fatia

**Files:** (nenhum novo — verificação)

- [ ] **Step 1: Suíte completa verde**

Run (em `site/`): `npm test` — todos os testes verdes (schema raça, dados memoizado, autolink, fichraca, índice, seed, etc.).
Run (em `extracao/`): `npm test` — verde.

- [ ] **Step 2: Build estático completo**

Run (em `site/`): `npm run build`
Expected: gera `out/` com `out/racas/index.html` e uma `out/ficha/raca/<slug>/index.html` para **cada** raça (conferir que todas aparecem em `generateStaticParams`). Sem erros.

- [ ] **Step 3: Conferência manual**

Run (em `site/`): `npm run dev` → abrir `/racas` (todas as raças com card e ilustração), abrir 3–4 fichas (mecânica estruturada, habilidades, tooltips funcionando, relações como links), buscar uma raça na home.

- [ ] **Step 4: Atualizar PROGRESSO.md**

Marcar a fatia de Raças como concluída e apontar a próxima fatia da Fase 1 (ex.: Classes ou Origens). Commit:
```bash
git add PROGRESSO.md
git commit -m "docs: fatia de Raças concluída (ponta a ponta) — próxima fatia da Fase 1"
```

---

## Encerramento

Ao fim, a fatia entrega: todas as raças do Livro Básico extraídas e validadas (visão 2 passadas), schema Zod de Raça testado, fichas dedicadas + índice `/racas`, ilustrações versionadas, tooltips/auto-link reais com proveniência, busca, export estático passando e suíte verde — provando o pipeline replicável para as próximas categorias da Fase 1.
