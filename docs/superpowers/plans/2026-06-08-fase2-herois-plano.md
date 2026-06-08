# Fase 2 — Heróis de Arton: Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extrair o livro *Heróis de Arton* por completo como 3ª fonte da wiki, implementando os tipos novos `variante-classe` e `distincao` e reusando os demais tipos existentes.

**Architecture:** Camada multi-fonte já pronta (carregador lê `data/sources.json`; `SeloFonte` marca origem). Duas ondas de **código** (TDD) criam os tipos novos; quatro ondas de **dados** extraem o conteúdo por capítulo, cada tipo precedido de um **spike de cobertura de schema** (1 exemplar conferido contra a página antes do lote). Validação por visão (2 passadas + revisor independente), commits por bloco, `tsc`+testes+build verdes ao fechar cada onda.

**Tech Stack:** Next.js 16 (App Router, React 19), TypeScript, Zod v4, Vitest + Testing Library (jsdom). Extração via poppler (`pdftoppm`/`pdftotext`).

**Spec:** `docs/superpowers/specs/2026-06-08-fase2-herois-de-arton-design.md`

**Ambiente:** PowerShell tem `node`/`npm` no PATH; no Bash, prefixar `export PATH="$PATH:/c/Program Files/nodejs"`. poppler em `C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin`. PDF `pdfs/T20-Herois-de-Arton-v1-1.pdf`. **Offset PDF = impressa + 2.** Rodar testes: `cd site && npm test`. Commitar caminhos específicos, **nunca `git add -A`**.

---

## ONDA A — Código: tipo `variante-classe` + fonte no manifesto

Cria o tipo `variante-classe` (reusa `ClasseMecanicaSchema` + campo `varianteDe`), liga a ficha (reusa `FichaClasse` com faixa de aviso) e o índice `/classes`, e registra a fonte.

### Task A1: Schema de `variante-classe`

**Files:**
- Modify: `site/lib/schema.ts` (após `ClasseMecanicaSchema`, ~linha 124; e o `superRefine`, ~linha 388)
- Test: `site/test/schema-variante-classe.test.ts` (criar)

- [ ] **Step 1: Escrever o teste que falha**

```ts
// site/test/schema-variante-classe.test.ts
import { describe, it, expect } from "vitest";
import { EntidadeSchema } from "@/lib/schema";

const variante = {
  id: "alquimista", tipo: "variante-classe", nome: "Alquimista",
  resumo: "Variante de Inventor focada em alquimia.",
  fonte: { livro: "herois-de-arton", pagina: 22 },
  mecanica: {
    varianteDe: "inventor",
    atributoChave: "Inteligência", pvInicial: 16, pvPorNivel: 4, pmPorNivel: 4,
    pericias: { quantidade: 4, fixas: [], lista: [], texto: "Como o inventor básico." },
    proficiencias: [], progressao: [], habilidades: [], poderes: [], caminhos: [],
  },
};

describe("schema variante-classe", () => {
  it("aceita uma variante válida", () => {
    expect(EntidadeSchema.safeParse(variante).success).toBe(true);
  });
  it("rejeita variante sem varianteDe", () => {
    const m = { ...variante, mecanica: { ...variante.mecanica, varianteDe: undefined } };
    expect(EntidadeSchema.safeParse(m).success).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && npx vitest run test/schema-variante-classe.test.ts`
Expected: FAIL (a validação ainda não tem ramo `variante-classe`; o `safeParse` passa no ramo genérico, então o 2º teste falha por retornar `true`).

- [ ] **Step 3: Implementar o schema + ramo no superRefine**

Em `site/lib/schema.ts`, logo após `export type ClasseMecanica = ...` (~linha 124):

```ts
export const VarianteClasseMecanicaSchema = ClasseMecanicaSchema.extend({
  varianteDe: z.string(), // slug da classe básica (ex.: "inventor")
});
export type VarianteClasseMecanica = z.infer<typeof VarianteClasseMecanicaSchema>;
```

No `superRefine`, antes do `}` final (logo após o ramo `criatura`, ~linha 388):

