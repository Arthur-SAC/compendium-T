# Deuses de Arton — Plano de Implementação (Fase 2, 4ª fonte)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extrair o livro Deuses de Arton para a wiki, enriquecendo os 20 deuses do Básico (lore, devotos, Avatar, artefatos, retrato + símbolo atualizado) por agregação de lookup, sem editar o Básico, e adicionando o conteúdo novo (Frade, Abençoada, distinções, magias, equipamentos, bestiário divino).

**Architecture:** Camada por fonte (`deuses-de-arton`, ordem 4). Tipo novo `divindade-expansao` (id `<deus>-deuses-de-arton`, campo `expandeDivindade`) é agregado no render pelo dispatcher e exibido num painel "Em Deuses de Arton" da `FichaDivindade`, junto do Avatar (`criatura`), poderes concedidos novos (`poder`) e artefatos (`item-magico`). Demais conteúdos reusam tipos existentes.

**Tech Stack:** Next.js 16 (App Router, React 19), TypeScript, Zod v4, Vitest. Extração: poppler (`pdftotext`/`pdftoppm`/`pdfimages`) em `C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin`. PDF: `pdfs/T20-Deuses-de-Arton-v1-1.pdf`.

**Spec:** `docs/superpowers/specs/2026-06-09-fase2-deuses-de-arton-design.md`

---

## Convenções (toda onda)

- **Ambiente:** PowerShell tem `node`/`npm` direto; no Bash, `export PATH="$PATH:/c/Program Files/nodejs"`. Build/test/tsc rodam de `site/`.
- **Subagentes de extração NÃO commitam** — o controlador commita por lote, caminhos específicos (`git add data/...`), **nunca `git add -A`**.
- **JSON:** sem BOM, LF, **sem `null`** (omitir chave), campo de seção sempre `texto` (nunca `conteudo`).
- **Offset PDF:** detectar no início da Onda 1 por âncora (achar uma página impressa conhecida). O sumário lista páginas impressas; PDF = impressa + offset.

## Procedimento P (ondas de dados 1–4)

1. **Spike de cobertura de schema** antes do lote: extrair 1 exemplar do tipo e conferir campo a campo vs a página; se algo não couber, ajustar o schema ANTES do lote.
2. `pdftotext -layout -f <p> -l <p> "<pdf>" -` é a **fonte da verdade do texto**. Renderizar 300 DPI (`pdftoppm -r 300 -f <p> -l <p> -png "<pdf>" extracao/cache/<lote>/pg`) só para layout/tabelas/arte/cabeçalhos. Conteúdo atravessa 2–3 páginas.
3. Arte via `pdfimages` cor+smask compostos (`comporComMascara` de `extracao/src/imagens.ts`, rodar `.mts` via `npx tsx` de `extracao/`); spot-check por visão.
4. Revisão por visão por amostragem; fidelidade célula a célula nas tabelas grandes.
5. Ao fim de cada onda: `tsc` 0 · testes verdes · `npm run build` verde · atualizar `PROGRESSO.md` · commit por lote.

---

# ONDA A — Código (TDD, tarefa a tarefa)

Arquivos-âncora existentes (já lidos): `site/lib/schema.ts` (enum linha 3–8; base `EntidadeSchema` linha 300–311 com `mecanica: z.record(z.string(), z.unknown())`; superRefine com ramos por tipo, último ramo `distincao` linha 412–416). Dispatcher `site/app/ficha/[tipo]/[id]/page.tsx` (poderesExtras linha 54–87; render linha 89–122; ramo `divindade` linha 110–111). `site/components/FichaDivindade.tsx`. `site/app/deuses/page.tsx`. `site/lib/navegacao.ts` (TIPO_PARA_AREA linha ~23). `site/lib/dados.ts` (`carregarFontes`, `tituloFonte`). Testes em `site/test/` (padrão `EntidadeSchema.safeParse`).

### Task A1: Tipo `divindade-expansao` no schema

**Files:**
- Modify: `site/lib/schema.ts` (enum linha 3–8; adicionar schema perto de `DivindadeMecanicaSchema` ~linha 249; ramo no superRefine após o ramo `distincao` ~linha 416)
- Test: `site/test/schema-divindade-expansao.test.ts`

