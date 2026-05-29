# Revamp Visual "Tomo de Arton" — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reestilizar o site inteiro para o visual aprovado (mockup `mockup-d-final.html`): casca escura carmesim + cards de pergaminho legíveis, fonte **Tormenta20x** nos títulos com degradê dourado→carmesim, acentos carmesim/vermelho/ouro e tooltips terracota.

**Architecture:** Tokens de tema em `globals.css` definem dois contextos (casca escura × pergaminho claro). A fonte é registrada via `next/font/local`. Os componentes têm seus estilos inline reescritos para a nova paleta, **preservando os atributos verificados pelos testes** (`data-testid`, `data-tooltip`, `role`, `href`, textos). Sem mudança de estrutura de dados nem de lógica.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, framer-motion, Vitest + Testing Library. Estilos inline + variáveis CSS (decisão do projeto). Export estático já ativo.

**Spec:** `docs/superpowers/specs/2026-05-29-revamp-visual-design.md`. Referência visual fiel: `mockup-d-final.html` (raiz; remover ao fim).

---

## Convenções (ler antes)

- Raiz: `C:\Users\ASCalderon\Desktop\compendium tormenta 20`. Comandos de site em `site/`.
- Node no PATH: PowerShell `$env:Path += ";C:\Program Files\nodejs"`; Bash `export PATH="$PATH:/c/Program Files/nodejs"`.
- **Commit caminhos específicos, nunca `git add -A`. Sem push.** Caminhos com espaço entre aspas.
- **Não quebrar os testes:** a suíte (35 testes) verifica estrutura/atributos, não cores. Cada tarefa roda `npm test` e deve ficar verde. No fim, `npm run build` (export estático) deve passar.
- Next.js 16 tem breaking changes — em dúvida, consultar `site/node_modules/next/dist/docs/`.

## Paleta (referência rápida)
- Casca: bg vinho `#1f0a0e→#160a10` + brilhos carmesim `#5a0f1a`/`#3a0a12`; texto casca `#f3dcd0`, suave `#e7b3a6`; topbar borda `#7a2030`; busca fundo `#2a0c11`.
- Pergaminho: `#f7eed8→#efe1c2`; tinta `#2c1d12`, suave `#6b513a`.
- Acentos: carmesim `#9b1c2e`, vermelho `#b1273a`, ouro `#e8c06a`, borda `#c8a86a`; tooltip texto `#a83e22`, linha `#b5462b`.
- Faixa de título: `radial-gradient(120% 140% at 50% 0%, #6a1421, transparent 70%)` sobre `linear-gradient(180deg,#4a0f18,#320a11)`.
- Degradê do título: `linear-gradient(180deg,#f8de9b 0%,#eaa84a 45%,#d23a4a 100%)`.

---

## Task 1: Registrar a fonte Tormenta20x + corrigir layout

**Files:**
- Move: `Tormenta20x.ttf` (raiz) → `site/app/fonts/Tormenta20x.ttf`
- Modify: `site/app/layout.tsx`

- [ ] **Step 1: Mover a fonte para dentro do site**

PowerShell (na raiz):
```powershell
New-Item -ItemType Directory -Force "site/app/fonts" | Out-Null
Move-Item "Tormenta20x.ttf" "site/app/fonts/Tormenta20x.ttf"
```
Expected: `site/app/fonts/Tormenta20x.ttf` existe; a raiz não tem mais o `.ttf`.

- [ ] **Step 2: Registrar via next/font/local**