```ts
    } else if (ent.tipo === "variante-classe") {
      const r = VarianteClasseMecanicaSchema.safeParse(ent.mecanica);
      if (!r.success) {
        ctx.addIssue({
          code: "custom",
          path: ["mecanica"],
          message: `mecânica de variante de classe inválida: ${r.error.issues.map((i) => i.message).join("; ")}`,
        });
      }
    }
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd site && npx vitest run test/schema-variante-classe.test.ts`
Expected: PASS (2 testes).

- [ ] **Step 5: Commit**

```bash
git add site/lib/schema.ts site/test/schema-variante-classe.test.ts
git commit -m "feat(fase2.3): schema do tipo variante-classe (Herois)"
```

### Task A2: Ficha de variante reusa `FichaClasse` + faixa de aviso

**Files:**
- Modify: `site/components/FichaClasse.tsx` (após `<article ...>`, ~linha 171)
- Modify: `site/app/ficha/[tipo]/[id]/page.tsx` (bloco de dispatch, ~linha 60)
- Test: `site/test/ficha-variante.test.tsx` (criar)

- [ ] **Step 1: Escrever o teste que falha**

```tsx
// site/test/ficha-variante.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FichaClasse } from "@/components/FichaClasse";
import { construirRegistro } from "@/lib/autolink";

const reg = construirRegistro({ termos: [], entidades: [] });
const ent = {
  id: "alquimista", tipo: "variante-classe", nome: "Alquimista", resumo: "",
  fonte: { livro: "herois-de-arton", pagina: 22 }, imagens: [], secoes: [], relacoes: [],
  mecanica: {
    varianteDe: "inventor", atributoChave: "Inteligência", pvInicial: 16, pvPorNivel: 4, pmPorNivel: 4,
    pericias: { quantidade: 4, fixas: [], lista: [], texto: "x" },
    proficiencias: [], progressao: [], habilidades: [], poderes: [], caminhos: [],
  },
} as any;

describe("FichaClasse com variante", () => {
  it("mostra a faixa de aviso de variante e linka a classe básica", () => {
    render(<FichaClasse entidade={ent} registro={reg} descricoes={{}} />);
    expect(screen.getByText(/Classe Variante/i)).toBeTruthy();
    const link = screen.getByRole("link", { name: /Inventor/i });
    expect(link.getAttribute("href")).toBe("/ficha/classe/inventor");
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && npx vitest run test/ficha-variante.test.tsx`
Expected: FAIL ("Classe Variante" não encontrado).

- [ ] **Step 3: Implementar a faixa de aviso**

No topo de `site/components/FichaClasse.tsx`, garantir o import do `Link`:

```tsx
import Link from "next/link";
```

Dentro de `FichaClasse`, logo após `const m = entidade.mecanica as unknown as ClasseMecanica;` (~linha 123), derivar a variante:

```tsx
  const varianteDe = (entidade.mecanica as { varianteDe?: string }).varianteDe;
  const nomeBasica = varianteDe ? varianteDe.charAt(0).toUpperCase() + varianteDe.slice(1) : "";
```

Logo após a abertura do `<article ...>` (~linha 171), antes do `<header>`:

```tsx
      {varianteDe && (
        <div style={{ background: "var(--vermelho)", color: "#fff", padding: "10px 18px", fontFamily: "var(--serifa)", fontSize: 13.5, textAlign: "center" }}>
          ⚠️ <strong>Classe Variante</strong> — variante de{" "}
          <Link href={`/ficha/classe/${varianteDe}`} style={{ color: "#fff", textDecoration: "underline" }}>{nomeBasica}</Link>.
          {" "}Substitui características da classe básica e <strong>não faz multiclasse</strong> com ela (são a mesma classe).
        </div>
      )}
```

- [ ] **Step 4: Ligar o dispatcher**

Em `site/app/ficha/[tipo]/[id]/page.tsx`, no encadeamento de tipos (~linha 60), adicionar antes do fallback `<Ficha …>` (linha ~78):

```tsx
      ) : entidade.tipo === "variante-classe" ? (
        <FichaClasse entidade={entidade} registro={registro} descricoes={descricoes} />
```

- [ ] **Step 5: Rodar e ver passar**

