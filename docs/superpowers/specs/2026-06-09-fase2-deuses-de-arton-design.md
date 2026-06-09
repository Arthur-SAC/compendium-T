# Deuses de Arton — Design (Fase 2, 4ª fonte)

**Data:** 2026-06-09
**Fonte:** `T20-Deuses-de-Arton-v1-1.pdf` (324 páginas, 4 capítulos)
**Slug da fonte:** `deuses-de-arton` (ordem 4 no manifesto)

> Camada por fonte: este livro **nunca sobrescreve** o Livro Básico. Tudo que ele acrescenta
> entra como entidades próprias da fonte `deuses-de-arton`, agregadas no render por lookup.

---

## Objetivo

Extrair o livro Deuses de Arton de ponta a ponta para a wiki, com destaque para **enriquecer as 20
divindades já existentes** (do Básico) com lore estendido, devotos, **Avatar** (bloco de criatura),
**Artefatos Divinos**, **retrato do deus** e (quando houver) **símbolo atualizado** — sem editar os
arquivos do Básico. Também traz conteúdo novo de jogador (classe Frade, linhagem Abençoada, poderes
concedidos, magias divinas, equipamentos litúrgicos), ~22 distinções e um bestiário (Ameaças Divinas).

## Decisões aprovadas pelo usuário

1. **Opção A — agregação por lookup** para enriquecer os deuses (Básico intacto).
2. Blocos de devoto (Sacerdote/Druida/Paladino de cada deus) são **lore** e ficam **na ficha do deus**
   (Opção A); a mecânica (poderes concedidos) continua aparecendo nas fichas de classe via o lookup
   de poderes já existente.
3. **Ordem das ondas:** A (código) → 1 (Cap.3 Deuses) → 2 (Cap.1 Campeões) → 3 (Cap.2 Distinções) →
   4 (Cap.4 Ameaças Divinas).
4. Cada deus passa a ter **retrato (arte do deus)** além do símbolo; a `FichaDivindade` **prefere o
   símbolo atualizado** de Deuses de Arton quando existir (sem editar o dado do Básico — só a regra
   de render prioriza a imagem da fonte mais nova).

## Mapa do livro (sumário)

- **Cap. 1 — Campeões dos Deuses (impr. 8–65):** Ser Devoto, Classes Divinas; Clérigos & Frades
  (Sacerdote de cada um dos 20 deuses + Autoridades Divinas); Druidas (de Aharadak/Allihanna/
  Megalokk/Oceano/Tenebra/Arton); Paladinos (de Azgher/Khalmyr/Lena/Lin-Wu/Marah/Tanna-Toh/Thyatis/
  Valkaria/do Bem); Nova Linhagem: Abençoada; Outros Devotos; Suraggel Variantes; Nova Classe: Frade;
  Novos Poderes Concedidos; Equipamentos Religiosos (aventura, ferramentas, vestuário, esotéricos,
  alquímicos, alimentação, serviços, itens superiores, **itens litúrgicos**); Magias Divinas.
- **Cap. 2 — Distinções (impr. 66–141):** ~22 distinções (Bufão de Hyninn, Cavaleiro da Luz, Cavaleiro
  de Khalmyr, Colecionador Monstruoso, Dançarina de Marah, Detetive de Tanna-Toh, Exegeta do Akzath,
  Forjador Litúrgico, Guardião da Realidade, Herói Henshin, Improvisador de Lena, Inquisidor de Wynna,
  Numeromante, Pacificador, Pregador, Sombra de Tenebra, Sortudo de Nimb, Sumo-Sacerdote, Taumaturgista,
  Teurgista Hermético, Tibarita, Tirano do Terceiro). Conferir a contagem na extração.
- **Cap. 3 — Deuses e Avatares (impr. 142–249):** História do Panteão; os **20 deuses maiores
  expandidos** (Aharadak 148, Allihanna 152, Arsenal 156, Azgher 160, Hyninn 164, Kallyadranoch 168,
  Khalmyr 172, Lena 176, Lin-Wu 180, Marah 184, Megalokk 188, Nimb 192, Oceano 196, Sszzaas 200,
  Tanna-Toh 204, Tenebra 208, Thwor 212, Thyatis 216, Valkaria 220, Wynna 224) — cada um com lore,
  devotos e **Avatar** (stat block); Deuses Menores (228); Os Antigos Deuses (238); Artefatos Divinos (246).
- **Cap. 4 — Ameaças Divinas (impr. 250–323):** Abissais (252), Aspectos dos Deuses (264), Celestiais
  (274), Fadas (286), Gênios (298), Gigantes (306), Perigos Complexos (316), Tabela de Ameaças por ND (319).

