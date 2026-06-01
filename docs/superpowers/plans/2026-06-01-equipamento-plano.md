# Capítulo 3 — Equipamento — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Tarefas com checkbox.
> Mapa de descoberta: `docs/superpowers/plans/equipamento-lista.md`. Executar em ONDAS.

**Goal:** Categoria **Equipamento** (~170 itens: armas, armaduras, escudos, munições, itens gerais) + as
**regras** do capítulo (riqueza/T$, proficiência, características de armas/armaduras, venenos, melhorias,
materiais especiais), com schema próprio, `FichaItem`, índice `/equipamento` agrupado, e build verde.

**Architecture:** Reusa o pipeline de entidades. Itens são **texto/tabela** (sem ilustração por item). Schema
**pragmático**: `item` com `categoria` + campos comuns (`preco`, `espacos`) + blocos opcionais `arma` / `protecao`
+ `especial` (regras únicas). NÃO usar união discriminada de 14 tipos. Melhorias/materiais especiais entram como
**regras** (tabelas em texto). Extração em ondas, 2 passadas.

**Stack:** Next.js 16 + TS + Zod v4 + Vitest; poppler. Export estático.

---

## Convenções (idênticas)
- poppler literal: `C:/Users/ASCalderon/Desktop/Projeto-Tormenta/poppler-bin/poppler-24.08.0/Library/bin`. Offset PDF = impressa + 6.
- Imagens já em `extracao/cache/discEq/p-144.png … p-173.png` (impressas 138–167); texto `extracao/cache/discEq/equip.txt`.
- Node no PATH (PowerShell); commit caminhos específicos; sem push. 2 passadas. **Confirmar tabelas pela IMAGEM** (pdftotext embaralha; Tabela 3-3 quebra em 2 páginas).

## Schema (pragmático)
```ts
export const ArmaStatsSchema = z.object({
  proficiencia: z.string(),            // "simples" | "marcial" | "exótica" | "fogo"
  empunhadura: z.string(),             // "leve" | "uma mão" | "duas mãos"
  alcance: z.string().optional(),      // "curto" | "médio" | "longo"
  dano: z.string(),                    // "1d8", "1d10/1d12" (adaptável)
  critico: z.string(),                 // "19", "x3", "19/x3"
  tipoDano: z.string(),                // "Corte" | "Impacto" | "Perfuração" | "Corte/perfuração"
  habilidades: z.array(z.string()).default([]),  // ["Ágil","Adaptável","Dupla","Versátil","Alongada","Desbalanceada","Arremesso"]
});
export const ProtecaoStatsSchema = z.object({
  subcategoria: z.string(),            // armadura: "leve"|"pesada"; escudo: "leve"|"pesado"
  bonusDefesa: z.number().int(),
  penalidadeArmadura: z.number().int(),
  danoAtaque: z.string().optional(),   // escudos
});
export const ItemMecanicaSchema = z.object({
  categoria: z.string(),               // arma|armadura|escudo|municao|item-aventura|ferramenta|vestuario|esoterico|alquimico|alimentacao|animal|veiculo|servico
  preco: z.string().optional(),        // "T$ 15", "—"
  espacos: z.string().optional(),      // "1", "0,5", "—"
  arma: ArmaStatsSchema.optional(),
  protecao: ProtecaoStatsSchema.optional(),
  especial: z.string().optional(),     // regras/propriedades além da linha de tabela (e descrição do item)
});
```
Ramo `else if (ent.tipo === "item")` no `superRefine`. O `resumo`/`secoes` da entidade guardam descrição longa quando houver; `especial` para a regra curta do item.

---

## ONDA A — Código (schema + FichaItem + índice + regras-chave)

### A1: Schema `item` (TDD)
- [ ] Adicionar os schemas acima a `site/lib/schema.ts` (antes de `EntidadeSchema`) + ramo `item` no `superRefine`. Testes: arma válida (com bloco `arma`), armadura válida (com `protecao`), item geral (só categoria+preco+espacos+especial); item sem `categoria` falha.

