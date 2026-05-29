# Raças Ponta a Ponta — Documento de Design

**Data:** 2026-05-29
**Status:** Aprovado para planejamento
**Contexto:** Primeiro sub-projeto da **Fase 1** (Livro Básico). A Fase 1 é grande demais
para um único plano, então foi decomposta; este documento cobre a **fatia vertical de Raças**,
que prova o pipeline completo da Fase 1 num escopo pequeno e replicável.

> Documentos relacionados: visão geral em
> `docs/superpowers/specs/2026-05-28-wiki-tormenta-20-design.md`;
> fundação concluída em `docs/superpowers/plans/2026-05-28-fase-0-fundacao.md`.

---

## 1. Objetivo e entregável

Levar a categoria **Raças** do Livro Básico 100% ponta a ponta, com o rigor de extração que
o projeto exige, provando o pipeline que escalará para todo o Livro Básico.

**Entregável:** todas as raças do Livro Básico extraídas com rigor (texto + visão, validadas em
duas passadas), em JSON estruturado e validado por Zod, exibidas em **fichas dedicadas** e numa
**página-índice `/racas`**, com **imagens**, **tooltips e auto-link reais**, indexadas na **busca**,
tudo no tema Grimório, com **suíte de testes verde** e **`npm run build` (export estático) passando**.

### Decisões desta fatia (tomadas no brainstorming)

1. Fatiar a Fase 1 por **categoria ponta a ponta**; a primeira categoria é **Raças**.
2. Mecânica das raças capturada como **dados estruturados completos** já agora (alimenta os
   geradores da Fase 3 sem re-extração).
3. Extração pela abordagem **A — visão em duas passadas** (estruturação + validação).
4. Escopo do entregável inclui: **página-índice**, **ficha dedicada de Raça**, **imagens** e
   **tooltips/auto-link reais**.
5. **Imagens versionadas no git** (sai do `.gitignore`).
6. Site passa a **export estático** (`output: "export"`) agora, conforme a spec geral §3.3.

### Princípios herdados (não mudar)

- **Nunca inventar dados** — tudo vem do PDF; o que não existir fica vazio/omitido.
- **Capturar conteúdo escondido** — caixas/sidebars coloridas e tabelas no meio do texto.
- **Proveniência obrigatória** — cada raça carrega `fonte { livro, pagina }`.
- **Qualidade antes de velocidade** — pode demorar; a segunda passada de validação é obrigatória.

---

## 2. Modelo de dados — mecânica estruturada de Raça

Estender `site/lib/schema.ts` **sem quebrar** o `EntidadeSchema` genérico já existente. O campo
livre `mecanica` continua existindo no schema base; adiciona-se um schema específico para Raça,
validado quando `tipo === "raca"`.

### 2.1 `RacaMecanicaSchema` (Zod)

```ts
// Modificador de atributo. Suporta valor fixo (+2 Força) e o caso "à sua escolha".
ModificadorAtributoSchema = z.object({
  atributo: z.enum(["Força","Destreza","Constituição","Inteligência","Sabedoria","Carisma"]).optional(),
  valor: z.number().int(),
  escolha: z.boolean().default(false),       // true = "em N atributos à sua escolha"
  quantidade: z.number().int().positive().optional(), // nº de atributos quando escolha=true
  observacao: z.string().optional(),          // texto literal do livro quando a regra for atípica
})

HabilidadeRacialSchema = z.object({
  nome: z.string(),
  descricao: z.string(),                       // prosa fiel ao livro
  efeito: z.string().optional(),               // campo mecânico legível por máquina (p/ geradores), quando houver
})

RacaMecanicaSchema = z.object({
  modificadores: z.array(ModificadorAtributoSchema).default([]),
  tamanho: z.string(),                          // ex.: "Médio"
  deslocamento: z.number().int().positive(),    // na unidade usada pelo Livro Básico (confirmar na extração: m ou quadrados)
  habilidades: z.array(HabilidadeRacialSchema).default([]),
})
```

### 2.2 Entidade Raça

