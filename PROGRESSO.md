# PROGRESSO — Compêndio Tormenta 20

> Estado vivo do projeto. Atualizar a cada tarefa concluída e antes de qualquer compactação.
> Para retomar: ler `CLAUDE.md` + este arquivo e continuar da seção "PRÓXIMA AÇÃO".

**Última atualização:** 2026-06-03
**Fase atual:** Fase 0 ✅ → **Fase 1 — LIVRO BÁSICO PONTA A PONTA ✅** (todos os capítulos extraídos). Raças ✅ · Revamp visual ✅ · **Classes ✅ (14/14)** · **Origens ✅ (35/35)** · **Cap. 2 ✅ (Perícias 29 + Poderes 162)** · **Cap. 3 Equipamento ✅ (171 itens + 5 regras)** · **Cap. 4 Magia ✅ (198 magias + 3 regras)** · **Deuses ✅ (20 divindades + regra de devoção)** · **Construção de Personagem ✅ (5 regras + landing /personagem)** · **Cap. 5 Jogando ✅ (4 regras)** · **Cap. 9 Mundo de Arton ✅ (30 regiões + cosmologia + Linha do Tempo)** · **Cap. 6 O Mestre ✅ (5 regras)** · **Cap. 7 Ameaças ✅ (77 criaturas + 3 regras)** · **Cap. 8 Recompensas ✅ (186 itens mágicos + 3 regras; índice `/itens-magicos`)** · **UI: listas a 1480px + fichas em duas colunas**. Próxima: **AUDITORIA DE COMPLETUDE** (varrer o livro inteiro p/ achar conteúdo pulado) + **passe de design/UX**.
**Método:** Subagent-Driven Development (1 subagente/tarefa + revisão Opus nas delicadas)

---

## Ajustes dos testers (rodada 2026-06-05)

➡️ **2 ajustes de UX corrigidos na camada de render `TextoBlocos` (`b765dc5`):**
1. **Manobras/ações sem destaque** (Atropelar, Preparar, Agredir…): o termo-líder de cada
   parágrafo de prosa agora vira `<strong class="termo-lead">` em vermelho (antes era texto corrido).
2. **Tabelas viradas em linha:** tabelas embutidas no texto da fonte (delimitadas por `|`, com
   legenda `Tabela X-Y:` e grupos `--- … ---`) eram achatadas em prosa; agora viram `<table
   class="tabela-dados">` de verdade. Conserto único cobre as **5 regras** com tabela-pipe
   (regras-de-armas, regras-de-armaduras, magia-como-funciona, itens-superiores, ao-sabor-do-destino).
   TDD: `site/test/textoblocos.test.tsx` (5 testes). Suíte **140 verde**, tsc limpo, build 1040 páginas.
- **Infra:** poppler v26.02.0 baixado em `extracao/poppler-bin/` (gitignored); caminhos da máquina
  antiga corrigidos no código e no CLAUDE.md (`1867670`). Bypass de permissão: `skipDangerousModePermissionPrompt:true`.
3. **Alinhamento das tabelas (`414d127`):** colunas de número ficavam à esquerda, soltas sob cabeçalhos
   largos. Agora 1ª coluna (rótulos) à esquerda, demais centralizadas, `tabular-nums`.
4. **Nomes de ações/manobras viram tooltip site-wide (`ca61a9f`):** Agredir, Atropelar, Agarrar, Derrubar…
   (`data/referencia/acoes.json`, 14 termos, p.233). Acendem em referências cruzadas capitalizadas
   ("manobra Agarrar"); NÃO acendem como verbo comum ("agarrar a corda"). Mecanismo novo no autolink:
   `TermoSchema.exigeMaiuscula` → tooltip só com Inicial Maiúscula (threaded por schema/dados/página).
   Suíte **142 verde**, build 1040.
- **Em aberto:** se aparecerem tabelas quebradas em **outro formato** (não-pipe), tratar quando o tester apontar.
- **Nota:** o termo-líder das manobras na própria página de Ações em Combate é `<strong class="termo-lead">`
  (a definição), não tooltip — os tooltips de ação acendem nas OUTRAS páginas que as citam.

---

## Fase 2.0 — Fundação multi-fonte + spike Ameaças (Brutos & Indomáveis) ✅ (branch `fase2-ameacas-spike`)

Spec `docs/superpowers/specs/2026-06-05-fase2-ameacas-de-arton-design.md`; plano `docs/superpowers/plans/2026-06-05-fase2-ameacas-spike-plano.md`. Executado por Subagent-Driven (implementer + 2 revisões por tarefa; extrações com revisor independente por visão).