Run: `cd site && npx vitest run test/ficha-variante.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add site/components/FichaClasse.tsx "site/app/ficha/[tipo]/[id]/page.tsx" site/test/ficha-variante.test.tsx
git commit -m "feat(fase2.3): ficha de variante-classe reusa FichaClasse + aviso de variante"
```

### Task A3: Índice `/classes` inclui variantes (selo + href dinâmico)

**Files:**
- Modify: `site/app/classes/page.tsx`
- Test: `site/test/classes-indice.test.tsx` (criar)

- [ ] **Step 1: Escrever o teste que falha**

```tsx
// site/test/classes-indice.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/dados", () => ({
  carregarEntidades: () => [
    { id: "inventor", tipo: "classe", nome: "Inventor", resumo: "", imagens: [], fonte: { livro: "livro-basico", pagina: 1 } },
    { id: "alquimista", tipo: "variante-classe", nome: "Alquimista", resumo: "", imagens: [], fonte: { livro: "herois-de-arton", pagina: 22 } },
  ],
}));

import IndiceClasses from "@/app/classes/page";

describe("índice /classes", () => {
  it("lista classe básica e variante com hrefs corretos e selo de variante", () => {
    render(<IndiceClasses />);
    expect(screen.getByRole("link", { name: /Inventor/i }).getAttribute("href")).toBe("/ficha/classe/inventor");
    const v = screen.getByRole("link", { name: /Alquimista/i });
    expect(v.getAttribute("href")).toBe("/ficha/variante-classe/alquimista");
    expect(screen.getByText(/Variante/i)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && npx vitest run test/classes-indice.test.tsx`
Expected: FAIL (href fixo `/ficha/classe/...` e sem selo "Variante").

- [ ] **Step 3: Implementar**

Substituir o corpo de `site/app/classes/page.tsx`:

```tsx
import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";

export default function IndiceClasses() {
  const classes = carregarEntidades()
    .filter((e) => e.tipo === "classe" || e.tipo === "variante-classe")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Classes de Arton</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>
          {classes.length} {classes.length === 1 ? "classe" : "classes"} (básicas e variantes)
        </p>
        <div className="indice-cards">
          {classes.map((r) => {
            const imagem = r.imagens[0];
            const variante = r.tipo === "variante-classe";
            return (
              <Link key={`${r.tipo}/${r.id}`} href={`/ficha/${r.tipo}/${r.id}`} className="indice-card">
                <span className="indice-card-fig">
                  {imagem && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagem} alt={r.nome} loading="lazy" decoding="async" />
                  )}
                </span>
                <span className="indice-card-body">
                  <span className="indice-card-nome">
                    {r.nome}
                    {variante && (
                      <span style={{ marginLeft: 8, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "var(--vermelho)", border: "1px solid var(--borda)", borderRadius: 6, padding: "1px 6px", verticalAlign: "middle" }}>Variante</span>
                    )}
                  </span>
                  <span className="indice-card-resumo">{r.resumo}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd site && npx vitest run test/classes-indice.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/app/classes/page.tsx site/test/classes-indice.test.tsx
git commit -m "feat(fase2.3): indice /classes inclui variantes (href dinamico + selo Variante)"
```

### Task A4: Registrar a fonte `herois-de-arton`

**Files:**
- Modify: `data/sources.json`

- [ ] **Step 1: Adicionar a fonte (ordem 3)**

Em `data/sources.json`, acrescentar ao array `fontes`:

```json
    { "slug": "herois-de-arton", "titulo": "Heróis de Arton", "arquivo": "T20-Herois-de-Arton-v1-1.pdf", "ordem": 3 }
```

- [ ] **Step 2: Validar build + suíte**

Run: `cd site && npx tsc --noEmit && npm test`
Expected: `tsc` exit 0; suíte verde (novos testes inclusos).

- [ ] **Step 3: Commit**

```bash
git add data/sources.json
git commit -m "feat(fase2.3): registra fonte Herois de Arton (ordem 3)"
```

---

## ONDA 1 — Dados: Capítulo 1 (Campeões de Arton)

> Onda de **dados**. Não é código: cada tipo é extraído por visão, em blocos, com revisor independente. **Cada tipo começa com o spike de cobertura de schema** (Procedimento P abaixo). Pasta destino: `data/herois-de-arton/<tipo>/`.