Uma raça é uma `Entidade` (schema base: `id`, `tipo:"raca"`, `nome`, `resumo`, `fonte`,
`imagens[]`, `secoes[]`, `relacoes[]`, `mecanica`). A validação acrescenta: quando
`tipo === "raca"`, `mecanica` deve satisfazer `RacaMecanicaSchema`. A prosa introdutória/cultural
da raça vai em `secoes[]` (renderizada com auto-link); os números vão na mecânica estruturada.

**Decisão de unidade do deslocamento** e a forma exata de "atributos à sua escolha" são
confirmadas na extração contra o texto real — não presumir.

---

## 3. Pipeline de extração de Raças (visão, duas passadas)

Reusa o pacote `extracao/` da Fase 0 (poppler: `pdftotext -layout`, `pdftoppm`, `pdfimages`).

1. **Descoberta de páginas.** Localizar o intervalo de páginas do capítulo de Raças no
   `pdfs/T20 - Livro Básico.pdf` (rodar `pdftotext`/render e identificar início/fim do capítulo e a
   página de cada raça). Registrar o mapa raça→página(s).
2. **Render + texto.** Para cada página do capítulo: gerar PNG (`pdftoppm`, via `extracao/`) e o
   texto `pdftotext -layout -enc UTF-8`. Cache em `extracao/cache/` (gitignored).
3. **Passada 1 — estruturação.** Um subagente **com visão** recebe, por raça, a(s) imagem(ns) da(s)
   página(s) + o texto correspondente, e produz o JSON conforme §2:
   - O **texto** é a fonte da verdade para grafia, números, nomes e acentos — nunca parafrasear.
   - A **imagem** garante que **caixas/sidebars coloridas e tabelas** (que estão no fluxo do PDF, mas
     fáceis de pular) sejam atribuídas à raça certa e nunca omitidas.
   - Campos ausentes ficam vazios; **não inventar**.
4. **Passada 2 — validação de completude.** Outro subagente relê a(s) página(s) contra o JSON gerado
   e reporta lacunas: habilidade faltando, caixa colorida não capturada, tabela ignorada, número
   divergente, proveniência incorreta. Corrige-se e revalida até completo.
5. **Persistência.** JSON salvo em `data/livro-basico/racas/<slug>.json` (um arquivo por raça),
   validado pelo schema no carregamento do site.

> Trabalho por blocos com subagentes; verificação sempre por **conteúdo**, não só contagem.

---

## 4. Imagens (versionadas no git)

- Extrair as ilustrações das páginas de Raças via `pdfimages` (wrapper já existe na Fase 0).
- Associar a ilustração correta a cada raça pela página de origem; quando uma página tiver várias
  imagens (decorativas + ilustração principal), a passada de visão indica qual é a ilustração da raça.
- Salvar em `data/livro-basico/imagens/racas/<slug>.<ext>` e referenciar em `entidade.imagens[]`.
- **Remover `data/**/imagens/` do `.gitignore`** e versionar as imagens (decisão do usuário) — o site
  funciona ao clonar e publica na Vercel direto. (Os PDFs originais continuam gitignored.)
- Exibir a ilustração na ficha dedicada (§5).

---

## 5. Site — índice, ficha dedicada, auto-link

- **Rota `/racas` (índice).** Lista todas as raças em cards no tema grimório (com `framer-motion`),
  cada card navegando para `/ficha/raca/<id>`. Server Component lendo do carregador memoizado (§6).
- **Componente `FichaRaca`.** Layout dedicado que exibe de forma estruturada e bonita: imagem,
  modificadores de atributo, tamanho, deslocamento e a lista de habilidades raciais (nome + descrição
  com auto-link). A prosa de `secoes[]` é renderizada com `TextoRico`. O componente `Ficha` genérico
  atual permanece para os demais tipos; a rota `/ficha/[tipo]/[id]` escolhe `FichaRaca` quando
  `tipo === "raca"`.