- **Carregador multi-fonte (`ae5b93d`):** `lib/dados.ts` lê `data/sources.json` (Básico antes por `ordem`); `carregarFontes`/`tituloFonte`; guarda `existsSync` p/ fonte listada mas não extraída. **`["livro-basico"]` hard-coded eliminado.**
- **`SeloFonte` (`5eedcb5`):** selo SVG monocromático da fonte. Em **toda ficha** (`1e5d1d2`, topo) e nos índices `/racas` (por card) e `/bestiario` (por tema) — filtro `=== "livro-basico"` removido (`54e3061`).
- **Súcubo movido (`fd4fffa`):** `data/livro-basico/criaturas/sucubo.json` → `data/ameacas-de-arton/criaturas/`. O teste "encontra o Súcubo" agora passa carregando da fonte Ameaças = **multi-fonte provado**.
- **Offset de Ameaças: PDF = impressa + 2** (`98f2ace`).
- **Spike extraído (impressas 30–37 = PDF 32–39):** 13 criaturas na passada 1; **3 eram reprints idênticos do Básico** (orc-chefe/combatente/mutante, já em "Masmorras" p286) → removidos (`1f8c980`, Decisão 8: Básico canônico). **Sobram 10 criaturas próprias de Ameaças** em `data/ameacas-de-arton/criaturas/` (Meio-Orc ×3, Orc Veterano, Orc Rei, Orc Mutante Superior, Orc Xamã, Sapo Atroz, Tabrachi ×2) + **3 raças jogáveis** (`40fc5c0`: meio-orc, orc, tabrachi), **cruzadas** criatura↔raça (`versaoJogavel`/`verTambem`; a raça Orc liga aos 7 orcs — 3 resolvem pro Básico, 4 pra Ameaças). **Ambas as passadas: 0 discrepâncias** (revisor independente por visão).
- **Guarda anti-sombreamento (`1f8c980`):** `idsDuplicados()` no carregador; `carregarEntidades` lança erro se duas fontes definirem o mesmo `tipo/id`. Pega colisão futura no build. **Nota:** os 3 orcs reimpressos aparecem em "Masmorras" (Básico, selo Livro Básico), não em "Brutos & Indomáveis" — consequência correta de não duplicar.
- **Validação:** tsc 0 · **146 testes** · build **1054 páginas**. Teste do índice de raças tornado específico por href (`racas-indice`).
- **Reuso confirmado:** `criatura`/`FichaCriatura` e `raca`/`FichaRaca` do Básico serviram sem mudança; só a camada de fonte foi nova.

**Ameaças completo é feito em ONDAS por grupo temático** (spec `2026-06-06-fase2.1-ameacas-onda1-design.md`, plano `2026-06-06-fase2.1-ameacas-onda1-plano.md`). Política: pular reprints do Básico (Básico canônico); mesclar temas homônimos por tema com selo (ex. "Ermos", em ondas futuras).

### Onda 1 ✅ — Áreas de Tormenta + Capangas & Bandoleiros (Subagent-Driven, 0 discrepâncias por visão)
- **Áreas de Tormenta (13 criaturas, `42aefd2`):** Alma Acorrentada, Bruxo/Arquibruxo da Tormenta, Enxame Infernal, Esmagador Coletivo, Infecto, Turba de Infectos, Lefeu Veridak/Hurobakk/Burodron/Morgadrel/Ezzayn, Gatzvalith Lorde da Tormenta. "Armadilhas Vivas" = armadilhas (sem stat block) → não viraram criatura. Variantes de Ezzayn e sidebar Lekael dobradas como habilidades. Fix de 3 `fonte.pagina` (página do stat block) `…`.
- **Capangas & Bandoleiros (15 criaturas inéditas, `db7b113`):** Bandido Ligeiro/Selvagem, Capanga, Jagunço, Capanga Minotauro, Chefe de Gangue/Quadrilha, Sacerdote/Alto Sacerdote de Hyninn, Devoto de Hyninn Manhoso/Simão/Velhaco, Gatuno/Gatuno Mestre, Duplo. **Reprints pulados:** Bandido Comum (=Básico `bandido`), Chefe Bandido (=Básico `chefe-bandido`).
- **Sem raças/itens novos** nesses 2 grupos (confirmado por visão).
- **Total Ameaças: 39 criaturas** (Brutos 10 + Áreas 13 + Capangas 15 + seed Súcubo). Build **1084 páginas**, tsc 0, **148 testes**.

### Onda 2 ✅ — Culto de Aharadak + Dragões (0 discrepâncias mecânicas por visão)
- **Culto de Aharadak (10 criaturas, `b3b922d`):** Iniciado/Sacerdote da Agonia, Aspecto de Aharadak, Fanático/Líder Fanático Lefou, Reishid Líder de Culto, Senhor do Gigante Rubro (Forma Inicial + Final), Zyrrinaz, Avatar de Aharadak (ND **S**, fix `…`). **Reishid base pulado** (=Básico `reishid`).
- **Dragões (12 criaturas, `de1069f`):** Filhote do Bosque/dos Rios, Ninhada, Jovem da Proteção/do Ocaso, Adulto da Tirania/dos Segredos, Venerável da Equidade/dos Recifes, Feral, Bicéfalo, **Sckhar Dragão-Rei do Fogo** (ND S+). 0 reprints (variantes elementais nomeadas, distintas dos genéricos do Básico). "Dragão-Real" da p.74 é só flavor (não é criatura).
- Sem raças jogáveis nesses grupos. Build **1108 páginas**, tsc 0, 148 testes. **Total Ameaças: 61 criaturas.**

> **DEFERIDO p/ fatia final de "Itens & Regras de Ameaças"** (não perder): **itens** já vistos — Culto: Dádivas de Aharadak (Armadura/Asas/Flagelo/Mente/Olhos do Devorador, ~T$33–54k) + Semente Rubra (T$3.600). **Sidebars de regra** — Templos de Aharadak, Energia Dracônica, Dragões como Familiares e Parceiros, Modificando Dragões + Tabela 1-2, Lefeu e Almas. Coletar todos os itens/sidebars ao fim do bestiário, junto com a intro do Cap. 1 e a seção consolidada "Habilidades de Raça" (p.303).
> **Dívida leve:** prosa de flavor (`secoes`/`resumo`) das criaturas de Ameaças está sintetizada (não verbatim) — mecânica é 100% fiel; polir flavor depois se quiser.