### Procedimento P — extração de um tipo (repetir para cada tipo desta onda e das próximas)

> **Lições do spike (Onda 1 — Alquimista + Duende, 2026-06-08), agora obrigatórias:**
> - **`pdftotext` é a FONTE DA VERDADE do texto.** Este PDF tem texto selecionável; a leitura por
>   visão de página inteira **erra muito** em texto pequeno (números, palavras trocadas). Use
>   `pdftotext -layout -f <PDF> -l <PDF>` para o texto e a **imagem só para layout, tabelas, conferência e arte**.
> - **Conteúdo de uma entidade pode atravessar 2–3 páginas** (a descrição se separa da tabela). Sempre
>   confira a página seguinte antes de fechar uma entidade.
> - **Arte entra junto** (quando há figura isolada com máscara): `pdfimages -list` → `pdfimages -png`
>   → identificar o par cor+`smask` por visão → compor com `comporComMascara` (`extracao/src/imagens.ts`)
>   via script `.mts` rodado de `extracao/` → salvar em `site/public/<racas|classes|...>/<slug>.png` → `imagens:[...]`.
>   Sidebars/distinções sem figura isolada ficam sem arte (`imagens:[]`).

1. **Render + texto:** renderize as páginas em 300 DPI (`pdftoppm -r 300 …`, PDF = impressa + 2) **e** extraia o texto fiel (`pdftotext -layout …`). Caches em `extracao/cache/herois-<tipo>/`.
2. **SPIKE DE COBERTURA DE SCHEMA (obrigatório):** extrair **1 exemplar** e conferir, contra `pdftotext`+imagem, se **todo campo/linha do livro cabe no schema**. Se algo ficou de fora → **ajustar schema/ficha primeiro** (com teste), commitar, e só então seguir. Registrar no commit/PROGRESSO. (Os tipos `variante-classe`, `raca` já validados no spike da Onda 1.)
3. **Lote:** extrair em blocos, usando `pdftotext` como fonte do texto + imagem para conferir. 2 passadas (extrator + revisor independente). Pular reprints do Básico/Ameaças (documentar).
4. **Arte:** para cada entidade com figura isolada, compor cor+`smask` e ligar em `imagens:[...]`.
5. **Integrar:** validar `EntidadeSchema` (via build); acender auto-link dos novos nomes próprios.
6. **Verde:** `cd site && npx tsc --noEmit && npm test && npm run build`.
7. **Commit por bloco** (`git add data/herois-de-arton/<tipo>/ site/public/...`).

### Conteúdo da Onda 1 (impressas; PDF = +2)

- [ ] **Raças (5):** Duende (8), Eiradaan (12), Galokk (13), Meio-Elfo (14), Sátiro (15). Tipo `raca`. Spike no Duende. Arte por raça quando houver figura isolada (pipeline `comporComMascara`).
- [ ] **Classe Treinador (16–21):** tipo `classe`. Spike: conferir se o `ClasseMecanicaSchema` cobre tudo (progressão, habilidades, conjuração/caminhos se houver). Arte se houver.
- [ ] **Classes Variantes (14, 22–45):** tipo `variante-classe`. Mapa da Tabela 1-2 (ver spec). Para cada: pegar a classe básica já extraída e aplicar **só as substituições** que o livro lista; `varianteDe` = slug da básica. Spike no Alquimista (variante de Inventor) antes do lote.
- [ ] **Novas Origens (46–53):** tipo `origem`. Spike na 1ª origem.
- [ ] **Novos Poderes de Classe (54–77):** tipo `poder` (grupo por classe). Spike no 1º poder.
- [ ] **Novos Poderes Gerais (78–95):** tipo `poder` (grupos Combate/Destino/Magia/Tormenta/Raça/Grupo). Spike no 1º.
- [ ] **Tabelas para Personagens (96–101):** nomes/trejeitos → tipo `regra` (ou `regra-de-criacao`), com as tabelas na `mecanica`. Spike: conferir render das tabelas.

**Fechamento da Onda 1:** `tsc`+testes+build verdes; atualizar `PROGRESSO.md`; commit de fechamento.

