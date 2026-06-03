# Passe de Design/UX do Livro Básico — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans para implementar tarefa a tarefa. Passos usam checkbox (`- [ ]`).

**Goal:** Dar ao site um app shell unificado (nav global à esquerda + contexto à direita + logo), o tema visual "Página de Livro" e melhorias de apresentação (equipamento em tabela, regras contextuais, página de fabricação), responsivo, para enviar a testers.

**Architecture:** Refatorar `app/layout.tsx` num shell de 3 colunas alimentado por uma config declarativa (`lib/navegacao.ts`). O shell usa o pathname para destacar a área ativa e montar a barra direita (sub-seções + regras da área). Tema centralizado em tokens de `globals.css`. Páginas continuam fornecendo só o conteúdo central.

**Tech Stack:** Next.js 16 (App Router, RSC), TypeScript, CSS (globals.css + estilos inline existentes), Vitest + Testing Library. Node no PowerShell: `node`/`npm` direto; no Bash: `export PATH="$PATH:/c/Program Files/nodejs"`.

**Spec:** `docs/superpowers/specs/2026-06-03-passe-design-ux-livro-basico-design.md`. Referência visual: `.superpowers/brainstorm/1904-1780493483/content/visual-livro-v2.html`.

---

## Estrutura de arquivos

- `site/lib/navegacao.ts` — **novo**. Config declarativa: `CATEGORIAS` (nav global), `SUBSECOES` por área, `REGRAS_POR_AREA` (`area → ids de regra`), e helpers `areaDoPath(pathname)`, `subsecoesDaArea(area)`, `regrasDaArea(area)`.
- `site/components/Logo.tsx` — **novo**. Logo "Compêndio T20" (uma linha, fonte Tormenta, degradê) que linka para `/`.
- `site/components/NavGlobal.tsx` — **novo**. Coluna esquerda: logo + busca + lista de categorias com item ativo (client component; usa `usePathname`).
- `site/components/BarraContexto.tsx` — **novo**. Coluna direita: "Nesta seção" (sub-seções da área) + "Regras desta seção" (regras da área). Client; usa `usePathname` + a config.
- `site/components/AppShell.tsx` — **novo**. Casca de 3 colunas (desktop) + top bar/drawers (mobile). Client (estado do drawer mobile).
- `site/app/layout.tsx` — **modificar**. Envolver `children` no `<AppShell>`.
- `site/app/globals.css` — **modificar**. Tokens do tema "Página de Livro" (casca vinho, pergaminho+textura, acentos carmesim/magenta sem dourado no ambiente, menus legíveis), classes utilitárias (`.pagina-pergaminho`, `.calha`, etc.) e media queries.
- `site/app/page.tsx` e os índices — **modificar** (leve): remover `padding`/`maxWidth` duplicados que agora vêm do shell; remover a lista de links da home (vira a nav global).
- `site/app/equipamento/page.tsx` — **modificar**. Renderizar sub-seções como tabelas + descrições abaixo; tooltips nas características.
- `site/app/equipamento/fabricacao/page.tsx` — **novo**. Página "Fabricação de Itens".
- Testes: `site/test/navegacao.test.ts`, `site/test/nav-global.test.tsx`, `site/test/barra-contexto.test.tsx`, `site/test/equipamento-tabela.test.tsx`, `site/test/fabricacao.test.tsx`.

---

## FASE 1 — App shell + tema "Página de Livro"

### Task 1: Config de navegação (`lib/navegacao.ts`)

**Files:**
- Create: `site/lib/navegacao.ts`
- Test: `site/test/navegacao.test.ts`

- [ ] **Step 1: Escrever o teste falhando**

```ts
import { describe, expect, test } from "vitest";
import { areaDoPath, regrasDaArea, CATEGORIAS } from "@/lib/navegacao";

test("areaDoPath identifica a área pela rota", () => {
  expect(areaDoPath("/equipamento")).toBe("equipamento");
  expect(areaDoPath("/ficha/criatura/glop")).toBe("bestiario");
  expect(areaDoPath("/ficha/item/adaga")).toBe("equipamento");
  expect(areaDoPath("/ficha/regra-de-criacao/combate")).toBe("regras");
  expect(areaDoPath("/")).toBe("");
});

test("regras de equipamento incluem fabricação de itens mágicos", () => {
  expect(regrasDaArea("equipamento")).toContain("itens-magicos");
  expect(regrasDaArea("equipamento")).toContain("itens-superiores");
});

test("CATEGORIAS tem as áreas principais com rota e rótulo", () => {
  const ids = CATEGORIAS.map((c) => c.id);
  expect(ids).toEqual(expect.arrayContaining(["equipamento", "magias", "bestiario", "regras"]));
});
```

