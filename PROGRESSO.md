# PROGRESSO — Compêndio Tormenta 20

> Estado vivo do projeto. Atualizar a cada tarefa concluída e antes de qualquer compactação.
> Para retomar: ler `CLAUDE.md` + este arquivo e continuar da seção "PRÓXIMA AÇÃO".

**Última atualização:** 2026-05-28
**Fase atual:** Fase 0 — Fundação ✅ **CONCLUÍDA** → próxima: Fase 1
**Método:** Subagent-Driven Development (1 subagente/tarefa + revisão Opus nas delicadas)

---

## PRÓXIMA AÇÃO (retomar aqui)

➡️ **Escrever o plano da Fase 1** (`docs/superpowers/plans/2026-05-29-fase-1-livro-basico.md`).
A Fase 0 está fechada: build estático passa, 25 testes (site) + 3 (extração) verdes,
revisão final de integração aprovada. Antes de escrever o plano, **brainstorm com o usuário**
sobre sequência/prioridades da Fase 1 (quais categorias primeiro, profundidade, design das
Trilhas) — é decisão dele.

**Riscos de escala a embutir no plano da Fase 1** (do revisor final de integração):
1. **(Alto)** Memoizar carregamento de dados — hoje `carregarEntidades`/`carregarTermos` e
   `construirRegistro` rodam do zero em cada página/`generateStaticParams`. Cache em módulo.
2. **(Alto)** Pré-compilar a regex do auto-link dentro do `Registro` (hoje `tokenizar`
   remonta a alternância gigante a cada texto; cresce com nº de entidades).
3. **(Médio)** Escopo do auto-link: com centenas de entidades, nomes curtos/ambíguos
   ("Fúria", "Ataque") gerarão links indesejados — prever stop-words / termos linkáveis explícitos.
4. **(Médio)** Modelo de exibição da `mecanica` por tipo — hoje `String(v)` quebra em valores
   não-escalares (`[object Object]`); fichas ricas precisam de renderização estruturada.
5. **(Baixo)** Decidir `output: "export"` (estático 100%) vs. build híbrido atual — afeta 404 e Vercel.
6. **(Baixo)** Consumir `data/sources.json` como fonte da verdade (hoje `dirs=["livro-basico"]` hardcoded).

Lembrar: Node não está no PATH do Bash (`export PATH="$PATH:/c/Program Files/nodejs"`)
nem no PowerShell desta máquina (`$env:Path += ";C:\Program Files\nodejs"`);
commitar caminhos específicos; **não dar push** até o usuário pedir.

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