### Onda 3 ✅ — Duyshidakk + Elementais (0 discrepâncias mecânicas por visão)
- **Duyshidakk (12 criaturas, `e08c80d`):** Bugbear Sentinela/Guarda-Costas, Bruxa Goblin, Gangue/Horda Goblin, Goblin-Bomba, Goblin de Ferro/Mark II, Hobgoblin Atirador/Comandante Tático/Gladiador, Sangue do Ayrrak. 0 reprints (os goblinoides do Básico são outros).
- **Elementais (14 criaturas, `b68207a`):** Aquin'ne, Corgann, Namasqall, T'Peel, Rarvnaak, Hallus'tir, Pakk, Ber-baram, Serpentaar, Terrier, Pamgra, Bando de Pamgras, Tanaloom, Elemental Corrompido. `tipo` = "Espírito (elemental)" verbatim. 0 reprints.
- **2 raças jogáveis novas (`700380c`):** Bugbear (Foc+2/Des+1/Car−1) e Hobgoblin (Con+2/Des+1/Car−1), cruzadas com suas criaturas; Hobgoblin com arte (`/racas/hobgoblin.png`), Bugbear sem (sem figura isolada na página → `imagens:[]`).
- Build **1138 páginas**, 148 testes. **Total Ameaças: 87 criaturas + 5 raças** (meio-orc, orc, tabrachi, bugbear, hobgoblin).
- **Dívida leve adicional:** `bruxa-goblin` perdeu os marcadores `*` (footnote do foco arcano) nos nomes das magias — sem impacto numérico; tratar no polimento junto da dívida de flavor.

### Onda 4 ✅ — Ermos (MERGE de tema) + Gnolls (0 discrepâncias mecânicas por visão)
- **Ermos (14 criaturas, `a11b2af` + fix `estirge` p.107):** Bulette, Carrasco de Lena, Centauro Chefe, Centauro Xamã de Megalokk, Ente, Estirge/Enxame Estirge/Nuvem de Estirges, Fera-Vassalo/Líder/Mãe, Lagarto Perseguidor, Tendrículo, Rhandomm. `tema`="Ermos" → **mescla com os Ermos do Básico** no `/bestiario/ermos`, cada linha com seu selo. 0 reprints.
- **Gnolls (11 criaturas, `7af2f7e`):** Gnoll Caçador de Cabeças, Capanga, Líder de Alcateia, Xamã de Allihanna/Megalokk/Marah, Hiena, Hiena Rainha, Hienodonte, Matrona Gnoll, Gnoll Vuul'rak. **Reprints pulados:** Gnoll Filibusteiro e Gnoll Saqueador (já no Básico; Filibusteiro tem Ref +7 em Ameaças vs +11 no Básico — diferença de edição, mantido Básico). Typo da fonte preservado: Xamã de Marah "Curar Ferimentos 7d8+7 PM".
- **2 raças jogáveis novas (`242c6d8`):** Centauro (Sab+2/For+1/Int−1, Grande, 12m — sem arte isolada) e Gnoll (Con+2/Sab+1/Int−1, Médio, com arte `/racas/gnoll.png`), cruzadas com suas criaturas. Revisor confirmou as leituras do extrator (vs scan inicial errado).
- **Total Ameaças: 112 criaturas + 7 raças.** Item "Totens Risonhos" (Gnolls) → fatia de itens.

### Onda 5 ✅ — Golens + Igreja de Arsenal (0 discrepâncias mecânicas por visão)
- **Golens (10 criaturas, `1094f3d`):** Gárgula Assassina, Golem de Barro/Bronze/Carne/Espelhos/Ferro Superior/Matéria Vermelha/Pedra, Instrumento Divino, Soldado Mecânico. **Reprints pulados:** Gárgula (ND2) e Golem de Ferro (ND10) = idênticos ao Básico.
- **Igreja de Arsenal (7 criaturas, `4a8bb4e` + `a306953`):** Coletor de Arsenal, Forjador Litúrgico, Concílio Forjador, Guerreiro Perpétuo, Kishin, **Kishinauros (ND S** — fix), **Bispo de Guerra (ND8** — faltante recuperado na revisão). **Capelão de Guerra pulado** (=Básico `capelao-de-guerra`).
- **Golens Despertos** (raça golem desperto, expansão da raça `golem` que já existe no Básico) → DEFERIDO p/ fatia de regras (não sobrescrever Básico). Item "Totens Risonhos" idem.
- **Total Ameaças: 129 criaturas + 7 raças.**

**Próxima onda (Onda 6):** Igreja de Kallyadranoch (p.144) + Império de Jade (p.154). Reusa o pipeline.

---

## PRÓXIMA AÇÃO (retomar aqui) — dizer só "continua"

➡️ **PASSE DE DESIGN/UX — Fase 2 (em andamento, 2026-06-03):** "folha de pergaminho única" no centro.
Pedido do usuário: acabar com os "bloquinhos divididos", logo maior + mais espaço antes do menu, **busca movida para a
coluna da DIREITA** (topo), menus dos dois lados começando na mesma altura/espaçamento, e **trocar as bordas douradas por
vermelho** (`--borda` agora `#b1273a`; novo `--borda-suave`). Implementado:
- `globals.css`: colunas laterais simétricas (232px) com `gap`, ambas `sticky top:0` e `padding:30px 16px 28px` (mesma altura);
  logo 30px + `margin-bottom:30px`; novas classes `.folha`/`.folha-main` (folha de pergaminho preenchendo a coluna central, com
  textura) e `.indice-lista/.indice-linha/.indice-nome/.indice-meta/.indice-resumo/.indice-thumb/.indice-grupo-titulo` (linhas
  sobre a folha, fim dos cards divididos); responsivo ajustado.
- `NavGlobal` perdeu a busca; `BarraContexto` ganhou a busca no topo (sempre visível). `Logo` cresceu (via CSS).
- **13 índices + home convertidos** para a folha (cards→linhas, cores invertidas claro→tinta, painéis de regra viraram painéis
  embutidos vermelhos, sem dourado): home, racas, classes, origens, pericias, poderes, equipamento, itens-magicos, magias,
  deuses (com thumb do símbolo), bestiario, mundo, regras, personagem.