- [ ] **Step 2: Rodar e ver falhar** — `cd site && npx vitest run test/navegacao.test.ts` → FAIL (módulo não existe).

- [ ] **Step 3: Implementar `lib/navegacao.ts`**

```ts
// Config declarativa da navegação. Sem React aqui — só dados + helpers puros.
export type Categoria = { id: string; rotulo: string; rota: string };

export const CATEGORIAS: Categoria[] = [
  { id: "personagem", rotulo: "Personagem", rota: "/personagem" },
  { id: "racas", rotulo: "Raças", rota: "/racas" },
  { id: "classes", rotulo: "Classes", rota: "/classes" },
  { id: "origens", rotulo: "Origens", rota: "/origens" },
  { id: "pericias", rotulo: "Perícias", rota: "/pericias" },
  { id: "poderes", rotulo: "Poderes", rota: "/poderes" },
  { id: "equipamento", rotulo: "Equipamento", rota: "/equipamento" },
  { id: "itens-magicos", rotulo: "Itens Mágicos", rota: "/itens-magicos" },
  { id: "magias", rotulo: "Magias", rota: "/magias" },
  { id: "deuses", rotulo: "Deuses", rota: "/deuses" },
  { id: "bestiario", rotulo: "Bestiário", rota: "/bestiario" },
  { id: "mundo", rotulo: "Mundo", rota: "/mundo" },
  { id: "regras", rotulo: "Regras", rota: "/regras" },
];

// Mapa de tipo de entidade → área (para fichas /ficha/<tipo>/<id>).
const TIPO_PARA_AREA: Record<string, string> = {
  raca: "racas", classe: "classes", origem: "origens", pericia: "pericias",
  poder: "poderes", item: "equipamento", "item-magico": "itens-magicos",
  magia: "magias", divindade: "deuses", criatura: "bestiario", regiao: "mundo",
  "regra-de-criacao": "regras",
};

export function areaDoPath(pathname: string): string {
  if (pathname.startsWith("/ficha/")) {
    const tipo = pathname.split("/")[2] ?? "";
    return TIPO_PARA_AREA[tipo] ?? "";
  }
  const seg = pathname.split("/").filter(Boolean)[0] ?? "";
  return CATEGORIAS.some((c) => c.id === seg) ? seg : "";
}

// Regras tagueadas por área (fonte única em /regras; referência multi-área).
export const REGRAS_POR_AREA: Record<string, string[]> = {
  personagem: ["construcao-de-personagem", "atributos", "caracteristicas-derivadas", "nome-idade-e-envelhecimento", "alinhamento", "evolucao-de-personagem"],
  racas: ["caracteristicas-das-racas"],
  classes: ["classes-como-funcionam", "evolucao-de-personagem"],
  origens: ["construcao-origens"],
  pericias: ["pericias-como-funcionam"],
  poderes: ["poderes-como-funcionam"],
  equipamento: ["regras-de-armas", "regras-de-armaduras", "itens-superiores", "itens-magicos", "regras-de-itens-especiais", "riqueza-e-equipamento"],
  "itens-magicos": ["itens-magicos", "itens-superiores", "tesouros"],
  magias: ["magia-como-funciona", "caracteristicas-das-magias", "aprimoramentos-de-magia"],
  deuses: ["devocao-como-funciona", "deuses-menores"],
  bestiario: ["construindo-combates", "perigos", "fichas-de-npcs"],
  mundo: ["mundo-de-arton", "linha-do-tempo", "nomes-em-arton"],
};

export function regrasDaArea(area: string): string[] {
  return REGRAS_POR_AREA[area] ?? [];
}
```

- [ ] **Step 4: Rodar e passar** — `npx vitest run test/navegacao.test.ts` → PASS.
- [ ] **Step 5: Commit** — `git add site/lib/navegacao.ts site/test/navegacao.test.ts && git commit -m "feat(ux): config declarativa de navegacao (areas, regras por area)"`.

### Task 2: Tokens do tema "Página de Livro" (`globals.css`)

**Files:**
- Modify: `site/app/globals.css`