---

## ONDA B — Código: tipo `distincao`

Cria o tipo `distincao` (poderes embutidos, estilo classe), a ficha e o índice `/distincoes`.

### Task B1: Schema de `distincao`

**Files:**
- Modify: `site/lib/schema.ts` (após `PoderClasseSchema`, ~linha 87; e o `superRefine`)
- Test: `site/test/schema-distincao.test.ts` (criar)

- [ ] **Step 1: Escrever o teste que falha**

```ts
// site/test/schema-distincao.test.ts
import { describe, it, expect } from "vitest";
import { EntidadeSchema } from "@/lib/schema";

const d = {
  id: "cavaleiro-do-corvo", tipo: "distincao", nome: "Cavaleiro do Corvo",
  resumo: "Distinção sombria.", fonte: { livro: "herois-de-arton", pagina: 139 },
  mecanica: {
    admissao: "Ter contato com a Ordem do Corvo...",
    marca: { nome: "Marca do Corvo", descricao: "Você recebe..." },
    poderes: [{ nome: "Manto do Corvo", descricao: "..." }],
    beneficioAdicional: "Com 3 poderes da distinção...",
  },
};

describe("schema distincao", () => {
  it("aceita uma distinção válida", () => {
    expect(EntidadeSchema.safeParse(d).success).toBe(true);
  });
  it("rejeita distinção sem marca", () => {
    const m = { ...d, mecanica: { ...d.mecanica, marca: undefined } };
    expect(EntidadeSchema.safeParse(m).success).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && npx vitest run test/schema-distincao.test.ts`
Expected: FAIL (sem ramo `distincao`, o 2º teste retorna `true`).

- [ ] **Step 3: Implementar o schema + ramo**

Em `site/lib/schema.ts`, após `export type PoderClasse = ...` (~linha 87):

```ts
export const DistincaoMarcaSchema = z.object({ nome: z.string(), descricao: z.string() });
export const DistincaoMecanicaSchema = z.object({
  admissao: z.string(),
  marca: DistincaoMarcaSchema,
  poderes: z.array(PoderClasseSchema).default([]),
  beneficioAdicional: z.string().optional(),
});
export type DistincaoMecanica = z.infer<typeof DistincaoMecanicaSchema>;
```

No `superRefine`, adicionar o ramo (junto aos demais):

```ts
    } else if (ent.tipo === "distincao") {
      const r = DistincaoMecanicaSchema.safeParse(ent.mecanica);
      if (!r.success) {
        ctx.addIssue({
          code: "custom",
          path: ["mecanica"],
          message: `mecânica de distinção inválida: ${r.error.issues.map((i) => i.message).join("; ")}`,
        });
      }
    }
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd site && npx vitest run test/schema-distincao.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/lib/schema.ts site/test/schema-distincao.test.ts
git commit -m "feat(fase2.3): schema do tipo distincao (Herois)"
```

### Task B2: Componente `FichaDistincao` + dispatcher

**Files:**
- Create: `site/components/FichaDistincao.tsx`
- Modify: `site/app/ficha/[tipo]/[id]/page.tsx`
- Test: `site/test/ficha-distincao.test.tsx` (criar)

- [ ] **Step 1: Escrever o teste que falha**

```tsx
// site/test/ficha-distincao.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FichaDistincao } from "@/components/FichaDistincao";
import { construirRegistro } from "@/lib/autolink";

const reg = construirRegistro({ termos: [], entidades: [] });
const ent = {
  id: "cavaleiro-do-corvo", tipo: "distincao", nome: "Cavaleiro do Corvo", resumo: "",
  fonte: { livro: "herois-de-arton", pagina: 139 }, imagens: [], secoes: [], relacoes: [],
  mecanica: {
    admissao: "Ter contato com a Ordem do Corvo.",
    marca: { nome: "Marca do Corvo", descricao: "Você recebe asas." },
    poderes: [{ nome: "Manto do Corvo", descricao: "Some nas sombras." }],
    beneficioAdicional: "Com 3 poderes...",
  },
} as any;

describe("FichaDistincao", () => {
  it("mostra admissão, marca e poderes", () => {
    render(<FichaDistincao entidade={ent} registro={reg} descricoes={{}} />);
    expect(screen.getByText(/Admissão/i)).toBeTruthy();
    expect(screen.getByText(/Marca do Corvo/i)).toBeTruthy();
    expect(screen.getByText(/Manto do Corvo/i)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && npx vitest run test/ficha-distincao.test.tsx`
