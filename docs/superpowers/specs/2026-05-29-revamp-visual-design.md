# Revamp Visual — "Tomo de Arton" — Documento de Design

**Data:** 2026-05-29
**Status:** Aprovado para planejamento
**Contexto:** Pedido do usuário — deixar o site **mais parecido com os livros de Tormenta 20**, porém
**otimizado para leitura** (uso de ler/reler bastante). Substitui o tema atual ("grimório escuro neon")
por uma direção híbrida aprovada via mockup (`mockup-d-final.html`).

> A decisão #1 original do projeto ("fundo escuro + brilho neon") evolui aqui para o visual abaixo,
> com aval do usuário. Mantém a identidade Tormenta (carmesim/dourado, ornamentos, ícones SVG, sem emojis).

---

## 1. Direção aprovada (mockup D)

**Híbrido: moldura escura puxando pro vermelho/carmesim + painel de leitura claro (pergaminho).**

- **Moldura/casca escura** (fundo da página, topbar, navegação): tons de **vinho/carmesim** (não mais
  roxo), com brilho carmesim no topo e nos cantos. Dá a atmosfera de tomo antigo.
- **Conteúdo de leitura** (fichas, índices, regras) em **painéis de pergaminho claro**, com **texto
  serifado escuro de alto contraste** — confortável para sessões longas. Esta é a prioridade: legibilidade.
- **Título da entidade / marca do site** em **fonte Tormenta (`Tormenta20x`)** com **degradê
  dourado→âmbar→carmesim e leve brilho** (o tratamento que o usuário aprovou no mockup C), posicionado
  numa **faixa escura carmesim** no topo de cada card — assim o degradê brilha sobre o escuro, e o corpo
  do card segue claro e legível.

## 2. Tipografia

- **Fonte de display `Tormenta20x`** (arquivo `Tormenta20x.ttf`, hoje na raiz do projeto): registrar via
  **`next/font/local`** em `site/`. Usada em: **marca do site** ("Compêndio de Arton") e **nome da
  entidade (h1)**. (Opcional, a avaliar no plano: títulos de seção; por padrão NÃO, para preservar leitura.)
- **Corpo e cabeçalhos de seção**: serifa legível — manter `Georgia, "Times New Roman", serif` (`--serifa`).
- O arquivo `Tormenta20x.ttf` deve ser **movido para dentro de `site/`** (ex.: `site/app/fonts/Tormenta20x.ttf`)
  e versionado (a fonte é asset do site).

## 3. Paleta (tokens) — valores exatos do mockup aprovado

**Casca escura (shell):**
- Fundo: `radial-gradient(130% 80% at 50% -8%, #5a0f1a 0%, transparent 55%)`, mais
  `radial-gradient(90% 60% at 90% 100%, #3a0a12 0%, transparent 60%)`, sobre
  `linear-gradient(180deg, #1f0a0e, #160a10)`.
- Texto sobre a casca (ex.: subtítulos da home): claro, `#f3dcd0` / suave `#e7b3a6`.
- Borda da topbar: `#7a2030`. Campo de busca: fundo `#2a0c11`, borda `#b1273a`, texto `#e7b3a6`.

**Card de leitura (pergaminho):**
- Fundo: `linear-gradient(180deg, #f7eed8, #efe1c2)`; tijolos de stat `#f7edd6`.
- Tinta (texto): `#2c1d12`; tinta suave: `#6b513a`.
- Borda do card / divisórias: `#c8a86a` (`--borda`).

**Acentos (identidade Tormenta):**
- Carmesim (nomes de habilidade, valores de stat): `#9b1c2e`.
- Vermelho (cabeçalhos de seção, arabescos): `#b1273a`.
- Ouro (rótulos, flourish, brilho do título): `#e8c06a`.
- **Tooltip (termo com hover)**: texto `#a83e22` com **sublinhado pontilhado** `#b5462b` (terracota —
  substitui o magenta/roxo antigo; sinaliza interatividade sem destoar).
- **Link de entidade**: carmesim (`#9b1c2e`), sublinhado ao passar o mouse.
- Faixa de título do card: `radial-gradient(120% 140% at 50% 0%, #6a1421, transparent 70%)` sobre
  `linear-gradient(180deg, #4a0f18, #320a11)`, borda inferior `#c8a86a`.
