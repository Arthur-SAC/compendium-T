# Capítulo 7 — Ameaças / Bestiário — Plano

> Decisão do usuário: **bestiário primeiro** (criaturas), num **hub "Bestiário"** (`/bestiario`) que depois reunirá
> também **Perigos/Ameaças** e **Fichas de NPCs**. Construindo Combates/Perigos/NPCs = 2ª leva.
> Esta é a única fatia que precisa de **código novo** (entidade `criatura` com bloco de estatísticas).

**Goal:** O bestiário do Livro Básico no site — todas as criaturas com ficha de estatísticas (ND, atributos,
ataques, perícias, habilidades), agrupadas por tema, com auto-link cruzando condições, perícias, magias, deuses, regiões.

## Limites (Sumário) — offset PDF = impressa + 6
- **Capítulo 7: Ameaças** — impressas **280–323** (PDF 286–329).
  - Construindo Combates (282) — regra (2ª leva).
  - **Criaturas (282–316)** — BESTIÁRIO, agrupado por tema (cabeçalhos vermelhos grandes):
    Masmorras (286), Ermos (289), Os Puristas (294), Reino dos Mortos (297), Os Duyshidakk (300),
    Os Sszzaazitas (304), Os Trolls Nobres (307), Os Dragões (310), A Tormenta (314).
  - Perigos (317) — regra (2ª leva).
  - Fichas de NPCs (322) — 2ª leva (entram no hub Bestiário).

## Formato do bloco de estatísticas (confirmado na imagem, impressa 286)
Nome + **ND**; linha de tipo ("Monstro Pequeno" / "Animal" / "Humanoide (orc) Médio" + ícone);
**Iniciativa**, **Percepção** (+sentidos); **Defesa**, **Fort/Ref/Von**; **Pontos de Vida**; **Deslocamento**;
ataques **Corpo a Corpo**/**Distância**; atributos **For Des Con Int Sab Car**; **Perícias** (opc.);
habilidades especiais (nome em negrito + texto: Doença, Sensibilidade, Sentidos…); **Equipamento**; **Tesouro**.

## Modelagem (entidade `criatura`)
- `CriaturaMecanicaSchema`: `nd`, `tipo`, `tamanho` (req.); `tema` (agrupa o índice); `iniciativa`, `percepcao`,
  `defesa`, `fortitude`, `reflexos`, `vontade`, `pontosDeVida`, `deslocamento` (strings, p/ aceitar "+5"/"9m (6q)");
  `ataques[]`; `atributos{forca,destreza,constituicao,inteligencia,sabedoria,carisma}` (strings, "—" p/ mente animal);
  `pericias?`; `habilidades[] {nome,descricao}`; `equipamento?`; `tesouro?`. Ramo no `superRefine`.
- **`FichaCriatura`**: duas colunas — barra lateral = bloco numérico (ND/tipo/tamanho, defesa/saves/PV, desloc., atributos,
  ataques, perícias, equip./tesouro); coluna principal = habilidades especiais + `secoes` (flavor). Auto-link no texto.
- **Índice `/bestiario`**: agrupa por `tema` (ordem do livro) + selo de ND; atalho na home. Hub preparado p/ receber NPCs/perigos depois.

## Ondas
- [ ] **A — código + spike:** schema + `FichaCriatura` + `/bestiario` + wiring na rota de ficha + atalho home.
  Spike: criaturas da pág. 286 (Masmorras): Glop, Rato Gigante, Orc Combatente/Chefe/Mutante. Testes (índice+schema). Commit.
- [ ] **B — extração por tema** (subagentes, 1 por tema, 300 DPI, 2 passadas, commit por tema): Masmorras, Ermos,
  Puristas, Reino dos Mortos, Duyshidakk, Sszzaazitas, Trolls Nobres, Dragões, Tormenta. Mapear nome→ND→página primeiro.
- [ ] **C — validação** (2ª passada por visão, foco nos NÚMEROS do bloco) + correções; build; PROGRESSO; commit.
- [ ] **2ª leva (depois):** Construindo Combates + Perigos (regras) e Fichas de NPCs (no hub Bestiário).

## Notas
- Números do bloco são CRÍTICOS — validar célula a célula. Capturar habilidades especiais completas e ícones de tipo/energia (anotar; arte depois).
- ND como string ("1/4", "1/2", "2", "5"). Selo de ND no índice (como os selos de perícia/energia).