Expected: FAIL (módulo `FichaDistincao` não existe).

- [ ] **Step 3: Criar o componente** (modelado em `FichaPoder.tsx`)

```tsx
// site/components/FichaDistincao.tsx
import type { Entidade, DistincaoMecanica } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { TextoBlocos } from "./TextoBlocos";
import { Divisor } from "./Divisor";

const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "18px 0 8px" };

export function FichaDistincao({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as unknown as DistincaoMecanica;
  return (
    <article style={{ maxWidth: 1140, margin: "0 auto", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.6)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))" }}>
      <header style={{ padding: "20px 24px 14px", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700 }}>Distinção</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 50, margin: "4px 0 0", lineHeight: 1 }}>{entidade.nome}</h1>
        <Divisor />
      </header>
      <div style={{ padding: "0 28px 28px" }}>
        {entidade.resumo && <p style={{ fontFamily: "var(--serifa)", color: "var(--tinta-suave)", textAlign: "center", marginBottom: 8 }}>{entidade.resumo}</p>}

        <h2 style={h2}>Admissão</h2>
        <TextoRico texto={m.admissao} registro={registro} descricoes={descricoes} />

        <h2 style={h2}>Marca da Distinção: {m.marca.nome}</h2>
        <TextoRico texto={m.marca.descricao} registro={registro} descricoes={descricoes} />

        <h2 style={h2}>Poderes da Distinção</h2>
        {m.poderes.map((p, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong style={{ color: "var(--carmesim)", fontFamily: "var(--serifa)" }}>{p.nome}</strong>
            {p.prerequisito && <em style={{ display: "block", fontSize: 11.5, color: "var(--carmesim)" }}>Pré-requisito: {p.prerequisito}</em>}
            {p.custo && <em style={{ display: "block", fontSize: 11.5, color: "var(--carmesim)" }}>Custo: {p.custo}</em>}
            <TextoRico texto={p.descricao} registro={registro} descricoes={descricoes} />
          </div>
        ))}

        {m.beneficioAdicional && (
          <>
            <h2 style={h2}>Benefício Adicional</h2>
            <TextoRico texto={m.beneficioAdicional} registro={registro} descricoes={descricoes} />
          </>
        )}

        {entidade.secoes.length > 0 && <TextoBlocos secoes={entidade.secoes} registro={registro} descricoes={descricoes} />}
      </div>
    </article>
  );
}
```

> Nota: confirmar a assinatura de `TextoRico`/`TextoBlocos` (props `texto`/`secoes`, `registro`, `descricoes`) abrindo `components/FichaPoder.tsx`; ajustar nomes de props se divergir.

- [ ] **Step 4: Ligar o dispatcher**

Em `site/app/ficha/[tipo]/[id]/page.tsx`: importar no topo `import { FichaDistincao } from "@/components/FichaDistincao";` e adicionar no encadeamento, antes do fallback `<Ficha …>`:

```tsx
      ) : entidade.tipo === "distincao" ? (
        <FichaDistincao entidade={entidade} registro={registro} descricoes={descricoes} />
```

- [ ] **Step 5: Rodar e ver passar**

Run: `cd site && npx vitest run test/ficha-distincao.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add site/components/FichaDistincao.tsx "site/app/ficha/[tipo]/[id]/page.tsx" site/test/ficha-distincao.test.tsx
git commit -m "feat(fase2.3): FichaDistincao + dispatcher"
```

### Task B3: Índice `/distincoes` + atalho na home

**Files:**
- Create: `site/app/distincoes/page.tsx`
- Modify: `site/app/page.tsx` (atalho/card para `/distincoes`)
- Test: `site/test/distincoes-indice.test.tsx` (criar)

- [ ] **Step 1: Escrever o teste que falha**