- **Fichas** mantêm o card de pergaminho centrado (já eram "folha"); a borda 2px agora é vermelha via `--borda`.
- Validação: `tsc` limpo · **129 testes verdes** · `npm run build` **999 páginas**. `app/estilo` (styleguide de dev) ficou na casca escura — intencional.
- **Pendências menores do passe:** mobile põe a busca no rodapé (Fase 3 traz drawer); avaliar se home/personagem devem
  preencher a coluna (hoje são folhas centradas mais estreitas). Próxima fatia: **Fase 2 (demais livros)** ou continuar o passe de design.

(histórico) **AUDITORIA DE COMPLETUDE ✅ + 13 LACUNAS CORRIGIDAS ✅** (relatório: `docs/superpowers/plans/auditoria-completude-livro-basico.md`).
Livro Básico **completo de verdade** (catálogos + todas as regras/quadros).

**Correção das lacunas ✅ (2026-06-03):** 39 regras agora (era 32). **7 regras novas:** `introducao-ao-jogo` (O que é T20,
Mecânica Básica = 1d20+mod vs CD, Dados, Termos Importantes, 20 Coisas a Saber), `alinhamento` (eixos + 9 alinhamentos),
`interpretacao` (papel do jogador, regra de testes sociais, quadros Não Seja Fominha/Babaca/O Objetivo do RPG),
`nome-idade-e-envelhecimento` (idade inicial, envelhecimento Maduro/Velho, Raças Longevas), `classes-como-funcionam`
(intro + Tabela 1-3), `deuses-menores` (105: Tibar/Rhond/Sckhar), `nomes-em-arton` (361–364: 8 povos). **5 regras completadas:**
`pericias-como-funcionam` (+Escolhendo Perícias), `magia-como-funciona` (+tipo Universal; `mecanica.tipos` agora inclui "universal"),
`combate` (+Variante Mapa de Batalha), `poderes-como-funcionam` (+grupos Concedidos[Sab]/Tormenta[−Car]/Aprimoramento),
`riqueza-e-equipamento` (+Tabela 3-1 Dinheiro Inicial + quadro Carga). Wiring: grupo "Introdução" no `/regras` + regras de
criação reordenadas. `testTimeout` do Vitest → 20s (volume cresceu p/ ~1000 entidades; teste `magias-indice` ficava flaky no limite de 5s).
**Pendência menor:** ajustar `fonte.pagina` (alguns subagentes notaram off-by-1: deuses-menores está na impressa 105, idade na 108) — conferido, valores OK.

**Auditoria (2026-06-03):** 9 auditores independentes varreram o Livro Básico × `data/`. **Catálogos 100% íntegros**
(raças/classes/origens/deuses/perícias/poderes/magias/itens/itens-mágicos/criaturas/regiões). **13 lacunas** (3 seções
inteiras + regras/quadros intercalados) listadas no relatório. Cap. 6 e os catálogos sem nenhuma lacuna.

**Cap. 8 — Recompensas ✅ COMPLETO (`...` Ondas A+B+C):**
- **Onda A (código):** novo tipo `item-magico` (`ItemMagicoMecanicaSchema`: tipoItem/categoria/preco), `FichaItemMagico`, índice
  `/itens-magicos` (agrupado por tipo + selo de categoria + painel de regras), atalho na home, wiring na rota. Mapa `itens-magicos-lista.md` (192 catalogados).
- **Onda B (186 itens, 9 subagentes por visão):** 28 Encantos de Arma, 18 Armas Específicas, 25 Encantos de Armadura,
  8 Armaduras + 5 Escudos Específicos, 32 Poções (1 por nome único — "Poção/Óleo/Granada de X" — variações de potência embutidas),
  65 Acessórios (21 menores + 22 médios + 22 maiores), 5 Artefatos (Baralho do Caos com as 22 cartas em `secoes`).
- **3 regras** `regra-de-criacao`: `pontos-de-experiencia` (326), `tesouros` (327; Tabelas 8-1 a 8-6), `itens-magicos` (333; Tabela 8-7).
  Grupo **"Recompensas"** no `/regras`. **Onda C (validação por visão):** preços/categorias/descrições — **0 divergências**.
- Build **992 páginas**; suíte **123 verde**. Imagens 300 DPI em `extracao/cache/cap8/`.

**Nota de modelagem (item-magico):** descrição rica em `secoes`; `mecanica` mínima. Encantos sem preço/categoria (vêm da Tabela 8-7).
Poções nomeadas "Poção de X" p/ não colidir com as magias homônimas no auto-link. Artefatos sem preço. O `mecanica.cartas` do
Baralho do Caos é descartado pelo schema (não-strict) — conteúdo preservado nas `secoes`; estruturar no schema é melhoria futura.

**Cap. 7 — 2ª leva ✅ (`45878d0`):** 3 regras `regra-de-criacao` (validadas célula a célula por revisor independente, 0 discrepâncias):
- **`construindo-combates`** (impressas 282–285): ND, fatores, papéis solo/lacaio/especial, vários inimigos, formato do bloco de stats, `tipos_de_criatura` (6), **Tabela 7-1: Criaturas por Nível de Desafio** (80 linhas).
- **`perigos`** (impressas 317–321): perigos ambientais, **armadilhas** (23, c/ CDs/ND; mágicas marcadas), **doenças** (8), perigos complexos (4). (As armadilhas NÃO têm nº de tabela no livro — "Tabela 7-1" é só a de Criaturas.)
- **`fichas-de-npcs`** (impressas 322–323): criar fichas de ameaça por ND, **Tabela 7-2: Estatísticas de NPCs** (21 linhas) + pacotes de atributos por patamar.
- **Wiring:** grupo **"Ameaças"** no `/regras` + painel **"Regras de Ameaças"** no topo do `/bestiario`. Build **802 páginas**; suíte **122 verde**.
- **Nota fiel ao livro:** a Tabela 7-1 grafa "Finntroll caçador" (2 n) e "**Fintroll** feitor" (1 n) — inconsistência da fonte, preservada.
- Imagens 300 DPI em `extracao/cache/cap7-regras/` (impressas 282–285, 317–323).

