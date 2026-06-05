# Fase 2.0 — Fundação multi-fonte + spike Ameaças (Brutos & Indomáveis) — Plano

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans para implementar tarefa-a-tarefa. Passos usam checkbox (`- [ ]`).

**Goal:** Tornar o site multi-fonte de verdade (lê `sources.json`), marcar a fonte em toda ficha/índice, mover o seed Súcubo, e provar tudo extraindo a seção "Brutos & Indomáveis" de Ameaças (criaturas + raças jogáveis) ponta a ponta.

**Architecture:** Carregador passa a iterar as fontes de `data/sources.json` (Básico antes, por `ordem`), carregando qualquer tipo de entidade de cada pasta de fonte. Um `SeloFonte` marca a procedência. A extração reusa o pipeline poppler+visão (2 passadas) e os schemas/componentes `criatura`/`raca` já existentes; raça jogável embutida na criatura vira entidade `raca` própria, cruzada por relação.

**Tech Stack:** Next.js 16 (App Router) + TS + Vitest. poppler em `extracao/poppler-bin/poppler-26.02.0/Library/bin`. Node em `/c/Program Files/nodejs` (no Bash, `export PATH="$PATH:/c/Program Files/nodejs"`).

**Convenções do projeto (lembrar):**
- Rodar comandos de site dentro de `site/`; de extração dentro de `extracao/`.
- Commitar caminhos específicos (`git add <paths>`), **nunca** `git add -A`. Sem push até o usuário pedir.
- Caminhos com espaço → sempre entre aspas.
- Offset do Básico era impressa+6; **o de Ameaças é desconhecido — descobrir no Task 6.**

---

## Estrutura de arquivos (mapa desta fatia)

```
site/lib/dados.ts                      # MODIFICA: lê sources.json (multi-fonte) + carregarFontes/tituloFonte
site/components/SeloFonte.tsx          # CRIA: selo SVG da fonte
site/app/ficha/[tipo]/[id]/page.tsx    # MODIFICA: SeloFonte acima da ficha
site/app/racas/page.tsx                # MODIFICA: SeloFonte por card; conta todas as fontes
site/app/bestiario/page.tsx            # MODIFICA: remove filtro livro-basico; SeloFonte por tema
site/app/bestiario/[tema]/page.tsx     # MODIFICA: remove filtro livro-basico; SeloFonte no tema
site/test/dados.test.ts                # MODIFICA: testes multi-fonte + tituloFonte
site/test/selofonte.test.tsx           # CRIA: teste do SeloFonte
site/test/seed.test.ts                 # MODIFICA: novo caminho do Súcubo
data/ameacas-de-arton/criaturas/*.json # CRIA: criaturas de Brutos & Indomáveis (+ Súcubo movido)
data/ameacas-de-arton/racas/*.json     # CRIA: raças jogáveis (Meio-Orc, Orc, Tabrachi…)
extracao/cache/ameacas/                # cache de texto/imagens (gitignored)
```

---

## Task 1: Carregador multi-fonte (lê `sources.json`)

**Files:**
- Modify: `site/lib/dados.ts`
- Test: `site/test/dados.test.ts`

- [ ] **Step 1: Escrever os testes (RED)**

Modify `site/test/dados.test.ts` — adicionar ao fim (mantendo os testes existentes):
```ts
import { carregarFontes, tituloFonte } from "@/lib/dados";

test("carregarFontes lê sources.json em ordem (Básico primeiro)", () => {
  const fontes = carregarFontes();
  expect(fontes[0].slug).toBe("livro-basico");
  expect(fontes.some((f) => f.slug === "ameacas-de-arton")).toBe(true);
});

test("tituloFonte mapeia slug -> título; desconhecido cai no próprio slug", () => {
  expect(tituloFonte("livro-basico")).toBe("Livro Básico");
  expect(tituloFonte("ameacas-de-arton")).toBe("Ameaças de Arton");
  expect(tituloFonte("inexistente")).toBe("inexistente");
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && npm test -- dados`
Expected: FAIL — `carregarFontes`/`tituloFonte` não existem.

- [ ] **Step 3: Implementar (GREEN)**

