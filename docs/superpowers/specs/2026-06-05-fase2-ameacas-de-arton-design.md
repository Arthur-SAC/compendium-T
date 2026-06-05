# Fase 2.0 — Fundação multi-fonte + spike Ameaças de Arton — Documento de Design

**Data:** 2026-06-05
**Status:** Aprovado para planejamento

---

## 1. Objetivo

Transformar o site de "um livro" em **multi-livro de verdade**, validado ponta a
ponta com uma seção de **Ameaças de Arton** aparecendo no site, marcada pela fonte.

Esta é uma **fatia vertical** (espelha Fase 0 → Fase 1): entrega a fundação
multi-fonte + multi-tipo e a prova com um spike real; a extração completa de
Ameaças vem em um **plano separado** depois.

## 2. Decisões do usuário (não mudar)

1. **Livro:** Ameaças de Arton primeiro (reusa schema `criatura` + `FichaCriatura`
   já validados no Cap. 7; resolve o seed Súcubo deslocado).
2. **Abordagem:** fatia vertical — fundação + spike de uma seção, depois plano completo.
3. **Marcação de fonte:** selo em **toda** ficha (Básico também) + índices unificados
   por tema/categoria, cada linha com selo. Filtro por fonte fica para depois (YAGNI).
4. **Multi-tipo:** Ameaças NÃO é só bestiário. A fonte segura vários tipos de entidade —
   `criatura`, `raca` (jogáveis), `item`/`item-magico`, e quadros/regras soltos.
5. **Decisão 8 preservada:** expansão é camada separada (pasta própria), **nunca
   sobrescreve** o Básico; marcada visualmente pela fonte.
6. **Rigor de extração** (§7 da spec original): capturar conteúdo "escondido" —
   quadros/sidebars coloridos, raças embutidas, itens soltos. 2 passadas por visão.

## 3. Contexto do livro (fundamentado no PDF real)

- **Ameaças de Arton:** 436 páginas, organizado por **temas de criatura** (Áreas de
  Tormenta, Brutos & Indomáveis, Dragões, Duyshidakk, Elementais, Ermos, Gnolls,
  Golens, …) — mesma estrutura do bestiário do Cap. 7.
- **Raças jogáveis** aparecem como blocos **"X: Habilidades de Raça"** dentro da
  entrada da criatura (Meio-Orc, Orc, Tabrachi, Bugbear, Hobgoblin, Centauro, Gnoll,
  Kaijin, Kappa, Mashin, Stagh, Finntroll, …). Há uma seção consolidada
  **"Habilidades de Raça" na p.303** (impressa) referenciada no sumário.
- **Itens e quadros soltos** espalhados pelo livro (capturar fielmente).

## 4. Arquitetura

### 4.1 Carregador multi-fonte (o pré-requisito)
- `carregarEntidades()` / `carregarTermos()` deixam de ter `dirs = ["livro-basico"]`
  fixo. Passam a **ler `data/sources.json`** e carregar a pasta de cada fonte listada,
  na ordem do campo `ordem`.
- Cada entidade já carrega `fonte.livro` (slug); o carregador cruza com `sources.json`
  para obter o título legível da fonte.
- **Auto-link / desambiguação:** mantém o comportamento atual *first-wins por ordem de
  fonte* — Básico antes das expansões. A ordem de carregamento segue `sources.json.ordem`,
  garantindo que colisões de nome resolvam a favor do Básico.
- A pasta de uma fonte pode conter **qualquer tipo** de entidade (subpastas
  `criaturas/`, `racas/`, `itens/`, `itens-magicos/`, `regras/`, …). O carregador lê
  todo JSON recursivamente e valida por `tipo` no schema — nenhum código novo por tipo.

### 4.2 Marcação de fonte
- Componente novo **`SeloFonte`** (ícone SVG monocromático no tema, **sem emoji**),
  exibindo o título da fonte (ex.: "Ameaças de Arton").
- Aparece no **header de toda ficha** e em **cada linha de índice**. O Básico também é
  marcado ("Livro Básico"), por consistência e clareza de procedência.
- Os dados já existem: toda entidade tem `fonte { livro, pagina }`. O título vem do
  cruzamento `fonte.livro` × `sources.json`.

### 4.3 Modelagem: raça jogável embutida na criatura
- Uma entrada como "Orc" contém o **stat block** (vira entidade `criatura`) **e** o
  bloco "Orc: Habilidades de Raça" (vira entidade `raca`), ambos
  `fonte: ameacas-de-arton`.
