# Compêndio Tormenta 20 — Documento de Design

**Data:** 2026-05-28
**Status:** Aprovado para planejamento

---

## 1. Objetivo

Construir uma **wiki digital completa e navegável** do RPG Tormenta 20, extraída
dos livros oficiais em PDF, para o usuário consultar enquanto cria mesas e
personagens com os amigos.

Características essenciais:

- Tudo extraído dos PDFs — **nunca inventar dados**.
- Busca livre, estilo wiki real.
- **Tooltips** ao passar o mouse sobre condições, termos de regra e
  características de arma (ex.: "Medo — −2 em testes, ataques e Defesa…").
- **Ligação de pontos**: relações navegáveis entre personagens, regiões, itens,
  divindades, criaturas, classes, etc.
- Ilustrações dos livros associadas às fichas.
- Visual com cara de jogo, animado.
- **Extensível**: ao lançarem livros novos, adicionar é simples.
- **Regras completas do jogo**: combate, ações, movimento, condições, descanso,
  magia, exploração, interação social, progressão, e as regras de mestrar
  (montar encontros, recompensas, perigos). O objetivo é **não precisar mais dos
  livros para jogar** — a wiki é referência de regras completa e autossuficiente.
- **Trilhas de aprendizado guiadas**, separadas por papel (jogador e mestre têm
  funções diferentes), que ensinam o jogo na ordem certa, do zero.

## 2. Decisões do usuário (não mudar)

1. **Visual aprovado:** estrutura de "grimório antigo" (tomo ornamentado, serifa
   de fantasia, bordas decoradas) na **paleta da Tormenta** (roxo/magenta +
   carmesim, brilho neon sobre fundo escuro). **Ícones SVG monocromáticos, nunca
   emojis.**
2. **Estratégia:** fatia vertical — site + pipeline completos usando só o Livro
   Básico primeiro, depois encaixar os outros 7 livros.
3. **Uso:** roda local no PC agora, e preparado para publicar online (Vercel) depois.
4. **Escopo:** wiki primeiro; ferramentas geradoras (NPC, encontros) são fases
   futuras — mas o modelo de dados já deve suportá-las (fichas mecânicas completas).
5. **Rigor máximo na extração, pode demorar.** Qualidade antes de velocidade.
6. **Nunca inventar dados** — tudo vem dos PDFs.
7. **Capturar conteúdo "escondido"** — quadros coloridos, sidebars, tabelas no
   meio do texto. (Falha conhecida da tentativa anterior: ignorava blocos coloridos.)
8. **Separação por fonte:** conteúdo de expansões nunca sobrescreve o Livro
   Básico; fica em camada separada e marcada com a fonte.

## 3. Arquitetura

Três camadas independentes:

```
PDFs (8 livros) ──► [Pipeline de extração] ──► Dados JSON ──► [Site wiki] ──► local / Vercel
```

### 3.1 Pipeline de extração
- Scripts executados sob demanda (ao adicionar/atualizar um livro).
- Ferramentas: **poppler** (`pdftotext -layout`, `pdftoppm`, `pdfimages`) já
  disponíveis na máquina; orquestração em **Node** (o site é Node) com auxílio de
  **Python** quando útil.
- Método **híbrido** (ver §7).

### 3.2 Dados JSON (fonte da verdade)
- Uma pasta por **fonte** (livro). Arquivos pequenos por categoria.
- Cada registro tem `id` estável, campos mecânicos, e `source: { book, page }`.
- Versionável em git.

### 3.3 Site
- **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion.**
- **Exportação estática** (`output: export`): todo conteúdo é conhecido em build,
  então o site vira arquivos estáticos — roda local com um comando e publica na
  Vercel sem alteração.
- Busca client-side (índice pré-gerado, ex.: FlexSearch/Pagefind).

## 4. Modelo de dados e relações