**Cap. 7 — Bestiário (plano `2026-06-02-bestiario-cap7-plano.md`):**
- **Onda A ✅ (`3950046`):** entidade `criatura` (`CriaturaMecanicaSchema`), `FichaCriatura` (duas colunas: bloco numérico na lateral + habilidades/flavor), índice `/bestiario` agrupado por `tema` (ordem do livro) + selo de ND + atalho na home. Spike Masmorras.
- **Onda B ✅ COMPLETA (`cb39ca5` + `a0ff3d4`):** **77 criaturas** em 9 temas — Ermos 18, Masmorras 11, Os Sszzaazitas 9, Reino dos Mortos 8, Os Duyshidakk 7, Os Puristas 7, **Os Dragões 7**, Os Trolls Nobres 5, A Tormenta 5 (impressas 286–316). Schema/Ficha ganharam `pontosDeMana`. **Normalização:** 14 fichas tinham `ataques` como objeto `{tipo,descricao}` (violava o schema `z.array(z.string())`) → convertidas para string. Índice conta só criaturas do Livro Básico (exclui o seed `sucubo.json`, que é de `ameacas-de-arton`).
- **Onda C ✅ COMPLETA (validação por visão, 300 DPI):** **77/77 criaturas validadas célula a célula por revisores independentes, 0 discrepâncias numéricas.** Os Dragões (7/7) + os 8 temas restantes (70/70) por 8 validadores paralelos (1 por tema): Masmorras 11, Ermos 18, Puristas 7, Reino dos Mortos 8, Duyshidakk 7, Sszzaazitas 9, Trolls Nobres 5, A Tormenta 5. Conferidos: ataques (bônus/dados/margem), atributos com en-dash, CDs, PM de cada magia, sentidos, RD/RM/imunidades. Confirmado: impressa 302 é só continuação do Arsenal do engenho-de-guerra + arte (sem criatura faltante). Nenhuma correção de dados foi necessária — extração da Onda B sólida. Imagens em `extracao/cache/bestiario/` (impressas 286–309, 314–315, recortes L/R).
- **Convenções (reusar):** palavras-chave defensivas finais da linha (imunidade/redução de dano/RM/vulnerabilidade) vão no campo `defesa` (ex.: `"22, redução de dano 10"`). Habilidades de tema compartilhadas (Habilidades Lefeu, Habilidades Dracônicas) entram como `secao` titulada com `\n\n` entre as habilidades. Listas de magias dentro de uma habilidade usam `\n•` (estilo Necromante). `ataques` = só linhas Corpo a Corpo/Distância; Sopro/Varrer/etc. vão em `habilidades[]`. Atributos negativos usam en-dash `–`.
- **Cache reutilizável:** imagens 300 DPI dos Dragões em `extracao/cache/dragoes/` (p-316..319 + recortes L/R) + gerador `gerar.mjs`.
- **Dívida leve:** o seed `data/livro-basico/criaturas/sucubo.json` tem `fonte.livro="ameacas-de-arton"` mas vive na pasta do Básico — quando a Fase 2 trouxer Ameaças de Arton, mover/realocar (cuidado: `seed.test.ts` pode referenciá-lo).

**(histórico) Cap. 6 — O Mestre ✅ COMPLETO.** Próxima fatia (à época): Cap. 7 ou Cap. 8.
Compactação ✅ (`cb8ce04`): parceiros (12)/montarias (6) em `npcs-mestre` e as 20 aventuras-modelo em `sessoes` viraram TABELAS (`mecanica`), preservando o texto verbatim (contagem de caracteres idêntica). npcs 37→19 secoes, sessoes 38→18.

**Cap. 6 — O Mestre ✅ (`b4924e0` + validação `dbd1536`):** 5 regras `regra-de-criacao` (extração pura; tipo/índice/Ficha já existiam) +
grupo "O Mestre" no `/regras`. `como-mestrar` (12 secoes), `sessoes-aventuras-e-campanhas` (38), `npcs-mestre` (37 + Tabela 6-1),
`ambientes-de-aventura` (34 + Tabelas 6-2..6-5), `tempo-entre-aventuras` (10 + Tabelas 6-6/6-7 + Recompensas&Castigos).
Validação 2ª passada por visão: **tabelas 100% corretas**; 4 arquivos fiéis; 3 fixes de prosa em `como-mestrar` (incl. um "não" que faltava). Build 721 páginas. Plano `2026-06-02-mestrar-cap6-plano.md`.