```tsx
// site/test/distincoes-indice.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/dados", () => ({
  carregarEntidades: () => [
    { id: "cavaleiro-do-corvo", tipo: "distincao", nome: "Cavaleiro do Corvo", resumo: "", imagens: [], fonte: { livro: "herois-de-arton", pagina: 139 } },
  ],
}));

import IndiceDistincoes from "@/app/distincoes/page";

describe("índice /distincoes", () => {
  it("lista a distinção com href correto", () => {
    render(<IndiceDistincoes />);
    expect(screen.getByRole("link", { name: /Cavaleiro do Corvo/i }).getAttribute("href")).toBe("/ficha/distincao/cavaleiro-do-corvo");
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && npx vitest run test/distincoes-indice.test.tsx`
Expected: FAIL (rota não existe).

- [ ] **Step 3: Criar o índice** (modelado em `app/classes/page.tsx`)

```tsx
// site/app/distincoes/page.tsx
import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";

export default function IndiceDistincoes() {
  const distincoes = carregarEntidades()
    .filter((e) => e.tipo === "distincao")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <main className="folha-main">
      <div className="folha">
        <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Distinções</h1>
        <Divisor />
        <p style={{ textAlign: "center", color: "var(--tinta-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>
          {distincoes.length} {distincoes.length === 1 ? "distinção" : "distinções"}
        </p>
        <div className="indice-lista">
          {distincoes.map((r) => (
            <Link key={r.id} href={`/ficha/distincao/${r.id}`} className="indice-linha">
              <span className="indice-nome">{r.nome}</span>
              <span className="indice-resumo">{r.resumo}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
```

> Nota: conferir as classes CSS do índice (`indice-lista`/`indice-linha`/`indice-cards`/`indice-card`) usadas pelos índices atuais e seguir o mesmo padrão visual de um índice existente (ex.: `/poderes`).

- [ ] **Step 4: Atalho na home**

Em `site/app/page.tsx`, adicionar um card/atalho para `/distincoes` seguindo o padrão dos atalhos existentes (copiar o bloco de outro índice, ex.: o de `/classes`, trocando href/rótulo para "Distinções").

- [ ] **Step 5: Rodar e ver passar**

Run: `cd site && npx vitest run test/distincoes-indice.test.tsx`
Expected: PASS.

- [ ] **Step 6: Validar e commitar**

```bash
cd site && npx tsc --noEmit && npm test && npm run build
git add site/app/distincoes/page.tsx site/app/page.tsx site/test/distincoes-indice.test.tsx
git commit -m "feat(fase2.3): indice /distincoes + atalho na home"
```

---

## ONDA 2 — Dados: Capítulo 2 (Distinções)

> Onda de dados. Seguir o **Procedimento P** (com spike) por bloco. Pasta `data/herois-de-arton/distincoes/`.

- [ ] **Spike:** extrair 1 distinção completa (ex.: Cavaleiro do Corvo, impr. 139) e conferir que `admissao`/`marca`/`poderes`/`beneficioAdicional` cobrem tudo da página. Ajustar `DistincaoMecanicaSchema`/`FichaDistincao` se algo ficou de fora.
- [ ] **Lote (~40 distinções, impr. 106–211):** extrair em blocos (8–10 por bloco), 2 passadas com revisor independente. Lista (impressas): Aeronauta Goblin 106, Algoz da Tormenta 109, Amazona 112, Armadilheiro Mestre 115, Arqueiro de Lenórienn 118, Bruxo da Tormenta 121, Caçador de Cabeças 124, Caçador de Dragões 127, Campeão de Dojo 130, Capitão do Conclave Pirata 133, Carteador 136, Cavaleiro do Corvo 139, Cavaleiro Feérico 142, Chapéu-Preto 145, Cobaia dos Médicos Monstros 148, Dracomante Real 151, Drogadora 154, Engenhoqueiro Goblin 157, Escapista Magnífico 160, Gigante Furioso 163, Ginete de Namalkah 166, Guerreiro Mágico 169, Infiltrador de Wynlla 172, Mago da Ordem do Vazio 175, Mago de Batalha de Wynlla 178, Médico de Salistick 181, Mestre Bêbado 184, Mestre Cozinheiro 187, Mestre dos Desejos 190, Mestre Mahou-Jutsu 193, Mosqueteiro de Rishantor 196, Mutagenista 199, Pistoleiro de Smokestone 202, Professor de Magia 205, Senador 208, Vigarista 211. (Conferir a contagem final na extração.)
- [ ] **Fechamento:** auto-link dos nomes de distinção; `tsc`+testes+build verdes; `PROGRESSO.md`; commit de fechamento.

