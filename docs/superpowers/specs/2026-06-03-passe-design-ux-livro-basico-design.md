# Passe de Design/UX — Livro Básico (preparar para testers)

**Data:** 2026-06-03 · **Status:** design aprovado (visual), aguardando revisão do spec

## Objetivo

O Livro Básico está completo de conteúdo (auditoria feita; catálogos íntegros). Agora o site
precisa ficar **navegável, legível e organizado** o suficiente para enviar a **testers**, cujo foco
é revisar **conteúdo** (faltando / errado / incompleto). Este passe entrega um **app shell unificado**
com navegação dos dois lados, um **sistema visual coeso** ("Página de Livro"), e melhorias de
apresentação que ajudam a consulta — sem tocar nos dados.

Referência visual aprovada: `.superpowers/brainstorm/1904-1780493483/content/visual-livro-v2.html`.

## Não-objetivos

- Não alterar o conteúdo das entidades/regras (a auditoria já cobriu isso).
- Não redesenhar cada ficha individual além de receber o tema comum.
- Deploy (Vercel/Pages) e mecanismo de feedback dos testers são **fora deste escopo** (ver "Entrega").

## Decisões aprovadas

### 1. App shell (layout global persistente)
Refatorar `site/app/layout.tsx` (hoje só renderiza `children`) para um shell de 3 colunas, aplicado a
todas as páginas:
- **Canto superior esquerdo:** logo **"Compêndio T20"** em uma única linha (sem quebra), fonte
  Tormenta20x, degradê (a "pegada dos nomes"). Linka para a home.
- **Coluna esquerda — navegação global** (largura fixa ~196px): Busca, Personagem, Raças, Classes,
  Origens, Perícias, Poderes, Equipamento, Itens Mágicos, Magias, Deuses, Bestiário, Mundo, Regras.
  Item da área atual destacado (pílula carmesim, texto branco).
- **Centro — conteúdo** (fluido): "página de pergaminho" texturizada.
- **Coluna direita — contexto** (largura fixa ~184px): "Nesta seção" + "Regras desta seção" (ver §4).
- **Calhas iguais** dos dois lados do card central (~18px cada).

### 2. Sistema visual "Página de Livro" (tokens em `globals.css`)
- **Casca/fundo:** gradiente vinho sólido (ex.: radial `#371620`→`#1f0b11`). **Sem textura/malha**
  na casca (evita o quadriculado de ladrilho).
- **Conteúdo:** pergaminho claro (`#ece1c6` + gradiente) com **textura sutil de papel** via SVG
  `feTurbulence` com `stitchTiles="stitch"` (sem costura), e bordas envelhecidas (`inset box-shadow`).
- **Acentos:** carmesim (`#9b1c2e` / `#7a1320`) + magenta Tormenta discreto. **Sem dourado no
  ambiente** (sem fios/bordas dourados); o degradê dourado→carmesim fica **só no logo/títulos**.
- **Tipografia:** Tormenta20x nos títulos e logo (degradê); serifa para leitura corrida; menus com
  texto claro de alto contraste sobre o vinho (legibilidade foi um problema na 1ª versão).
- **Símbolos:** **SVG, nunca emoji** (sigilos/divisórias/ícones de menu como o "menu" mobile).
- Componente `Divisor` e os cabeçalhos passam a usar estes tokens.

### 3. Navegação contextual (coluna direita) por tipo de página
- **Índice de categoria** (ex.: Equipamento): "Nesta seção" lista as **sub-seções** (âncoras na
  mesma página); clicar a categoria na nav esquerda revela/rola para as sub-seções. **Armas à
  Distância + Munição ficam na MESMA página.**
- **Ficha** (ex.: criatura, item, magia): "Nesta ficha" (índice das seções da ficha) e/ou "Outros do
  mesmo grupo/tema"; mais as regras relevantes.
- A coluna direita sempre traz **"Regras desta seção"** (ver §4).

### 4. Regras contextuais — 3 camadas (fonte única, múltiplas referências)
- **Hub `/regras`** — todas as regras agrupadas (fonte única; já existe).
- **"Regras desta seção"** (coluna direita) — cada regra é **tagueada a uma ou mais áreas** e aparece
  no contexto onde importa, sem duplicar conteúdo. Ex.: a regra `itens-magicos` (fabricar/encantos)
  aparece tanto em **Itens Mágicos** quanto em **Equipamento**.
- **Tooltips** — lembrete inline de 1–2 frases de um termo (ex.: característica de arma). Tooltip
  lembra; a ficha de regra detalha. Os dois convivem.