**Onda C ✅ (`5706afa`):** `mundo-de-arton` (cosmologia + visão geral, seção "Mundo de Arton", topo do `/mundo`) +
`linha-do-tempo` (132 entradas "História Parcial", 7 Bilhões de Anos AE → 1420 "Época atual"; tabela ano|evento via `Ficha`).
Build 716 páginas. Índice `/mundo` agora com 32 entradas (30 regiões + cosmologia + cronologia).
**Validação da Onda B ✅** (3 lotes independentes por visão, JSON×imagem 300 DPI): 26/29 fiéis sem reparo. Correções aplicadas (`12225a7`):
deheon (2 §§ finais da Libertação, antes cortados pela ilustração — "abrigando"/"acreditavam honrar" reconferidos), mercado
("nas" não "das" → renomeado p/ `mercado-nas-nuvens`), aslothia ("grimórios"), ermos-purpuras (tira "se" sobrando).
Confirmados: Sambúrdia e Nova Malpetrim têm cabeçalho próprio; grafias Schwolld (Ahlen) e Moreania.
**Remanejamento ✅ (`6ff4de4`):** "A Tragédia Élfica" virou **entidade própria** `tragedia-elfica` (tem cabeçalho vermelho de
nível de região na impressa 383, logo após Doherimm; trata da queda dos elfos/Lamnor). Saiu de `ruinas-de-tyrondir`. Relações
thwor+tauron migraram com ela. **Total agora: 30 regiões; build 714 páginas.**
**UI feita nesta sessão:** listas a 1480px (`9cd50ff`); **fichas em duas colunas** texto+barra lateral (`f782d0c`, colapsa no mobile; imagem fica na lateral — decisão do usuário, tentativa de "imagem ao lado do texto" foi revertida).

**29 regiões (`8e71480`):** O Reinado (8): deheon, bielefeld, wynlla, namalkah, ahlen, zakharov, pondsmania, mercado-das-nuvens.
Além do Reinado (21): supremacia-purista, aslothia, republicas-livres-de-samburdia, feudos-de-trebuck, reino-do-dragao,
sanguinarias, ermos-purpuras, imperio-de-tauron, nova-malpetrim, covil-dos-pistoleiros, ruinas-de-tyrondir, salistick,
svalas, doherimm, tres-mares, khubar, mundo-perdido, continente-bestial, imperio-de-jade, moregnia, a-tormenta.
Entidade `regiao` = prosa (Ficha genérico); `mecanica.secao` agrupa o índice `/mundo` (ordena por página). Auto-link: colisão
"Tauron" (deus×região) é first-wins por ordem de pasta (divindades antes de regioes) → deus mantém o link; sem links quebrados.

---
### (histórico) plano original da Onda B
➡️ Plano `2026-06-02-mundo-de-arton-plano.md`;
**mapa autoritativo `docs/superpowers/plans/mundo-paginas.md`** (região→página, subseções, achados). Onda A já fez código + spike Deheon.
**Como na Onda A:** renderizar a página da região em 300 DPI (`pdftoppm -r 300`, `extracao/cache/arton/`), recortar colunas com PIL,
transcrever fiel (2 passadas, sem inventar), salvar `data/livro-basico/regioes/<slug>.json` (tipo `regiao`, `mecanica.secao`
= "O Reinado"/"Além do Reinado", `epiteto`, `capital`; subseções → `secoes`; deuses/raças citados → `relacoes` + auto-link Title-Case).
Commit por bloco. **Atenção (do mapa):** (a) reinos do Reinado são regiões PARES (Bielefeld, Wynlla, Namalkah, Ahlen, Zakharov,
Pondsmânia, Mercado das Nuvens); (b) "Além do Reinado" tem ~19 (Supremacia Purista, Aslothia [sem cabeçalho], Trebuck, Reino do
Dragão, Sanguinárias, Ermos Púrpuras, Tauron, Pistoleiros, Tyrondir, Salistick, Svalas, Doherimm, Três Mares, Khubar, Galrasia,
Lamnor, Tamu-ra, Morégnia, A Tormenta); (c) layout tem fluxo "Continua na página…" — algumas regiões terminam cortadas por ilustração
(Deheon tem 3º § da Libertação/Guerra Artoniana ainda pendente). **Depois (Onda C):** página `mundo-de-arton` (cosmologia) + Linha do Tempo (cronologia).

**Cap. 9 Onda A ✅ (`1450945`):** entidade `regiao` (prosa, reusa `Ficha` genérico — sem schema novo; `mecanica` mínima
`secao`/`epiteto`/`capital`). Índice `/mundo` agrupado por seção (ordem do livro) + ordenado por página + atalho na home.
Spike **Deheon** (impressa 358, 300 DPI): intro + A Cidade sob a Deusa + A Libertação de Valkaria; auto-link acende Valkaria/Khalmyr.
Mapa de descoberta corrigiu o plano (divisão real O Reinado/Além do Reinado; reinos-membros são regiões pares). +2 testes (119 verde); build 685 páginas.

**Cap. 5 Jogando ✅ COMPLETO** (4 regras: `testes-e-dificuldades`, `habilidades-e-efeitos`, `combate`, `acoes-em-combate`).
Plano `2026-06-02-jogando-combate-plano.md`. **Polimento pendente:** índice `/regras` reunindo as ~16 regras de jogo
(testes, combate, magia, devoção, perícias, equipamento, atributos, evolução…) — hoje acessíveis por auto-link e pela landing /personagem.

➡️ **CONSTRUÇÃO DE PERSONAGEM ✅** (Cap. 1, regras de criação). Plano `docs/superpowers/plans/2026-06-02-construcao-personagem-plano.md`.
4 regras (`regra-de-criacao`, verificadas em 300 DPI): **`atributos`** (6 atributos + pontos/rolagem 4d6/mínimos + Tabela 1-1),
**`construcao-de-personagem`** (visão geral + **9 passos** + Conceito), **`caracteristicas-derivadas`** (Toques Finais:
PV/PM, recuperação, temporários, Defesa, Tamanho + Tabela 1-21, Deslocamento, Descrição), **`caracteristicas-das-racas`**
(Modif. de Atributo + Habilidades de Raça → /racas; backfill de Raças). **Landing `/personagem`** com os 9 passos linkando
pros índices (semente da Trilha do Jogador) + atalho na home. Tabelas vão na `mecanica` e renderizam via `Ficha` (corrigido).
**Nota:** eram **9 passos** (não 6, como dizia a nota antiga). **Nível/XP/Patamares/Multiclasse NÃO estão no Cap. 1** →
ficam pra fatia do **Cap. 5 (Combate & Jogando)**.