---

## ONDA 3 — Dados: Capítulo 3 (Arsenal dos Heróis)

> Onda de dados. **Decidir na entrada** a natureza de Capangas/Veículos/Bases (inspecionar a página → `item`, `criatura` ou `regra`). Seguir o Procedimento P (com spike) por tipo.

- [ ] **Decisão de modelagem:** abrir impr. 240 (Capangas), 241 (Veículos), 244 (Bases) e classificar cada um. Registrar a decisão no PROGRESSO antes de extrair.
- [ ] **Novos Equipamentos (216–251):** `item` — Armas (216), Armaduras & Escudos (223), Itens Gerais (227), Itens Superiores (239), Capangas (240)*, Veículos (241)*, Bases (244)*. Spike no 1º de cada subgrupo. (*conforme a decisão acima.)
- [ ] **Novas Magias Arcanas (252–255):** `magia`. **Spike obrigatório:** conferir que `MagiaMecanicaSchema` cobre cada linha (alcance/alvo/duração/resistência/aprimoramentos) — atenção a campos novos.
- [ ] **Novos Itens Mágicos (256–277):** `item-magico` — Armas, Armaduras & Escudos, Esotéricos, Acessórios, Itens Inteligentes (269), Itens Amaldiçoados (271), Artefatos (274). Spike no 1º; conferir se "inteligentes/amaldiçoados" precisam de campo novo.
- [ ] **Fechamento:** auto-link; `tsc`+testes+build verdes; `PROGRESSO.md`; commit.

---

## ONDA 4 — Dados: Capítulo 4 (Regras Opcionais)

> Onda de dados. Tipo `regra` (grupo "Regras Opcionais — Heróis de Arton" no `/regras`). Tabelas na `mecanica`, render via `Ficha`. Seguir Procedimento P (spike: conferir render das tabelas).

- [ ] **Regras opcionais (278–309):** Atributos Variados, Raças Abertas, Devoções Abertas, Complicações, Idades Variadas, Objetivos Heroicos, Papéis no Grupo, Combate Avançado (296), Culinária Avançada (305). Uma entrada `regra` por seção.
- [ ] **Exploração de Masmorras (310–313):** `regra`.
- [ ] **Domínios / regência (314–327):** `regra` grande com as tabelas (Características dos Domínios, Turnos de Domínio, Domínios Místicos, Eventos Aleatórios).
- [ ] **Lista de Regras Opcionais (328):** índice/tabela-resumo como `regra`.
- [ ] **Backlog:** registrar no PROGRESSO a dívida "repensar apresentação das Regras (opcionais e gerais)" — formato a definir com o usuário.
- [ ] **Fechamento da fase:** `tsc`+testes+build verdes; `PROGRESSO.md` com totais finais do livro; decidir push/PR com o usuário.

---

## Self-review (cobertura do spec)

- Fundação multi-fonte → Task A4 (sources.json). ✔
- Tipo `variante-classe` (ficha completa + aviso, índice) → Tasks A1–A3. ✔
- Tipo `distincao` (poderes embutidos, ficha, índice) → Tasks B1–B3. ✔
- Política de **spike de cobertura de schema por tipo** → Procedimento P (passo 2) + chamadas explícitas nas Ondas 1–4. ✔
- Ondas por capítulo na ordem do spec → Ondas 1, 2, 3, 4. ✔
- Pontos a decidir (Capangas/Veículos/Bases; auto-link; colisões) → Onda 3 (decisão) + fechamentos. ✔
- Backlog "repensar apresentação das Regras" → Onda 4. ✔
- DoD (tsc+testes+build; revisão por visão; testes dos tipos novos; PROGRESSO) → fechamentos de cada onda. ✔
