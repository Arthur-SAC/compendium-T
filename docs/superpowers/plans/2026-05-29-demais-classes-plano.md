# Demais Classes do Livro Básico — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar a categoria **Classes** do Livro Básico — extrair as ~13 classes restantes (visão, 2 passadas), estender o schema para conjuradores (`conjuracao` + `caminhos`), exibi-las na `FichaClasse`, e adicionar o índice `/classes` — com build estático verde.

**Architecture:** Reusa o pipeline do spike do Guerreiro. Schema ganha campos opcionais aditivos (não quebram marciais). `FichaClasse` ganha render de conjuração/caminhos. Extração em blocos (marciais → conjuradoras), cada bloco com validação independente.

**Tech Stack:** Next.js 16 + TS + Zod v4 + Vitest/Testing Library; poppler + `sharp`; export estático.

**Spec:** `docs/superpowers/specs/2026-05-29-demais-classes-design.md`.

---

## Convenções
- Raiz: `C:\Users\ASCalderon\Desktop\compendium tormenta 20`. Comandos de site em `site/`. Node no PATH: PowerShell `$env:Path += ";C:\Program Files\nodejs"`; Bash `export PATH="$PATH:/c/Program Files/nodejs"`. Aspas em caminhos com espaço.
- **Commit caminhos específicos, nunca `git add -A`. Sem push.** `extracao/cache/` gitignored.
- poppler: `C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin` (`POPPLER_BIN`). PDF: `pdfs/T20 - Livro Básico.pdf`.
- **Nunca inventar dados.** Typos óbvios do livro podem ser corrigidos. **Editou JSON em `data/`? o dev server precisa reiniciar** (carregador memoizado).
- Tokens do tema e helpers (`comporComMascara`, `caminhoImagemRaca`) já existem. As ilustrações de classe vão para `site/public/classes/<slug>.png`.

---

## Task 1: Estender o schema (conjuração + caminhos)

**Files:**
- Modify: `site/lib/schema.ts`
- Test: `site/test/schema.test.ts`

- [ ] **Step 1: Testes (vermelho)** — adicionar ao fim de `site/test/schema.test.ts`:
```ts
import { CaminhoClasseSchema } from "@/lib/schema";

const conjuradoraMec = {
  atributoChave: "Inteligência", pvInicial: 12, pvPorNivel: 3, pmPorNivel: 6,
  pericias: { quantidade: 4, fixas: [], lista: [], texto: "Quatro perícias a sua escolha." },
  proficiencias: ["armas simples"],
  progressao: [{ nivel: 1, habilidades: ["Caminho", "Magias"] }],
  habilidades: [{ nome: "Magias", descricao: "Você aprende e lança magias arcanas." }],
  poderes: [],
  conjuracao: { tipo: "Arcana", atributoChave: "Inteligência", descricao: "Conjura magias arcanas." },
  caminhos: [{ nome: "Mago", descricao: "Estudioso da magia.", habilidades: [{ nome: "Magia Especialista", descricao: "..." }] }],
};

test("ClasseMecanicaSchema aceita classe conjuradora (conjuracao + caminhos)", () => {
  expect(() => ClasseMecanicaSchema.parse(conjuradoraMec)).not.toThrow();
});

test("ClasseMecanicaSchema: marcial continua válida sem conjuracao/caminhos", () => {
  const marcial = {
    atributoChave: "Força", pvInicial: 20, pvPorNivel: 5, pmPorNivel: 3,
    pericias: { quantidade: 2, fixas: [], lista: [], texto: "x" },
    proficiencias: [], progressao: [], habilidades: [], poderes: [],
  };
  expect(() => ClasseMecanicaSchema.parse(marcial)).not.toThrow();
});

test("CaminhoClasseSchema exige nome e descricao", () => {
  expect(() => CaminhoClasseSchema.parse({ nome: "Bruxo" })).toThrow();
});
```
(`ClasseMecanicaSchema` já é importado no topo do arquivo.)

- [ ] **Step 2: Rodar (vermelho)** — Run (em `site/`): `npm test -- schema` → FAIL (`CaminhoClasseSchema` não existe / campos ausentes).