### 4.1 Tipos de entidade
`Raça`, `Classe`, `Origem`, `Poder`, `Magia`, `Perícia`, `Item/Equipamento`,
`Condição`, `Divindade`, `Criatura`, `NPC`, `Região/Local`, `Distinção`,
`Variante de classe`, `Linhagem`, `Termo de regra`, `Regra` (página de regra:
combate, ações, magia, descanso, mestrar, etc.), `RegraDeCriação` (tabelas e
fórmulas de balanceamento — ver §13).

Toda entidade mecânica (poder, item, magia, criatura, origem) guarda também
**campos mecânicos estruturados e legíveis por máquina** (custo, pré-requisitos,
ND, dano, efeitos, modificadores de atributo, habilidades por nível), não só
texto — pré-requisito para os geradores da §13 (incluindo raça e classe).

### 4.2 Campos comuns a toda entidade
- `id` (slug estável), `nome`, `tipo`, `resumo`, `source { book, page }`,
  `imagens[]`, `corpoEstruturado` (seções), `relacoes[]`.

### 4.3 Relações (arestas navegáveis)
Cada relação é `{ tipo, alvoId, rotulo }`. Exemplos:
- **Criatura** → `habitaEm` Região, `serve` Divindade, `vulneravelA` Item,
  `verTambem` Criatura.
- **Divindade** → `devotos` (Raças/Classes), `concede` Poderes,
  `reliquia` Itens, `cultuadaEm` Região.
- **Classe** → `concedePoder` Poder, `temVariante` Variante.
- **Poder** → `requer` Poder (pré-requisito).
- **Magia** → `escola`, `quemConjura` (Classe).
- **Item** → `associadoA` Divindade/Região, `usadoPor` NPC.
- **Região** → `abriga` Criatura/NPC, `cultua` Divindade, `vizinhaDe` Região.
- **NPC** → ficha completa ligando Raça, Classe, Poderes, Itens, Região.
- **Origem** → `regiaoDeOrigem` Região (origens regionais do Atlas).

As relações são **bidirecionais na exibição**: a página da Região lista as
criaturas que a citam, mesmo que o vínculo tenha sido declarado na criatura.

## 5. Tooltips vs. Links

- **Tooltip (hover, sem navegar):** condições, termos de regra, características de
  arma. Conteúdo vem de `referencia/glossario.json` e `referencia/condicoes.json`.
- **Link (clique → ficha):** entidades nomeadas. Hover mostra mini-card de prévia.
- **Marcação automática:** ao renderizar o texto de uma ficha, um passo de
  pós-processamento detecta termos conhecidos (por dicionário de termos + nomes de
  entidades) e os transforma em tooltip/link, sem marcação manual no JSON.
- Desambiguação por contexto/fonte quando um nome colide.

## 6. Regras completas e trilhas de aprendizado

Objetivo declarado pelo usuário: **a wiki deve substituir os livros na mesa**.
Logo, além dos catálogos de entidades, ela contém **todas as regras do jogo**,
estruturadas e cruzadas.

### 6.1 Regras completas
Cada bloco de regra vira uma página `Regra`, com seções, exemplos, quadros e
tabelas — extraídos principalmente dos capítulos de regras do Livro Básico
(Jogando, Mestrando) e de regras espalhadas pelas expansões. Cobertura mínima:

- **Combate:** turnos, iniciativa, ações (padrão/movimento/livre/reação),
  ataques, dano, acerto crítico, manobras, alcance, cobertura, condições de combate.
- **Movimento e exploração:** deslocamento, terreno, viagem, ambientes.
- **Magia:** conjuração, custo em PM, resistência, escolas, aprimoramentos.
- **Descanso e recuperação**, **progressão/XP**, **interação social/perícias**.
- **Mestrar:** dificuldades, montar encontros, perigos, recompensas e tesouro.

Regras se ligam ao resto: a regra de "ataque" linka para a condição que aplica,
para a perícia usada, para o item, etc. Termos viram tooltip onde citados (§5).

### 6.2 Trilhas de aprendizado (por papel)
Percursos guiados que ensinam o jogo do zero, na ordem certa, com texto próprio
de apresentação encadeando as páginas de regra/ficha já existentes (sem duplicar
conteúdo):

