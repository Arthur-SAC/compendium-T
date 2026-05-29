# Demais Classes do Livro Básico — Documento de Design

**Data:** 2026-05-29
**Status:** Aprovado para planejamento
**Contexto:** Completa a categoria **Classes** da Fase 1. O spike do **Guerreiro** já validou o
`ClasseMecanicaSchema`, a `FichaClasse` e o pipeline de extração por visão. Esta fatia extrai as
**~13 classes restantes** do Livro Básico, estende o schema para **conjuradores** e adiciona o índice
`/classes`.

> Relacionados: spike do Guerreiro (`docs/superpowers/specs/2026-05-29-guerreiro-classe-spike-design.md`),
> fatia de Raças, tema "Tomo de Arton". Pipeline: descoberta → extração visão 2 passadas → validação independente.

---

## 1. Objetivo e entregável

Extrair com rigor (visão, 2 passadas) as classes restantes do Livro Básico — **Arcanista, Bárbaro, Bardo,
Bucaneiro, Caçador, Cavaleiro, Clérigo, Druida, Inventor, Ladino, Lutador, Nobre, Paladino** (Guerreiro já
feito) — em JSON estruturado validado por Zod, exibidas na `FichaClasse`, com **índice `/classes`**,
ilustrações, tooltips/auto-link, busca, no tema "Tomo de Arton". **Suíte verde + build estático** OK.
Executada em **blocos** com **validação independente por bloco**.

### Decisões do brainstorm
1. **Uma fatia, em blocos**: (a) estender schema + índice; (b) descobrir páginas; (c) extrair **marciais**;
   (d) extrair **conjuradoras**. Validação independente por bloco.
2. **Conjuração estruturada, magias adiadas**: o schema ganha campos opcionais para descrever a conjuração
   e os caminhos da classe; as **descrições das magias** ficam para a categoria *Magias* (fatia futura) —
   a classe só descreve *como* conjura.
3. Lista de classes confirmada na descoberta (a lista acima é a esperada do Livro Básico).

### Princípios herdados
Nunca inventar dados; capturar conteúdo escondido (tabelas, quadros); proveniência obrigatória; qualidade
antes de velocidade; typos óbvios do livro podem ser corrigidos.

## 2. Extensão do schema (aditiva, opcional)

Acrescentar ao `ClasseMecanicaSchema` (em `site/lib/schema.ts`) campos **opcionais** — não afetam o
Guerreiro nem as classes marciais (que simplesmente não os têm):

```
ConjuracaoSchema = z.object({
  tipo: z.string(),                 // ex.: "Arcana", "Divina"
  atributoChave: z.string(),        // ex.: "Inteligência", "Sabedoria", "Carisma"
  descricao: z.string().optional(), // texto fiel de como a classe conjura
})

CaminhoClasseSchema = z.object({
  nome: z.string(),                 // ex.: "Mago", "Bruxo", "Feiticeiro"
  descricao: z.string(),
  habilidades: z.array(HabilidadeClasseSchema).default([]), // habilidades específicas do caminho
})

// adicionar a ClasseMecanicaSchema:
//   conjuracao: ConjuracaoSchema.optional(),
//   caminhos: z.array(CaminhoClasseSchema).default([]),
```