- [ ] **Step 1:** Ler `globals.css` atual e localizar as variáveis (`--casca`, `--pergaminho-*`, `--ouro`, `--carmesim`, etc.).
- [ ] **Step 2:** Ajustar/adicionar tokens conforme o spec:
  - Casca: `--casca: radial-gradient(150% 120% at 50% -15%, #371620, #1f0b11 72%)` (cor sólida `--casca-cor: #250f16`).
  - Pergaminho: `--pergaminho-1:#f4ecd5; --pergaminho-2:#e3d4b3;` e classe `.pagina-pergaminho` com a textura SVG `feTurbulence` (`stitchTiles="stitch"`, `mix-blend-mode:multiply`, `opacity:.6`) + `box-shadow` envelhecido.
  - Acentos: `--carmesim:#9b1c2e; --carmesim-escuro:#7a1320; --magenta:#b0388f;`. **Remover uso de dourado em bordas/divisórias do ambiente** (trocar por carmesim); manter degradê dourado→carmesim só nos tokens de título/logo (`--grad-nome`).
  - Menu: `--menu-texto:#e3d4bf` (claro, alto contraste sobre a casca).
- [ ] **Step 3:** `cd site && npm run build` (PowerShell: `node`/`npm` ok) → compila sem erro. Inspecionar `/` no `out/` ou no dev server (`npm run dev`) — a malha sumiu, leitura clara.
- [ ] **Step 4: Commit** — `git add site/app/globals.css && git commit -m "feat(ux): tokens do tema Pagina de Livro (casca solida, pergaminho texturizado, sem dourado no ambiente)"`.

### Task 3: Logo + NavGlobal

**Files:**
- Create: `site/components/Logo.tsx`, `site/components/NavGlobal.tsx`
- Test: `site/test/nav-global.test.tsx`

- [ ] **Step 1: Teste falhando**

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
vi.mock("next/navigation", () => ({ usePathname: () => "/equipamento" }));
import { NavGlobal } from "@/components/NavGlobal";

test("NavGlobal mostra logo, todas as categorias e marca a ativa", () => {
  render(<NavGlobal />);
  expect(screen.getByRole("link", { name: /Compêndio/ })).toHaveAttribute("href", "/");
  expect(screen.getByRole("link", { name: "Magias" })).toHaveAttribute("href", "/magias");
  const ativo = screen.getByRole("link", { name: "Equipamento" });
  expect(ativo).toHaveAttribute("aria-current", "page");
});
```

- [ ] **Step 2:** `npx vitest run test/nav-global.test.tsx` → FAIL.
- [ ] **Step 3:** Implementar `Logo.tsx` (texto "Compêndio T20", `white-space:nowrap`, classe de degradê de nome, `<Link href="/">`) e `NavGlobal.tsx` (`"use client"`; `usePathname()`; itens de `CATEGORIAS`; `aria-current="page"` quando `areaDoPath(pathname)===c.id`; um campo/atalho de Busca no topo). Usar os tokens do tema.
- [ ] **Step 4:** `npx vitest run test/nav-global.test.tsx` → PASS.
- [ ] **Step 5: Commit** — `git add site/components/Logo.tsx site/components/NavGlobal.tsx site/test/nav-global.test.tsx && git commit -m "feat(ux): Logo + NavGlobal (nav esquerda com item ativo)"`.

### Task 4: BarraContexto (direita)

**Files:**
- Create: `site/components/BarraContexto.tsx`
- Test: `site/test/barra-contexto.test.tsx`

- [ ] **Step 1: Teste falhando**

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
vi.mock("next/navigation", () => ({ usePathname: () => "/equipamento" }));
import { BarraContexto } from "@/components/BarraContexto";

test("BarraContexto lista regras da área (equipamento inclui Itens Mágicos)", () => {
  render(<BarraContexto />);
  expect(screen.getByText(/Regras desta seção/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Itens Mágicos/ })).toHaveAttribute("href", "/ficha/regra-de-criacao/itens-magicos");
});
```

- [ ] **Step 2:** `npx vitest run test/barra-contexto.test.tsx` → FAIL.
- [ ] **Step 3:** Implementar `BarraContexto.tsx` (`"use client"`; `usePathname()`→`areaDoPath`; renderiza "Regras desta seção" a partir de `regrasDaArea(area)` linkando `/ficha/regra-de-criacao/<id>`; mostra o rótulo legível da regra — derivar do id ou de um mapa simples de rótulos). "Nesta seção" (sub-seções) entra na Task 6/Fase 2 para Equipamento; aqui deixar a estrutura pronta e vazia quando não houver.
- [ ] **Step 4:** `npx vitest run test/barra-contexto.test.tsx` → PASS.
- [ ] **Step 5: Commit** — `git add site/components/BarraContexto.tsx site/test/barra-contexto.test.tsx && git commit -m "feat(ux): BarraContexto com Regras desta secao por area"`.