**Próxima fatia: Combate & Jogando (Cap. 5)** — combate, ações, testes/CDs, condições em uso, e **Nível/XP/Patamares/Multiclasse**.
Depois: **Mundo de Arton** e **Mestrar**. (Pendências de polimento no Backlog de UX; símbolos dos deuses + Deuses de Arton anotados.)

**Deuses ✅** (20 divindades + regra de devoção; plano `2026-06-02-deuses-plano.md`):
- **Onda A ✅ (`79bf2a6`):** `DivindadeMecanicaSchema` (crencasObjetivos, simboloSagrado, canalizaEnergia,
  armaPreferida, devotos, poderesConcedidos[], obrigacoesRestricoes) + ramo no superRefine; `FichaDivindade`
  (selo de energia; Poderes Concedidos como chips que linkam); índice `/deuses` por energia + atalho na home;
  regra `devocao-como-funciona` (impressa 96); spike Khalmyr. +7 testes.
- **Onda B ✅ (`ae1870c`):** 20 divindades extraídas (impressas 96–105). Reconciliação automática dos Poderes
  Concedidos vs slugs de poderes (script): corrigidos nomes p/ acender link (Azgher "Fulgor Solar"; Wynna
  "Bênção do Mana"/"Teurgista Místico"; Arsenal energia "Qualquer.").
- **Passada 2 ✅ (`44123b3`):** validação independente por visão (5 validadores). Fixes: khalmyr ("vitória",
  "permanentes"), tenebra ("se cobrir"). 16/20 sem discrepância. Achado: o mapa de descoberta tinha thwor/thyatis
  trocados — a extração da imagem estava certa (corrigido o doc).
- **Onda C ✅:** links reversos acendem (deuses citados em Cavaleiro/Clérigo/Druida/Paladino, poderes concedidos e
  raças linkam pras fichas de divindade — auto-link Title-Case). Build **672 páginas**; suíte **117 verde**.
- **Deferido / enriquecimento futuro (pedido do usuário, 2026-06-02):**
  - ~~**Símbolos sagrados:** falta extrair as IMAGENS~~ **FEITO (`e97a322`):** os 20 símbolos extraídos
    (`pdfimages -png`, identificados por visão casando com `simboloSagrado`), em `site/public/divindades/<slug>.png`,
    ligados via `imagens[]` nas 20 fichas. `FichaDivindade` já renderiza.
  - **Livro "Deuses de Arton" (Fase 2):** traz MUITO mais sobre cada divindade (lore, devotos, mais poderes) **e arte**.
    Quando essa fonte entrar (camada separada, marcada por fonte — nunca sobrescreve o Básico), enriquecer as fichas de
    divindade com esse conteúdo e imagens.

**Cap. 4 — Magia ✅** (198 magias + 3 regras):
- **Onda A ✅:** schema `magia`, `FichaMagia`, índice `/magias` (por círculo + Arcanas/Divinas/Universais), 3 regras, spike.
- **Onda B ✅:** 198 magias (Passada 1; descrições A–Z, impressas 178–211) — cabeçalho/descrição/aprimoramentos/truque, schema-válidas.
- **Onda C ✅ (`874d856`):** links de conjuração acesos. As 198 magias entram no registro de auto-link; como vários nomes são
  palavras comuns ("Luz", "Sono", "Voo", "Condição"), o auto-link gerava ~86 links espúrios. **Correção (TDD):** links de
  ENTIDADE exigem inicial maiúscula (nomes próprios Title-Case); TOOLTIPS seguem case-insensitive (condições em minúsculo).
  Resultado: 116 referências legítimas linkam (concessões inatas Sílfide=Luz/Sono/Enfeitiçar, Suraggel=Escuridão,
  Bucaneiro=Amedrontar, poderes que ensinam Toque Vampírico…) e 86 falsos positivos somem. **Resolve o "risco médio" de auto-link.**
- **Passada 2 ✅ (`7c890fd`):** validação independente das 198 por visão (11 blocos, JSON×imagem). Passada 1 muito sólida. Fixes:
  (a) **conteúdo** — `enxame-rubro-de-ichabod` (+aprimoramento +3 PM voo/cubo faltante), `toque-vampirico` (−aprimoramento +5 PM
  fabricado), `telecinesia` (efeito completado + requisitoCirculo espúrio removido), `mao-poderosa-de-talude` ("Esmarar"→"Esmagar"),
  `caminhos-da-natureza` (rótulo alvo→área); (b) **75 páginas** `fonte.pagina` off-by-one — a extração não contou as impressas
  183 e 192; reconciliado contra mapa autoritativo (rodapés de p-184..p-217, convenção PDF=impressa+6). Watch-points: `controlar-o-clima`
  círculo 4 e `muralha-de-ossos` Universal 4 — **ambos já corretos**. 198 schema-válidas; build 650 páginas; suíte **106 verde**.
- **Técnica reutilizável:** para validar/posicionar páginas, re-renderizar em 300 DPI (`pdftoppm -r 300 -f N -l N`) e recortar
  colunas com PIL — muito mais legível que as imagens 150 DPI do cache; o rodapé dourado dá a impressa (= PDF − 6).

