# Fase 2 — Heróis de Arton (3ª fonte) — Design

**Data:** 2026-06-08
**Status:** aprovado (design); aguardando spec review → plano de implementação
**Fonte:** `pdfs/T20-Herois-de-Arton-v1-1.pdf` (332 páginas PDF / 328 impressas)
**Offset:** PDF = impressa + 2 (confirmado: sumário "Prefácio…4" ↔ rodapé "4" na página PDF 6)

## Objetivo

Extrair o livro **Heróis de Arton** por completo como 3ª fonte da wiki, reusando o
pipeline multi-fonte e os componentes já existentes (criados nas Fases 1 e 2/Ameaças),
e implementando os dois conceitos novos do livro: **Distinções** e **Classes Variantes**.

Meta de fidelidade e políticas herdadas (não mudam):
- **Mecânica 100% fiel** ao PDF; **nunca inventar dados**.
- Camada por fonte: **nunca sobrescreve** Livro Básico nem Ameaças de Arton.
- Validação por visão (2 passadas + revisor independente), como nas ondas de Ameaças.
- Pular reprints de fontes anteriores (fonte anterior é canônica); a guarda
  `idsDuplicados()` do carregador pega colisões `tipo/id` no build.
- `SeloFonte` já marca a origem em fichas e índices.

## 1. Fundação (multi-fonte)

- Acrescentar a `data/sources.json`:
  `{ "slug": "herois-de-arton", "titulo": "Heróis de Arton", "arquivo": "T20-Herois-de-Arton-v1-1.pdf", "ordem": 3 }`.
- Carregador multi-fonte (`lib/dados.ts`) e `SeloFonte` já existem — **sem mudança de infra**.
- Pasta de dados: `data/herois-de-arton/<tipo>/...`.

## 2. Tipos de dados

### Reusados sem mudança
`raca`, `classe`, `origem`, `poder`, `magia`, `item`, `item-magico`, `regra`,
`regra-de-criacao`. (Já no enum `TIPOS_ENTIDADE` e com schema/ficha prontos.)

### Novos (já reservados no enum `TIPOS_ENTIDADE`; falta schema + ficha)

**`distincao`** — conceito novo do T20 (Cap. 2). Cada distinção =
admissão + marca + poderes da distinção. **Decisão do usuário: modelar como as
Classes — poderes embutidos na própria entidade** (não como entidades `poder` avulsas).

`DistincaoMecanicaSchema`:
- `admissao: string` — critérios narrativos de ingresso.
- `marca: { nome: string, descricao: string }` — habilidade automática recebida ao conquistar.
- `poderes: PoderClasseSchema[]` — poderes exclusivos da distinção (nome/descrição/
  prerequisito?/custo?/efeitos?). Reusa o `PoderClasseSchema` existente.
- `beneficioAdicional?: string` — bônus que algumas distinções dão por possuir N poderes da distinção.

Componentes: `FichaDistincao` (admissão → marca → poderes → benefício adicional) +
índice `/distincoes` + atalho na home. Patamar mínimo (veterano/5º nível) citado no texto da regra.

**`variante-classe`** — Cap. 1. Reusa o **`ClasseMecanicaSchema` completo** + campo novo
`varianteDe: string` (slug da classe básica). **Decisão do usuário: ficha COMPLETA**
(a variante vira um card próprio em `/classes`, como se fosse uma classe inteira), com
**faixa de aviso** no topo:

> ⚠️ **Classe Variante** — Esta é uma variante de **{Classe Básica}**. Substitui
> características da classe básica e **não pode fazer multiclasse** com ela (para
> todos os efeitos, são a mesma classe).

Montagem dos dados (fiel ao livro): o livro só imprime *o que muda*. Cada variante é
composta a partir da **classe básica já extraída (100% fiel)** + as **substituições
listadas no livro** para aquela variante. Tudo vem do PDF (é composição, não invenção);
validado por visão. Renderiza com a `FichaClasse` (+ aviso); selo "Variante" no índice.

Tabela 1-2 (mapa básica → variante, lido da imagem da impr. 22):

| Classe básica | Variante | | Classe básica | Variante |
|---|---|---|---|---|
| Arcanista | Necromante | | Inventor | Alquimista |
| Bárbaro | Machado de Pedra | | Ladino | Ventanista |
| Bardo | Magimarcialista | | Lutador | Atleta |
| Bucaneiro | Duelista | | Nobre | Burguês |
| Caçador | Seteiro | | Paladino | Santo* |
| Cavaleiro | Vassalo | | | |
| Clérigo | Usurpador | | | |
| Druida | Ermitão | | | |
| Guerreiro | Inovador | | | |

