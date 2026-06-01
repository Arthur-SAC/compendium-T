# PROGRESSO — Compêndio Tormenta 20

> Estado vivo do projeto. Atualizar a cada tarefa concluída e antes de qualquer compactação.
> Para retomar: ler `CLAUDE.md` + este arquivo e continuar da seção "PRÓXIMA AÇÃO".

**Última atualização:** 2026-06-01
**Fase atual:** Fase 0 ✅ → **Fase 1**. Raças ✅ · Revamp visual ✅ · **Classes ✅ (14/14)** · **Origens ✅ (35/35)** · **Cap. 2 ✅ (Perícias 29 + Poderes 162)** · **Cap. 3 Equipamento em andamento (Ondas A+B: 56 itens — armas/armaduras/escudos/munições)**. Próxima: Onda C (itens gerais).
**Método:** Subagent-Driven Development (1 subagente/tarefa + revisão Opus nas delicadas)

---

## PRÓXIMA AÇÃO (retomar aqui) — dizer só "continua"

➡️ **CAPÍTULO 3 — EQUIPAMENTO em andamento** (plano `docs/superpowers/plans/2026-06-01-equipamento-plano.md`;
mapa `docs/superpowers/plans/equipamento-lista.md`). **Ondas A+B ✅.** Próximo: **Onda C — Itens Gerais (~110)**
(Tabela 3-6, impressas 154–163): Equipamento de Aventura (17), Ferramentas (12), Vestuário (21), Esotéricos (10),
Alquímicos preparados (8)/catalisadores (12)/venenos (10), Alimentação (7), Animais (8), Veículos (5), Serviços (~10).
Depois **Onda D** (regras consolidadas + Melhorias/Materiais Especiais — Tabelas 3-7/3-8/3-9) e **Onda E** (integração
+ build + PROGRESSO). Imagens já em `extracao/cache/discEq/`; schema `item` pragmático já pronto. Subagent-Driven.

**Cap. 3 — Equipamento (progresso):**
- **Onda A (código) ✅**: `ItemMecanicaSchema` (categoria, preco, espacos, blocos opcionais `arma`/`protecao`, `especial`) + ramo no `superRefine`; `FichaItem`; índice `/equipamento` agrupado por categoria + painel; regra `riqueza-e-equipamento` (p.138). Spikes Espada Longa + Cota de Malha.
- **Onda B (armas+proteção) ✅ (56 itens)**: 40 armas (Tabela 3-3, simples/marciais/exóticas/fogo), 4 munições (3-4), 10 armaduras + 2 escudos (3-5). Stats exatos (dano/crítico/alcance/tipo), habilidades e `especial`. Dano duplo (`/`) e crítico composto (`19/x3`) preservados. Visão 2 passadas.
- **FALTAM:** Onda C (itens gerais), Onda D (regras + melhorias/materiais), Onda E (integração).

**Cap. 2 — Perícias & Poderes ✅** (plano `docs/superpowers/plans/2026-06-01-pericias-poderes-plano.md`):
- **Perícias (29) ✅**: schema `pericia` (`PericiaMecanicaSchema` com `usos[]`), `FichaPericia` (+ selos SVG treinada/armadura no índice), `/pericias` + painel de regra, regra `pericias-como-funcionam` (p.114). Tabela 2-1, impressas 114–123.
- **Poderes (162) ✅**: schema `poder` (`PoderMecanicaSchema {grupo, prerequisito?, custo?, descricao}`), `FichaPoder`, `/poderes` agrupado nos 5 grupos + regra `poderes-como-funcionam` (p.124). Mapa em `docs/superpowers/plans/poderes-lista.md`. Grupos: **Combate 40, Destino 20, Magia 8, Concedidos 72, Tormenta 22** (impressas 124–137). Concedidos com devoção no pré-requisito; Tormenta com escalonamento. Visão 2 passadas.
- **Links acendendo:** chips de benefício em `FichaOrigem` (perícias/poderes) viram links quando casam uma entidade. (Estender a `FichaClasse` está no backlog.)

> **Polimento de UI/UX → ver "Backlog de UX/polimento" abaixo.** Decisão (2026-06-01): foco no CONTEÚDO agora;
> um **passe de design dedicado no fim do Livro Básico** aplica o polimento visual de forma uniforme. Inline só
> o que for (a) estrutural/mecanismo (schema, regras "como funciona", auto-link/chip-link, proveniência) ou
> (b) pedido pelo usuário para revisar o conteúdo. O resto entra no backlog.

