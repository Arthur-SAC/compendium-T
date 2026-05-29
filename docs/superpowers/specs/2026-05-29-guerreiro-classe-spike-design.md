# Guerreiro (Classe) — Spike Ponta a Ponta — Documento de Design

**Data:** 2026-05-29
**Status:** Aprovado para planejamento
**Contexto:** Primeiro sub-projeto da fatia de **Classes** (Fase 1). Por decisão do usuário, levamos **uma
classe (Guerreiro) 100% ponta a ponta** primeiro — para validar o `ClasseMecanicaSchema` e uma ficha de
classe dedicada — e só então planejar as demais classes. Reusa o pipeline e o tema já estabelecidos.

> Relacionados: fatia de Raças (`docs/superpowers/specs/2026-05-29-racas-ponta-a-ponta-design.md`),
> tema "Tomo de Arton" (`docs/superpowers/specs/2026-05-29-revamp-visual-design.md`), visão geral
> (`docs/superpowers/specs/2026-05-28-wiki-tormenta-20-design.md`).

---

## 1. Objetivo e entregável

Extrair a classe **Guerreiro** do Livro Básico com rigor (visão em 2 passadas), em **JSON estruturado
validado por Zod**, exibida numa **ficha de classe dedicada** (`FichaClasse`) na rota
`/ficha/classe/guerreiro`, com **ilustração**, **tooltips/auto-link**, indexada na **busca**, no tema
"Tomo de Arton", com **suíte verde** e **build estático** passando. Depois revisamos e decidimos o plano
das demais classes.

### Decisões do brainstorm
1. Escopo = **uma classe (Guerreiro)**; demais classes ficam para a próxima fatia.
2. Mecânica capturada como **dados estruturados completos** (consistente com Raças; alimenta os geradores).
3. Classe-cobaia = **Guerreiro** (marcial, sem magia — valida o núcleo do schema com baixa complexidade).
4. Extração pela abordagem **visão em 2 passadas** (estruturação + validação independente).

### Princípios herdados
Nunca inventar dados (tudo vem do PDF; o que não existir fica vazio); capturar conteúdo escondido
(tabelas, quadros); proveniência obrigatória (`fonte { livro, pagina }`); qualidade antes de velocidade;
typos óbvios do livro podem ser corrigidos (decisão do usuário na fatia de Raças).

## 2. Modelo de dados — `ClasseMecanicaSchema` (Zod)

Estende `site/lib/schema.ts` **sem quebrar** o `EntidadeSchema` genérico, com validação por tipo quando
`tipo === "classe"` (mesmo padrão `superRefine` usado para Raça). Formas:

```
ProgressaoNivelSchema = z.object({
  nivel: z.number().int().min(1).max(20),
  habilidades: z.array(z.string()).default([]),   // nomes das habilidades ganhas naquele nível
})

HabilidadeClasseSchema = z.object({
  nome: z.string(),
  nivel: z.number().int().optional(),              // nível em que é obtida (quando aplicável)
  descricao: z.string(),                           // texto fiel ao livro
  custo: z.string().optional(),                    // ex.: "1 PM" (quando houver)
  prerequisito: z.string().optional(),
  efeito: z.string().optional(),                   // resumo mecânico legível por máquina (p/ geradores)
})

PoderClasseSchema = z.object({
  nome: z.string(),
  descricao: z.string(),
  prerequisito: z.string().optional(),
  custo: z.string().optional(),
})

PericiasClasseSchema = z.object({
  quantidade: z.number().int().min(0),             // nº de perícias à escolha
  fixas: z.array(z.string()).default([]),          // perícias sempre treinadas
  lista: z.array(z.string()).default([]),          // lista de onde escolher (se restrita)
  texto: z.string(),                               // descrição fiel do livro (fonte da verdade)
})

ClasseMecanicaSchema = z.object({
  atributoChave: z.string(),                       // ex.: "Força" (texto, p/ casos "à escolha")
  pvInicial: z.number().int().positive(),
  pvPorNivel: z.number().int().positive(),
  pmPorNivel: z.number().int().min(0),
  pericias: PericiasClasseSchema,
  proficiencias: z.array(z.string()).default([]),  // armas/armaduras/escudos
  progressao: z.array(ProgressaoNivelSchema).default([]),  // tabela 1–20
  habilidades: z.array(HabilidadeClasseSchema).default([]),
  poderes: z.array(PoderClasseSchema).default([]), // pool de poderes da classe
})
```

A prosa de flavor da classe vai em `secoes[]`; os números/tabelas vão na mecânica estruturada. Campos
opcionais ficam ausentes quando o livro não os define.

## 3. Site — `FichaClasse` + rota