`HabilidadeClasseSchema` já existe (reuso). As habilidades de magia da classe (ex.: "Magias", "Magias de
Arcanista") continuam em `mecanica.habilidades`. As **magias em si** não entram na classe.

## 3. Índice `/classes`

Rota `site/app/classes/page.tsx` — Server Component que lista todas as entidades `tipo:"classe"` em cards
no tema "Tomo de Arton", **no mesmo estilo do `/racas`** (card de pergaminho, ilustração, nome em carmesim
com a fonte Tormenta, resumo em tinta suave; link para `/ficha/classe/<id>`). Análogo a `app/racas/page.tsx`.
Acrescentar um atalho para `/classes` na home (ao lado do de raças).

## 4. `FichaClasse` — acréscimos

Estender o componente para renderizar, **quando presentes**:
- **Conjuração**: um bloco/box com `tipo`, `atributoChave` e `descricao` (ex.: "Conjurador Arcano · atributo-chave Inteligência").
- **Caminhos**: uma seção listando cada caminho (`nome` + `descricao` + suas `habilidades`, no mesmo formato
  em blocos das habilidades de classe).
Marciais (sem `conjuracao`/`caminhos`) não exibem nada novo. Mantém tabela de progressão, habilidades,
poderes (e tabela de efeitos quando houver, ex.: Golpe Pessoal).

## 5. Pipeline de extração (visão, 2 passadas) — por bloco

1. **Descoberta**: mapear o intervalo de páginas PDF de cada classe no `pdfs/T20 - Livro Básico.pdf`
   (registrar em `docs/superpowers/plans/classes-paginas.md`), confirmando o offset do capítulo de Classes.
2. **Por classe** (em blocos de ~3–4): render (PNG 150 dpi) + `pdftotext -layout`; ler imagem+texto e
   preencher `data/livro-basico/classes/<slug>.json` conforme o `ClasseMecanicaSchema` (atributo-chave,
   PV/PM, perícias, proficiências, **progressão 1–20 completa**, habilidades, poderes; e — para conjuradoras —
   `conjuracao` e `caminhos`). Ilustração via `comporComMascara` → `site/public/classes/<slug>.png`.
3. **2ª passada independente** (outro agente) por bloco: reler as páginas vs JSON — progressão completa,
   habilidades/poderes/caminhos presentes e fiéis, números corretos, proveniência, grafia.
4. Termos de regra citados que faltarem em `data/referencia/` entram com proveniência.

Ordem dos blocos: marciais primeiro (validam o schema atual), conjuradoras por fim (exercitam
`conjuracao`/`caminhos`).

## 6. Fora de escopo

- **Descrições das magias** → categoria *Magias* (fatia futura). Os caminhos ficam embutidos na classe
  (não viram entidades `variante-classe` separadas por ora).
- Outras categorias (origens, poderes gerais avulsos, perícias como entidades, etc.).
- Geradores (Fase 3).

## 7. Testes e validação

- **Schema**: classe conjuradora válida (com `conjuracao` e `caminhos`); classe marcial continua válida
  (campos ausentes); `caminho` exige `nome`/`descricao`.
- **Dados**: o carregador encontra cada nova classe; cada JSON valida contra o schema.
- **Site**: `FichaClasse` renderiza conjuração e caminhos quando presentes (teste com fixture conjuradora);
  `/classes` lista as classes com link para a ficha.
- **Integração**: `npm test` verde; `npm run build` gera `/classes` e `/ficha/classe/<slug>` de todas.
- **Conteúdo**: a 2ª passada (visão) é o gate por classe — progressão 1–20, habilidades, poderes, caminhos
  e conjuração completos e fiéis.

## 8. Estrutura de arquivos afetada

```
site/
├── lib/schema.ts                         # + ConjuracaoSchema, CaminhoClasseSchema; campos opcionais em ClasseMecanicaSchema
├── components/FichaClasse.tsx            # + render de Conjuração e Caminhos (quando presentes)
├── app/classes/page.tsx                  # NOVO: índice de classes (estilo /racas)
├── app/page.tsx                          # + atalho para /classes
├── public/classes/<slug>.png             # NOVO: ilustrações das classes (versionadas)
└── test/
    ├── schema.test.ts                    # + casos de classe conjuradora
    ├── fichaclasse.test.tsx              # + render de conjuração/caminhos
    └── classes-indice.test.tsx           # NOVO
data/livro-basico/classes/<slug>.json     # NOVO: 13 classes restantes
data/referencia/{glossario,condicoes}.json # + termos citados nas classes (se faltarem), com proveniência
docs/superpowers/plans/classes-paginas.md  # NOVO: mapa de páginas das classes
```