- Implementação: um mapa `area → [ids de regra]` (config), consumido pela coluna direita.

### 5. Equipamento em tabela
- Sub-seções (Armas Simples, Marciais, à Distância+Munição, Armaduras, Escudos, Itens Gerais,
  Alquímicos) renderizadas como **tabelas**: `Arma | Dano | Crít | Alcance | Espaços | Preço |
  Características`. Colunas se adaptam ao tipo (armaduras: `Defesa | Penalidade | …`).
- **Características das armas viram tooltips** (glossário p.143, já existe como termos).
- **Descrição completa de cada item abaixo da tabela** da sub-seção (nome em destaque + texto).
- Esta apresentação tabular é específica de **Equipamento**; outras categorias mantêm o grid/cards
  atuais (não é um redesenho de todos os índices).

### 6. Página "Fabricação de Itens" (nova)
- Rota dedicada `site/app/equipamento/fabricacao/page.tsx` (linkada do índice de Equipamento).
- Reúne num lugar só os **caminhos de criação**, cada um linkando à regra completa:
  Itens Superiores · Itens Mágicos (fabricar/encantos) · Poções & Pergaminhos · Venenos · Pratos.
- Listada em "Regras desta seção" de **Equipamento** e de **Itens Mágicos**.

### 7. Mobile (proposta — foco em consulta rápida, mas usável para pesquisa longa)
- **Top bar fixa:** logo (esquerda, uma linha) + botão de menu (ícone SVG ☰) + atalho de Busca.
- **Nav global = drawer off-canvas** (desliza da esquerda ao tocar o menu).
- **Conteúdo em coluna única.** Tabelas de Equipamento: scroll horizontal contido **ou** reflow para
  "linha empilhada" (rótulo: valor) em telas estreitas — definir na implementação, priorizando leitura.
- **"Nesta seção" / "Regras desta seção":** como acordeão no topo do conteúdo (ou 2º drawer), para
  quem quer pesquisar fundo (montar/evoluir personagem no celular).
- **Tooltips → tap-to-reveal** (popover ao tocar).

## Arquitetura / componentes
- `app/layout.tsx` → shell (logo + `<NavGlobal>` + slot de conteúdo + `<BarraContexto>`).
- `components/NavGlobal.tsx` — nav esquerda (lista fixa + item ativo via pathname).
- `components/BarraContexto.tsx` — coluna direita; recebe (ou deriva por rota) as sub-seções e as
  regras da área. Em ficha, mostra índice/relacionados.
- `components/AppShellMobile` — top bar + drawers (ou variação responsiva do shell via CSS).
- `lib/navegacao.ts` — config declarativa: categorias da nav, sub-seções por área, `area → regras`.
- `globals.css` — tokens do tema "Página de Livro" (casca, pergaminho+textura, acentos, tipografia).
- Equipamento: `app/equipamento/page.tsx` reescrita para tabelas + descrições; tooltips reusam o motor
  existente; nova `app/equipamento/fabricacao/page.tsx`.

## Fases de implementação (para o plano)
1. **Shell + tema** — layout global (logo, nav esquerda, barra direita base), tokens visuais "Página de
   Livro", aplicado a todas as páginas. Maior ganho visual; remove o dourado do ambiente e a malha.
2. **Equipamento + regras contextuais** — tabelas + tooltips + descrições; `area → regras` na barra
   direita; página "Fabricação de Itens".
3. **Mobile** — top bar + drawers + reflow de tabelas + tooltips por toque.
Cada fase mantém `npm run build` e a suíte de testes **verdes**, e adiciona testes de navegação/render.

## Entrega aos testers (fora do escopo de implementação, mas registrar)
- O site é **estático** (`output: "export"`), então publicar é simples (Vercel / Cloudflare Pages /
  GitHub Pages a partir de `out/`). **Confirmar com o usuário** o destino do deploy quando o design
  estiver implementado — é o que de fato "manda pros testers".
- Mecanismo de feedback (form/issue) é opcional e fica para depois, se desejado.

## Riscos / atenção
- Refatorar `layout.tsx` para shell global toca todas as páginas — fazer incremental, com build verde
  a cada passo. As páginas hoje têm `padding`/`maxWidth` próprios que migram para o shell.
- Textura SVG: validar que não reaparece "malha" (usar `stitchTiles`; casca sem textura).
- Legibilidade dos menus (contraste claro sobre vinho) é requisito, não detalhe.
