# Guerreiro (Classe) Spike — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Levar a classe **Guerreiro** ponta a ponta — `ClasseMecanicaSchema` validado, `FichaClasse` dedicada no tema "Tomo de Arton", Guerreiro extraído por visão (2 passadas) com tabela de progressão e habilidades/poderes, na busca, build estático verde.

**Architecture:** Reusa o pipeline das Raças. Schema Zod ganha um tipo de mecânica de classe (validado via `superRefine` quando `tipo==="classe"`). A rota de ficha despacha para `FichaClasse`. Extração: render+texto (poppler) lido por um agente com visão, estruturado em JSON, validado por uma 2ª passada independente.

**Tech Stack:** Next.js 16 (App Router) + TS + Zod v4 + Vitest/Testing Library; poppler + `sharp` (extração/imagem). Export estático já ativo.

**Spec:** `docs/superpowers/specs/2026-05-29-guerreiro-classe-spike-design.md`.

---

## Convenções
- Raiz: `C:\Users\ASCalderon\Desktop\compendium tormenta 20`. Comandos de site em `site/`. Node no PATH: PowerShell `$env:Path += ";C:\Program Files\nodejs"`; Bash `export PATH="$PATH:/c/Program Files/nodejs"`. Aspas em caminhos com espaço.
- **Commit caminhos específicos, nunca `git add -A`. Sem push.** `extracao/cache/` é gitignored.
- poppler: `C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin` (env `POPPLER_BIN`). PDF: `pdfs/T20 - Livro Básico.pdf`.
- **Nunca inventar dados.** Typos óbvios do livro podem ser corrigidos. Tokens do tema (`--carmesim`, `--vermelho`, `--ouro`, `--borda`, `--pergaminho-1/2`, `--pergaminho-stat`, `--tinta`, `--tinta-suave`, `--serifa`, `--font-tormenta`) já existem.

---

## Task 1: ClasseMecanicaSchema + validação por tipo

**Files:**
- Modify: `site/lib/schema.ts`
- Test: `site/test/schema.test.ts`

- [ ] **Step 1: Escrever os testes (vermelho)** — adicionar ao fim de `site/test/schema.test.ts`:
```ts
import { ClasseMecanicaSchema } from "@/lib/schema";

const classeValida = {
  id: "guerreiro", tipo: "classe", nome: "Guerreiro", resumo: "Mestre das armas.",
  fonte: { livro: "livro-basico", pagina: 33 },
  imagens: [], secoes: [], relacoes: [],
  mecanica: {
    atributoChave: "Força", pvInicial: 20, pvPorNivel: 5, pmPorNivel: 3,
    pericias: { quantidade: 2, fixas: ["Luta"], lista: [], texto: "Duas perícias a sua escolha." },
    proficiencias: ["armas marciais", "escudos", "armaduras pesadas"],
    progressao: [{ nivel: 1, habilidades: ["Aptidão de Combate"] }],
    habilidades: [{ nome: "Aptidão de Combate", nivel: 1, descricao: "Você recebe um poder de combate." }],
    poderes: [{ nome: "Ataque Especial", descricao: "Gaste PM para ampliar um ataque." }],
  },
};

test("ClasseMecanicaSchema aceita uma classe válida", () => {
  expect(() => ClasseMecanicaSchema.parse(classeValida.mecanica)).not.toThrow();
});

test("entidade tipo classe aceita mecânica de classe válida", () => {
  expect(() => EntidadeSchema.parse(classeValida)).not.toThrow();
});

test("entidade tipo classe rejeita mecânica sem atributoChave", () => {
  const { atributoChave, ...semChave } = classeValida.mecanica;
  expect(() => EntidadeSchema.parse({ ...classeValida, mecanica: semChave })).toThrow();
});

test("ClasseMecanicaSchema rejeita nível de progressão fora de 1–20", () => {
  const ruim = { ...classeValida.mecanica, progressao: [{ nivel: 21, habilidades: [] }] };
  expect(() => ClasseMecanicaSchema.parse(ruim)).toThrow();
});
```
(`EntidadeSchema` já é importado no topo do arquivo de teste.)

- [ ] **Step 2: Rodar (vermelho)** — Run (em `site/`): `npm test -- schema` → FAIL (`ClasseMecanicaSchema` não existe).