> **FATIAS PENDENTES DO LIVRO BÁSICO (não esquecer — confirmado com o usuário 2026-06-01):** além de **Magia**,
> faltam **Deuses** (panteão, ~20 divindades — domínios, energia, Obrigações & Restrições, Poderes Concedidos, devotos;
> impressas 96–111; referenciado por Clérigo/Paladino/Poderes Concedidos), **Construção de Personagem** (6 passos,
> **Atributos** e o que cada um faz, rolagem/compra de pontos, multiclasse, evolução de nível/XP/patamares — Cap. 1),
> **Combate & Jogando** (Cap. 5), **Mundo de Arton** e **Mestrar**. Ordem combinada: seguir como organizado (catálogos
> primeiro), e fazer estas em seguida. Decisão do usuário: continuar a sequência atual, voltar nelas depois.

**Cap. 3 — Equipamento ✅** (plano `docs/superpowers/plans/2026-06-01-equipamento-plano.md`; mapa `equipamento-lista.md`):
- **Onda A (código) ✅**: `ItemMecanicaSchema` (categoria, preco, espacos, blocos opcionais `arma`/`protecao`, `especial`); `FichaItem`; índice `/equipamento` (armas por proficiência; armaduras leve/pesada/escudos) + painel com links pras 5 regras.
- **Onda B ✅ (56)**: 40 armas + 4 munições + 10 armaduras + 2 escudos. Habilidades de armas viram **tooltip** (glossário p.143) e os chips de habilidade linkam.
- **Onda C ✅ (115)**: itens gerais (aventura, ferramentas, vestuário, esotéricos, alquímicos prep/catalisadores/venenos, alimentação, animais, veículos, serviços). **Total: 171 itens.**
- **Onda D ✅ (regras)**: `regras-de-armas`, `regras-de-armaduras`, `itens-superiores` (31 melhorias + 6 materiais especiais, Tabelas 3-7/3-8/3-9), `regras-de-itens-especiais` (venenos/pratos/instrumentos). + `riqueza-e-equipamento` (Onda A).
- **Onda E ✅**: suíte 89 verde; build **448 páginas** (171 fichas de item + 5 regras + `/equipamento`). Visão 2 passadas em todas as ondas.

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
- [ ] **Auto-link: stop-list explícita p/ resíduos Title-Case** (a regra de inicial-maiúscula da Onda C de Magia já mata o grosso; sobram poucos casos como "Condição"/"Névoa" em contexto de palavra comum e capitalizações de início de frase).
- [ ] **Trilhas de aprendizado** (Jogador/Mestre) e navegação global — quando o conteúdo permitir.
- [ ] **Artes das armas (Cap. 3, impressas 146–149):** o livro tem **pranchas ilustradas agrupadas** (várias armas por imagem, rotuladas por tipo: "Espadas longas", "Cimitarras", "Adagas", "Alfanges", "Espadas bastardas", "Katana"…), **não** arte limpa por arma (sem smask, sobrepostas). Opções: usar as pranchas como ilustração decorativa de seção em `/equipamento`, ou recortar manualmente. Decidir no passe de design. (Equipamento já tem subgrupos no índice: armas por proficiência; armaduras leve/pesada/escudos.)

### Dívidas/notas abertas (tratar nas próximas fatias)
- **Suraggel**: schema não tem "variante" de raça → modificadores das heranças (aggelus/sulfure) ficaram
  na `mecanica.nota` com `modificadores:[]`. Futuro: estruturar heranças/variantes no schema + exibição.
- ~~**Condições seed** `medo`/`atordoado` usam pág. 318 (provisória)~~ **RESOLVIDO (`fd9c789`):** apêndice
  de Condições (35) extraído das impressas 394–395; `medo` virou tipo de efeito no glossário (p.228); `atordoado` realinhado.
- ~~**Auto-link (risco médio)**: com mais categorias, nomes curtos/ambíguos gerarão links indesejados~~
  **MITIGADO (`874d856`, Onda C de Magia):** links de entidade exigem inicial maiúscula (nomes próprios
  Title-Case); tooltips seguem case-insensitive. Elimina o grosso dos falsos positivos de palavras comuns.
  **Resíduo:** ainda podem sobrar falsos Title-Case raros (ex.: "Condição" em bullet de regra, "Névoa" do
  item "Névoa Tóxica") e capitalizações de início de frase — tratar com stop-list explícita no passe de design se incomodar.
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
- Remote `origin` (GitHub `Arthur-SAC/compendium-T`) main = `83cbf2e` — **sincronizado** (push em 2026-06-05).
- Local `main` HEAD = `83cbf2e`. Sem commits pendentes.
- Identidade git local do repo: `Arthur-SAC <arthur.cald3ron@gmail.com>` (configurada nesta máquina).
- Lembrete: PDFs/poppler-bin/node_modules/settings.local.json continuam gitignored (conferido antes do push).

---

## Ameaças de Arton — Offset de páginas (descoberto 2026-06-05)

**Offset confirmado: PDF = impressa + 2** (i.e., OFFSET = 2).

Evidências (PDF page → impressa → título):
- PDF 32 → impressa 30 → "BRUTOS & INDOMÁVEIS" / Meio-Orc (início da seção)
- PDF 36 → impressa 34 → Orc Mutante / Orc Mutante Superior
- PDF 38 → impressa 36 → Sapo Atroz / Tabrachi

**Spike Brutos & Indomáveis:** impressas 30–37 = PDF pages 32–39.
Texto layout extraído em `extracao/cache/ameacas/brutos/` (8 arquivos: `txt-printed-30_pdf-32.txt` … `txt-printed-37_pdf-39.txt`). Acentos UTF-8 confirmados ("Tabrachi", "Pântano", "natação", "Xamã").

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