### Task 5: AppShell + layout + limpeza das páginas

**Files:**
- Create: `site/components/AppShell.tsx`
- Modify: `site/app/layout.tsx`, `site/app/page.tsx` (remover a lista de links — agora na nav), índices (remover `padding`/`maxWidth` duplicados conforme necessário)

- [ ] **Step 1:** Implementar `AppShell.tsx` (`"use client"`): grid/flex de 3 colunas no desktop (`<NavGlobal/>` | `children` no centro com `.pagina-pergaminho` e calhas iguais | `<BarraContexto/>`). Estrutura mobile (top bar + drawer) entra na Fase 3; por ora, em telas estreitas empilhar (nav vira topo) via CSS simples.
- [ ] **Step 2:** Modificar `layout.tsx` para envolver `children` em `<AppShell>`.
- [ ] **Step 3:** Ajustar `app/page.tsx` (home): remover o bloco de links de categorias (a nav cobre isso); manter título + Busca + destaques. Remover `padding/maxWidth` que conflitem com o shell.
- [ ] **Step 4:** `cd site && npm run build` → 999+ páginas, sem erro. Rodar a suíte: `npx vitest run` → verde. Abrir `npm run dev` e conferir: nav à esquerda, conteúdo no centro em pergaminho, barra direita com regras; navegação entre áreas destaca o item certo.
- [ ] **Step 5: Commit** — `git add site/components/AppShell.tsx site/app/layout.tsx site/app/page.tsx && git commit -m "feat(ux): AppShell de 3 colunas no layout global"`.

### Task 6: Verificação visual da Fase 1
- [ ] Rodar o app (`npm run dev`) e revisar 4-5 páginas (home, /equipamento, /magias, uma ficha de criatura, /regras): legibilidade dos menus, sem malha no fundo, logo numa linha no canto esquerdo, calhas iguais, item ativo correto. Ajustar tokens se necessário e commitar correções.

---

## FASE 2 — Equipamento em tabela + regras contextuais + Fabricação

### Task 7: "Nesta seção" (sub-seções) na BarraContexto para índices

**Files:**
- Modify: `site/lib/navegacao.ts` (adicionar `SUBSECOES` por área — derivar das ordens já usadas nos índices), `site/components/BarraContexto.tsx`
- Test: estender `site/test/barra-contexto.test.tsx`

- [ ] **Step 1:** Teste: em `/equipamento`, BarraContexto mostra "Nesta seção" com links âncora `#armas-simples`, `#armas-marciais`, etc.
- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Adicionar `SUBSECOES: Record<string,{id:string;rotulo:string}[]>` (equipamento: Armas Simples, Armas Marciais, Armas à Distância, Armaduras, Escudos, Itens Gerais, Alquímicos) e renderizar como links de âncora (`/equipamento#armas-simples`). Outras áreas podem ficar vazias por ora.
- [ ] **Step 4:** Rodar → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(ux): Nesta secao (sub-secoes por ancora) na BarraContexto"`.

### Task 8: Equipamento em tabela + tooltips + descrições

**Files:**
- Modify: `site/app/equipamento/page.tsx`
- Test: `site/test/equipamento-tabela.test.tsx`

- [ ] **Step 1: Teste falhando**

```tsx
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import IndiceEquipamento from "@/app/equipamento/page";

test("equipamento renderiza armas em tabela com colunas e descrição abaixo", () => {
  render(<IndiceEquipamento />);
  // cabeçalho de coluna
  expect(screen.getAllByRole("columnheader").some(th => /Dano/i.test(th.textContent || ""))).toBe(true);
  // uma arma conhecida aparece em célula
  expect(screen.getByRole("cell", { name: "Adaga" })).toBeInTheDocument();
});
```

- [ ] **Step 2:** `npx vitest run test/equipamento-tabela.test.tsx` → FAIL.
- [ ] **Step 3:** Reescrever o índice de Equipamento: para cada sub-seção, um `<section id="...">` com `<table>` (colunas conforme o tipo: armas = Arma/Dano/Crít/Alcance/Espaços/Preço/Características; armaduras = Armadura/Defesa/Penalidade/Espaços/Preço). Características renderizadas via `TextoRico`/tooltip (motor existente). Abaixo da tabela, as descrições completas (nome + texto) dos itens da sub-seção. **Armas à Distância + Munição na mesma `<section>`.**
- [ ] **Step 4:** `npx vitest run test/equipamento-tabela.test.tsx` → PASS; `npm run build` verde.
- [ ] **Step 5: Commit** — `git commit -m "feat(equipamento): apresentacao em tabela + tooltips + descricoes abaixo"`.