(*) Paladino→Santo: a última linha da tabela ficou cortada na borda inferior da página;
inferida pela exclusão (Santo é a única das 14 variantes do sumário sem básica atribuída) —
**confirmar na Onda 1**.

## 3. Conteúdo do livro (mapa por capítulo)

- **Cap. 1 — Campeões de Arton (impr. 6):** Novas Raças (Duende 8, Eiradaan 12, Galokk 13,
  Meio-Elfo 14, Sátiro 15); Nova Classe: Treinador (16); 14 Classes Variantes (22);
  Novas Origens (46); Novos Poderes de Classe (54, 13 classes); Novos Poderes Gerais (78:
  Combate/Destino/Magia/Tormenta/Raça/Grupo); Tabelas para Personagens (96).
- **Cap. 2 — Distinções (impr. 102):** Distinções em Jogo (104), Usando Distinções (105),
  ~40 distinções (Aeronauta Goblin 106 → Vigarista 211).
- **Cap. 3 — Arsenal dos Heróis (impr. 214):** Novos Equipamentos (216: Armas, Armaduras &
  Escudos, Itens Gerais, Itens Superiores, Capangas 240, Veículos 241, Bases 244); Novas
  Magias Arcanas (252); Novos Itens Mágicos (256: Armas, Armaduras & Escudos, Esotéricos,
  Acessórios, Itens Inteligentes 269, Itens Amaldiçoados 271, Artefatos 274).
- **Cap. 4 — Regras Opcionais (impr. 278):** Atributos Variados, Raças Abertas, Devoções
  Abertas, Complicações, Idades Variadas, Objetivos Heroicos, Papéis no Grupo, Combate
  Avançado (296), Culinária Avançada (305), Exploração de Masmorras (310), Domínios/regência
  (314), Lista de Regras Opcionais (328).

## 4. Ordem de execução (ondas)

| Onda | Natureza | Conteúdo | Modelo |
|---|---|---|---|
| **A** | código (mecânico) | fonte no `sources.json` + schema/ficha/wiring de `variante-classe` em `/classes` | Sonnet + revisão |
| **1** | dados | Cap. 1: 5 raças, Treinador, 14 variantes, origens, poderes (classe + gerais), tabelas | extração por visão |
| **B** | código (mecânico) | schema/ficha de `distincao` + índice `/distincoes` + atalho na home | Sonnet + revisão |
| **2** | dados | Cap. 2: ~40 distinções | extração por visão |
| **3** | dados | Cap. 3: equipamentos, itens superiores, capangas, veículos, bases, magias arcanas, itens mágicos | extração por visão |
| **4** | dados | Cap. 4: regras opcionais + Domínios (tipo `regra`) | extração por visão |

Cada onda de dados: blocos com revisor independente; commits por bloco; ao fechar a onda,
`tsc` limpo + suíte verde + `npm run build` ok. Caches de imagem 300 DPI em
`extracao/cache/herois-*`.

## 5. Pontos a decidir na execução (não bloqueiam o início)

- **Cap. 3 — "Capangas" (240), "Veículos" (241), "Bases" (244):** inspecionar a natureza
  mecânica ao chegar e mapear para o tipo certo (`item`, `criatura` ou `regra`). Veículos já
  têm precedente como `item` no Básico.
- **Auto-link:** registrar os novos nomes próprios (raças, distinções, poderes); manter a
  regra de inicial-maiúscula que mitiga falsos positivos de palavras comuns.
- **Colisões entre fontes:** Heróis traz conteúdo majoritariamente novo, mas conferir
  magias/poderes/itens homônimos (a guarda `idsDuplicados` falha o build se houver colisão).

## 6. Backlog / dívidas registradas

- **Repensar a apresentação das Regras** (opcionais e gerais) — formato a definir com o
  usuário no futuro (pedido explícito, 2026-06-08). Esta fase apenas adiciona as regras
  opcionais como `regra`; o redesenho da seção de regras é trabalho separado.
- Dívidas leves herdadas de Ameaças (normalização de "—" de atributo, flavor sintetizado)
  permanecem fora de escopo desta fase.

## 7. Validação e Definition of Done

- `tsc --noEmit` exit 0; suíte Vitest verde; `npm run build` sem erros (valida todos os
  JSONs via Zod ao prerenderizar).
- Catálogo de Heróis revisado por visão (mecânica 100% fiel).
- Novos tipos (`distincao`, `variante-classe`) com testes de schema + ficha + índice.
- `PROGRESSO.md` atualizado ao fim de cada onda.
- Livro 100% coberto (catálogos + regras); reprints documentados; pulados sem mecânica
  (créditos, índices/apêndices) registrados.