- [ ] **Step 3: Implementar** — em `site/lib/schema.ts`, **antes** de `export const EntidadeSchema`, inserir:
```ts
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

export const PoderClasseSchema = z.object({
  nome: z.string(),
  descricao: z.string(),
  prerequisito: z.string().optional(),
  custo: z.string().optional(),
});
export type PoderClasse = z.infer<typeof PoderClasseSchema>;

export const PericiasClasseSchema = z.object({
  quantidade: z.number().int().min(0),
  fixas: z.array(z.string()).default([]),
  lista: z.array(z.string()).default([]),
  texto: z.string(),
});
export type PericiasClasse = z.infer<typeof PericiasClasseSchema>;

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
});
export type ClasseMecanica = z.infer<typeof ClasseMecanicaSchema>;
```
E substituir o bloco `.superRefine(...)` do `EntidadeSchema` por (acrescentando o ramo de classe):
```ts
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
    }
  });
```

- [ ] **Step 4: Rodar (verde)** — `npm test -- schema` → PASS; depois `npm test` (suíte completa) → tudo verde (35 + 4 novos = 39).

- [ ] **Step 5: Commit**
```bash
git add site/lib/schema.ts site/test/schema.test.ts
git commit -m "feat(schema): mecânica estruturada de Classe com validação Zod por tipo"
```

---

## Task 2: FichaClasse + rota + teste

Componente já pode ser testado com um Guerreiro sintético (não depende da extração).

**Files:**
- Create: `site/components/FichaClasse.tsx`
- Modify: `site/app/ficha/[tipo]/[id]/page.tsx`
- Test: `site/test/fichaclasse.test.tsx`

- [ ] **Step 1: Escrever o teste (vermelho)** — Create `site/test/fichaclasse.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { FichaClasse } from "@/components/FichaClasse";
import { construirRegistro } from "@/lib/autolink";
import type { Entidade } from "@/lib/schema";

const registro = construirRegistro({ termos: [], entidades: [] });

const guerreiro = {
  id: "guerreiro", tipo: "classe", nome: "Guerreiro", resumo: "Mestre das armas de Arton.",
  fonte: { livro: "livro-basico", pagina: 33 }, imagens: ["/classes/guerreiro.png"],
  secoes: [{ titulo: "Descrição", texto: "Especialista em combate." }], relacoes: [],
  mecanica: {
    atributoChave: "Força", pvInicial: 20, pvPorNivel: 5, pmPorNivel: 3,
    pericias: { quantidade: 2, fixas: ["Luta"], lista: [], texto: "Duas perícias a sua escolha." },
    proficiencias: ["armas marciais", "escudos"],
    progressao: [{ nivel: 1, habilidades: ["Aptidão de Combate"] }, { nivel: 2, habilidades: ["Poder de Guerreiro"] }],
    habilidades: [{ nome: "Aptidão de Combate", nivel: 1, descricao: "Você recebe um poder de combate." }],
    poderes: [{ nome: "Ataque Especial", descricao: "Gaste PM para ampliar um ataque." }],
  },
} as unknown as Entidade;

test("FichaClasse exibe nome, atributo-chave, PV e uma habilidade", () => {
  render(<FichaClasse entidade={guerreiro} registro={registro} descricoes={{}} />);
  expect(screen.getByText("Guerreiro")).toBeInTheDocument();
  expect(screen.getByText("Força")).toBeInTheDocument();
  expect(screen.getByText("20")).toBeInTheDocument();
  expect(screen.getByText("Aptidão de Combate")).toBeInTheDocument();
});

test("FichaClasse mostra a tabela de progressão (nível 2) e a ilustração", () => {
  render(<FichaClasse entidade={guerreiro} registro={registro} descricoes={{}} />);
  expect(screen.getByText("Poder de Guerreiro")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /Ilustração de Guerreiro/ })).toHaveAttribute("src", "/classes/guerreiro.png");
});
```

- [ ] **Step 2: Rodar (vermelho)** — `npm test -- fichaclasse` → FAIL (componente não existe).