Modify `site/lib/dados.ts` — substituir o topo do arquivo e a `carregarEntidades` por:
```ts
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { EntidadeSchema, TermoSchema, type Entidade, type Termo } from "./schema";

const RAIZ_DADOS = join(process.cwd(), "..", "data");

export type Fonte = { slug: string; titulo: string; arquivo?: string; ordem: number };

let _fontes: Fonte[] | null = null;
export function carregarFontes(): Fonte[] {
  if (_fontes) return _fontes;
  const raw = JSON.parse(readFileSync(join(RAIZ_DADOS, "sources.json"), "utf8")) as { fontes: Fonte[] };
  _fontes = [...raw.fontes].sort((a, b) => a.ordem - b.ordem);
  return _fontes;
}

export function tituloFonte(slug: string): string {
  return carregarFontes().find((f) => f.slug === slug)?.titulo ?? slug;
}

function listarJson(dir: string): string[] {
  const out: string[] = [];
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) out.push(...listarJson(caminho));
    else if (nome.endsWith(".json")) out.push(caminho);
  }
  return out;
}

let _entidades: Entidade[] | null = null;

export function carregarEntidades(): Entidade[] {
  if (_entidades) return _entidades;
  const ents: Entidade[] = [];
  // Ordem das fontes (Básico antes) garante first-wins do auto-link a favor do Básico.
  for (const fonte of carregarFontes()) {
    const base = join(RAIZ_DADOS, fonte.slug);
    if (!existsSync(base)) continue; // fonte listada mas ainda não extraída
    for (const arq of listarJson(base)) {
      ents.push(EntidadeSchema.parse(JSON.parse(readFileSync(arq, "utf8"))));
    }
  }
  _entidades = ents;
  return ents;
}
```
(Manter `carregarTermos` como está — ela já lê `referencia/condicoes.json`, `glossario.json`, `acoes.json`.)

- [ ] **Step 4: Rodar e ver passar (GREEN)**

Run: `cd site && npm test -- dados`
Expected: PASS (incl. os testes existentes "encontra o Súcubo" e memoização).

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/lib/dados.ts site/test/dados.test.ts && git commit -m "feat(fase2): carregador multi-fonte le sources.json (Basico antes por ordem)"
```

---

## Task 2: Componente `SeloFonte`

**Files:**
- Create: `site/components/SeloFonte.tsx`
- Test: `site/test/selofonte.test.tsx`

- [ ] **Step 1: Escrever o teste (RED)**

Create `site/test/selofonte.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { SeloFonte } from "@/components/SeloFonte";

test("mostra o título da fonte", () => {
  render(<SeloFonte titulo="Ameaças de Arton" />);
  expect(screen.getByText("Ameaças de Arton")).toBeInTheDocument();
});