> **Regras conectivas (decisão do usuário, 2026-06-01):** o objetivo "jogável sem o livro" exige as regras de
> "como funciona X" no site, não só os catálogos. Já feito para **Origens** (`regra-de-criacao` + painel em `/origens`,
> commit das regras). **Backfill pendente:** intros de regra de **Raças** e **Classes** (como funcionam, atributo-chave/PV/PM).
> Cada nova fatia (Perícias, Poderes…) já inclui sua regra "como funcionam". Capítulos de regra inteiros
> (Construção de Personagem, Combate, Magia, Exploração, Mestrar) = fatias dedicadas futuras.

> **Dívida leve (O4 de Origens):** termos citados nas origens (perícias/poderes — futuras categorias; e
> "parceiro"/"patamar veterano-heroico-lenda"/"T$/tibar") ainda não têm tooltip/link próprio. Tratar quando
> Perícias/Poderes existirem (viram links automáticos) + adicionar os termos de regra avulsos ao `data/referencia/`.

**Dicas operacionais (reutilizáveis em qualquer extração):**
- poppler: a env `POPPLER_BIN` **não fica setada** na sessão — usar o caminho literal
  `C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin`. Render `pdftoppm -r 150`; texto `pdftotext -layout -enc UTF-8`.
- Offset do Livro Básico: **PDF = impressa + 6**.
- Ilustração: compor cor+smask com `comporComMascara` de `extracao/src/imagens.ts` via um script **`.mts`**
  em `extracao/cache/...` rodado de `extracao/` (`npx tsx cache/<dir>/compor.mts`); o `pdfimages -png` extrai cor+smask (índices consecutivos). Saída em `site/public/<categoria>/<slug>.png`.
- O `pdftotext` às vezes **embaralha as linhas 7/12/13 (e 14/15) da tabela** — confirmar a ordem pela IMAGEM.
- PV/PM com "+atributo": guardar o inteiro base + registrar o "+atributo" na seção "Pontos de Vida e Mana"/resumo.
- **Editou JSON em `data/`? reiniciar o dev server** (carregador memoizado) para ver no navegador.
- Validação de extração funciona bem por **2 passadas** (extrator + revisor independente, ambos com visão).

**Fatia Classes — CONCLUÍDA ✅** (spec `2026-05-29-demais-classes-design.md`, plano `2026-05-29-demais-classes-plano.md`):
- **C1–C3 (código) ✅**: schema com `conjuracao`+`caminhos` (opcionais); `FichaClasse` renderiza Conjuração/Caminhos;
  índice `/classes` + atalhos na home.
- **C4 (descoberta) ✅**: `docs/superpowers/plans/classes-paginas.md` (14 classes, offset +6).
- **C5 (marciais) ✅ — 10 classes:** Guerreiro (spike) + Bárbaro/Bucaneiro/Caçador (`bfb57f6`) + Cavaleiro/Inventor/Ladino (`017c3a5`) + Lutador/Nobre/Paladino (`ad67c8d`).
- **C6 (conjuradoras) ✅ — 4 classes (`058c69a`):** **Arcanista** (Arcana; caminhos Bruxo/Mago/Feiticeiro + Linhagens),
  **Bardo** (Arcana; Músicas de Bardo), **Clérigo** (Divina; Devoção/Poderes Concedidos + Missas), **Druida** (Divina; Companheiro Animal + Forma Selvagem). Visão 2 passadas, validadas.
- **C7 (tooltips) ✅ (`fd9c789`):** extraído o **apêndice de Condições (35, impressas 394–395)** com descritores; "Medo" reclassificado como tipo de efeito (glossário, p.228); tipos de dano (essência/luz/trevas, p.230) e duração sustentada (p.226).
- **C8 (integração) ✅:** suíte **46 verde**; `npm run build` prerenderiza **as 14 fichas de classe** + `/classes`; HTML confere Conjuração/Caminhos das conjuradoras.

**Fatia Origens — CONCLUÍDA ✅** (plano `docs/superpowers/plans/2026-06-01-origens-plano.md`):
- **O1 (código) ✅ (`a…` no commit de fundação):** `OrigemMecanicaSchema` (itens/itensTexto, beneficios{pericias,poderes,texto}, poderesUnicos) + ramo no `superRefine`; `FichaOrigem`; índice `/origens` + atalho na home; wiring na página de ficha. Origens são **texto puro** (sem ilustração por origem).
- **O2 (spike) ✅:** `acolito.json` validado vs livro (no mesmo commit da fundação).
- **O3 (extração) ✅:** **35 origens** (Tabela 1-19, impressas 85–95) por 6 blocos, visão 2 passadas. Cada uma: flavor, Itens, Benefícios (perícias/poderes), Poder Único. Correções de `fonte.pagina` e pontuação aplicadas após validação independente (atenção: os validadores erraram em `mateiro`/`refugiado` — páginas conferidas na imagem).
- **O4 (tooltips) — diferido** (ver dívida leve acima).
- **O5 (integração) ✅:** suíte **54 verde**; `npm run build` (75 páginas) gera `/origens` + **35 fichas** `/ficha/origem/<slug>`.