- **`FichaClasse`** (novo componente, tema Tomo): faixa de título escura (rótulo "Classe" + nome em
  Tormenta/degradê + Divisor) e corpo pergaminho com:
  - caixas de stat: **Atributo-chave, PV inicial, PV/nível, PM/nível**;
  - **Perícias** (texto fiel + chips das fixas) e **Proficiências** (chips);
  - **Tabela de progressão 1–20** (coluna Nível | Habilidades) — renderizada como tabela legível no pergaminho;
  - **Habilidades de classe** (nome + descrição com `TextoRico`; nível/custo/pré-requisito quando houver);
  - **Poderes da classe** (lista nome + descrição);
  - **Descrição** (flavor) e a **ilustração**.
- **Rota** `site/app/ficha/[tipo]/[id]/page.tsx`: passa a escolher `FichaClasse` quando
  `tipo === "classe"` (hoje escolhe `FichaRaca` para `"raca"`, senão `Ficha`).
- **Busca**: o Guerreiro entra automaticamente no índice (carregador já lê todas as entidades).

## 4. Pipeline de extração (visão, 2 passadas)

1. **Descoberta**: localizar o intervalo de páginas do Guerreiro no `pdfs/T20 - Livro Básico.pdf`
   (uma classe ocupa várias páginas). Registrar as páginas.
2. **Render + texto**: `pdftoppm` (PNG 150 dpi) + `pdftotext -layout -enc UTF-8` por página (cache gitignored).
3. **Passada 1 (estruturação)**: ler imagem+texto e produzir `data/livro-basico/classes/guerreiro.json`
   conforme §2 — texto = fonte de grafia/números; imagem = estrutura (capturar a **tabela de progressão**
   e TODAS as habilidades e poderes; não pular quadros). Nunca inventar.
4. **Passada 2 (validação independente)**: reler as páginas contra o JSON — tabela completa (1–20),
   habilidades e poderes presentes, números (PV/PM/perícias) corretos, proveniência correta, grafia fiel.
5. **Ilustração**: extrair via `pdfimages`, compor com `comporComMascara` (de `extracao/src/imagens.ts`)
   → `site/public/classes/guerreiro.png` (versionada); referenciar em `imagens[]`.
6. **Tooltips**: termos de regra citados no Guerreiro que ainda não estejam em `data/referencia/` entram
   com proveniência (mesmo critério da fatia de Raças). Reusar os já existentes.

## 5. Fora de escopo (deste spike)

- **Índice `/classes`** e as **demais classes** do Livro Básico → próxima fatia (decidida após revisar o Guerreiro).
- **Campos específicos de conjuradores** (caminhos/escolas, magias por círculo) → quando uma classe
  conjuradora entrar; o `ClasseMecanicaSchema` será estendido então (os campos atuais são opcionais/aditivos).
- Geradores (Fase 3) e demais categorias.

## 6. Testes e validação

- **Schema**: `ClasseMecanicaSchema` aceita um Guerreiro válido; entidade `tipo:"classe"` exige a mecânica
  de classe; rejeita progressão/níveis inválidos (nível fora de 1–20) e mecânica incompleta (sem `atributoChave`/PV).
- **Dados**: o carregador encontra o Guerreiro; o JSON valida contra o schema.
- **Site**: `FichaClasse` exibe atributo-chave, PV/PM, a tabela de progressão e ao menos uma habilidade;
  auto-link aplica num texto do Guerreiro; rota `/ficha/classe/guerreiro` prerenderiza.
- **Integração**: `npm test` (site) verde; `npm run build` (export estático) conclui e gera a ficha do Guerreiro.
- **Validação de conteúdo**: a 2ª passada (visão) é o gate — Guerreiro só é dado como pronto após releitura
  confirmando a tabela 1–20 e as habilidades/poderes completos.

## 7. Estrutura de arquivos afetada

```
site/
├── lib/schema.ts                        # + ClasseMecanicaSchema (e subtipos) + validação por tipo "classe"
├── app/ficha/[tipo]/[id]/page.tsx       # + escolher FichaClasse quando tipo === "classe"
├── components/FichaClasse.tsx           # NOVO: ficha de classe (tema Tomo, tabela de progressão)
├── public/classes/guerreiro.png         # NOVO: ilustração (versionada)
└── test/
    ├── schema.test.ts                   # + casos de Classe
    └── fichaclasse.test.tsx             # NOVO
data/livro-basico/classes/guerreiro.json # NOVO
data/referencia/{glossario,condicoes}.json # + termos citados no Guerreiro (se faltarem), com proveniência
docs/superpowers/plans/guerreiro-paginas.md # NOVO (opcional): páginas PDF do Guerreiro (artefato da descoberta)
```