> **Offset PDF** a confirmar no início (detectar via âncora). Há um 2º livro de deuses
> (`T20-Guia-de-Deuses-Menores-v1-1.pdf`) — **fonte futura separada**, fora deste escopo.

## Arquitetura de dados

### Enriquecimento dos 20 deuses (Opção A)
- Os 20 arquivos `data/livro-basico/divindades/*.json` ficam **intactos**.
- Cada deus ganha uma **entidade de expansão**: tipo novo **`divindade-expansao`**, id
  `<deus>-deuses-de-arton` (evita colisão com a guarda `idsDuplicados`), campo
  `expandeDivindade: "<id-do-deus-base>"`.
- A `divindade-expansao` carrega: lore estendido + blocos de devoto (Sacerdote/Druida/Paladino de X)
  em `secoes`; `imagens` (retrato do deus; opcionalmente símbolo atualizado em campo dedicado);
  referências leves ao Avatar e aos artefatos (via `relacoes`).
- **Avatar** de cada deus → `criatura` própria (fonte deuses), `relacoes` cruzando deus↔avatar.
- **Novos poderes concedidos** → `poder` com `grupo` = nome do deus (ou "concedido"); aparecem nas
  fichas de classe via o lookup existente e na ficha do deus via o novo lookup.
- **Artefatos Divinos** → `item-magico` (tipoItem "Artefato"), cruzados ao deus por `relacoes`.

### Schema novo
```ts
export const DivindadeExpansaoMecanicaSchema = z.object({
  expandeDivindade: z.string(),          // id da divindade base no Básico (ex.: "khalmyr")
  simboloAtualizado: z.string().optional(), // caminho de imagem, se Deuses de Arton trouxer símbolo novo
});
```
- A entidade `divindade-expansao` usa `nome`, `resumo`, `fonte`, `imagens` (retrato em `imagens[0]`),
  `secoes` (lore + devotos) e `relacoes` (avatar, artefatos) como qualquer entidade.
- Ramo no `superRefine` validando `mecanica` contra esse schema quando `tipo === "divindade-expansao"`.
- Tipo adicionado ao enum `TIPOS_ENTIDADE`.

### Linhagem (Abençoada)
- O enum já tem `linhagem`, mas **não existe nenhuma entidade `linhagem` hoje, nem `FichaLinhagem`,
  nem wiring** no dispatcher/navegação — "Abençoada" seria a **primeira**. O plano deve decidir entre
  (a) construir suporte completo a `linhagem` (ficha + índice/área + dispatcher), já que mais linhagens
  virão de livros futuros, ou (b) modelar "Abençoada" de forma pragmática se o custo não compensar para
  uma única entidade. Recomendação: (a) enxuto — reusar o `Ficha` genérico no dispatcher e exibir as
  linhagens dentro da área `/racas` (linhagens são heranças de raça em T20), sem componente novo pesado.

## Render — `FichaDivindade` enriquecida

O dispatcher (`app/ficha/[tipo]/[id]/page.tsx`), para `tipo === "divindade"`, calcula por lookup:
- `expansao` = `divindade-expansao` com `expandeDivindade === id`;
- `avatares` = `criatura`(s) ligadas ao deus (via relacoes/convention);
- `poderesConcedidosExtras` = `poder` com grupo = deus;
- `artefatos` = `item-magico` ligados ao deus.

A `FichaDivindade` passa a exibir:
- **Retrato grande** do deus (estilo arte de classe/raça), vindo de `expansao.imagens[0]`.
- **Símbolo** na barra de stats: usa `expansao.mecanica.simboloAtualizado` se houver; senão
  `entidade.imagens[0]` (símbolo do Básico).
- Painel **"Em Deuses de Arton"** (com **selo da fonte**): lore estendido + devotos, link pro Avatar
  e pros artefatos, e os poderes concedidos novos.
- Tudo defensivo: deuses sem expansão (caso algum não seja coberto) renderizam como hoje.

## Mapeamento por capítulo