test("tem papel de marcação acessível (data-selo-fonte)", () => {
  const { container } = render(<SeloFonte titulo="Livro Básico" />);
  expect(container.querySelector('[data-selo-fonte]')).toBeInTheDocument();
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && npm test -- selofonte`
Expected: FAIL — `@/components/SeloFonte` não existe.

- [ ] **Step 3: Implementar (GREEN)**

Create `site/components/SeloFonte.tsx`:
```tsx
// Selo monocromático (SVG, sem emoji) indicando a fonte/livro de uma entidade.
export function SeloFonte({ titulo }: { titulo: string }) {
  return (
    <span
      data-selo-fonte
      title={`Fonte: ${titulo}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        fontSize: 10, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700,
        color: "var(--vermelho)", border: "1px solid var(--borda)", borderRadius: 12,
        padding: "2px 9px", background: "var(--pergaminho-stat)", whiteSpace: "nowrap",
      }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M4 4h11a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z" />
        <path d="M4 4v14" />
      </svg>
      {titulo}
    </span>
  );
}
```

- [ ] **Step 4: Rodar e ver passar (GREEN)**

Run: `cd site && npm test -- selofonte`
Expected: PASS (2 testes).

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/components/SeloFonte.tsx site/test/selofonte.test.tsx && git commit -m "feat(fase2): componente SeloFonte (selo SVG da fonte)"
```

---

## Task 3: `SeloFonte` no topo de toda ficha

**Files:**
- Modify: `site/app/ficha/[tipo]/[id]/page.tsx`

- [ ] **Step 1: Adicionar o selo no wrapper da ficha**

Modify `site/app/ficha/[tipo]/[id]/page.tsx`:
1. Adicionar imports no topo:
```tsx
import { SeloFonte } from "@/components/SeloFonte";
import { tituloFonte } from "@/lib/dados";
```
2. Trocar o `carregarEntidades, carregarTermos` import por incluir `tituloFonte` (já no mesmo módulo): a linha vira
```tsx
import { carregarEntidades, carregarTermos, tituloFonte } from "@/lib/dados";
```
(e remover o import duplicado de `tituloFonte` do passo 1).
3. No `return`, dentro do `<main style={{ padding: 40 }}>`, ANTES do bloco condicional de fichas, inserir:
```tsx
      <div style={{ maxWidth: 1140, margin: "0 auto 10px", textAlign: "center" }}>
        <SeloFonte titulo={tituloFonte(entidade.fonte.livro)} />
      </div>
```

- [ ] **Step 2: Verificar tipos e build**

Run: `cd site && npx tsc --noEmit`
Expected: 0 erros.

- [ ] **Step 3: Verificação manual (dev server já roda ou subir)**

Run (se necessário): `cd site && npm run dev` e abrir `http://localhost:3000/ficha/raca/humano`.
Expected: selo "Livro Básico" acima da ficha do Humano.

- [ ] **Step 4: Commit**

```bash
cd .. && git add "site/app/ficha/[tipo]/[id]/page.tsx" && git commit -m "feat(fase2): SeloFonte no topo de toda ficha"
```

---

## Task 4: Mover o seed Súcubo para `ameacas-de-arton`

**Files:**
- Move: `data/livro-basico/criaturas/sucubo.json` → `data/ameacas-de-arton/criaturas/sucubo.json`
- Modify: `site/test/seed.test.ts`

- [ ] **Step 1: Atualizar o teste para o novo caminho (RED)**

Modify `site/test/seed.test.ts` — trocar a linha do caminho:
```ts
  const json = JSON.parse(readFileSync(join(RAIZ, "ameacas-de-arton/criaturas/sucubo.json"), "utf8"));
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd site && npm test -- seed`
Expected: FAIL — arquivo ainda está no caminho antigo (ENOENT).

- [ ] **Step 3: Mover o arquivo (GREEN)**

Run (na raiz):
```bash
mkdir -p data/ameacas-de-arton/criaturas
git mv data/livro-basico/criaturas/sucubo.json data/ameacas-de-arton/criaturas/sucubo.json
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd site && npm test -- seed dados`
Expected: PASS — `seed.test.ts` acha o Súcubo no novo caminho; `dados.test.ts` "encontra o Súcubo" continua passando (agora carregado da fonte `ameacas-de-arton`, provando o multi-fonte de verdade).

- [ ] **Step 5: Commit**

```bash
cd .. && git add data/ameacas-de-arton/criaturas/sucubo.json site/test/seed.test.ts && git commit -m "refactor(fase2): move seed Sucubo para ameacas-de-arton (resolve divida)"
```

---

## Task 5: `SeloFonte` nos índices + bestiário multi-fonte

**Files:**
- Modify: `site/app/racas/page.tsx`
- Modify: `site/app/bestiario/page.tsx`
- Modify: `site/app/bestiario/[tema]/page.tsx`

- [ ] **Step 1: `/racas` — selo por card e conta todas as fontes**

Modify `site/app/racas/page.tsx`:
1. Imports: adicionar
```tsx
import { SeloFonte } from "@/components/SeloFonte";
import { tituloFonte } from "@/lib/dados";
```
(e usar `carregarEntidades, tituloFonte` no import de `@/lib/dados`).
2. Trocar o subtítulo (linha do `{racas.length} ... do Livro Básico`) por:
```tsx
          {racas.length} {racas.length === 1 ? "raça" : "raças"} de Arton
```
3. Dentro de `.indice-card-body`, após o `.indice-card-resumo`, inserir:
```tsx
                  <span style={{ marginTop: 6 }}><SeloFonte titulo={tituloFonte(r.fonte.livro)} /></span>
```

- [ ] **Step 2: `/bestiario` (índice de temas) — remover filtro de fonte + selo por tema**

Modify `site/app/bestiario/page.tsx`:
1. Imports: adicionar `import { SeloFonte } from "@/components/SeloFonte";` e incluir `tituloFonte` no import de `@/lib/dados`.
2. Linha 27 — remover o filtro de fonte:
```tsx
  const criaturas = entidades.filter((e) => e.tipo === "criatura");
```
3. Subtítulo (`{criaturas.length} criaturas do Livro Básico — escolha um tema`) →
```tsx
          {criaturas.length} criaturas — escolha um tema
```
4. Helper para a fonte de um tema (criaturas de um tema são homogêneas por fonte). Após `const contar = ...` adicionar:
```tsx
  const fonteDoTema = (tema: string) =>
    criaturas.find((c) => mec(c).tema === tema)?.fonte.livro ?? "livro-basico";
```
5. Na linha do tema (`<Link ... className="indice-linha">`), trocar o conteúdo por:
```tsx
                <span className="indice-nome">{tema}</span>
                <SeloFonte titulo={tituloFonte(fonteDoTema(tema))} />
                <span className="indice-resumo">{n} {n === 1 ? "criatura" : "criaturas"}</span>
```

- [ ] **Step 3: `/bestiario/[tema]` — remover filtro de fonte (2 lugares) + selo**

Modify `site/app/bestiario/[tema]/page.tsx`:
1. Imports: adicionar `import { SeloFonte } from "@/components/SeloFonte";` e incluir `tituloFonte` no import de `@/lib/dados`.
2. Linha 36 (dentro de `temasOrdenados`) — remover `&& e.fonte?.livro === "livro-basico"`:
```tsx
    carregarEntidades().filter((e) => e.tipo === "criatura").map((e) => mec(e).tema).filter(Boolean) as string[],
```
3. Linha 53 — remover `e.fonte?.livro === "livro-basico" &&`:
```tsx
    .filter((e) => e.tipo === "criatura" && mec(e).tema === temaReal)
```
4. Após o `<p>` do subtítulo (`{criaturas.length} ... criaturas`), inserir selo do tema:
```tsx
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <SeloFonte titulo={tituloFonte(criaturas[0]?.fonte.livro ?? "livro-basico")} />
        </div>
```

- [ ] **Step 4: Verificar build + suíte**

Run: `cd site && npx tsc --noEmit && npm test && npm run build`
Expected: tsc 0 erros; suíte verde; build conclui. (O `/bestiario` ainda mostra só temas do Básico + o Súcubo solto vira o tema dele — confirmar que o build não quebra; o Súcubo tem `mecanica.tema`? Se não tiver, ele não aparece no índice por tema, o que é aceitável até o Task 7 trazer um tema real.)

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/app/racas/page.tsx site/app/bestiario/page.tsx "site/app/bestiario/[tema]/page.tsx" && git commit -m "feat(fase2): indices /racas e /bestiario multi-fonte com SeloFonte"
```

---

## Task 6: Spike de extração — render + descobrir offset

**Files:**
- Create (cache, gitignored): `extracao/cache/ameacas/`

- [ ] **Step 1: Renderizar as páginas de Brutos & Indomáveis em 300 DPI**

A seção (impressas 30–37 conforme sumário: Meio-Orc 30, Orc 32, Orc Mutante 33, Orc Xamã 35, Sapo Atroz 35, Tabrachi 36). O PDF tem 436 páginas; o offset é desconhecido. Rodar (de `extracao/`):
```bash
export PATH="$PATH:/c/Program Files/nodejs"
bin="poppler-bin/poppler-26.02.0/Library/bin"
pdf="../pdfs/Ameacas-de-Arton-v1.0-17-11-2023.pdf"
mkdir -p cache/ameacas/brutos
# render uma janela ampla p/ achar o offset (PDF 34..46 cobre impressas ~28..40 se offset~6)
for p in $(seq 34 46); do "$bin/pdftoppm" -f $p -l $p -png -r 300 "$pdf" "cache/ameacas/brutos/pdf-$p"; done
```

- [ ] **Step 2: Determinar o offset (visão)**

Abrir as imagens renderizadas e ler o número impresso no rodapé de cada página; achar a página do PDF cujo rodapé impresso = 30 (início de "Brutos & Indomáveis", com Meio-Orc). Registrar `OFFSET = pdf − impressa`. Anotar no PROGRESSO e usar daqui pra frente.

- [ ] **Step 3: Extrair o texto-layout das páginas confirmadas**

Para o intervalo PDF correspondente às impressas 30–37 (usando o offset do Step 2):
```bash
for p in <pdf_ini>..<pdf_fim>; do "$bin/pdftotext" -f $p -l $p -layout -enc UTF-8 "$pdf" "cache/ameacas/brutos/txt-$p.txt"; done
```
Expected: textos com acentuação UTF-8 correta (conferir um arquivo).

- [ ] **Step 4: Commit (doc do offset; cache é gitignored)**

Atualizar `PROGRESSO.md` com o offset de Ameaças e o intervalo do spike, e commitar só o PROGRESSO:
```bash
cd .. && git add PROGRESSO.md && git commit -m "docs(fase2): offset de Ameacas de Arton + intervalo do spike"
```

---

## Task 7: Extrair as CRIATURAS de Brutos & Indomáveis (2 passadas por visão)

**Files:**
- Create: `data/ameacas-de-arton/criaturas/<slug>.json` (uma por criatura)

> Reusar as convenções do bestiário do Cap. 7 (ver PROGRESSO, seção "Convenções (reusar)"):
> palavras-chave defensivas no campo `defesa`; habilidades de tema como `secao` titulada; `ataques` = só Corpo a Corpo/Distância; atributos negativos com en-dash `–`; `mecanica.tema = "Brutos & Indomáveis"`.

- [ ] **Step 1: Extrair (Passada 1) cada criatura da seção**

Para cada stat block de criatura nas páginas do spike (ex.: Orc Mutante, Orc Xamã, Sapo Atroz, Tabrachi — confirmar a lista exata pela imagem; algumas entradas podem ser só-raça), criar `data/ameacas-de-arton/criaturas/<slug>.json` no formato `criatura` (mesmo schema do Básico). Exemplo de formato (campos reais vêm da página):
```json
{
  "id": "orc-mutante",
  "tipo": "criatura",
  "nome": "Orc Mutante",
  "resumo": "<1 linha do flavor>",
  "fonte": { "livro": "ameacas-de-arton", "pagina": 33 },
  "imagens": [],
  "secoes": [{ "titulo": "Descrição", "texto": "<flavor fiel>" }],
  "relacoes": [],
  "mecanica": {
    "tema": "Brutos & Indomáveis",
    "nd": "<ND>", "tipo": "<tipo de criatura>", "tamanho": "<tamanho>",
    "atributos": "<For/Des/Con/Int/Sab/Car com en-dash>",
    "pv": <int>, "defesa": "<valor + palavras defensivas>",
    "deslocamento": "<...>", "ataques": ["<linha de ataque>"],
    "pericias": "<...>", "sentidos": "<...>",
    "habilidades": [{ "nome": "<...>", "descricao": "<...>" }]
  }
}
```
Manter `id` em slug estável; `pagina` = a impressa real.

- [ ] **Step 2: Validar (Passada 2) por revisor independente com visão**

Conferir cada JSON célula-a-célula contra a imagem 300 DPI (ND, atributos com en-dash, CDs, PV/PM, ataques bônus/dados/margem, sentidos, RD/RM/imunidades no `defesa`). Corrigir divergências. Registrar "0 divergências" ou as correções.

- [ ] **Step 3: Validar contra o schema + build**

Run: `cd site && npm test -- seed dados && npm run build`
Expected: entidades novas válidas; build prerenderiza as fichas `/ficha/criatura/<slug>` e elas aparecem em `/bestiario/brutos-indomaveis` com selo "Ameaças de Arton".

- [ ] **Step 4: Commit**

```bash
cd .. && git add data/ameacas-de-arton/criaturas/ && git commit -m "feat(fase2): criaturas de Brutos & Indomaveis (Ameacas), validadas por visao"
```

---

## Task 8: Extrair as RAÇAS JOGÁVEIS (Habilidades de Raça), cruzadas

**Files:**
- Create: `data/ameacas-de-arton/racas/<slug>.json` (Meio-Orc, Orc, Tabrachi — os blocos "X: Habilidades de Raça" da seção)
- Modify: as criaturas correspondentes do Task 7 (adicionar relação criatura↔raça)

- [ ] **Step 1: Extrair (Passada 1) cada raça jogável**

Para cada bloco "X: Habilidades de Raça" da seção, criar `data/ameacas-de-arton/racas/<slug>.json` no formato `raca` (mesmo `RacaMecanicaSchema` do Básico: `modificadores[]`, `tamanho`, `deslocamento`, `habilidades[]`). Exemplo:
```json
{
  "id": "orc",
  "tipo": "raca",
  "nome": "Orc",
  "resumo": "<1 linha>",
  "fonte": { "livro": "ameacas-de-arton", "pagina": 32 },
  "imagens": [],
  "secoes": [{ "titulo": "Descrição", "texto": "<flavor fiel>" }],
  "relacoes": [{ "tipo": "verTambem", "alvoId": "orc", "alvoTipo": "criatura", "rotulo": "Ficha de criatura" }],
  "mecanica": {
    "modificadores": [{ "atributo": "Força", "valor": 2 }, { "atributo": "Inteligência", "valor": -1 }],
    "tamanho": "Médio", "deslocamento": 9,
    "habilidades": [{ "nome": "<habilidade racial>", "descricao": "<...>" }]
  }
}
```
> Cuidado com colisão de `id`: a criatura "Orc" e a raça "Orc" têm o mesmo nome. Os `id` podem coincidir (`orc`) porque a rota é `/ficha/<tipo>/<id>` — tipos diferentes não colidem. Mas para o auto-link/busca, conferir que não há ambiguidade quebrando link (rodar build e checar console).

- [ ] **Step 2: Cruzar criatura ↔ raça**

Na criatura correspondente (Task 7), adicionar em `relacoes`:
```json
{ "tipo": "versaoJogavel", "alvoId": "<id-da-raca>", "alvoTipo": "raca", "rotulo": "Versão jogável" }
```

- [ ] **Step 3: Validar (Passada 2) por visão + schema**

Conferir modificadores de atributo, tamanho, deslocamento e cada habilidade racial contra a imagem. Corrigir divergências.
Run: `cd site && npm test && npm run build`
Expected: raças válidas; aparecem em `/racas` com selo "Ameaças de Arton"; a ficha da raça linka pra criatura e vice-versa.

- [ ] **Step 4: Commit**

```bash
cd .. && git add data/ameacas-de-arton/racas/ data/ameacas-de-arton/criaturas/ && git commit -m "feat(fase2): racas jogaveis de Brutos & Indomaveis, cruzadas com as criaturas"
```

---

## Task 9: Validação final da fatia + PROGRESSO

- [ ] **Step 1: Verificação completa**

Run:
```bash
cd site && export PATH="$PATH:/c/Program Files/nodejs" && npx tsc --noEmit && npm test && npm run build
```
Expected: tsc 0 erros; suíte verde (incl. novos testes de dados/SeloFonte/seed); build conclui.

- [ ] **Step 2: Conferência visual (dev server)**

Abrir e conferir:
- `/ficha/raca/<raca-ameacas>` → selo "Ameaças de Arton" + link pra criatura.
- `/ficha/criatura/<criatura-ameacas>` → selo + link pra versão jogável.
- `/racas` → raças de Ameaças com selo, junto das do Básico.
- `/bestiario` → tema "Brutos & Indomáveis" com selo; `/bestiario/brutos-indomaveis` lista as criaturas.
- `/ficha/criatura/sucubo` → agora selo "Ameaças de Arton".

- [ ] **Step 3: Atualizar PROGRESSO e commit**

Registrar no `PROGRESSO.md`: Fase 2.0 concluída (multi-fonte + SeloFonte + Súcubo movido + spike Brutos & Indomáveis), offset de Ameaças, e a próxima fatia (plano completo de Ameaças). Commitar:
```bash
cd .. && git add PROGRESSO.md && git commit -m "docs(fase2): conclui fundacao multi-fonte + spike Brutos & Indomaveis"
```

---

## Encerramento da fatia

Ao fim, o site é **multi-fonte de verdade**: lê `sources.json`, marca a procedência em toda ficha/índice, e tem conteúdo real de **Ameaças de Arton** (criaturas + raças jogáveis de "Brutos & Indomáveis") convivendo com o Básico sem sobrescrevê-lo. Valida a arquitetura multi-fonte + multi-tipo de ponta a ponta. **A próxima fatia** (plano próprio) extrai o resto de Ameaças — todos os temas, raças, itens e a intro de regras — reusando este pipeline.