- **Trilha do Jogador:** o que é o jogo → criar personagem (raça, classe, origem,
  perícias, poderes, equipamento) → ler sua ficha → como agir em combate → como
  usar magia/habilidades → subir de nível.
- **Trilha do Mestre:** papel do mestre → preparar uma sessão → narrar e arbitrar
  testes → rodar combate → montar encontros equilibrados → dar recompensas →
  construir uma mesa/aventura.

Cada trilha é uma sequência de passos com progresso visível; cada passo aponta
para as páginas de regra/entidade reais da wiki. As duas trilhas convivem e o
usuário escolhe o papel ao entrar.

## 7. Pipeline de extração (resolve o problema das caixas coloridas)

Processamento **página por página**, combinando duas fontes:

1. **Texto** via `pdftotext -layout` — fonte da verdade para grafia, números e
   acentos (UTF-8 confirmado correto). Nunca parafrasear números/nomes.
2. **Imagem da página** via `pdftoppm` — analisada por visão para entender a
   estrutura e **identificar caixas/sidebars coloridas e tabelas**, garantindo que
   o texto correspondente (que está no fluxo do PDF) seja atribuído à entidade
   certa e nunca pulado.
3. **Ilustrações** via `pdfimages` — extraídas e associadas por página.
4. **Provtência** `{ book, page }` em cada registro.
5. **Validação (segunda passada):** releitura da página conferindo completude
   contra o JSON gerado (quadros, tabelas, sidebars, apêndices, índice remissivo).

PDFs grandes são divididos em partes para processamento. Trabalho em blocos com
subagentes paralelos para escala, sempre com verificação de **conteúdo** (não só
contagem).

## 8. Extensibilidade

- **Manifesto de fontes** (`data/sources.json`) lista os livros e seus metadados.
- Adicionar um livro = rodar o pipeline nele + soltar o JSON na pasta da fonte; o
  site descobre e inclui automaticamente.
- Novos tipos de entidade são possíveis sem reescrever o núcleo.
- Expansões ficam em camada separada (nunca sobrescrevem o Básico) e são
  marcadas visualmente com a fonte na ficha.

## 9. Estrutura de pastas (proposta)

```
compendium tormenta 20/
├── pdfs/                      # os 8 PDFs (movidos da raiz)
├── extracao/                  # scripts do pipeline + páginas renderizadas (cache)
├── data/
│   ├── sources.json           # manifesto de livros
│   ├── referencia/            # glossario.json, condicoes.json (tooltips)
│   ├── livro-basico/          # racas/, classes/, magias/, poderes/, origens/, ...
│   ├── ameacas-de-arton/      # bestiario/...
│   └── ...                    # uma pasta por fonte
├── site/                      # app Next.js
│   ├── app/                   # rotas (índices + fichas por tipo)
│   ├── components/            # Ficha, Tooltip, LinkEntidade, Busca, ...
│   ├── lib/                   # carregamento de dados, índice de busca, auto-link
│   └── styles/                # design system "Grimório/Tormenta"
└── docs/                      # specs e planos
```

## 10. Fases de construção

- **Fase 0 — Fundação:** mover PDFs para `pdfs/`; scaffold Next.js; design system
  do tema aprovado (cores, tipografia, componentes base: Ficha, Tooltip,
  LinkEntidade, Busca); esquema TypeScript das entidades; esqueleto do pipeline de
  extração validado em algumas páginas.
- **Fase 1 — Livro Básico ponta a ponta:** extração completa e validada (raças,
  classes, origens, perícias, poderes, magias, equipamentos, condições, glossário,
  capítulo do mundo, **todas as regras** — combate, magia, exploração, mestrar — e
  as **regras de criação/balanceamento** da §13); todas as páginas de ficha e de
  regra; busca; tooltips; auto-link; imagens; **Trilha do Jogador e Trilha do
  Mestre** (§6.2). **Entregável: wiki jogável, suficiente para rodar mesa sem o livro.**
- **Fase 2 — Demais livros:** Ameaças, Atlas, Heróis, Deuses de Arton, Deuses
  Menores, Guia de NPCs, Encartes — cada um como fonte, reusando pipeline e
  componentes.