- [ ] **Step 3: Implementar** — em `site/lib/schema.ts`, **antes** de `export const ClasseMecanicaSchema`, inserir:
```ts
export const ConjuracaoSchema = z.object({
  tipo: z.string(),
  atributoChave: z.string(),
  descricao: z.string().optional(),
});
export type Conjuracao = z.infer<typeof ConjuracaoSchema>;

export const CaminhoClasseSchema = z.object({
  nome: z.string(),
  descricao: z.string(),
  habilidades: z.array(HabilidadeClasseSchema).default([]),
});
export type CaminhoClasse = z.infer<typeof CaminhoClasseSchema>;
```
E adicionar dois campos ao objeto `ClasseMecanicaSchema` (logo após a linha `poderes: z.array(PoderClasseSchema).default([]),`):
```ts
  conjuracao: ConjuracaoSchema.optional(),
  caminhos: z.array(CaminhoClasseSchema).default([]),
```

- [ ] **Step 4: Rodar (verde)** — `npm test -- schema` → PASS; depois `npm test` (suíte completa) → tudo verde (eram 41; +3 novos = 44). Confirme que os casos de Raça e do Guerreiro seguem passando.

- [ ] **Step 5: Commit**
```bash
git add site/lib/schema.ts site/test/schema.test.ts
git commit -m "feat(schema): conjuracao e caminhos (opcionais) na mecânica de Classe"
```

---

## Task 2: FichaClasse — render de Conjuração e Caminhos

**Files:**
- Modify: `site/components/FichaClasse.tsx`
- Test: `site/test/fichaclasse.test.tsx`