- **Tooltips/auto-link reais.** Expandir `data/referencia/glossario.json` e
  `data/referencia/condicoes.json` com os termos efetivamente citados nos textos das raças (atributos,
  deslocamento, perícias e condições mencionadas), com proveniência. Assim `TextoRico` transforma esses
  termos em tooltip e os nomes de entidades em link, sem marcação manual no JSON das raças.
- **Busca.** As raças entram automaticamente no índice de busca existente (já lê todas as entidades).

---

## 6. Endurecimento da fundação (incluído nesta fatia)

Itens baratos e oportunos agora que o volume de dados cresce (do revisor de integração da Fase 0):

- **Memoização do carregamento.** `carregarEntidades`/`carregarTermos` e a construção do índice de
  busca e do `Registro` de auto-link passam a usar cache em escopo de módulo, evitando reparse a cada
  página e a cada `generateStaticParams`.
- **Pré-compilação da regex de auto-link.** `construirRegistro` passa a guardar a regex já compilada
  no `Registro`; `tokenizar` reusa em vez de remontar a alternância a cada texto.
- **Export estático.** Adotar `output: "export"` no `next.config.ts` e `dynamicParams = false` na rota
  de ficha, para o site virar arquivos estáticos (roda local e publica na Vercel sem alteração) e
  produzir 404 correto para entidades inexistentes (ex.: o link "serve Sszzaas" do Súcubo, ainda sem ficha).

Estes ajustes **não devem alterar comportamento observável** além do export; cobertos por testes
existentes + build.

---

## 7. Testes e validação

- **Schema:** `RacaMecanicaSchema` aceita raça válida (com modificadores fixos e "à escolha"), rejeita
  inválida (atributo fora do enum, deslocamento ausente); entidade `tipo:"raca"` exige a mecânica de raça.
- **Dados:** o carregador encontra todas as raças extraídas; cada JSON de raça valida contra o schema.
- **Site:** `/racas` renderiza a lista; `FichaRaca` exibe modificadores/tamanho/deslocamento/habilidades
  e a imagem; auto-link aplica tooltip/link nos textos de uma raça real.
- **Integração:** `npm test` (site e extracao) verde; **`npm run build` com export estático conclui** e
  gera as páginas das raças e o índice.
- **Validação de conteúdo (humana/visão):** a segunda passada de extração é o gate de qualidade —
  nenhuma raça é dada como pronta sem releitura da página confirmando completude (caixas, tabelas,
  habilidades, proveniência).

---

## 8. Fora de escopo (desta fatia)

- Outras categorias (classes, origens, magias, poderes, etc.) — fatias seguintes da Fase 1.
- Páginas de regra, regras de criação/balanceamento e as Trilhas de Jogador/Mestre — fatias seguintes.
- Geradores criativos (Fase 3+).
- Consumir `data/sources.json` como fonte da verdade da listagem de fontes (continua `dirs` explícito;
  trocar quando uma segunda fonte entrar).

---

## 9. Estrutura de arquivos afetada

```
compendium tormenta 20/
├── .gitignore                         # remover a linha data/**/imagens/
├── data/
│   ├── referencia/
│   │   ├── condicoes.json             # expandir com termos citados nas raças
│   │   └── glossario.json             # idem
│   └── livro-basico/
│       ├── racas/<slug>.json          # NOVO: uma raça por arquivo
│       └── imagens/racas/<slug>.<ext> # NOVO: ilustrações (versionadas)
├── extracao/                          # reuso do pipeline da Fase 0 (sem mudança estrutural)
└── site/
    ├── next.config.ts                 # output: "export"
    ├── lib/schema.ts                  # + RacaMecanicaSchema e validação por tipo
    ├── lib/dados.ts                   # + memoização
    ├── lib/autolink.ts                # + regex pré-compilada no Registro
    ├── app/ficha/[tipo]/[id]/page.tsx # + dynamicParams=false; escolhe FichaRaca p/ raca
    ├── app/racas/page.tsx             # NOVO: índice de raças
    ├── components/FichaRaca.tsx       # NOVO: ficha dedicada de raça
    └── test/                          # novos testes (schema raça, índice, FichaRaca, autolink em raça)
```
