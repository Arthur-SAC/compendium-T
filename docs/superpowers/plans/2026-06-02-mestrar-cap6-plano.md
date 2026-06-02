# Capítulo 6 — O Mestre / Como Mestrar — Plano

> Fatia de REGRAS/ORIENTAÇÃO ao mestre. **Sem código novo:** reusa o tipo `regra` (como o Cap. 5 Jogando),
> o índice `/regras` e o `Ficha` genérico (prosa em `secoes` + tabelas via `mecanica`). Logo, é **extração pura**.

**Goal:** O capítulo do Mestre no site — como mestrar, estruturar sessões/aventuras/campanhas, criar NPCs,
ambientes de aventura (masmorras/ermos/cidades, visibilidade, terreno) e atividades de tempo livre — para
mestrar sem o livro. Auto-link cruzando perícias, condições, regras de combate, criaturas (quando existirem) e regiões.

## Limites (Sumário) — offset PDF = impressa + 6
- **Capítulo 6: O Mestre** — impressas **240–279** (PDF 246–285). Splash em 246; intro "O Mestre" em 247 (impressa 241).
- Seções (cabeçalhos vermelhos a confirmar por imagem):
  - **O Mestre** (intro, impressa 241 / PDF 247) — o papel do mestre.
  - **Como Mestrar** (242 / PDF 248) — subseção "Preparação" e provavelmente outras (CDs, arbitragem, dicas).
  - **Sessões, Aventuras e Campanhas** (248 / PDF 254).
  - **NPCs** (257 / PDF 263) — criação de NPCs (regras + tabelas/fichas).
  - **Ambientes de Aventura** (263 / PDF 269) — masmorras, ermos, visibilidade, terreno (tabelas).
  - **Tempo entre Aventuras** (276 / PDF 282).
- **NÃO** entram aqui: Perigos (Cap. 7, impressa 317), XP/Tesouros/Itens Mágicos (Cap. 8) — fatias futuras.

## Modelagem (decidida)
- Uma **entidade `regra`** por seção do sumário → entra no `/regras`. Slugs propostos:
  `o-mestre` (intro curta), `como-mestrar`, `sessoes-aventuras-e-campanhas`, `npcs-mestre`, `ambientes-de-aventura`,
  `tempo-entre-aventuras`. (Obs.: usar `npcs-mestre` para não colidir com futura categoria de NPCs/fichas.)
- Prosa → `secoes` (subseções viram seções). Tabelas (CDs, visibilidade, terreno, tempo livre) → `mecanica`
  (arrays de objetos = tabela no `Ficha`; primitivos = chips). `relacoes` para o que casar (perícias/condições/regras).
- Auto-link já acende perícias, condições, regras, magias, regiões, deuses (Title-Case / tooltips).

## Ondas
- [ ] **A — spike:** `como-mestrar` (PDF 248–253), extraído por imagem 300 DPI (recorte de colunas), 2 leituras.
  Valida que `regra` + `/regras` + `Ficha` (2 colunas/tabelas) servem bem ao conteúdo do Mestre. Commit.
- [ ] **B — extração das demais seções** (subagentes, 1 por seção, 300 DPI, 2 passadas, commit por bloco):
  `o-mestre`, `sessoes-aventuras-e-campanhas`, `npcs-mestre`, `ambientes-de-aventura`, `tempo-entre-aventuras`.
- [ ] **C — validação** (2ª passada independente por visão) + correções; build + `/regras` confere as novas regras; PROGRESSO; commit.

## Notas
- Capturar QUADROS/sidebars coloridos e TABELAS (falha do projeto antigo). Conferir cabeçalhos na imagem (podem divergir do sumário).
- "Ambientes de Aventura" é a maior seção (263–275) e a mais densa em tabelas — atenção a visibilidade/iluminação/terreno/masmorras.
- Criaturas (Cap. 7) ainda não são entidades; relações "usa Criatura" ficam para essa fatia futura.