### A2: `FichaItem` (TDD)
- [ ] `site/components/FichaItem.tsx` espelhando `FichaPericia`/`FichaPoder`. Cabeçalho: nome + selo da **categoria** (rótulo legível). Mostrar **Preço** e **Espaços**. Se `arma`: linha de stats (Dano, Crítico, Alcance, Tipo, Empunhadura, Proficiência) + chips de `habilidades`. Se `protecao`: Bônus de Defesa, Penalidade de Armadura (+ Dano do escudo). `especial`/descrição via `TextoRico`. Wiring no `app/ficha/[tipo]/[id]/page.tsx` (ramo `item`). Teste: arma mostra dano/crítico; armadura mostra bônus de defesa.

### A3: Índice `/equipamento` + atalho na home + regras "como funciona"
- [ ] `site/app/equipamento/page.tsx`: agrupado por **categoria** (Armas, Armaduras & Escudos, Munições, Equipamento de Aventura, Ferramentas, Vestuário, Esotéricos, Alquímicos, Alimentação, Animais, Veículos, Serviços). Painel "Como funciona o Equipamento" + atalho na home. Teste de índice.
- [ ] Regras (entidades `regra-de-criacao`/`regra`) — consolidar o mapa de 25 em **poucas entidades coesas** (fiel ao livro): `riqueza-e-equipamento` (T$/moedas, dinheiro inicial, limites de uso/carga), `regras-de-armas` (proficiência, propósito, empunhadura, características, habilidades de armas, passos de dano, armas improvisadas), `regras-de-armaduras` (categorias, características, penalidade), `regras-de-itens-gerais` (subcategorias, instrumentos, venenos, pratos especiais), `itens-superiores` (melhorias + tabela + materiais especiais). Proveniência por impressa. Spike: extrair 1 arma (Espada longa) e 1 armadura (Cota de malha) para o índice/teste ter dados.

---

## ONDA B — Armas (40) + Munições (4) + Armaduras (10) + Escudos (2)
- [ ] Tabela 3-3 (impressas 143–145) + descrições (145–149): cada arma com bloco `arma` completo (proficiencia, empunhadura, alcance, dano, danoDuasMaos via campo `dano` "x/y", critico, tipoDano, habilidades) + `especial` (regra textual: Ágil, Adaptável, Alcance 4,5m, recarregar, Rede etc.). Munições (Tabela 3-4) como `categoria:"municao"`. Armaduras & Escudos (Tabela 3-5, impressa 152 + descrições 153) com bloco `protecao`. Blocos por subcategoria, 2 passadas. **Confirmar valores pela IMAGEM** (dano duplo `/`, crítico `19/x3`). Commit por bloco.

## ONDA C — Itens Gerais (~110)
- [ ] Tabela 3-6 + descrições (impressas 154–163): Equipamento de Aventura (17), Ferramentas (12), Vestuário (21), Esotéricos (10), Alquímicos preparados (8)/catalisadores (12)/venenos (10), Alimentação (7), Animais (8), Veículos (5), Serviços (~10). Cada um: categoria, preco, espacos, `especial`/descrição (incl. mecânica especial: Algemas, Bomba, Cetro elemental, Balão goblin, venenos com inoculação etc.). Blocos por subcategoria, 2 passadas. Commit por bloco.

## ONDA D — Regras + Itens Superiores
- [ ] Criar as entidades `regra` consolidadas (Onda A já fez as principais; completar venenos/pratos/instrumentos). **Melhorias** (Tabela 3-8, ~30) e **Materiais Especiais** (Tabela 3-9, 6) capturados na regra `itens-superiores` (tabelas + efeitos em texto, fiéis). 2 passadas.

## ONDA E — Integração
- [ ] `npm test` + `npm run build` (gera `/equipamento` + uma ficha por item). Conferir links (proficiências/itens citados em Origens/Classes/Combate). Atualizar PROGRESSO (Cap. 3 ✅; próxima: **Magia** Cap. 4). Commit.

---

## Encerramento
Ao fim: ~170 itens + regras do Cap. 3 no site, schema `item`, `FichaItem`, índice `/equipamento`, build verde.
Próxima fatia: **Magia** (Cap. 4) — destrava a conjuração das classes.