- [ ] **Step 1: Teste (vermelho)** — adicionar ao fim de `site/test/fichaclasse.test.tsx`:
```tsx
const arcanista = {
  id: "arcanista", tipo: "classe", nome: "Arcanista", resumo: "Conjurador arcano.",
  fonte: { livro: "livro-basico", pagina: 33 }, imagens: [],
  secoes: [], relacoes: [],
  mecanica: {
    atributoChave: "Inteligência", pvInicial: 12, pvPorNivel: 3, pmPorNivel: 6,
    pericias: { quantidade: 4, fixas: [], lista: [], texto: "Quatro perícias a sua escolha." },
    proficiencias: ["armas simples"],
    progressao: [{ nivel: 1, habilidades: ["Magias", "Caminho"] }],
    habilidades: [{ nome: "Magias", descricao: "Você lança magias arcanas." }],
    poderes: [],
    conjuracao: { tipo: "Arcana", atributoChave: "Inteligência", descricao: "Conjura magias arcanas." },
    caminhos: [{ nome: "Mago", descricao: "Estudioso da magia.", habilidades: [{ nome: "Magia Especialista", descricao: "Escolhe uma escola." }] }],
  },
} as unknown as Entidade;

test("FichaClasse mostra conjuração e caminhos quando presentes", () => {
  render(<FichaClasse entidade={arcanista} registro={registro} descricoes={{}} />);
  expect(screen.getByText("Conjuração")).toBeInTheDocument();
  expect(screen.getByText("Arcana")).toBeInTheDocument();
  expect(screen.getByText("Caminhos")).toBeInTheDocument();
  expect(screen.getByText("Mago")).toBeInTheDocument();
  expect(screen.getByText(/Magia Especialista/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Rodar (vermelho)** — `npm test -- fichaclasse` → FAIL (não renderiza Conjuração/Caminhos).

- [ ] **Step 3: Implementar** — em `site/components/FichaClasse.tsx`:

(a) No topo, ampliar o import de tipos para incluir `CaminhoClasse`:
```tsx
import type { Entidade, ClasseMecanica, ProgressaoNivel, EfeitoPoder } from "@/lib/schema";
```
não precisa mudar (os tipos de conjuração/caminho são acessados via `m`). 

(b) **Conjuração** — na coluna direita, logo APÓS o bloco de Proficiências (`{m.proficiencias.length > 0 && ( ... )}`) e ANTES de `{secaoPVMana && (`, inserir:
```tsx
            {m.conjuracao && (
              <section style={{ marginBottom: 12 }}>
                <h2 style={h2}>Conjuração</h2>
                <p style={{ fontFamily: "var(--serifa)", lineHeight: 1.55, margin: 0 }}>
                  <strong style={{ color: "var(--carmesim)" }}>{m.conjuracao.tipo}</strong>
                  {" · atributo-chave "}
                  <strong style={{ color: "var(--carmesim)" }}>{m.conjuracao.atributoChave}</strong>
                  {m.conjuracao.descricao ? <>. <TextoRico texto={m.conjuracao.descricao} registro={registro} descricoes={descricoes} /></> : null}
                </p>
              </section>
            )}
```

(c) **Caminhos** — na área de largura total, APÓS o bloco de Poderes (`{m.poderes.length > 0 && ( ... )}`) e ANTES de `{outrasSecoes.map(`, inserir:
```tsx
          {m.caminhos && m.caminhos.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <h2 style={h2}>Caminhos</h2>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {m.caminhos.map((c, i) => (
                  <div key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.6, padding: "10px 0", borderBottom: i < m.caminhos.length - 1 ? "1px solid var(--borda)" : "none" }}>
                    <div style={{ color: "var(--carmesim)", fontWeight: 800, fontSize: 16 }}>{c.nome}</div>
                    <div style={{ marginTop: 2 }}><TextoRico texto={c.descricao} registro={registro} descricoes={descricoes} /></div>
                    {c.habilidades.length > 0 && (
                      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                        {c.habilidades.map((h, j) => (
                          <div key={j}>
                            <span style={{ color: "var(--carmesim)", fontWeight: 800 }}>{h.nome}{h.nivel ? ` (${h.nivel}º)` : ""}{h.custo ? ` — ${h.custo}` : ""}.</span>{" "}
                            <TextoRico texto={h.descricao} registro={registro} descricoes={descricoes} />
                            {h.prerequisito && <PreRequisito texto={h.prerequisito} />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
```

- [ ] **Step 4: Rodar (verde)** — `npm test -- fichaclasse` → PASS (3 testes: os 2 antigos + 1 novo). Rode `npx tsc --noEmit` (exit 0) e `npm test` (44 verde).

- [ ] **Step 5: Commit**
```bash
git add site/components/FichaClasse.tsx site/test/fichaclasse.test.tsx
git commit -m "feat(fichaclasse): render de Conjuração e Caminhos (conjuradoras)"
```

---

## Task 3: Índice /classes + atalho na home

**Files:**
- Create: `site/app/classes/page.tsx`
- Modify: `site/app/page.tsx`
- Test: `site/test/classes-indice.test.tsx`

- [ ] **Step 1: Teste (vermelho)** — Create `site/test/classes-indice.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import IndiceClasses from "@/app/classes/page";

test("índice de classes lista o Guerreiro com link para a ficha", () => {
  render(<IndiceClasses />);
  const link = screen.getByRole("link", { name: /Guerreiro/ });
  expect(link).toHaveAttribute("href", "/ficha/classe/guerreiro");
});
```

- [ ] **Step 2: Rodar (vermelho)** — `npm test -- classes-indice` → FAIL (página não existe).

- [ ] **Step 3: Implementar índice** — Create `site/app/classes/page.tsx`:
```tsx
import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";

export default function IndiceClasses() {
  const classes = carregarEntidades()
    .filter((e) => e.tipo === "classe")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <main style={{ padding: 48, maxWidth: 980, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Classes de Arton</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>
        {classes.length} {classes.length === 1 ? "classe" : "classes"} do Livro Básico
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {classes.map((r) => {
          const imagem = r.imagens[0];
          return (
            <Link
              key={r.id}
              href={`/ficha/classe/${r.id}`}
              style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--tinta)", background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", border: "2px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
            >
              <div style={{ height: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "radial-gradient(120% 90% at 50% 10%, rgba(155,28,46,.10), transparent 70%)" }}>
                {imagem && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagem} alt={r.nome} style={{ maxHeight: 196, maxWidth: "90%", filter: "drop-shadow(0 8px 16px rgba(60,30,10,.45))" }} />
                )}
              </div>
              <div style={{ padding: "12px 14px", borderTop: "1px solid var(--borda)" }}>
                <strong style={{ fontFamily: "var(--font-tormenta), var(--serifa)", color: "var(--carmesim)", fontSize: 22, letterSpacing: ".5px" }}>{r.nome}</strong>
                <p style={{ fontFamily: "var(--serifa)", fontSize: 12.5, color: "var(--tinta-suave)", lineHeight: 1.45, margin: "4px 0 0" }}>{r.resumo}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Atalho na home** — em `site/app/page.tsx`, substituir o bloco do atalho de raças por dois atalhos:
```tsx
      <div style={{ textAlign: "center", marginTop: 28, display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/racas" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Ver todas as raças →
        </Link>
        <Link href="/classes" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Ver todas as classes →
        </Link>
      </div>
```
(O `Link` já é importado na home.)

- [ ] **Step 5: Rodar (verde)** — `npm test -- classes-indice` → PASS; `npm test` → 44 verde; `npm run build` → gera `/classes`.

- [ ] **Step 6: Commit**
```bash
git add "site/app/classes/" site/app/page.tsx site/test/classes-indice.test.tsx
git commit -m "feat(classes): índice /classes (estilo Tomo) + atalho na home"
```

---

## Task 4: Descoberta das páginas das classes

**Files:**
- Create: `docs/superpowers/plans/classes-paginas.md`

- [ ] **Step 1: Texto completo (reuso)** — se `extracao/cache/basico-full.txt` não existir, gerar (em `extracao/`): `"$POPPLER_BIN/pdftotext.exe" -layout -enc UTF-8 "../pdfs/T20 - Livro Básico.pdf" cache/basico-full.txt`.

- [ ] **Step 2: Mapear cada classe** — o capítulo de Classes começa por volta da **PDF 38** (impressa 32); o Guerreiro está em **PDF 70–72** (impressas 64–66), offset **PDF = impressa + 6**. Para CADA classe restante (Arcanista, Bárbaro, Bardo, Bucaneiro, Caçador, Cavaleiro, Clérigo, Druida, Inventor, Ladino, Lutador, Nobre, Paladino): achar o título no texto, **renderizar as páginas candidatas** (`pdftoppm -f P -l P -png -r 150 ... cache/discC/p`) e **ler as imagens** para delimitar o intervalo completo (flavor + bloco mecânico + Tabela de progressão + habilidades + poderes + — nas conjuradoras — Conjuração e Caminhos). Confirmar página impressa pelo rodapé.

- [ ] **Step 3: Registrar** — Create `docs/superpowers/plans/classes-paginas.md` com uma tabela: `slug | nome | conjuradora? | páginas PDF | impressas | onde está a Tabela/Caminhos | observações`. Marcar as conjuradoras (Arcanista, Bardo, Clérigo, Druida) e seus caminhos.

- [ ] **Step 4: Commit**
```bash
git add docs/superpowers/plans/classes-paginas.md
git commit -m "docs(classes): mapa de páginas das classes para extração"
```

---

## Task 5: Extração das classes MARCIAIS (visão, 2 passadas) — por blocos

Aplicar o procedimento do spike do Guerreiro a cada classe marcial, em blocos de ~3–4: **Bárbaro, Bucaneiro, Cavaleiro, Caçador, Inventor, Ladino, Lutador, Nobre, Paladino**. (Caçador/Paladino podem ter magia limitada — se o livro indicar conjuração/caminho, capture em `conjuracao`/`caminhos`.)

**Files (por classe):**
- Create: `data/livro-basico/classes/<slug>.json`
- Create: `site/public/classes/<slug>.png`

- [ ] **Passada 1 (por classe):** render (PNG 150 dpi) + `pdftotext -layout` das páginas do mapa; ler imagem+texto e preencher o JSON conforme `ClasseMecanicaSchema` (atributoChave, pvInicial, pvPorNivel, pmPorNivel; `pericias {quantidade,fixas,lista,texto}`; proficiencias; **progressão 1–20 completa**; habilidades; poderes). Onde o PV/PM tiver "+Constituição"/"+atributo", guardar o inteiro base e registrar o "+atributo" na seção "Pontos de Vida e Mana" / resumo (como no Guerreiro). Ilustração via `comporComMascara` → `site/public/classes/<slug>.png`; `imagens:["/classes/<slug>.png"]`.
- [ ] **Passada 2 (independente, por bloco):** outro agente relê as páginas vs cada JSON — progressão 1–20, habilidades e poderes completos e fiéis, números corretos, proveniência, grafia. Corrigir até completo.
- [ ] **Verificação por bloco:** Run (em `site/`): `npm test` → verde (carregador valida cada JSON). Se falhar schema, corrigir o dado.
- [ ] **Commit por bloco:**
```bash
git add data/livro-basico/classes/ site/public/classes/
git commit -m "feat(classes): extrai <classes do bloco> (visão 2 passadas, validadas)"
```
(Repetir até todas as marciais.)

---

## Task 6: Extração das classes CONJURADORAS (visão, 2 passadas)

**Arcanista, Bardo, Clérigo, Druida.** Mesmo procedimento da Task 5, mais:
- [ ] Preencher `mecanica.conjuracao` `{ tipo, atributoChave, descricao }` (ex.: Arcanista → tipo "Arcana"; Clérigo/Druida → "Divina"; atributo-chave conforme o livro).
- [ ] Preencher `mecanica.caminhos` `[{ nome, descricao, habilidades[] }]` — ex.: Arcanista (Bruxo/Mago/Feiticeiro); Clérigo (devoção/poderes concedidos, se modelado como caminho); Druida; Bardo (se houver). Capturar as habilidades específicas de cada caminho.
- [ ] **NÃO** incluir descrições de magias (categoria *Magias*, futura). As habilidades de magia da classe (ex.: "Magias") vão em `habilidades`.
- [ ] Passada 2 independente confere também `conjuracao` e `caminhos` completos.
- [ ] Verificação (`npm test`) + commit por bloco:
```bash
git add data/livro-basico/classes/ site/public/classes/
git commit -m "feat(classes): extrai <conjuradoras> com conjuração e caminhos (visão 2 passadas)"
```

---

## Task 7: Tooltips citados nas classes (proveniência)

**Files:**
- Modify: `data/referencia/glossario.json` e/ou `data/referencia/condicoes.json`

- [ ] **Step 1:** Levantar termos de regra citados nos textos das novas classes que **ainda não existem** em `data/referencia/` (muitos já existem da fatia de Raças e do Guerreiro). Para cada novo, localizar a definição no Livro Básico via `pdftotext`/visão e adicionar seguindo o `TermoSchema` `{ id, nome, descricao, fonte:{livro,pagina} }`, fiel ao livro. Não duplicar ids; não inventar (se não achar, deixar de fora).
- [ ] **Step 2:** Run (em `site/`): `npm test` → verde (`seed.test`).
- [ ] **Step 3: Commit**
```bash
git add data/referencia/glossario.json data/referencia/condicoes.json
git commit -m "feat(referencia): termos citados nas classes com proveniência"
```

---

## Task 8: Integração final

- [ ] **Step 1: Suíte + build** — Run (em `site/`): `npm test` → verde; `npm run build` → conclui e gera `/classes` e uma `/ficha/classe/<slug>` para **cada** classe (confirmar que todas aparecem em `generateStaticParams`).
- [ ] **Step 2: Conferência** — reiniciar o dev (dados novos!) e abrir `/classes` (todas as classes), 3–4 fichas marciais e as 4 conjuradoras (conjuração + caminhos aparecem; tabelas e tooltips OK). Encerrar o dev.
- [ ] **Step 3: PROGRESSO** — marcar a categoria Classes como concluída e apontar a próxima (ex.: Origens, ou a categoria *Magias*). Commit:
```bash
git add PROGRESSO.md
git commit -m "docs: categoria Classes do Livro Básico concluída"
```

---

## Encerramento

Ao fim: todas as classes do Livro Básico extraídas e validadas (visão 2 passadas), schema com conjuração/caminhos, `FichaClasse` exibindo conjuradoras, índice `/classes`, busca e build estático OK. Próxima fatia da Fase 1: outra categoria (Origens/Perícias/Poderes) ou a categoria *Magias* (que destrava o conteúdo de conjuração das classes).