### Task 9: Página "Fabricação de Itens"

**Files:**
- Create: `site/app/equipamento/fabricacao/page.tsx`
- Modify: `site/app/equipamento/page.tsx` (link para a página), `site/lib/navegacao.ts` (incluir `fabricacao` em SUBSECOES/REGRAS de equipamento se útil)
- Test: `site/test/fabricacao.test.tsx`

- [ ] **Step 1: Teste falhando** — a página lista os caminhos de criação com links para as regras (itens-superiores, itens-magicos, regras-de-itens-especiais) e existe no build.

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Fabricacao from "@/app/equipamento/fabricacao/page";
test("Fabricacao lista caminhos de criacao com link para as regras", () => {
  render(<Fabricacao />);
  expect(screen.getByRole("link", { name: /Itens Superiores/ })).toHaveAttribute("href", "/ficha/regra-de-criacao/itens-superiores");
  expect(screen.getByRole("link", { name: /Itens Mágicos/ })).toHaveAttribute("href", "/ficha/regra-de-criacao/itens-magicos");
});
```

- [ ] **Step 2:** Rodar → FAIL.
- [ ] **Step 3:** Criar a página: blocos para Itens Superiores, Itens Mágicos (fabricar/encantos), Poções & Pergaminhos, Venenos, Pratos — cada um com 1-2 frases e link para a regra completa (`/ficha/regra-de-criacao/<id>`). Adicionar link "Fabricação de Itens" no índice de Equipamento.
- [ ] **Step 4:** Rodar → PASS; `npm run build` gera a rota.
- [ ] **Step 5: Commit** — `git commit -m "feat(equipamento): pagina Fabricacao de Itens (hub de criacao)"`.

---

## FASE 3 — Mobile

### Task 10: Top bar + drawer da nav global

**Files:**
- Modify: `site/components/AppShell.tsx`, `site/app/globals.css`

- [ ] **Step 1:** Adicionar ao AppShell um estado `menuAberto` e, abaixo de ~960px: top bar fixa (logo à esquerda + botão de menu SVG + atalho de busca); `<NavGlobal>` vira drawer off-canvas (transform), com backdrop que fecha ao tocar. Conteúdo em coluna única.
- [ ] **Step 2:** CSS: media query escondendo as colunas laterais fixas no mobile e mostrando a top bar/drawer; `BarraContexto` vira acordeão acima do conteúdo (ou seção colapsável).
- [ ] **Step 3:** `npm run build` verde; testar no dev server reduzindo a janela: menu abre/fecha, leitura ok.
- [ ] **Step 4: Commit** — `git commit -m "feat(ux/mobile): top bar + drawer da navegacao global"`.

### Task 11: Reflow das tabelas + tooltips por toque (mobile)

**Files:**
- Modify: `site/app/globals.css` (regras de tabela responsiva), componente de tooltip (toque)

- [ ] **Step 1:** Em telas estreitas, tabelas de equipamento com scroll horizontal contido **ou** reflow para "linha empilhada" (rótulo: valor) — escolher priorizando leitura; aplicar via CSS.
- [ ] **Step 2:** Tooltips: garantir abertura por toque (tap) no mobile (o componente de tooltip aceita clique/foco, não só hover).
- [ ] **Step 3:** `npm run build` verde; testar no dev server estreito.
- [ ] **Step 4: Commit** — `git commit -m "feat(ux/mobile): reflow de tabelas + tooltips por toque"`.

### Task 12: Revisão final + PROGRESSO
- [ ] Rodar `npx vitest run` (verde) e `npm run build` (verde). Revisar desktop e mobile em 5-6 páginas.
- [ ] Atualizar `PROGRESSO.md` (passe de design/UX concluído; próxima: deploy para testers).
- [ ] Commit final.

---

## Notas de execução
- Node: PowerShell ok direto; Bash precisa de `export PATH="$PATH:/c/Program Files/nodejs"`.
- Commitar caminhos específicos (NUNCA `git add -A`).
- Tema é iterativo: ajustar tokens de `globals.css` é esperado; a referência é `visual-livro-v2.html`.
- Deploy (Vercel/Pages) é passo separado — confirmar destino ao fim.
```