- [ ] **Step 1: Escrever o teste que falha**

```ts
// site/test/schema-divindade-expansao.test.ts
import { describe, it, expect } from "vitest";
import { EntidadeSchema } from "@/lib/schema";

const exp = {
  id: "khalmyr-deuses-de-arton", tipo: "divindade-expansao", nome: "Khalmyr (Deuses de Arton)",
  resumo: "Expansão de Khalmyr.",
  fonte: { livro: "deuses-de-arton", pagina: 172 },
  imagens: ["/divindades/khalmyr-retrato.png"],
  secoes: [{ titulo: "Sacerdotes de Khalmyr", texto: "..." }],
  relacoes: [{ alvoTipo: "criatura", alvoId: "avatar-de-khalmyr", rotulo: "Avatar de Khalmyr" }],
  mecanica: { expandeDivindade: "khalmyr", simboloAtualizado: "/divindades/khalmyr-simbolo-da.png" },
};

describe("schema divindade-expansao", () => {
  it("aceita uma expansão válida", () => {
    expect(EntidadeSchema.safeParse(exp).success).toBe(true);
  });
  it("rejeita expansão sem expandeDivindade", () => {
    const m = { ...exp, mecanica: { simboloAtualizado: "/x.png" } };
    expect(EntidadeSchema.safeParse(m).success).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run (de `site/`): `npx vitest run test/schema-divindade-expansao.test.ts`
Expected: FALHA — `tipo` `"divindade-expansao"` não está no enum (`invalid_enum_value`).

- [ ] **Step 3: Implementar**

No enum `TIPOS_ENTIDADE` (linha 3–8), acrescentar `"divindade-expansao"` logo após `"divindade"`:
```ts
  "condicao", "divindade", "divindade-expansao", "criatura", "npc", "regiao", "distincao",
