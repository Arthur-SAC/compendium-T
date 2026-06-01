# PROGRESSO — Compêndio Tormenta 20

> Estado vivo do projeto. Atualizar a cada tarefa concluída e antes de qualquer compactação.
> Para retomar: ler `CLAUDE.md` + este arquivo e continuar da seção "PRÓXIMA AÇÃO".

**Última atualização:** 2026-06-01
**Fase atual:** Fase 0 ✅ → **Fase 1**. Raças ✅ · Revamp visual ✅ · **Classes ✅ (14/14)**. Próxima: escolher a próxima categoria.
**Método:** Subagent-Driven Development (1 subagente/tarefa + revisão Opus nas delicadas)

---

## PRÓXIMA AÇÃO (retomar aqui) — dizer só "continua"

➡️ **Categoria Classes CONCLUÍDA.** Definir e escrever o plano da **próxima categoria do Livro Básico**.
Opções (ver Roadmap da Fase 1): **Magias** (destrava o conteúdo de conjuração que as classes referenciam),
**Origens** (próximo capítulo sequencial — impressa 85+ = PDF 91+), **Perícias** ou **Poderes Gerais**.
Recomendação: confirmar com o usuário qual categoria priorizar, então `superpowers:brainstorming` →
`superpowers:writing-plans` para o plano da fatia, e executar por **Subagent-Driven** (mesmo padrão das Classes).

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

> Spike do Guerreiro (plano `2026-05-29-guerreiro-classe-spike-plano.md`) validou schema, `FichaClasse` e pipeline.

**Revamp visual concluído** (plano `2026-05-29-revamp-visual-plano.md`): tema "Tomo de Arton" — casca
escura carmesim + cards de pergaminho legíveis, fonte **Tormenta20x** (`site/app/fonts/`, via
`next/font/local`) nos títulos com degradê dourado→carmesim, acentos carmesim/vermelho/ouro, tooltips
terracota. Aplicado a globals.css, layout, Divisor, Tooltip, LinkEntidade, FichaRaca, Ficha, Busca,
home, índice `/racas` e estilo. 35 testes verdes + build estático OK. Mockups de decisão removidos.

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