Substituir TODO o conteúdo de `site/app/layout.tsx` por:
```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const tormenta = localFont({
  src: "./fonts/Tormenta20x.ttf",
  variable: "--font-tormenta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Compêndio de Arton — Tormenta 20",
  description: "Wiki de mesa de Tormenta 20: raças, regras e mais.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br" className={`${tormenta.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verificar build de fonte/tipos**

Run (em `site/`): `npm run build`
Expected: compila sem erro (a fonte local é resolvida; `out/` gerado). Se reclamar do caminho da fonte, confirmar que o arquivo está em `site/app/fonts/Tormenta20x.ttf`.

- [ ] **Step 4: Commit**

```bash
git add site/app/layout.tsx site/app/fonts/Tormenta20x.ttf
git commit -m "feat(tema): registra fonte Tormenta20x (next/font/local) e ajusta layout"
```

---

## Task 2: Tokens do tema híbrido + classe de título

**Files:**
- Modify: `site/app/globals.css`

- [ ] **Step 1: Substituir o conteúdo do globals.css**

Substituir TODO o conteúdo de `site/app/globals.css` por:
```css
@import "tailwindcss";

:root {
  /* casca escura (vinho/carmesim) */
  --fundo-1: #1f0a0e;
  --fundo-2: #160a10;
  --texto-casca: #f3dcd0;
  --texto-casca-suave: #e7b3a6;
  --topbar-borda: #7a2030;
  --busca-fundo: #2a0c11;
  /* pergaminho / card de leitura */
  --pergaminho-1: #f7eed8;
  --pergaminho-2: #efe1c2;
  --pergaminho-stat: #f7edd6;
  --tinta: #2c1d12;
  --tinta-suave: #6b513a;
  /* acentos */
  --carmesim: #9b1c2e;
  --vermelho: #b1273a;
  --ouro: #e8c06a;
  --borda: #c8a86a;
  --tooltip: #a83e22;
  --tooltip-linha: #b5462b;
  --serifa: Georgia, "Times New Roman", serif;
}

body {
  background:
    radial-gradient(130% 80% at 50% -8%, #5a0f1a 0%, transparent 55%),
    radial-gradient(90% 60% at 90% 100%, #3a0a12 0%, transparent 60%),
    linear-gradient(180deg, var(--fundo-1), var(--fundo-2));
  color: var(--texto-casca);
  min-height: 100vh;
}

/* título em fonte Tormenta + degradê dourado→carmesim (usado em marca e nome de entidade) */
.titulo-grimorio {
  font-family: var(--font-tormenta), var(--serifa);
  background: linear-gradient(180deg, #f8de9b 0%, #eaa84a 45%, #d23a4a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 10px rgba(210, 58, 74, 0.5));
  letter-spacing: 0.5px;
}
```
> Mantemos a classe `.titulo-grimorio` (já usada em FichaRaca, Ficha, home, índice e estilo) — agora com o tratamento Tormenta+degradê. Funciona nos contextos escuros onde ela aparece (casca e faixa de título do card).

- [ ] **Step 2: Rodar a suíte (não-regressão)**

Run (em `site/`): `npm test`
Expected: 35 testes verdes (estilos não afetam asserções).

- [ ] **Step 3: Commit**

```bash
git add site/app/globals.css
git commit -m "feat(tema): tokens do tema híbrido (casca carmesim + pergaminho) e título Tormenta"
```

---

## Task 3: Divisor (flourish em ouro)

**Files:**
- Modify: `site/components/Divisor.tsx`
- Test: `site/test/divisor.test.tsx` (já existe; deve continuar verde)

- [ ] **Step 1: Substituir o componente**

Substituir TODO o conteúdo de `site/components/Divisor.tsx` por:
```tsx
export function Divisor() {
  return (
    <div
      data-testid="divisor"
      aria-hidden
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--ouro)", opacity: 0.9 }}
    >
      <span style={{ height: 2, width: 110, background: "linear-gradient(90deg,transparent,var(--ouro))" }} />
      <span style={{ width: 8, height: 8, background: "var(--ouro)", transform: "rotate(45deg)" }} />
      <span style={{ height: 2, width: 110, background: "linear-gradient(90deg,var(--ouro),transparent)" }} />
    </div>
  );
}
```
> Mantém `data-testid="divisor"` (teste `divisor.test.tsx` continua passando).

- [ ] **Step 2: Rodar o teste**

Run (em `site/`): `npm test -- divisor`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add site/components/Divisor.tsx
git commit -m "style(divisor): flourish em ouro para o novo tema"
```

---

## Task 4: Tooltip (gatilho terracota + popup pergaminho)

**Files:**
- Modify: `site/components/Tooltip.tsx`
- Test: `site/test/textorico.test.tsx` (verifica `data-tooltip` e que a descrição aparece no hover — deve continuar verde)

- [ ] **Step 1: Substituir o componente**

Substituir TODO o conteúdo de `site/components/Tooltip.tsx` por:
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
      style={{ position: "relative", borderBottom: "2px dotted var(--tooltip-linha)", color: "var(--tooltip)", fontWeight: 700, cursor: "help" }}
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
              width: 240, background: "linear-gradient(180deg,#fbf3df,#f1e3c4)", color: "var(--tinta)",
              border: "1px solid var(--borda)", borderRadius: 10, padding: "11px 13px",
              font: "400 12px/1.5 var(--serifa)", boxShadow: "0 14px 40px rgba(0,0,0,.55)", zIndex: 50,
            }}
          >
            <b style={{ color: "var(--carmesim)" }}>{rotulo}</b>
            <br />
            {descricao}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
```
> Mantém `data-tooltip`, `role="tooltip"` e o gatilho de hover/focus (testes preservados). Gatilho em terracota; popup como plaqueta de pergaminho legível.

- [ ] **Step 2: Rodar o teste**

Run (em `site/`): `npm test -- textorico`
Expected: PASS (2 testes).

- [ ] **Step 3: Commit**

```bash
git add site/components/Tooltip.tsx
git commit -m "style(tooltip): gatilho terracota e popup de pergaminho"
```

---

## Task 5: LinkEntidade (carmesim)

**Files:**
- Modify: `site/components/LinkEntidade.tsx`
- Test: `site/test/textorico.test.tsx` (verifica `href` — continua verde)

- [ ] **Step 1: Substituir o componente**

Substituir TODO o conteúdo de `site/components/LinkEntidade.tsx` por:
```tsx
import Link from "next/link";
import type { TipoEntidade } from "@/lib/schema";

export function LinkEntidade({ alvoId, alvoTipo, rotulo }: { alvoId: string; alvoTipo: TipoEntidade; rotulo: string }) {
  return (
    <Link
      href={`/ficha/${alvoTipo}/${alvoId}`}
      style={{ color: "var(--carmesim)", fontWeight: 700, textDecoration: "none", borderBottom: "1px solid rgba(155,28,46,.4)" }}
    >
      {rotulo}
    </Link>
  );
}
```
> Mantém o `href` `/ficha/${alvoTipo}/${alvoId}` (teste preservado).

- [ ] **Step 2: Rodar o teste**

Run (em `site/`): `npm test -- textorico`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add site/components/LinkEntidade.tsx
git commit -m "style(link): link de entidade em carmesim"
```

---

## Task 6: FichaRaca (faixa de título escura + corpo pergaminho)

**Files:**
- Modify: `site/components/FichaRaca.tsx`
- Test: `site/test/fichraca.test.tsx` (verifica nome, "Médio", "9m", "Versátil", alt da imagem — deve continuar verde)

- [ ] **Step 1: Substituir o componente**

Substituir TODO o conteúdo de `site/components/FichaRaca.tsx` por:
```tsx
import type { Entidade, RacaMecanica, ModificadorAtributo } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

function rotuloModificador(m: ModificadorAtributo): string {
  if (m.escolha) return `${m.valor > 0 ? "+" : ""}${m.valor} em ${m.quantidade ?? ""} atributos`;
  return `${m.valor > 0 ? "+" : ""}${m.valor} ${m.atributo ?? ""}`.trim();
}

function StatBox({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <span style={{ textAlign: "center", background: "var(--pergaminho-stat)", border: "1px solid var(--borda)", borderRadius: 10, padding: "8px 14px" }}>
      <span style={{ display: "block", fontFamily: "var(--serifa)", fontSize: 18, color: "var(--carmesim)", fontWeight: 800 }}>{valor}</span>
      <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--tinta-suave)" }}>{rotulo}</span>
    </span>
  );
}