> Spike do Guerreiro (plano `2026-05-29-guerreiro-classe-spike-plano.md`) validou schema, `FichaClasse` e pipeline.

**Revamp visual concluído** (plano `2026-05-29-revamp-visual-plano.md`): tema "Tomo de Arton" — casca
escura carmesim + cards de pergaminho legíveis, fonte **Tormenta20x** (`site/app/fonts/`, via
`next/font/local`) nos títulos com degradê dourado→carmesim, acentos carmesim/vermelho/ouro, tooltips
terracota. Aplicado a globals.css, layout, Divisor, Tooltip, LinkEntidade, FichaRaca, Ficha, Busca,
home, índice `/racas` e estilo. 35 testes verdes + build estático OK. Mockups de decisão removidos.

## Backlog de UX/polimento (passe dedicado no fim do Livro Básico — Fase 1)

> **Política (decisão do usuário, 2026-06-01):** conteúdo primeiro; polimento visual em lote, uma vez, com
> decisões consistentes em todas as categorias. Não enfeitar página por página conforme chega. Inline só o
> estrutural/mecanismo ou o que o usuário pedir para revisar.

- [ ] **Chips → links em `FichaClasse`**: perícias (fixas/lista) e, quando existirem, poderes citados viram links (igual feito em `FichaOrigem`).
- [ ] **Poderes citados viram links** em Origens e Classes (depois da Onda 2 — Poderes existirem como entidades).
- [ ] **Selos SVG na ficha individual de Perícia** (`FichaPericia`): hoje "Somente Treinada"/"Penalidade de armadura" são texto; usar os mesmos ícones do índice `/pericias`.
- [ ] **Revisão visual unificada** das fichas/índices (densidade, espaçamentos, navegação entre categorias, breadcrumb, busca com filtros por tipo).
- [ ] **Auto-link com stop-words/termos explícitos** (risco que cresce com mais categorias — nomes curtos/ambíguos gerando links indesejados).
- [ ] **Trilhas de aprendizado** (Jogador/Mestre) e navegação global — quando o conteúdo permitir.

### Dívidas/notas abertas (tratar nas próximas fatias)
- **Suraggel**: schema não tem "variante" de raça → modificadores das heranças (aggelus/sulfure) ficaram
  na `mecanica.nota` com `modificadores:[]`. Futuro: estruturar heranças/variantes no schema + exibição.
- ~~**Condições seed** `medo`/`atordoado` usam pág. 318 (provisória)~~ **RESOLVIDO (`fd9c789`):** apêndice
  de Condições (35) extraído das impressas 394–395; `medo` virou tipo de efeito no glossário (p.228); `atordoado` realinhado.
- **Auto-link (risco médio)**: com mais categorias, nomes curtos/ambíguos gerarão links indesejados →
  prever stop-words / termos linkáveis explícitos.
- **`data/sources.json`** ainda não é a fonte da verdade (carregador usa `dirs=["livro-basico"]`).
- Riscos de escala JÁ resolvidos nesta fatia: memoização do carregamento (T2), regex pré-compilada (T3),
  export estático (T4), exibição estruturada da mecânica via `FichaRaca` (T5).

Lembrar: Node não está no PATH do Bash (`export PATH="$PATH:/c/Program Files/nodejs"`)
nem no PowerShell desta máquina (`$env:Path += ";C:\Program Files\nodejs"`);
commitar caminhos específicos; **não dar push** até o usuário pedir.

---

## Fatia 1 da Fase 1 — Raças ✅ (executada por Subagent-Driven, plano `2026-05-29-racas-ponta-a-ponta-plano.md`)

- **T1–T7** (código, TDD + revisão): schema Zod de Raça (`RacaMecanicaSchema` + superRefine), memoização
  do carregamento, regex pré-compilada no auto-link, export estático (`output:"export"`, `dynamicParams=false`),
  testes de `FichaRaca` + dedup de tipos, teste do índice `/racas`, pipeline de imagens (`sharp`,
  `comporComMascara`). Commits `461481f`, `f328d74`, `7c4cacb`, `bccfc68`, `e7240a2`, `568a4f4`, `6c1ffb0`.
