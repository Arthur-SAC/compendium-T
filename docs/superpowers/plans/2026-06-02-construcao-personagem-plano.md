# Construção de Personagem & Atributos (Cap. 1) — Plano

> Fatia de REGRAS (não catálogo). Reusa `regra-de-criacao` + `Ficha` genérico (já renderiza `mecanica`
> estruturada como tabela/lista — corrigido em `3e529f8`). Sem schema/componente novo.

**Goal:** As regras de criação de personagem do Cap. 1 no site: visão geral (9 passos), Atributos
(os 6 + como definir), Características das Raças (Tabela 1-2) e Toques Finais (características derivadas).
Entregável-bônus: uma landing **/personagem** que amarra os 9 passos aos índices já existentes (semente da Trilha do Jogador).

## Mapa de páginas (offset PDF = impressa + 6)
| Conteúdo | Impressa | PDF |
|---|---|---|
| Abertura "Capítulo 1 — Construção de Personagem" (arte) | 14–15 | 20–21 |
| **Visão geral: 9 passos** + "Conceito de Personagem" | 16 | 22 |
| **Atributos Básicos** (6 atributos) + **Definindo seus Atributos** (Pontos/Rolagem/Mínimos) + **Tabela 1-1** | 17 | 23 |
| **Raças** intro + **Características das Raças** (Modif. de Atributo, Habilidades de Raça) + **Tabela 1-2** | 18 | 24 |
| **Toques Finais / Características Derivadas** (PV, PM, recuperação, temporários, Defesa, Tamanho, Deslocamento, Descrição) | 106–107+ | 112–113+ |

> **9 passos** (a nota antiga dizia "6" — ERRADO): 1 Atributos · 2 Raça · 3 Classe · 4 Origem · 5 Divindade (opcional)
> · 6 Perícias · 7 Equipamento · 8 Magias (conjuradoras) · 9 Toques Finais.

## Ondas
- [x] **Spike:** regra `atributos` (impressa 17) — 6 atributos + definir (pontos/rolagem 4d6/mínimos) + Tabela 1-1 na `mecanica`.
- [ ] **A — regras restantes** (`regra-de-criacao`, extração 2 passadas):
  - `construcao-de-personagem` (9 passos + Conceito) — impressa 16. (vira a base da landing)
  - `caracteristicas-derivadas` (Toques Finais: PV, PM, recuperação Normal/Ruim/Confortável/Luxuosa, temporários,
    Defesa = 10 + armadura + Destreza, Tamanho + Tabela 3-2, Deslocamento) — impressas 106–107.
  - `caracteristicas-das-racas` (Modif. de Atributo + Habilidades de Raça + Tabela 1-2) — impressa 18. **Backfill da regra de Raças.**
- [ ] **DESCOBRIR:** onde estão **Nível / XP / Patamares (iniciante-veterano-campeão-lenda) / Multiclasse**. Procurar no fim do Cap. 1
  (impressas 107–113, "Toques Finais"/descrição) ou em capítulo de evolução. Extrair a(s) regra(s) correspondente(s).
- [ ] **B — landing /personagem** (opcional, alto valor): lista os 9 passos, cada um linkando pro índice/regra
  (Atributos→/ficha/regra-de-criacao/atributos; Raça→/racas; Classe→/classes; Origem→/origens; Divindade→/deuses;
  Perícias→/pericias; Equipamento→/equipamento; Magias→/magias; Toques Finais→a regra). Semente da **Trilha do Jogador**.
- [ ] **C — integração:** build + testes verdes; atalho na home; atualizar PROGRESSO. Commit.

## Notas
- Tabelas (1-1, 1-2, 3-2) entram em `mecanica` como array de objetos → `Ficha` genérico renderiza como `<table>`.
- Reaproveitar: já existe `pericias-como-funcionam`, `magia-como-funciona`, `devocao-como-funciona`, regras de equipamento — as novas regras de criação completam a camada "jogável sem o livro".