export function FichaRaca({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as unknown as RacaMecanica;
  const imagem = entidade.imagens[0];
  const deslocamento = m.deslocamento != null ? `${m.deslocamento}${m.deslocamentoUnidade ?? ""}` : null;
  const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 8px" };

  return (
    <article style={{ maxWidth: 760, margin: "0 auto", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.6)" }}>
      {/* faixa de título escura carmesim */}
      <header style={{ background: "radial-gradient(120% 140% at 50% 0%, #6a1421 0%, transparent 70%), linear-gradient(180deg,#4a0f18,#320a11)", padding: "20px 24px 14px", textAlign: "center", borderBottom: "2px solid var(--borda)" }}>
        <div style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700 }}>Raça</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 50, margin: "4px 0 0", lineHeight: 1 }}>{entidade.nome}</h1>
        <Divisor />
      </header>

      {/* corpo de pergaminho claro */}
      <div style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", color: "var(--tinta)" }}>
        {entidade.resumo && (
          <p style={{ fontFamily: "var(--serifa)", fontStyle: "italic", color: "var(--tinta-suave)", maxWidth: 560, margin: "0 auto", padding: "16px 24px 0", lineHeight: 1.55, textAlign: "center" }}>
            {entidade.resumo}
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, padding: "18px 22px 22px" }}>
          {imagem && (
            <div style={{ flex: "1 1 240px", minWidth: 220, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagem} alt={`Ilustração de ${entidade.nome}`} style={{ width: "100%", maxWidth: 290, height: "auto", filter: "drop-shadow(0 8px 18px rgba(60,30,10,.4))" }} />
            </div>
          )}
          <div style={{ flex: "2 1 320px", minWidth: 280 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              {m.tamanho && <StatBox valor={m.tamanho} rotulo="Tamanho" />}
              {deslocamento && <StatBox valor={deslocamento} rotulo="Deslocamento" />}
            </div>
            {m.modificadores && m.modificadores.length > 0 && (
              <section style={{ marginBottom: 16 }}>
                <h2 style={h2}>Modificadores de Atributo</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {m.modificadores.map((mod, i) => (
                    <span key={i} style={{ fontFamily: "var(--serifa)", fontWeight: 700, fontSize: 14, color: "var(--carmesim)", padding: "4px 11px", borderRadius: 8, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)" }}>
                      {rotuloModificador(mod)}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {m.habilidades && m.habilidades.length > 0 && (
              <section>
                <h2 style={h2}>Habilidades de Raça</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                  {m.habilidades.map((h, i) => (
                    <div key={i} style={{ fontFamily: "var(--serifa)", lineHeight: 1.6 }}>
                      <span style={{ color: "var(--carmesim)", fontWeight: 800 }}>{h.nome}.</span>{" "}
                      <TextoRico texto={h.descricao} registro={registro} descricoes={descricoes} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
        <div style={{ padding: "0 24px 22px" }}>
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
          {m.nota && <p style={{ marginTop: 16, fontSize: 11, color: "var(--tinta-suave)", fontStyle: "italic" }}>{m.nota}</p>}
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Rodar o teste**

Run (em `site/`): `npm test -- fichraca`
Expected: PASS (2 testes — nome, Médio, 9m, Versátil, alt da imagem).

- [ ] **Step 3: Commit**

```bash
git add site/components/FichaRaca.tsx
git commit -m "style(fichraca): card pergaminho + faixa de título carmesim/degradê"
```

---

## Task 7: Ficha genérica (mesmo tratamento para outros tipos)

**Files:**
- Modify: `site/components/Ficha.tsx`

- [ ] **Step 1: Substituir o componente**

Substituir TODO o conteúdo de `site/components/Ficha.tsx` por:
```tsx
import type { Entidade } from "@/lib/schema";
import { type Registro } from "@/lib/autolink";
import { TextoRico } from "./TextoRico";
import { LinkEntidade } from "./LinkEntidade";
import { Divisor } from "./Divisor";

export function Ficha({ entidade, registro, descricoes }: { entidade: Entidade; registro: Registro; descricoes: Record<string, string> }) {
  const m = entidade.mecanica as Record<string, string | number>;
  const h2 = { fontSize: 13, textTransform: "uppercase" as const, letterSpacing: 2, color: "var(--vermelho)", borderBottom: "1px solid var(--borda)", paddingBottom: 4, margin: "0 0 8px" };
  return (
    <article style={{ maxWidth: 620, margin: "0 auto", border: "2px solid var(--borda)", borderRadius: 16, overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.6)" }}>
      <header style={{ background: "radial-gradient(120% 140% at 50% 0%, #6a1421 0%, transparent 70%), linear-gradient(180deg,#4a0f18,#320a11)", padding: "18px 22px 12px", textAlign: "center", borderBottom: "2px solid var(--borda)" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "var(--ouro)", fontWeight: 700 }}>{entidade.tipo}</div>
        <h1 className="titulo-grimorio" style={{ fontSize: 38, margin: "2px 0 0" }}>{entidade.nome}</h1>
        <Divisor />
      </header>
      <div style={{ background: "linear-gradient(180deg, var(--pergaminho-1), var(--pergaminho-2))", color: "var(--tinta)", padding: "18px 24px 22px" }}>
        {Object.keys(m).length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
            {Object.entries(m).map(([k, v]) => (
              <span key={k} style={{ textAlign: "center", background: "var(--pergaminho-stat)", border: "1px solid var(--borda)", borderRadius: 10, padding: "8px 12px" }}>
                <span style={{ display: "block", fontFamily: "var(--serifa)", fontSize: 18, color: "var(--carmesim)", fontWeight: 800 }}>{String(v)}</span>
                <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--tinta-suave)" }}>{k}</span>
              </span>
            ))}
          </div>
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {entidade.relacoes.map((r, i) => (
                <span key={i} style={{ fontSize: 11, padding: "4px 11px", borderRadius: 20, background: "var(--pergaminho-stat)", border: "1px solid var(--borda)" }}>
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

- [ ] **Step 2: Rodar a suíte**

Run (em `site/`): `npm test`
Expected: 35 verdes.

- [ ] **Step 3: Commit**

```bash
git add site/components/Ficha.tsx
git commit -m "style(ficha): card pergaminho + faixa de título para entidades genéricas"
```

---

## Task 8: Busca (estilo da casca escura)

**Files:**
- Modify: `site/components/Busca.tsx`

- [ ] **Step 1: Substituir o componente**

Substituir TODO o conteúdo de `site/components/Busca.tsx` por:
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
        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "var(--busca-fundo)", border: "1px solid var(--vermelho)", color: "var(--texto-casca)", fontSize: 16, fontFamily: "var(--serifa)" }}
      />
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {resultados.map((r: ItemIndice, i) => (
          <motion.div key={r.tipo + r.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <Link href={`/ficha/${r.tipo}/${r.id}`} style={{ display: "block", padding: "10px 14px", borderRadius: 10, background: "rgba(42,12,17,.6)", border: "1px solid var(--topbar-borda)", color: "var(--texto-casca)", textDecoration: "none" }}>
              <strong style={{ color: "var(--ouro)" }}>{r.nome}</strong>
              <span style={{ float: "right", fontSize: 10, textTransform: "uppercase", color: "var(--texto-casca-suave)" }}>{r.tipo}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Rodar a suíte**

Run (em `site/`): `npm test`
Expected: 35 verdes (busca testada por `busca.test.ts`, lógica intacta).

- [ ] **Step 3: Commit**

```bash
git add site/components/Busca.tsx
git commit -m "style(busca): caixa e resultados no estilo da casca escura"
```

---

## Task 9: Home

**Files:**
- Modify: `site/app/page.tsx`

- [ ] **Step 1: Substituir o conteúdo**

Substituir TODO o conteúdo de `site/app/page.tsx` por:
```tsx
import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { construirIndice } from "@/lib/busca";
import { Busca } from "@/components/Busca";
import { Divisor } from "@/components/Divisor";

export default function Home() {
  const ents = carregarEntidades();
  const indice = construirIndice(ents.map((e) => ({ id: e.id, tipo: e.tipo, nome: e.nome, resumo: e.resumo })));
  return (
    <main style={{ padding: 48 }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 52, textAlign: "center" }}>Compêndio de Arton</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>Tormenta 20 — wiki de mesa</p>
      <Busca indice={indice} />
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <Link href="/racas" style={{ color: "var(--ouro)", textDecoration: "none", fontFamily: "var(--serifa)", borderBottom: "1px solid rgba(232,192,106,.4)" }}>
          Ver todas as raças →
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Rodar a suíte**

Run (em `site/`): `npm test`
Expected: 35 verdes.

- [ ] **Step 3: Commit**

```bash
git add site/app/page.tsx
git commit -m "style(home): marca em Tormenta/degradê + atalho para raças"
```

---

## Task 10: Índice /racas (cards no estilo casca + ilustração)

**Files:**
- Modify: `site/app/racas/page.tsx`
- Test: `site/test/racas-indice.test.tsx` (verifica link com nome /Humano/ e href — deve continuar verde)

Decisão (da spec §5): galerias/navegação ficam na **casca escura** (cards escuros com borda dourada, ilustração em destaque, nome em ouro, resumo em texto claro-suave); a leitura aprofundada (fichas) é o pergaminho. Isso mantém o nome/resumo legíveis (texto claro curto sobre escuro) e a ilustração com transparência fica linda sobre o escuro.

- [ ] **Step 1: Substituir o conteúdo**

Substituir TODO o conteúdo de `site/app/racas/page.tsx` por:
```tsx
import Link from "next/link";
import { carregarEntidades } from "@/lib/dados";
import { Divisor } from "@/components/Divisor";

export default function IndiceRacas() {
  const racas = carregarEntidades()
    .filter((e) => e.tipo === "raca")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  return (
    <main style={{ padding: 48, maxWidth: 980, margin: "0 auto" }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 46, textAlign: "center" }}>Raças de Arton</h1>
      <Divisor />
      <p style={{ textAlign: "center", color: "var(--texto-casca-suave)", margin: "12px 0 28px", fontFamily: "var(--serifa)" }}>
        {racas.length} {racas.length === 1 ? "raça" : "raças"} do Livro Básico
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {racas.map((r) => {
          const imagem = r.imagens[0];
          return (
            <Link
              key={r.id}
              href={`/ficha/raca/${r.id}`}
              style={{ display: "flex", flexDirection: "column", textDecoration: "none", color: "var(--texto-casca)", background: "linear-gradient(180deg,#241334,#1b0f25)", border: "1px solid var(--borda)", borderRadius: 14, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.45)" }}
            >
              <div style={{ height: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "radial-gradient(120% 90% at 50% 10%, rgba(106,20,33,.35), transparent 70%)" }}>
                {imagem && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagem} alt={r.nome} style={{ maxHeight: 196, maxWidth: "90%", filter: "drop-shadow(0 8px 18px rgba(0,0,0,.6))" }} />
                )}
              </div>
              <div style={{ padding: "12px 14px", borderTop: "1px solid var(--borda)" }}>
                <strong className="titulo-grimorio" style={{ fontSize: 22 }}>{r.nome}</strong>
                <p style={{ fontFamily: "var(--serifa)", fontSize: 12.5, color: "var(--texto-casca-suave)", lineHeight: 1.45, margin: "4px 0 0" }}>{r.resumo}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
```
> Mantém o `<Link href={/ficha/raca/${r.id}}>` com o nome dentro (teste `racas-indice` continua verde). O nome usa `.titulo-grimorio` (Tormenta+degradê) — fica sobre o card escuro.

- [ ] **Step 2: Rodar o teste**

Run (em `site/`): `npm test -- racas-indice`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add "site/app/racas/"
git commit -m "style(racas): índice em cards de casca escura com borda dourada"
```

---

## Task 11: Página de estilo (vitrine atualizada)

**Files:**
- Modify: `site/app/estilo/page.tsx`

- [ ] **Step 1: Substituir o conteúdo**

Substituir TODO o conteúdo de `site/app/estilo/page.tsx` por:
```tsx
import { Divisor } from "@/components/Divisor";

export default function Estilo() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 40 }}>
      <h1 className="titulo-grimorio" style={{ fontSize: 44, textAlign: "center" }}>Compêndio de Arton</h1>
      <Divisor />
      <p style={{ fontFamily: "var(--serifa)", lineHeight: 1.7, marginTop: 20, color: "var(--texto-casca)" }}>
        Vitrine do tema "Tomo de Arton": casca escura em tons de vinho e carmesim, títulos na fonte da
        Tormenta com degradê dourado→carmesim, e painéis de pergaminho claro para leitura confortável.
      </p>
    </main>
  );
}
```

- [ ] **Step 2: Rodar a suíte**

Run (em `site/`): `npm test`
Expected: 35 verdes.

- [ ] **Step 3: Commit**

```bash
git add "site/app/estilo/"
git commit -m "style(estilo): vitrine do novo tema"
```

---

## Task 12: Integração final + limpeza

**Files:** verificação; remover mockups da raiz.

- [ ] **Step 1: Suíte completa + build estático**

Run (em `site/`): `npm test` → 35 verdes.
Run (em `site/`): `npm run build` → conclui; `out/` com home, `/racas`, 17 fichas de raça e `/estilo`.

- [ ] **Step 2: Conferência visual**

Run (em `site/`): `npm run dev` → abrir `/` (marca em degradê, busca escura), `/racas` (cards escuros + ilustrações), `/ficha/raca/humano` e mais 2–3 raças (faixa de título + corpo pergaminho legível; tooltip terracota no hover; relação como link carmesim). Encerrar o dev depois.

- [ ] **Step 3: Remover os protótipos da raiz**

PowerShell (na raiz):
```powershell
Remove-Item "mockup-a-pergaminho.html","mockup-b-hibrido.html","mockup-c-escuro.html","mockup-d-final.html","mockups-comparar.html","mockup-server.mjs" -ErrorAction SilentlyContinue
```
(São arquivos não versionados; apenas limpeza local.)

- [ ] **Step 4: Atualizar PROGRESSO.md**

Registrar o revamp visual como concluído e remover a pendência "revamp visual" da PRÓXIMA AÇÃO; apontar a próxima fatia de categoria (Classes/Origens). Commit:
```bash
git add PROGRESSO.md
git commit -m "docs: revamp visual concluído (Tomo de Arton)"
```

---

## Encerramento

Ao fim: site inteiro no tema "Tomo de Arton" (casca carmesim + pergaminho legível + fonte Tormenta nos títulos), suíte verde e build estático passando. Próxima fatia da Fase 1: outra categoria do Livro Básico reusando o pipeline e os componentes.