- **T8** mapa raça→página: `docs/superpowers/plans/racas-paginas.md` (17 raças, offset PDF=impressa+6). Commit `531d3d0`.
- **T9** extração das **17 raças** por visão em 2 passadas, em blocos, **cada bloco validado por agente independente**:
  Humano (spike) + Anão/Dahllan/Elfo/Goblin (`ab13bb7`) + Lefou/Minotauro/Qareen (Bloco B) + Golem/Hynne/Kliren (`7baa3a4`)
  + Medusa/Osteon/Sereia-Tritão (`1e268fb`) + Sílfide/Suraggel/Trog (`dc96bef`). Correções: "Crisma"→"Carisma" (Lefou, `afba901`),
  "afeito"→"efeito" (Golem, `f5f2154`). Achados notáveis: Goblin = Pequeno; Sílfide = **Minúsculo**; Suraggel = 2 heranças.
- **T10** tooltips: glossário + condições citados nas raças, com proveniência (`24cc353`).
- **T11** integração: site **35 testes** + extração **4 testes** verdes; **build estático gera as 17 fichas de raça** + `/racas`.

---

## Fase 0 — checklist

- [x] **T1** Repo + estrutura + mover PDFs para `pdfs/` (commit `e3cc344`)
- [x] **T2** Scaffold Next.js 16 + Tailwind v4 + Vitest (commit `f601ab1`)
- [x] **T3** Tema Grimório/Tormenta + componente `Divisor` (commit `433f96d`)
- [x] **T4** Schema Zod das entidades + provtência (commit `42350dd`)
- [x] **T5** Dados-semente validados (sources, condições, glossário, Súcubo) (commit `9078e3f`)
- [x] _(extra)_ Ignorar PDFs/settings.local + reescrever histórico (commit `092e8b9`, force-push)
- [x] **T6** Motor de auto-link/tooltip + fix de revisão (bordas com dígitos, Map) (commits `c8d67b7`, `155fbce`) — 9 testes
- [x] **T7** Componentes `Tooltip`, `LinkEntidade`, `TextoRico` (commit `e5a472b`) — suíte com 19 testes
- [x] **T8** Carregador de dados (`lib/dados.ts`) + página de ficha (`app/ficha/[tipo]/[id]`) (commit `ef6d49d`) — 21 testes
- [x] **T9** Busca (`lib/busca.ts`) + componente `Busca` + home (commit `3842e0f`) — 25 testes
- [x] **T10** Ferramenta de extração (`extracao/` — poppler + proveniência + CLI), validada em páginas reais (commits `3f7db76`, `ebb80a8` fix `prefixoImagem`) — 3 testes helpers + CLI validado pgs 41–42 do Livro Básico
- [x] **Revisão final da Fase 0** + `npm run build` ok — build prerenderiza `/`, `/estilo`, `/ficha/criatura/sucubo`; revisão de integração aprovada (fatia vertical coesa)
- [ ] Escrever plano da **Fase 1** — **PRÓXIMA**

## Estado dos testes
- **site/:** suíte verde: **25 testes** (smoke, divisor, schema, seed, autolink ×9, textorico ×2, dados ×2, busca ×4). Rodar: `cd site && npm test`.
- **extracao/:** **3 testes** (slugify, parsePdfimagesList, buildPagePaths). Rodar: `cd extracao && npm test`.

## Estado do git
- Remote `origin` (GitHub `Arthur-SAC/compendium-T`) main = `092e8b9`.
- Local `main` HEAD = `ebb80a8`.
- **Commits locais não enviados:** `c8d67b7`, `155fbce`, `e5a472b`, `e47365f`, `ef6d49d`, `3842e0f`, `221ec2e`, `3f7db76`, `34f7c4c`, `ebb80a8` (Tarefas 6–10 + docs + fix). Push pendente do "sobe" do usuário.

---

## Roadmap (fases seguintes — cada uma com plano próprio)

- **Fase 1 — Livro Básico ponta a ponta:** extrair e validar TUDO (raças, classes, origens,
  perícias, poderes, magias, equipamentos, condições, glossário, mundo, **todas as regras**
  de combate/magia/exploração/mestrar, e as **regras de criação/balanceamento**); páginas de
  ficha e de regra; busca; tooltips; auto-link; imagens; **Trilha do Jogador** e **Trilha do
  Mestre**. Entregável: wiki jogável sem o livro. _(Escrever plano após a Fase 0.)_
- **Fase 2 — Demais livros:** Ameaças, Atlas, Heróis, Deuses de Arton, Deuses Menores,
  Guia de NPCs, Encartes — cada um como fonte, reusando pipeline e componentes.
- **Fase 3+ — Geradores criativos balanceados:** criatura, item, poder, origem, raça, classe
  (habilidades por tema), NPC, encontro. Modelo de dados das Fases 1–2 já dá suporte.

## Histórico de decisões recentes
- Modelos: **Misto** (Sonnet mecânico, Opus delicado + revisões).
- Permissões: bypass + allow amplo em `.claude/settings.local.json` (entra pleno na próxima sessão).
- Push: só sob pedido; PDFs nunca vão pro repo.