- A extração **separa** nos dois registros, **cruzados por relação** (a criatura aponta
  para sua raça jogável e vice-versa) para navegação.
- Raças de Ameaças entram no índice `/racas` (com selo); criaturas no `/bestiario`
  (com selo); itens no `/equipamento` ou `/itens-magicos`. Todos unificados, marcados
  pela fonte.

### 4.4 Mover o seed Súcubo (resolve dívida antiga)
- `data/livro-basico/criaturas/sucubo.json` → `data/ameacas-de-arton/criaturas/sucubo.json`
  (ele já tem `fonte.livro = "ameacas-de-arton"`).
- Remover a exceção no índice do bestiário que escondia o seed do Básico.
- Ajustar `seed.test.ts` que referenciava o caminho antigo.

## 5. Escopo da fatia (spike)

**Seção do spike: "Brutos & Indomáveis" (impressa p.30+).** Escolhida porque tem, na
mesma seção, **criaturas** (Orc Mutante, Orc Xamã, Sapo Atroz, …) **e raças jogáveis**
(Meio-Orc, Orc, Tabrachi: Habilidades de Raça) — valida **criatura + raça numa fonte
só**, a prova de arquitetura mais forte. (Áreas de Tormenta não tem raça jogável.)

Entregáveis do spike:
1. Carregador multi-fonte lendo `sources.json` (§4.1) + testes.
2. `SeloFonte` em fichas e índices (§4.2) + testes.
3. Súcubo realocado para `data/ameacas-de-arton/criaturas/` (§4.4) + ajuste de teste.
4. **Extração validada da seção "Brutos & Indomáveis"** (2 passadas por visão):
   - criaturas → `data/ameacas-de-arton/criaturas/`
   - raças jogáveis → `data/ameacas-de-arton/racas/`, cruzadas com as criaturas
   - quaisquer quadros/itens soltos da seção, capturados fielmente
5. **Descobrir o offset de página de Ameaças** (Básico era impressa+6; Ameaças pode
   diferir — confirmar no spike e documentar).
6. Validação: `tsc` + suíte (carregador multi-fonte + `SeloFonte` + Súcubo) + build
   estático + conferência visual das fichas novas com selo "Ameaças de Arton" e das
   raças no `/racas`.

## 6. Fora de escopo (vai para o plano completo seguinte)

- Demais temas/criaturas de Ameaças (centenas), todas as raças jogáveis e itens.
- A intro de regras de Ameaças (Cap. 1: Fichas de Criaturas, Tipos de Criaturas,
  Habilidades Gerais; seção consolidada "Habilidades de Raça" p.303) como páginas `regra`.
- Templates/modelos de criatura, se houver.
- Filtro por fonte nos índices (só se for pedido depois).

## 7. Pipeline de extração (reuso)

Idêntico ao validado na Fase 1: `pdftotext -layout -enc UTF-8` (texto = fonte da
verdade) + `pdftoppm -r 300` (imagem para ver quadros/sidebars) + `pdfimages` (artes),
processado por visão em **2 passadas** (extrator + revisor independente), com
proveniência `{ livro, pagina }` em cada registro. poppler já instalado localmente em
`extracao/poppler-bin/poppler-26.02.0/Library/bin`.

## 8. Riscos e mitigação

- **Offset de página desconhecido** → descobrir no spike conferindo o rodapé impresso
  vs. página do PDF; documentar para o plano completo.
- **Separar criatura × raça na mesma entrada** → regra clara: stat block = `criatura`;
  bloco "Habilidades de Raça" = `raca`; cruzar por relação. Validar no spike.
- **Colisão de nomes entre fontes** (ex.: uma criatura/raça com nome já usado no Básico)
  → desambiguação por fonte; auto-link first-wins por ordem (`sources.json`). Conferir.
- **Conteúdo escondido** (quadros, raças, itens soltos) → 2 passadas por visão; o revisor
  confere completude contra a imagem da página.

## 9. Validação de sucesso da fatia

- Build estático passa, com as novas fichas de "Brutos & Indomáveis" pré-renderizadas.
- `/bestiario` mostra as criaturas novas (com selo "Ameaças de Arton") junto das do Básico.
- `/racas` mostra Meio-Orc/Orc/Tabrachi (com selo), reusando `FichaRaca`.
- Toda ficha mostra o `SeloFonte` (Básico inclusive).
- Suíte verde (incl. testes novos do carregador multi-fonte e do `SeloFonte`).
