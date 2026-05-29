# Mapa de páginas — Guerreiro (Livro Básico de Tormenta 20)

> Tarefa 3 do plano `2026-05-29-guerreiro-classe-spike-plano.md`. Mapeamento por
> **visão** (render poppler a 150 dpi + leitura das imagens). **Não** é extração de
> conteúdo — só localização para guiar a extração.

## Intervalo do Guerreiro

| | PDF | Impressa |
|---|---|---|
| **Início (título "GUERREIRO" + flavor)** | 70 | 64 |
| **Fim (última página de poderes/habilidades)** | 72 | 66 |
| **Total** | 3 páginas | — |

A classe seguinte (**Inventor**) começa na página PDF **73** (impressa **67**),
confirmando o fim do Guerreiro na PDF 72.

## Offset confirmado (capítulo Classes / "Construção de Personagem")

**PDF = impressa + 6** (validado pelos rodapés):
- PDF 70 → rodapé "64"
- PDF 71 → rodapé "65"
- PDF 72 → rodapé "66"
- PDF 73 (Inventor) → rodapé "67"

Mesmo offset (+6) do capítulo de Raças. O índice (sumário) lista "Guerreiro ..... 64"
(página impressa), batendo com a PDF 70.

## O que há em cada página

### PDF 70 / impressa 64 — Abertura
- Título **GUERREIRO** (cabeçalho carmesim grande).
- **Flavor** completo (duas colunas): origem dos guerreiros, papel, versatilidade,
  disciplina, "Guerreiros Famosos" (Christian Pryde, Katabrok, Ledd, Loriane, Val,
  Verônica…).
- **Ilustração de meia/maior parte de página** (guerreira ruiva — a Val — ocupando a
  metade direita inferior).
- **Quadro/sidebar carmesim** no rodapé direito: "Val. Ser duelista urbana é apenas um
  dos muitos caminhos de guerreiro".
- Rodapé esquerdo: "CAPÍTULO UM" + nº 64.
- **NÃO** tem bloco mecânico nem tabela nesta página.

### PDF 71 / impressa 65 — Núcleo mecânico (página mais densa)
Coluna esquerda:
- **CARACTERÍSTICAS DE CLASSE** = o **bloco mecânico**:
  - Pontos de Vida: começa com **20 PV + Constituição**; ganha **5 PV + Con por nível**.
  - Pontos de Mana: **3 PM por nível**.
  - Perícias: **Luta (For) ou Pontaria (Des)**, **Fortitude (Con)**, **mais 2 a sua
    escolha** entre Adestramento, Atletismo, Cavalgar, Guerra, Iniciativa, Intimidação,
    Luta, Ofício, Percepção, Pontaria, Reflexos.
  - Proficiências: **armas marciais, armaduras pesadas e escudos**.
- **HABILIDADES DE CLASSE** (descrição): **Ataque Especial** e **Poder de Guerreiro**
  (este último com lista de poderes começando: Ambidestria, Arqueiro, Ataque Reflexo,
  Aumento de Atributo, Bater e Correr, Destruidor…).

Coluna direita:
- **Tabela 1-13: O Guerreiro** — **tabela de progressão completa do 1º ao 20º nível**
  (Nível × Habilidades de Classe). Ocupa a coluna direita inteira (não a página toda).
  Marcos visíveis: 1º Ataque especial +4; 2º Poder de guerreiro; 3º Durão; 5º Ataque
  especial +8; 6º Ataque extra; 9º +12; 13º +16; 20º Campeão.

### PDF 72 / impressa 66 — Poderes + fim das habilidades
- Coluna esquerda (topo): **"Efeitos do Golpe Pessoal"** — sub-bloco do poder Golpe
  Pessoal (Amplo, Atordoante, Brutal, Conjurador, Destruidor, Distante, Elemental,
  Impactante, Letal, Penetrante, Preciso, Qualquer Arma, Ricocheteante, Teleguiado,
  Lento, Perto da Morte, Sacrifício…).
- Restante: continuação da **lista de Poderes de Guerreiro** (Golpe Pessoal, Ímpeto,
  Mestre em Arma, Planejamento Marcial, Romper Resistências, Sólido, Tornado de Dor,
  Valentia…).
- Coluna direita (parte final): conclusão das **habilidades de classe** descritas:
  **Durão** (3º), **Ataque Extra** (6º) e **Campeão** (20º).
- Rodapé: "CONSTRUÇÃO DE PERSONAGEM" + nº 66.

## Observações para a extração
- **2 colunas** por página (layout padrão do livro) — usar `pdftotext -layout` e cuidar
  da ordem de leitura (a Tabela 1-13 está na coluna direita da PDF 71, intercalada com
  texto da coluna esquerda).
- **Tabela de progressão** está toda numa única coluna (PDF 71, direita) — **não** ocupa
  página inteira; cabe em uma passada de visão.
- **Quadros/sidebars coloridos**: há o sidebar "Val" na PDF 70 (flavor, não-mecânico).
  Não foram observados sidebars mecânicos escondidos no Guerreiro.
- **Ilustração de página**: PDF 70 tem ilustração grande (não é página inteira; é meia
  página). Não há página-ilustração dedicada dentro do intervalo.
- **"Efeitos do Golpe Pessoal"** (PDF 72) é um sub-quadro/lista pertencente ao poder
  "Golpe Pessoal" — modelar como detalhamento desse poder, não como poder solto.
- O poder **Golpe Pessoal** é descrito na PDF 72 mas a frase começa no rodapé da PDF 71
  ("Golpe Pessoal. Quando faz um ataque…") — atenção à quebra entre páginas.
- A página anterior (PDF 67–69) é a classe **Druida** (Tabela 1-12); a posterior
  (PDF 73) é o **Inventor** (Tabela 1-14) — úteis como balizas de início/fim.

## Páginas renderizadas (referência, não versionado)
`extracao/cache/discG/p-070.png`, `p-071.png`, `p-072.png` (+ 065–069, 073–074 para
contexto). 150 dpi. `extracao/cache/` é gitignored.