- Degradê do título (h1/marca): `linear-gradient(180deg, #f8de9b 0%, #eaa84a 45%, #d23a4a 100%)` com
  `drop-shadow` carmesim suave.

## 4. Arquitetura de tema (dois contextos de cor)

O híbrido tem **dois contextos**: texto **claro sobre a casca escura** e texto **escuro sobre o
pergaminho**. Isso exige cuidado — não basta inverter tokens.

- Definir em `site/app/globals.css` os **tokens da casca** (fundo, texto-claro, marca) e os **tokens de
  pergaminho/card** (pergaminho, tinta, carmesim, vermelho, ouro, borda, tooltip).
- Componentes que renderizam **na casca** (home: marca, subtítulo, busca; topbar) usam o conjunto claro.
- Componentes que renderizam **dentro de cards** (`Ficha`, `FichaRaca`, cards do índice) usam o conjunto
  pergaminho/escuro.
- O `body` fica escuro (casca); os cards trazem o seu próprio fundo claro. Garantir contraste em ambos.

## 5. Escopo (aplicar ao site inteiro)

- `site/app/globals.css` — substituir tokens e `body` pelo tema híbrido; registrar a classe de título
  com a fonte Tormenta + degradê.
- `site/app/layout.tsx` — registrar `Tormenta20x` via `next/font/local`; ajustar `lang="pt-br"` e o
  `metadata` (hoje "Create Next App").
- `site/components/FichaRaca.tsx` e `site/components/Ficha.tsx` — card pergaminho + faixa de título escura
  com o h1 em degradê; nomes de habilidade em carmesim; seções em vermelho.
- `site/components/Tooltip.tsx` — gatilho em terracota pontilhado; popup coerente com o tema.
- `site/components/LinkEntidade.tsx` — link carmesim.
- `site/components/Divisor.tsx` — flourish em ouro/vermelho (variante para fundo claro e escuro, se preciso).
- `site/app/page.tsx` (home) — marca em Tormenta+degradê, subtítulo claro, busca no estilo da casca.
- `site/app/racas/page.tsx` (índice) — cards no novo tema (pergaminho ou card escuro com borda dourada — a
  decidir no plano para manter legibilidade do nome/resumo).
- `site/app/estilo/page.tsx` — atualizar a vitrine do tema.
- Referência visual fiel: **`mockup-d-final.html`** (na raiz; protótipo — remover ao fim do revamp).

## 6. Testes e não-regressão

- A suíte atual (35 testes site) deve permanecer **verde** — os testes verificam estrutura/atributos
  (ex.: `data-tooltip`, `href`, textos), não cores; mudanças de estilo não devem quebrá-los. Rodar `npm test`.
- `npm run build` (export estático) deve continuar passando.
- Conferência visual no app (home, `/racas`, fichas de várias raças, tooltip ao hover, link de entidade).
- Acessibilidade: garantir contraste suficiente do texto do card (tinta sobre pergaminho) e da casca.

## 7. Fora de escopo

- Reescrever conteúdo/dados (só estilo/tema).
- Ornamentos/bordas ilustradas elaboradas (cantos decorados com arte) — pode ser refinamento futuro;
  esta fatia entrega a paleta, tipografia (Tormenta nos títulos) e o layout híbrido aprovados.
- Modo claro/escuro alternável — não pedido.

## 8. Estrutura de arquivos afetada

```
site/
├── app/fonts/Tormenta20x.ttf      # NOVO (movido da raiz; versionado)
├── app/globals.css                # tokens do tema híbrido + classe de título Tormenta/degradê
├── app/layout.tsx                 # next/font/local; lang pt-br; metadata
├── app/page.tsx                   # home no novo tema
├── app/racas/page.tsx             # índice no novo tema
├── app/estilo/page.tsx            # vitrine atualizada
├── components/FichaRaca.tsx       # card pergaminho + faixa de título degradê
├── components/Ficha.tsx           # idem (entidades genéricas)
├── components/Tooltip.tsx         # gatilho terracota pontilhado
├── components/LinkEntidade.tsx    # link carmesim
└── components/Divisor.tsx         # flourish ouro/vermelho
(raiz)
└── Tormenta20x.ttf                # removido após mover para site/app/fonts/
```