- [ ] **Step 3: Implementar `FichaClasse`** — Create `site/components/FichaClasse.tsx`:
```tsx
import type { Entidade, ClasseMecanica } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 8px" };

function StatBox({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <span style={{ textAlign: "center", background: "var(--pergaminho-stat)", border: "1px solid var(--borda)", borderRadius: 10, padding: "8px 14px" }}>
      <span style={{ display: "block", fontFamily: "var(--serifa)", fontSize: 18, color: "var(--carmesim)", fontWeight: 800 }}>{valor}</span>
      <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--tinta-suave)" }}>{rotulo}</span>
    </span>
  );
}

function Chips({ itens }: { itens: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
      {itens.map((t, i) => (
        <span key={i} style={{ fontFamily: "var(--serifa)", fontSize: 13, color: "var(--carmesim)", padding: "3px 10px", borderRadius: 8, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)" }}>{t}</span>
      ))}
    </div>
  );
}

export function FichaClasse({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as unknown as ClasseMecanica;
  const imagem = entidade.imagens[0];
  return (
    <article style={{ maxWidth: 820, margin: "0 auto", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.6)" }}>
      <header style={{ background: "radial-gradient(120% 140% at 50% 0%, #6a1421 0%, transparent 70%), linear-gradient(180deg,#4a0f18,#320a11)", padding: "20px 24px 14px", textAlign: "center", borderBottom: "2px solid var(--borda)" }}>
        <div style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700 }}>Classe</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 50, margin: "4px 0 0", lineHeight: 1 }}>{entidade.nome}</h1>
        <Divisor />
      </header>

      <div style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", color: "var(--tinta)" }}>
        {entidade.resumo && (
          <p style={{ fontFamily: "var(--serifa)", fontStyle: "italic", color: "var(--tinta-suave)", maxWidth: 620, margin: "0 auto", padding: "16px 24px 0", lineHeight: 1.55, textAlign: "center" }}>{entidade.resumo}</p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, padding: "18px 22px 8px" }}>
          {imagem && (
            <div style={{ flex: "1 1 240px", minWidth: 220, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagem} alt={`Ilustração de ${entidade.nome}`} style={{ width: "100%", maxWidth: 300, height: "auto", filter: "drop-shadow(0 8px 18px rgba(60,30,10,.4))" }} />
            </div>
          )}
          <div style={{ flex: "2 1 360px", minWidth: 300 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <StatBox valor={m.atributoChave} rotulo="Atributo-chave" />
              <StatBox valor={String(m.pvInicial)} rotulo="PV inicial" />
              <StatBox valor={`+${m.pvPorNivel}`} rotulo="PV / nível" />
              <StatBox valor={`+${m.pmPorNivel}`} rotulo="PM / nível" />
            </div>
            <section style={{ marginBottom: 12 }}>
              <h2 style={h2}>Perícias</h2>
              <p style={{ fontFamily: "var(--serifa)", lineHeight: 1.55, margin: "0 0 4px" }}>{m.pericias.texto}</p>
              {m.pericias.fixas.length > 0 && <Chips itens={m.pericias.fixas} />}
            </section>
            {m.proficiencias.length > 0 && (
              <section>
                <h2 style={h2}>Proficiências</h2>
                <Chips itens={m.proficiencias} />
              </section>
            )}
          </div>
        </div>

        <div style={{ padding: "8px 24px 22px" }}>
          {m.progressao.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Progressão (1º–20º nível)</h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--serifa)", fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--carmesim)", borderBottom: "2px solid var(--borda)", width: 64 }}>Nível</th>
                    <th style={{ textAlign: "left", padding: "6px 8px", color: "var(--carmesim)", borderBottom: "2px solid var(--borda)" }}>Habilidades</th>
                  </tr>
                </thead>
                <tbody>
                  {m.progressao.map((p) => (
                    <tr key={p.nivel}>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--borda)", fontWeight: 700, color: "var(--carmesim)" }}>{p.nivel}º</td>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid var(--borda)" }}>{p.habilidades.join(", ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          {m.habilidades.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Habilidades de Classe</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {m.habilidades.map((h, i) => (
                  <div key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--carmesim)", fontWeight: 800 }}>{h.nome}{h.nivel ? ` (${h.nivel}º)` : ""}{h.custo ? ` — ${h.custo}` : ""}.</span>{" "}
                    <TextoRico texto={h.descricao} registro={registro} descricoes={descricoes} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {m.poderes.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Poderes de Classe</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {m.poderes.map((p, i) => (
                  <div key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.6 }}>
                    <span style={{ color: "var(--carmesim)", fontWeight: 800 }}>{p.nome}{p.prerequisito ? ` (${p.prerequisito})` : ""}.</span>{" "}
                    <TextoRico texto={p.descricao} registro={registro} descricoes={descricoes} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {entidade.secoes.map((s, i) => (
            <section key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.7, marginBottom: 12 }}>
              <h2 style={h2}>{s.titulo}</h2>
              <p><TextoRico texto={s.texto} registro={registro} descricoes={descricoes} /></p>
            </section>
          ))}
          {entidade.relacoes.length > 0 && (
            <section>
              <h2 style={h2}>Relações</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {entidade.relacoes.map((r, i) => (
                  <span key={i} style={{ fontSize: 11, padding: "4px 11px", borderRadius: 20, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)" }}>
                    <LinkEntidade alvoId={r.alvoId} alvoTipo={r.alvoTipo} rotulo={r.rotulo} />
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Despachar na rota** — em `site/app/ficha/[tipo]/[id]/page.tsx`: adicionar o import `import { FichaClasse } from "@/components/FichaClasse";` (junto dos outros imports) e trocar o bloco de renderização por:
```tsx
      {entidade.tipo === "raca" ? (
        <FichaRaca entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : entidade.tipo === "classe" ? (
        <FichaClasse entidade={entidade} registro={registro} descricoes={descricoes} />
      ) : (
        <Ficha entidade={entidade} registro={registro} descricoes={descricoes} />
      )}
```

- [ ] **Step 5: Rodar (verde)** — `npm test -- fichaclasse` → PASS (2 testes); depois `npm test` → tudo verde.

- [ ] **Step 6: Commit**
```bash
git add site/components/FichaClasse.tsx "site/app/ficha/" site/test/fichaclasse.test.tsx
git commit -m "feat(fichaclasse): ficha de classe dedicada (stats, progressão, habilidades, poderes)"
```

---

## Task 3: Descoberta das páginas do Guerreiro

**Files:**
- Create: `docs/superpowers/plans/guerreiro-paginas.md`

- [ ] **Step 1: Texto completo (reuso)** — se `extracao/cache/basico-full.txt` não existir, gerar (em `extracao/`, Bash):
```bash
export POPPLER_BIN="C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin"
"$POPPLER_BIN/pdftotext.exe" -layout -enc UTF-8 "../pdfs/T20 - Livro Básico.pdf" cache/basico-full.txt
```

- [ ] **Step 2: Localizar e confirmar** — achar o capítulo de Classes e o início do **Guerreiro** no texto; renderizar as páginas candidatas (`pdftoppm -f P -l P -png -r 150 ... cache/disc/p`) e **ler as imagens** para delimitar onde começa e termina a entrada do Guerreiro (a classe ocupa várias páginas: flavor + bloco mecânico + tabela de progressão + habilidades + poderes). Confirmar a página impressa pelo rodapé (lembrar offset PDF=impressa+6 observado nas Raças, mas **confirmar** para o capítulo de Classes). Anotar em `docs/superpowers/plans/guerreiro-paginas.md`: intervalo de páginas PDF e impressas, onde está a Tabela de progressão, onde está a lista de Poderes de Guerreiro, e se há quadros/sidebars.

- [ ] **Step 3: Commit**
```bash
git add docs/superpowers/plans/guerreiro-paginas.md
git commit -m "docs(guerreiro): mapa de páginas do Guerreiro para extração"
```

---

## Task 4: Extração do Guerreiro (visão, 2 passadas)

**Files:**
- Create: `data/livro-basico/classes/guerreiro.json`
- Create: `site/public/classes/guerreiro.png`

- [ ] **Passada 1 — estruturação:** com as páginas do mapa (Task 3), renderizar (PNG 150 dpi) + `pdftotext -layout`, **ler imagem+texto** e preencher `data/livro-basico/classes/guerreiro.json` conforme o `ClasseMecanicaSchema` (Task 1):
  - `id:"guerreiro"`, `tipo:"classe"`, `nome:"Guerreiro"`, `resumo`, `fonte {livro:"livro-basico", pagina:<impressa do início>}`, `secoes[]` (flavor fiel), `relacoes[]` (se citar entidades).
  - `mecanica`: `atributoChave`, `pvInicial`, `pvPorNivel`, `pmPorNivel` (números do bloco), `pericias {quantidade, fixas[], lista[], texto}` (texto fiel + forma estruturada), `proficiencias[]`, **`progressao` (tabela 1–20 completa — todos os 20 níveis, com os nomes das habilidades por nível)**, `habilidades[]` (cada habilidade de classe: nome, nível, descrição fiel, custo/prereq quando houver, `efeito` opcional), `poderes[]` (todos os poderes de Guerreiro: nome + descrição + prereq/custo).
  - **Capturar a tabela e TODAS as habilidades/poderes; não inventar.**
- [ ] **Ilustração:** extrair imagens da(s) página(s) (`pdfimages -f P -l P -list`/`-png`), identificar a figura do Guerreiro via leitura, compor com `comporComMascara` (`extracao/src/imagens.ts`) — rodar de dentro de `extracao/`: `npx tsx -e "import {comporComMascara} from './src/imagens.ts'; await comporComMascara('cache/.../cor.png','cache/.../mask.png','../site/public/classes/guerreiro.png')"` (criar a pasta `site/public/classes/` antes). Setar `imagens:["/classes/guerreiro.png"]`. Sem máscara → converter com sharp.
- [ ] **Passada 2 — validação independente:** reler as páginas contra o JSON — tabela 1–20 completa, habilidades e poderes presentes e fiéis, números (PV/PM/perícias/proficiências) corretos, proveniência correta, grafia fiel. Corrigir até completo.
- [ ] **Verificação:** Run (em `site/`): `npm test` → verde (o carregador valida `guerreiro.json` contra o schema via `superRefine`; se falhar, corrigir o dado).
- [ ] **Commit:**
```bash
git add data/livro-basico/classes/ site/public/classes/
git commit -m "feat(classes): extrai Guerreiro (visão 2 passadas, validado)"
```

---

## Task 5: Tooltips citados no Guerreiro (proveniência)

**Files:**
- Modify: `data/referencia/glossario.json` e/ou `data/referencia/condicoes.json`

- [ ] **Step 1:** Levantar os termos de regra citados nos textos do Guerreiro (habilidades/poderes/seções) que **ainda não existem** em `data/referencia/` (ex.: nomes de perícias de combate, termos como "ação", "agredir", "maestria", "crítico" — apenas os que aparecem). Para cada um sem definição, localizar no Livro Básico via `pdftotext`/visão e adicionar ao arquivo apropriado seguindo o `TermoSchema` `{ id, nome, descricao, fonte:{livro,pagina} }`, **fiel ao livro**. Reusar os já existentes; não duplicar ids. Se não achar a definição, não inventar — deixar de fora.
- [ ] **Step 2:** Run (em `site/`): `npm test` → verde (`seed.test` valida `TermoSchema`).
- [ ] **Step 3: Commit**
```bash
git add data/referencia/glossario.json data/referencia/condicoes.json
git commit -m "feat(referencia): termos citados no Guerreiro com proveniência"
```

---

## Task 6: Integração final

- [ ] **Step 1: Suíte + build** — Run (em `site/`): `npm test` → verde; `npm run build` → conclui e gera `out/ficha/classe/guerreiro` (a classe entra em `generateStaticParams`).
- [ ] **Step 2: Conferência** — `npm run dev` → abrir `/ficha/classe/guerreiro` (faixa de título; stats; **tabela de progressão 1–20**; habilidades e poderes; tooltips; ilustração) e buscar "guerreiro" na home. Encerrar o dev.
- [ ] **Step 3: PROGRESSO** — registrar o spike do Guerreiro como concluído e apontar a decisão da próxima fatia (demais classes). Commit:
```bash
git add PROGRESSO.md
git commit -m "docs: spike do Guerreiro concluído; decidir plano das demais classes"
```

---

## Encerramento

Ao fim: `ClasseMecanicaSchema` validado, `FichaClasse` no tema Tomo com tabela de progressão, Guerreiro extraído e validado (2 passadas), busca e build estático OK. Em seguida, revisar o Guerreiro e planejar as demais classes do Livro Básico (mesmo pipeline; estender o schema para conjuradores quando necessário).