- **Fase 3+ (futuro, spec próprio):** geradores criativos balanceados (§13). O
  modelo de dados das Fases 1–2 já os suporta.

## 11. Fora de escopo (por enquanto)

- Geradores criativos (§13) — ficam para a Fase 3+, com spec próprio. Apenas a
  **base de dados** que os habilita é construída nas Fases 1–2.
- Edição colaborativa / multiusuário.
- Mesa virtual / rolagem de dados integrada.

## 12. Riscos e mitigação

- **Layout complexo dos PDFs** → método híbrido texto+imagem; validação página a página.
- **Volume (8 livros, ~490 MB)** → fatia vertical; subagentes paralelos em blocos.
- **Direitos autorais ao publicar** → manter privado/local por padrão; só publicar
  sob decisão explícita do usuário.
- **Colisão de nomes em auto-link** → desambiguação por tipo/fonte.
- **Geradores que produzem conteúdo desbalanceado** → fundamentar nos parâmetros
  oficiais de criação (§13); marcar saídas como "geradas" e mostrar os números que
  justificam o balanceamento, para o mestre revisar.

## 13. Geradores criativos balanceados (Fase 3+, visão)

Não são sorteadores de conteúdo pronto: são ferramentas que **recombinam os
componentes e funções das regras** para **criar entidades novas e balanceadas**,
usando os próprios parâmetros de criação do sistema (extraídos como
`RegraDeCriação` nas Fases 1–2). Saídas sempre marcadas como "geradas" e
exportáveis como fichas da wiki.

Geradores previstos:

- **Gerador de Criatura:** monta um monstro novo a partir do **ND alvo**, usando
  as tabelas de criação de criaturas (PV/Defesa/ataques/perícias por ND) e um
  banco de habilidades especiais; combina partes coerentes e valida contra os
  alvos numéricos do ND.
- **Gerador de Item:** cria itens (mágicos/alquímicos/relíquias) combinando
  encantamentos/propriedades existentes e calculando preço/categoria pelas regras
  de precificação do sistema.
- **Gerador de Poder:** propõe um poder novo combinando efeitos/benefícios e
  pré-requisitos de poderes existentes, dentro de um "orçamento" de potência.
- **Gerador de Origem:** monta uma origem nova seguindo a fórmula do sistema
  (perícias/poderes concedidos + poder de origem + item inicial).
- **Gerador de Raça:** cria uma raça nova combinando modificadores de atributo e
  habilidades raciais existentes dentro de um orçamento de poder racial
  (tamanho, deslocamento, ~3 habilidades), mantendo o equilíbrio das raças oficiais.
- **Gerador de Classe:** monta uma classe nova seguindo o esqueleto do sistema
  (dado de PV/PM por nível, perícias e proficiências iniciais, e habilidades de
  classe distribuídas do 1º ao 20º nível), respeitando o orçamento de poder por
  nível das classes oficiais. **As habilidades de classe são geradas pelo motor do
  Gerador de Poder, porém guiadas por um TEMA comum** informado pelo usuário (ex.:
  "Samurai" → habilidades de honra, katana, postura de combate, golpe decisivo).
  O tema é uma restrição criativa que orienta quais efeitos/flavor combinar e os
  nomes; o **balanceamento continua garantido pelos orçamentos** por nível, e a
  saída é marcada como "gerada" para revisão do mestre.
- **Gerador de NPC:** ficha completa e jogável (nível 1–20), combinando raça,
  classe, poderes, origem e equipamento de forma coerente.
- **Montador de Encontro:** combina criaturas para um grupo/nível alvo, usando o
  orçamento de ND de encontro.

Pré-requisitos (entregues pelas Fases 1–2): campos mecânicos estruturados em todas
as entidades e as `RegraDeCriação` (tabelas de criação de criaturas, precificação
de itens, fórmula de origem, orçamento de poder racial, esqueleto/orçamento de
poder por nível das classes, e orçamento de poder e de encontro).
