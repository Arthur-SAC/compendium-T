# Capítulo 9 — Mundo de Arton — Plano

> Fatia de LORE/CATÁLOGO (regiões), escolhida pelo usuário. Entidades novas do tipo `regiao` (já existe no enum do schema).
> Regiões são **prosa** (como origens) → reusam o `Ficha` genérico (sem schema/componente novo; `mecanica` freeform/vazia
> não dispara superRefine). Texto de apoio: `extracao/cache/arton.txt` (pdftotext PDF 356–398).

**Goal:** O cenário de Arton no site — cosmologia/cronologia + um catálogo navegável de **regiões** (O Reinado e Além do Reinado),
com auto-link cruzando deuses, raças e criaturas citados na lore.

## Limites e estrutura (Sumário + leitura)
- **Capítulo 9: Mundo de Arton** — impressas **350–391** (PDF 356–397). ~42 páginas. Splash em 356–357.
- Seções (do Sumário):
  - **Mundo de Arton** (impressa 350): introdução, cosmologia (mundos/deuses), **Linha do Tempo** (cronologia "Anos AE"), visão geral do Reinado.
  - **O Reinado** (impressa 358): entradas detalhadas das nações civilizadas. Cada região = cabeçalho vermelho + subtítulo + lore
    (ex.: **Deheon — O Reino Central**, com subseção "A Cidade sob a Estátua" = Valkaria, a capital).
  - **Além do Reinado** (impressa 370): terras selvagens e outras regiões/continentes/planos.

## Regiões a extrair (nomes da visão geral — confirmar entradas/páginas na Onda A)
- **O Reinado:** Deheon (reino central, capital Valkaria), Supremacia Purista, Aslothia (Reino dos Mortos), Repúblicas Livres de
  Sambúrdia, Svalas, Salistick, Feudos de Trebuck, Sckharshantallas (Reino do Dragão), Império de Tauron, Khubar.
- **Além do Reinado:** Ermos Púrpuras, Sanguinárias, Galrasia, Grande Savana, Deserto da Perdição. (+ possíveis outras — confirmar.)
- ⚠️ A lista acima vem da visão geral (impressa 358); a Onda A deve mapear as ENTRADAS REAIS (cabeçalhos vermelhos) e páginas,
  pois pode haver mais regiões/subdivisões (cidades, locais notáveis).

## Ondas
- [ ] **A — descoberta + código:** mapear região→página (cabeçalhos vermelhos; render por imagem, pois não são all-caps no texto) →
  `mundo-paginas.md`. Decidir entidade: `regiao` com `secoes` (lore) + `relacoes` (deuses/raças/criaturas citados). Talvez
  `RegiaoMecanica` mínima (capital, clima, povos?) só se o livro trouxer dados estruturados — pelo visto é prosa pura, então
  provável **sem schema novo**. Índice **`/mundo`** (ou `/arton`) listando regiões (Reinado / Além do Reinado) + atalho na home.
  Spike: 1 região (Deheon).
- [ ] **B — extração das regiões** (2 passadas, por imagem p/ fidelidade — "não perder nada"): cada região com flavor/lore completo,
  subseções (cidades/locais), e auto-link acendendo deuses/raças/criaturas. Commit por bloco.
- [ ] **C — cosmologia + cronologia:** regra/página `mundo-de-arton` (intro, mundos, deuses) + a **Linha do Tempo** (cronologia)
  como entidade/tabela. Integração: build + testes; PROGRESSO; commit.

## Notas
- Auto-link já acende deuses (Title-Case) e raças/classes — a lore vai cruzar muito com /deuses e /racas.
- Possível componente futuro `FichaRegiao` (mapa, vizinhança, devoção) — só se agregar valor; começar com o `Ficha` genérico.
- Criaturas (Cap. 7 Ameaças) ainda não existem como entidades; relações `abriga Criatura` ficam pendentes até essa fatia.