```
Após `DivindadeMecanicaSchema` (~linha 257), adicionar:
```ts
export const DivindadeExpansaoMecanicaSchema = z.object({
  expandeDivindade: z.string(),              // id da divindade base no Básico (ex.: "khalmyr")
  simboloAtualizado: z.string().optional(),  // caminho de imagem se Deuses de Arton trouxer símbolo novo
});
export type DivindadeExpansaoMecanica = z.infer<typeof DivindadeExpansaoMecanicaSchema>;
```
No superRefine, após o ramo `distincao` (linha 416), adicionar:
```ts
    } else if (ent.tipo === "divindade-expansao") {
      const r = DivindadeExpansaoMecanicaSchema.safeParse(ent.mecanica);
      if (!r.success) {
        ctx.addIssue({ code: "custom", path: ["mecanica"], message: `mecânica de expansão de divindade inválida: ${r.error.issues.map((i) => i.message).join("; ")}` });
      }
```

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `npx vitest run test/schema-divindade-expansao.test.ts`
Expected: PASS (2 testes).

- [ ] **Step 5: Commit**

```bash
git add site/lib/schema.ts site/test/schema-divindade-expansao.test.ts
git commit -m "feat(fase2.4): tipo divindade-expansao no schema (enum + DivindadeExpansaoMecanicaSchema + superRefine)"
```

### Task A2: Fonte `deuses-de-arton` no manifesto

**Files:**
- Modify: `data/sources.json`
- Test: `site/test/dados-fontes.test.ts` (criar se útil; senão validar via build)

- [ ] **Step 1: Escrever o teste que falha**

```ts
// site/test/dados-fontes.test.ts
import { describe, it, expect } from "vitest";
import { carregarFontes } from "@/lib/dados";

describe("manifesto de fontes", () => {
  it("inclui deuses-de-arton na ordem 4", () => {
    const f = carregarFontes().find((x) => x.slug === "deuses-de-arton");
    expect(f).toBeTruthy();
    expect(f!.ordem).toBe(4);
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run test/dados-fontes.test.ts`
Expected: FALHA — fonte não existe.

- [ ] **Step 3: Implementar** — em `data/sources.json`, adicionar ao array `fontes`:
```json
    { "slug": "deuses-de-arton", "titulo": "Deuses de Arton", "arquivo": "T20-Deuses-de-Arton-v1-1.pdf", "ordem": 4 }
```
(Adicionar vírgula após a entrada `herois-de-arton`.) **Não** criar a pasta `data/deuses-de-arton/` ainda — o carregador tem guarda `existsSync` que aceita fonte listada sem dados.

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run test/dados-fontes.test.ts` → PASS.
Run: `npx vitest run` → suíte inteira continua verde (a guarda `existsSync` impede erro de pasta ausente).

- [ ] **Step 5: Commit**

```bash
git add data/sources.json site/test/dados-fontes.test.ts
git commit -m "feat(fase2.4): fonte deuses-de-arton (ordem 4) no manifesto"
```

### Task A3: Lookup da expansão de divindade no dispatcher

**Files:**
- Modify: `site/app/ficha/[tipo]/[id]/page.tsx` (bloco de lookup ~linha 54–87; chamada da `FichaDivindade` linha 110–111)
- Test: coberto pelo teste de render da Task A4 (a lógica é exercida via a ficha).

- [ ] **Step 1: Implementar o lookup** — após o bloco `poderesExtras` (antes do `return`, ~linha 88), adicionar:

```tsx
  // Expansão de uma divindade (Deuses de Arton e futuros): agregação por lookup, sem editar o Básico.
  let divindadeExtras:
    | { expansao?: typeof entidade; avatares: { id: string; nome: string }[]; artefatos: { id: string; nome: string }[]; poderesConcedidos: { id: string; nome: string }[] }
    | undefined;
  if (entidade.tipo === "divindade") {
    const idDeus = norm(entidade.id);
    const expansao = entidades.find(
      (e) => e.tipo === "divindade-expansao" && norm(String((e.mecanica as { expandeDivindade?: string }).expandeDivindade ?? "")) === idDeus,
    );
    // Avatar/artefatos: entidades cujas relacoes apontam para este deus (alvoTipo divindade).
    const apontaPraDeus = (e: typeof entidade) => e.relacoes.some((r) => r.alvoTipo === "divindade" && norm(r.alvoId) === idDeus);
    const avatares = entidades.filter((e) => e.tipo === "criatura" && apontaPraDeus(e)).map((e) => ({ id: e.id, nome: e.nome }));
    const artefatos = entidades.filter((e) => e.tipo === "item-magico" && apontaPraDeus(e)).map((e) => ({ id: e.id, nome: e.nome }));
    const poderesConcedidos = ordenar(
      todosPoderes
        .filter((e) => norm(String((e.mecanica as { grupo?: string }).grupo ?? "")) === idDeus)
        .map((e) => ({ id: e.id, nome: e.nome })),
    );
    divindadeExtras = { expansao, avatares, artefatos, poderesConcedidos };
  }
```

- [ ] **Step 2: Passar para a ficha** — trocar a linha 110–111:
```tsx
      ) : entidade.tipo === "divindade" ? (
        <FichaDivindade entidade={entidade} registro={registro} descricoes={descricoes} extras={divindadeExtras} />
```

- [ ] **Step 3: Verificar tsc** (a `FichaDivindade` ainda não aceita `extras` — Task A4 adiciona). Rodar: `npx tsc --noEmit` → ESPERA erro de prop `extras` inexistente. Isso é resolvido na Task A4; commit conjunto A3+A4.

> Nota de execução: A3 e A4 são acopladas (a prop nova). Implementar A3 e A4 e só então rodar tsc/testes/commit (um commit cobrindo as duas). Mantidas separadas só para clareza de leitura.

### Task A4: `FichaDivindade` com retrato, regra de símbolo e painel "Em Deuses de Arton"

**Files:**
- Modify: `site/components/FichaDivindade.tsx`
- Test: `site/test/fichadivindade.test.tsx`

- [ ] **Step 1: Escrever o teste que falha** — acrescentar ao `fichadivindade.test.tsx` um caso com `extras`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FichaDivindade } from "@/components/FichaDivindade";

const registro = { porNome: new Map() } as any;
const deus = {
  id: "khalmyr", tipo: "divindade", nome: "Khalmyr", resumo: "Deus da justiça.",
  fonte: { livro: "livro-basico", pagina: 100 }, imagens: ["/divindades/khalmyr.png"],
  secoes: [], relacoes: [],
  mecanica: { crencasObjetivos: "Justiça.", simboloSagrado: "Espada", canalizaEnergia: "Positiva", armaPreferida: "Espada longa", devotos: "Paladinos", poderesConcedidos: [], obrigacoesRestricoes: "Nunca mentir." },
} as any;
const extras = {
  expansao: { id: "khalmyr-deuses-de-arton", imagens: ["/divindades/khalmyr-retrato.png"],
    secoes: [{ titulo: "Sacerdotes de Khalmyr", texto: "Os juízes." }],
    mecanica: { expandeDivindade: "khalmyr", simboloAtualizado: "/divindades/khalmyr-simbolo-da.png" } },
  avatares: [{ id: "avatar-de-khalmyr", nome: "Avatar de Khalmyr" }],
  artefatos: [{ id: "espada-da-justica", nome: "Espada da Justiça" }],
  poderesConcedidos: [{ id: "p-x", nome: "Sentença" }],
} as any;

describe("FichaDivindade com expansão", () => {
  it("mostra o painel Em Deuses de Arton com lore, avatar e artefato", () => {
    render(<FichaDivindade entidade={deus} registro={registro} descricoes={{}} extras={extras} />);
    expect(screen.getByText(/Em Deuses de Arton/i)).toBeTruthy();
    expect(screen.getByText(/Sacerdotes de Khalmyr/i)).toBeTruthy();
    expect(screen.getByText(/Avatar de Khalmyr/i)).toBeTruthy();
    expect(screen.getByText(/Espada da Justiça/i)).toBeTruthy();
  });
  it("usa o símbolo atualizado da expansão quando presente", () => {
    render(<FichaDivindade entidade={deus} registro={registro} descricoes={{}} extras={extras} />);
    const img = screen.getByAltText(/Símbolo de Khalmyr/i) as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("/divindades/khalmyr-simbolo-da.png");
  });
  it("renderiza sem extras (deus sem expansão)", () => {
    render(<FichaDivindade entidade={deus} registro={registro} descricoes={{}} />);
    expect(screen.getByText(/Crenças e Objetivos/i)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run test/fichadivindade.test.tsx`
Expected: FALHA — `FichaDivindade` não aceita `extras` / painel inexistente.

- [ ] **Step 3: Implementar** — em `FichaDivindade.tsx`:

(a) Tipo dos extras e nova prop opcional. Trocar a assinatura (linha 22):
```tsx
type DivindadeExtras = {
  expansao?: { id: string; imagens: string[]; secoes: { titulo?: string; texto: string }[]; mecanica: { simboloAtualizado?: string } };
  avatares: { id: string; nome: string }[];
  artefatos: { id: string; nome: string }[];
  poderesConcedidos: { id: string; nome: string }[];
};

export function FichaDivindade({ entidade, registro, descricoes, extras }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string>; extras?: DivindadeExtras }) {
  const m = entidade.mecanica as unknown as DivindadeMecanica;
  const expansao = extras?.expansao;
  const retrato = expansao?.imagens?.[0];
  const simbolo = expansao?.mecanica?.simboloAtualizado ?? entidade.imagens[0];
```

(b) No `aside`, trocar o `imagem` antigo (linha 88–93) para usar `simbolo` e adicionar o retrato acima dos campos. Substituir o bloco do símbolo por:
```tsx
            {retrato && (
              <div style={{ ...cartaoAside, display: "flex", justifyContent: "center", padding: 0, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={retrato} alt={`Retrato de ${entidade.nome}`} style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            )}
            {simbolo && (
              <div style={{ ...cartaoAside, display: "flex", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={simbolo} alt={`Símbolo de ${entidade.nome}`} style={{ width: "100%", maxWidth: 220, height: "auto", filter: "drop-shadow(0 8px 18px rgba(60,30,10,.4))" }} />
              </div>
            )}
```

(c) No `ficha-main`, após o bloco "Poderes Concedidos" (linha 80) e antes do `<p>` de Fonte (linha 82), adicionar o painel de expansão:
```tsx
            {extras && (expansao || extras.avatares.length || extras.artefatos.length || extras.poderesConcedidos.length) ? (
              <section style={{ marginTop: 18, background: "rgba(177,39,58,.06)", border: "1px solid var(--borda-suave)", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--vermelho)", fontWeight: 700, marginBottom: 10 }}>Em Deuses de Arton</div>
                {expansao?.secoes.map((s, i) => (
                  <section key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.7, marginBottom: 10 }}>
                    {s.titulo ? <h2 style={h2}>{s.titulo}</h2> : null}
                    <TextoBlocos texto={s.texto} registro={registro} descricoes={descricoes} />
                  </section>
                ))}
                {extras.avatares.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={rotuloCampo}>Avatar</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                      {extras.avatares.map((a) => <Link key={a.id} href={`/ficha/criatura/${a.id}`} style={{ ...chipBase, textDecoration: "none", borderColor: "var(--ouro)" }}>{a.nome}</Link>)}
                    </div>
                  </div>
                )}
                {extras.artefatos.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div style={rotuloCampo}>Artefatos Divinos</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                      {extras.artefatos.map((a) => <Link key={a.id} href={`/ficha/item-magico/${a.id}`} style={{ ...chipBase, textDecoration: "none", borderColor: "var(--ouro)" }}>{a.nome}</Link>)}
                    </div>
                  </div>
                )}
                {extras.poderesConcedidos.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div style={rotuloCampo}>Novos Poderes Concedidos</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                      {extras.poderesConcedidos.map((p) => <Link key={p.id} href={`/ficha/poder/${p.id}`} style={{ ...chipBase, textDecoration: "none", borderColor: "var(--ouro)" }}>{p.nome}</Link>)}
                    </div>
                  </div>
                )}
              </section>
            ) : null}
```

(d) Garantir o import de `Link` (já existe na linha 1). `rotuloCampo`, `chipBase`, `h2`, `TextoBlocos` já existem no arquivo.

- [ ] **Step 4: Rodar tsc + testes**

Run (de `site/`): `npx tsc --noEmit` → 0 erros (a prop `extras` agora existe; o dispatcher da A3 compila).
Run: `npx vitest run test/fichadivindade.test.tsx` → PASS (3 testes).

- [ ] **Step 5: Commit (cobre A3 + A4)**

```bash
git add site/app/ficha/[tipo]/[id]/page.tsx site/components/FichaDivindade.tsx site/test/fichadivindade.test.tsx
git commit -m "feat(fase2.4): FichaDivindade agrega expansão por lookup (retrato + símbolo atualizado + painel Em Deuses de Arton)"
```

### Task A5: Suporte a `linhagem` (navegação + índice)

**Contexto:** `linhagem` já está no enum; `mecanica` base é `z.record` (valida sem branch); o dispatcher tem fallback `<Ficha>` que já renderiza qualquer tipo. Falta só: mapear a área e listar no índice `/racas` (linhagens são heranças de raça em T20). **Não** criar componente novo (YAGNI).

**Files:**
- Modify: `site/lib/navegacao.ts` (TIPO_PARA_AREA ~linha 23)
- Modify: `site/app/racas/page.tsx` (incluir linhagens numa subseção)
- Test: `site/test/navegacao.test.ts`

- [ ] **Step 1: Teste que falha** — em `navegacao.test.ts`, no teste de `areaDoPath`, adicionar:
```ts
  expect(areaDoPath("/ficha/linhagem/abencoada")).toBe("racas");
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `npx vitest run test/navegacao.test.ts` → FALHA (`linhagem` não mapeada → retorna "").

- [ ] **Step 3: Implementar** — em `navegacao.ts`, em `TIPO_PARA_AREA`, após `raca: "racas",` adicionar:
```ts
  linhagem: "racas",
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `npx vitest run test/navegacao.test.ts` → PASS.

- [ ] **Step 5: Índice `/racas` lista linhagens** — em `site/app/racas/page.tsx`, após a listagem de raças, adicionar uma subseção que filtra `e.tipo === "linhagem"` (mesmo padrão visual `indice-cards`/`indice-lista` da página). Com 0 linhagens hoje, a seção não aparece (guard `if (linhagens.length === 0) return null`). Mostrar título "Linhagens (N)".

```tsx
// dentro do componente, após obter `entidades`:
const linhagens = entidades.filter((e) => e.tipo === "linhagem").sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
// ...no JSX, após a lista de raças:
{linhagens.length > 0 && (
  <section style={{ marginBottom: 8 }}>
    <h3 className="indice-grupo-titulo" style={{ fontSize: 14 }}>Linhagens ({linhagens.length})</h3>
    <div className="indice-lista">
      {linhagens.map((l) => (
        <Link key={l.id} href={`/ficha/linhagem/${l.id}`} className="indice-linha">
          <span className="indice-nome">{l.nome}</span>
          {l.resumo && <span className="indice-resumo">{l.resumo}</span>}
        </Link>
      ))}
    </div>
  </section>
)}
```
(Confirmar import de `Link` no arquivo; adicionar se faltar.)

- [ ] **Step 6: tsc + build + commit**

Run: `npx tsc --noEmit` → 0. Run: `npm run build` → verde.
```bash
git add site/lib/navegacao.ts site/app/racas/page.tsx site/test/navegacao.test.ts
git commit -m "feat(fase2.4): suporte a tipo linhagem (área racas + listagem no índice); render pelo Ficha genérico"
```

### Task A6: Spike ponta a ponta — Khalmyr

**Objetivo:** validar a agregação com dados reais de 1 deus antes do lote da Onda 1. Sem TDD (é extração); valida pelo build + dev server.

- [ ] **Step 1: Detectar offset** — achar a página impressa 172 (Khalmyr, Cap.3). Ex.: varrer PDF 172–176 procurando "Khalmyr" como título de seção de deus; registrar `offset = pdf - impressa`.
- [ ] **Step 2: Extrair** (seguindo Procedimento P) e criar:
  - `data/deuses-de-arton/divindades-expansao/khalmyr-deuses-de-arton.json` (tipo `divindade-expansao`, `expandeDivindade: "khalmyr"`, lore + blocos de devoto de Khalmyr de Cap.1 (Sacerdote/Paladino de Khalmyr) e Cap.3, `relacoes` → avatar; `imagens[0]` = retrato; `mecanica.simboloAtualizado` se houver símbolo novo).
  - `data/deuses-de-arton/criaturas/avatar-de-khalmyr.json` (tipo `criatura`, `relacoes` → `{ alvoTipo: "divindade", alvoId: "khalmyr" }`).
  - 1 artefato divino ligado a Khalmyr, se houver, em `data/deuses-de-arton/itens-magicos/<slug>.json` (tipo `item-magico`, `relacoes` → khalmyr).
- [ ] **Step 3: Arte** — extrair retrato (e símbolo novo, se houver) de Khalmyr em `site/public/divindades/khalmyr-retrato.png` (e `khalmyr-simbolo-da.png`).
- [ ] **Step 4: Validar** — `npm run build` verde (sem colisão de id: a expansão usa id `khalmyr-deuses-de-arton`, distinto do `khalmyr` do Básico). Subir dev server e conferir a ficha de Khalmyr: retrato, símbolo atualizado, painel "Em Deuses de Arton", link pro avatar.
- [ ] **Step 5: Commit + aprovação do usuário** antes de seguir pra Onda 1.

```bash
git add data/deuses-de-arton/ site/public/divindades/khalmyr-* 
git commit -m "feat(fase2.4): spike Khalmyr (expansão + avatar + arte) — valida agregação de divindade"
```

---

# ONDA 1 — Cap. 3 (Deuses e Avatares) [dados, Procedimento P]

> Offset já detectado na A6. Cada deus reúne lore de Cap.3 **e** os blocos de devoto de Cap.1 (Sacerdote/Druida/Paladino daquele deus) na sua `divindade-expansao`.

- [ ] **Spike de schema** já coberto pela A6 (divindade-expansao + criatura avatar + item-magico artefato). Confirmar que os 3 schemas cobrem os demais deuses no 1º deus do lote.
- [ ] **19 expansões restantes** (Aharadak, Allihanna, Arsenal, Azgher, Hyninn, Kallyadranoch, Lena, Lin-Wu, Marah, Megalokk, Nimb, Oceano, Sszzaas, Tanna-Toh, Tenebra, Thwor, Thyatis, Valkaria, Wynna): `divindade-expansao` com `expandeDivindade` = id do deus base, lore + devotos, `relacoes` → avatar/artefatos. Extrair em blocos (5–6 deuses por bloco), revisor por visão.
- [ ] **20 Avatares**: `criatura` cada, com bloco de stats completo, `relacoes` → divindade. Spike no 1º avatar p/ confirmar `CriaturaMecanicaSchema`.
- [ ] **Deuses Menores (impr. 228)** e **Os Antigos Deuses (impr. 238)**: novas entidades `divindade` (ids que NÃO colidam com os 20 do Básico; ex.: usar o nome próprio). Conferir se o `DivindadeMecanicaSchema` cobre (spike no 1º). Se forem entradas curtas sem todos os campos, avaliar omitir campos ou ajustar schema (campos opcionais) — decidir no spike.
- [ ] **Artefatos Divinos (impr. 246)**: `item-magico` (tipoItem "Artefato"), `relacoes` → deus quando aplicável. Spike no 1º.
- [ ] **Arte em lote**: retratos dos 20 deuses + símbolos atualizados (cor+smask) → `site/public/divindades/<deus>-retrato.png` / `<deus>-simbolo-da.png`. Spot-check por visão.
- [ ] **Índice `/deuses`**: ajustar o texto "— Livro Básico" (linha 47) para refletir multi-fonte; opcional mostrar selo/“+ Deuses de Arton” nos deuses com expansão. (Tarefa de código pequena; pode virar uma sub-tarefa TDD se mexer em teste de índice.)
- [ ] **Fechamento**: `tsc`/testes/build verdes; `PROGRESSO.md`; commit por bloco.

# ONDA 2 — Cap. 1 (Campeões dos Deuses) [dados, Procedimento P]

- [ ] **Frade** (`classe`): nova classe divina (20 níveis, habilidades, poderes). Spike confirmando `ClasseMecanicaSchema`.
- [ ] **Abençoada** (`linhagem`): 1ª entidade `linhagem` (renderiza pelo `Ficha` genérico; aparece em `/racas` via Task A5). `mecanica` livre (heranças/benefícios) — spike conferindo render.
- [ ] **Suraggel Variantes (impr. 36)**: poderes/heranças que estendem a raça `suraggel` → `poder` (grupo "raca", prerequisito citando suraggel/aggelus/sulfure) e/ou ajustes; aparecem na ficha de Suraggel via lookup existente (ALIASES_RACA já cobre).
- [ ] **Novos Poderes Concedidos (impr. 42)**: `poder` com `grupo` = nome do deus (aparecem na ficha do deus via lookup da A3 e nas classes divinas via lookup existente). Spike no 1º.
- [ ] **Equipamentos Religiosos (impr. 48–54)**: `item` (aventura/ferramentas/vestuário/esotéricos/alquímicos/alimentação/serviços/itens superiores) e **Itens Litúrgicos (impr. 55)** → `item` ou `item-magico` conforme natureza (decidir no spike). Dedup vs itens já existentes.
- [ ] **Magias Divinas (impr. 60)**: `magia` (tipo "divina"; custoPM por círculo). Spike conferindo `MagiaMecanicaSchema`.
- [ ] **Blocos de devoto que sobraram**: os "Sacerdote/Druida/Paladino de X" já foram anexados às `divindade-expansao` na Onda 1; aqui só conteúdo não específico de um deus (Ser Devoto, Classes Divinas, Autoridades Divinas, Outros Devotos) → `regra` se for regra geral.
- [ ] **Fechamento**: `tsc`/testes/build; `PROGRESSO.md`; commit por bloco.

# ONDA 3 — Cap. 2 (Distinções) [dados, Procedimento P]

- [ ] **~22 distinções** (tipo `distincao`, já existe — schema/Ficha/índice prontos): Bufão de Hyninn, Cavaleiro da Luz, Cavaleiro de Khalmyr, Colecionador Monstruoso, Dançarina de Marah, Detetive de Tanna-Toh, Exegeta do Akzath, Forjador Litúrgico, Guardião da Realidade, Herói Henshin, Improvisador de Lena, Inquisidor de Wynna, Numeromante, Pacificador, Pregador, Sombra de Tenebra, Sortudo de Nimb, Sumo-Sacerdote, Taumaturgista, Teurgista Hermético, Tibarita, Tirano do Terceiro. (Conferir contagem.)
- [ ] Spike no 1º (confirmar `DistincaoMecanicaSchema` — admissão/marca/poderes/benefício). Extrair em blocos de 6–8, revisor por visão.
- [ ] **Arte das distinções** (cor+smask em lote, como em Heróis) → `site/public/distincoes/` ou pasta usada hoje.
- [ ] **Fechamento**: `tsc`/testes/build; `PROGRESSO.md`; commit por bloco.

# ONDA 4 — Cap. 4 (Ameaças Divinas) [dados, Procedimento P]

> Bestiário por tema. **Dedup vs Básico/Ameaças** (Básico canônico): pular reprints; mesclar temas homônimos por selo. `criatura` (schema/Ficha prontos).

- [ ] **Spike** no 1º monstro (confirmar `CriaturaMecanicaSchema`).
- [ ] **Abissais (252)**, **Aspectos dos Deuses (264)**, **Celestiais (274)**, **Fadas (286)**, **Gênios (298)**, **Gigantes (306)** — extrair por tema em blocos; revisor por visão; pular reprints (conferir nomes vs Básico/Ameaças).
- [ ] **Perigos Complexos (316)** → `regra` (perigos/armadilhas, como no Básico/Ameaças).
- [ ] **Tabela de Ameaças por ND (319)** → `regra` (tabela pipe).
- [ ] **Raças jogáveis novas** (se houver alguma fada/gênio/gigante jogável) → `raca`, cruzada com a criatura.
- [ ] **Arte** das criaturas com figura própria (cor+smask) → `site/public/criaturas/` (ou pasta usada hoje).
- [ ] **Fechamento da fase**: `tsc`/testes/build; `PROGRESSO.md` com totais finais do livro; decidir push/PR com o usuário.

---

## Self-review (cobertura do spec)

- Opção A (agregação por lookup, Básico intacto) → Tasks A1, A3, A4 + Onda 1 (ids `<deus>-deuses-de-arton`). ✔
- Retrato + símbolo atualizado → Task A4 (regra `simboloAtualizado ?? imagens[0]`) + arte na Onda 1/A6. ✔
- Devoto packages na ficha do deus (Opção A) → anexados à `divindade-expansao` (A6 spike + Onda 1). ✔
- Avatar → `criatura` ligada por relacoes; lookup em A3; exibida em A4. ✔
- Poderes concedidos novos → `poder` grupo=deus; lookup A3 (ficha do deus) + lookup existente (classes). ✔
- Artefatos → `item-magico`; lookup A3. ✔
- Frade → `classe` (Onda 2). ✔  Abençoada → `linhagem` (Task A5 wiring + Onda 2 dado). ✔
- Suraggel variantes → reusa lookup de raça (ALIASES_RACA já cobre). ✔
- Magias divinas / equipamentos litúrgicos / distinções → Ondas 2 e 3 (tipos existentes). ✔
- Cap.4 bestiário + dedup → Onda 4. ✔
- Spike de schema por tipo antes de cada lote → Procedimento P + chamadas explícitas. ✔
- DoD (tsc/testes/build; tipos novos testados; PROGRESSO) → fechamentos + Tasks A1–A5 com testes. ✔
