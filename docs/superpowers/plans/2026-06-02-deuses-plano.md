# Capítulo Deuses (Panteão) — Plano de Implementação

> Mapa de descoberta: `docs/superpowers/plans/deuses-paginas.md`. Executar em ONDAS (Subagent-Driven).

**Goal:** Categoria **Divindade** (20 deuses do Panteão) + a **regra de devoção**, com schema `divindade`,
`FichaDivindade`, índice `/deuses` e build verde. **Acende os links** que faltavam: Clérigo/Paladino/Devoto →
divindades; e os **Poderes Concedidos** de cada deus → as fichas de poder (group `concedido`, já existentes).

**Architecture:** Reusa o pipeline de entidades. Divindade = texto + ficha estruturada (sem tabela complexa como magia).
`tipo: "divindade"` já existe no enum do schema; falta `DivindadeMecanicaSchema` + ramo no `superRefine`.
Símbolos (ilustração circular) = opcional, deferido.

---

## Schema (pragmático)
```ts
export const DivindadeMecanicaSchema = z.object({
  crencasObjetivos: z.string(),
  simboloSagrado: z.string(),
  canalizaEnergia: z.string(),          // "Positiva" | "Negativa" | "Qualquer"
  armaPreferida: z.string(),            // pode ser "não há"
  devotos: z.string(),                  // texto (raças/classes permitidas) — auto-link acende nomes
  poderesConcedidos: z.array(z.string()).default([]),  // nomes → chips que linkam pros poderes
  obrigacoesRestricoes: z.string(),
});
```
Ramo `else if (ent.tipo === "divindade")` no `superRefine`. `nome`/`resumo` (flavor) na entidade;
`descricao` (flavor longo) pode ir em `secoes` ou no resumo. Relações: `devotos`, `concede` (poderes).

---

## ONDA A — Código (schema + FichaDivindade + índice + regra) [TDD]
- [ ] **A1 schema `divindade`** (TDD): schema acima + ramo no `superRefine`. Testes: divindade válida; sem `canalizaEnergia` falha.
- [ ] **A2 `FichaDivindade`** (TDD): cabeçalho (nome + selo "Canaliza Energia: X"); bloco com Símbolo Sagrado, Arma Preferida,
  Devotos; **Poderes Concedidos como chips que linkam** (igual chips de `FichaOrigem`); Crenças e Objetivos + Obrigações &
  Restrições via `TextoRico`. Wiring no `ficha/[tipo]/[id]`. Teste: mostra energia, um poder concedido linkado.
- [ ] **A3 índice `/deuses`** + atalho na home: lista as 20, agrupáveis/filtráveis por **Canaliza Energia** (Positiva/Negativa/Qualquer).
  Painel "Como funciona a devoção" → regra. Spike: extrair 1 divindade (ex.: **Khalmyr** ou **Wynna**) p/ índice/teste.
- [ ] Regra `devocao-como-funciona` (entidade `regra-de-criacao`): "Escolhendo seu Deus" + "Características dos Deuses"
  (impressa 96). Devoto vs clérigo/paladino, seguir Obrigações & Restrições, perda de poderes/penitência (perícia Religião).

## ONDA B — Extração das 20 divindades (impressas 96–105) — por blocos
- [ ] ~3–4 blocos (~5–6 deuses cada), 2 passadas, **validação independente por agente com visão**. Cada divindade:
  flavor (resumo), Crenças e Objetivos, Símbolo Sagrado, Canaliza Energia, Arma Preferida, Devotos, Poderes Concedidos
  (lista exata), Obrigações & Restrições. Conferir nomes dos Poderes Concedidos contra os slugs em `data/livro-basico/poderes/`.
  Commit por bloco.

## ONDA C — Integração + links
- [ ] `npm test` + `npm run build` (gera `/deuses` + 20 fichas + a regra). **Acender links:** chips de Poderes Concedidos →
  fichas de poder; devotos (raças/classes) auto-linkam; e referências a deuses em Clérigo/Paladino/Poderes Concedidos passam a
  linkar pras divindades (auto-link por nome — atenção a nomes curtos: "Lena", "Marah", "Nimb", "Oceano", "Wynna" seguem a
  regra de inicial maiúscula da Onda C de Magia, então só Title-Case linka). Atualizar PROGRESSO (Deuses ✅). Commit.

## Opcional / deferido
- **Símbolos sagrados** (ilustração circular por deus): extrair via `comporComMascara` (`pdfimages -png`), salvar em
  `site/public/divindades/<slug>.png`. Polimento — fazer no passe de design ou se o usuário pedir.

## Encerramento
20 divindades + regra de devoção no site, schema `divindade`, `FichaDivindade`, índice `/deuses`, build verde, e a
teia deuses↔poderes-concedidos↔conjuradoras clicável. Próximas fatias: **Construção de Personagem/Atributos**, Combate, Mundo, Mestrar.