| Conteúdo | Tipo | Observação |
|---|---|---|
| 20 deuses expandidos (Cap.3) | `divindade-expansao` (lookup) | **tipo novo** |
| Avatares (Cap.3) | `criatura` | cruzado ao deus |
| Deuses Menores / Antigos Deuses (Cap.3) | `divindade` (novas) | fonte deuses; não colidem com os 20 |
| Artefatos Divinos (Cap.3) | `item-magico` | tipoItem "Artefato" |
| Frade (Cap.1) | `classe` | reusa |
| Abençoada (Cap.1) | `linhagem` | criar `FichaLinhagem` se faltar |
| Suraggel variantes (Cap.1) | `poder`/`raca` (lookup em suraggel) | reusa (aliases já existem) |
| Novos Poderes Concedidos (Cap.1) | `poder` (grupo = deus) | reusa |
| Equipamentos religiosos/litúrgicos (Cap.1) | `item` / `item-magico` | reusa |
| Magias Divinas (Cap.1) | `magia` | reusa (custoPM por círculo) |
| ~22 Distinções (Cap.2) | `distincao` | reusa |
| Ameaças Divinas (Cap.4) | `criatura` | reusa, com dedup |

## Ondas (decompostas em planos por onda)

- **Onda A — Código:** schema `divindade-expansao` + enum + superRefine; `FichaLinhagem` (se faltar);
  lookup da divindade no dispatcher; `FichaDivindade` (retrato + regra de símbolo + painel "Em Deuses
  de Arton"); fonte `deuses-de-arton` (ordem 4) no manifesto; testes dos tipos novos. **Spike** ponta a
  ponta com 1 deus (ex.: Khalmyr) para validar o padrão de agregação antes do lote.
- **Onda 1 — Cap. 3 (Deuses e Avatares):** 20 expansões + 20 avatares + Deuses Menores + Antigos
  Deuses + Artefatos Divinos. Arte (retratos + símbolos atualizados) em lote.
- **Onda 2 — Cap. 1 (Campeões dos Deuses):** Frade, Abençoada, Suraggel variantes, poderes concedidos,
  equipamentos religiosos/litúrgicos, magias divinas. (Os blocos de devoto de Cap.1 que são lore de um
  deus específico podem ser anexados à `divindade-expansao` daquele deus — coordenar com a Onda 1.)
- **Onda 3 — Cap. 2:** ~22 distinções (tipo `distincao` já existe).
- **Onda 4 — Cap. 4 (Ameaças Divinas):** bestiário por tema (Abissais/Aspectos/Celestiais/Fadas/
  Gênios/Gigantes/Perigos Complexos), com **dedup vs Básico/Ameaças** (Básico canônico) e merge de
  temas homônimos por selo. Tabela de Ameaças por ND como `regra`.

## Procedimento P (por lote, política do projeto)

1. **Spike de cobertura de schema** antes de extrair em lote qualquer tipo (1 exemplar conferido vs
   página); ajustar schema se algo não couber.
2. `pdftotext -layout` é a **fonte da verdade do texto**; renderizar 300 DPI (`pdftoppm`) só para
   layout/tabelas/arte e cabeçalhos estilizados. Conteúdo atravessa 2–3 páginas.
3. Arte via `pdfimages` cor+smask compostos (`comporComMascara`), spot-check por visão.
4. JSON **sem BOM, LF, sem `null`** (omitir chave), campo de seção sempre `texto`.
5. Subagentes **não commitam** (controlador commita por lote, caminhos específicos — nunca `git add -A`).
6. Revisão por visão por amostragem; revisão de fidelidade nas tabelas grandes.

## Definition of Done

- `tsc` 0 · suíte verde (incl. testes dos tipos novos: `divindade-expansao`, `FichaLinhagem`) ·
  `npm run build` verde (Zod valida tudo; guarda `idsDuplicados` sem colisão).
- Revisão por visão por amostragem do conteúdo; arte conferida.
- `PROGRESSO.md` atualizado a cada onda; commits descritivos em pt-br por lote.
- Push/PR só quando o usuário pedir.

## Riscos / pontos de atenção

- **Colisão de id:** as 20 expansões usam id `<deus>-deuses-de-arton`; Deuses Menores/Antigos Deuses
  como `divindade` precisam de ids que não colidam com os 20 do Básico.
- **Dedup Cap.4:** Gigantes/Fadas/Celestiais podem reimprimir criaturas do Básico/Ameaças — pular
  reprints (Básico canônico).
- **Imagens:** retratos e símbolos atualizados vêm do PDF de Deuses de Arton; armazenar em
  `site/public/divindades/` com nomes que não sobrescrevam os símbolos atuais do Básico
  (ex.: `<deus>-retrato.png`, `<deus>-simbolo-da.png`).
- **Devoto packages × ondas:** o lore de devoto (Cap.1) pertence à `divindade-expansao` (Cap.3) —
  garantir no plano que a entidade do deus reúna ambos sem retrabalho.
- **Linhagem:** confirmar como `linhagem` é exibida/indexada hoje antes de criar a ficha.
