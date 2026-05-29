# Mapa Raça → Página PDF (Livro Básico)

> **Fonte:** `pdfs/T20 - Livro Básico.pdf` (Capítulo Um: Construção de Personagem → Raças).
> **Offset:** página PDF = página impressa **+ 6** (confirmado: Humano em PDF 25 / impressa 19; rodapés lidos em todas as páginas).
> **Confirmação:** todas as páginas foram **conferidas visualmente** (render `pdftoppm` a 110–150 dpi + leitura das imagens). Os modificadores de atributo conferem com a **Tabela 1-2** (página impressa 18 / PDF 24).
> **Artefato de descoberta** — a Tarefa 9 extrai o conteúdo a partir deste mapa. Não inventar dados; tudo vem do PDF.

## Estrutura observada

O capítulo de Raças vai de **PDF 25 a 37** (impressas 19–31). Divide-se em dois blocos:

- **Raças comuns** (8): **uma raça por página**, cada uma com ilustração própria de página inteira — PDF 25–32.
- **Raças extras** (9): seção iniciada pelo título **"RAÇAS EXTRAS"** no topo da PDF 33; layout **mais denso, em duas colunas, com várias raças por página e entradas que atravessam a quebra de página**. Cada raça tem uma ilustração menor própria. PDF 33–37.

A Tabela 1-2 (Modificadores de Atributo) está na **PDF 24** (impressa 18), logo antes das fichas. CLASSES começa na PDF 38.

## Tabela

| slug | nome | página(s) PDF | página impressa | tem ilustração própria? | observações |
|------|------|---------------|-----------------|-------------------------|-------------|
| humano | Humano | 25 | 19 | Sim | Modificador atípico: **+1 em três atributos diferentes** (à escolha). Bloco "Habilidades de Raça": Versátil, Aprendizado. Já extraído (Task 0/spike). |
| anao | Anão | 26 | 20 | Sim | Con +2, Sab +1, Des −1. Habilidades de Raça (Conhecimento das Rochas, Devagar e Sempre, Tradição de Heredrimm, Visão no Escuro etc.). Cita **Heredrimm** (divindade) → relação. |
| dahllan | Dahllan | 27 | 21 | Sim | Sab +2, Des +1, Int −1. Habilidades (Empatia Selvagem, Armazenar Magia/clima etc.). Cita **Allihanna** e a heroína **Lisandra de Galrasia** → relações. |
| elfo | Elfo | 28 | 22 | Sim | Int +2, Des +1, Con −1. Habilidades (Graça de Glórienn, Sangue Mágico, Memória Ancestral/sono etc.). Cita **Glórienn** (divindade) → relação. |
| goblin | Goblin | 29 | 23 | Sim | Des +2, Int +1, Car −1. Habilidades (Engenhoso, Faro etc.). Confirmar tamanho/deslocamento (possível **Pequeno** — verificar na extração). |
| lefou | Lefou | 30 | 24 | Sim | Modificador atípico: **+1 em três atributos diferentes (exceto Car), Car −1**. Tocados pela Tormenta. Habilidades (Aberração, Cria da Tormenta etc.). Usar `escolha/quantidade/observacao` no schema. |
| minotauro | Minotauro | 31 | 25 | Sim | For +2, Con +1, Sab −1. Habilidades (Chifres, Faro etc.). |
| qareen | Qareen | 32 | 26 | Sim | Car +2, Int +1, Sab −1. Habilidades (Herança Divina, Resistência Elemental, Tutelado Místico etc.). |
| golem | Golem | 33 | 27 | Sim | **Construto.** For +2, Con +1, Car −1. Primeira raça sob o título "RAÇAS EXTRAS" (PDF 33). Traços especiais: **Chassi**, **Criatura Artificial** (tipo construto — imune a efeitos de cansaço/metabolismo, não dorme/respira/come), **Fonte Elemental**, **Propósito de Criação**. Texto mecânico denso — capturar todos os traços. |
| hynne | Hynne | 33–34 | 27–28 | Sim | Des +2, Car +1, For −1. **Pequeno** ("Pequeno e Rechonchudo" — tamanho Pequeno, deslocamento **6m**; usar Destreza no lugar de Força em Atletismo, ver pág. 106). Habilidades: Sorte Salvadora etc. Entrada inicia na coluna direita da PDF 33 e termina na coluna esquerda da PDF 34. |
| kliren | Kliren | 34 | 28 | Sim | Int +2, Car +1, For −1. Híbridos humano+gnomo. Habilidades: **Híbrido**, **Engenhosidade**, **Ossos Frágeis** (sofre +1 ponto de dano por dado em impacto), **Vanguardista**. Entrada na PDF 34 (colunas esquerda→direita). |
| medusa | Medusa | 34–35 | 28–29 | Sim | Des +2, Car +1 (apenas dois modificadores, **sem penalidade**). Habilidades: **Cria de Megalokk**, **Natureza Venenosa** (Veneno), **Olhar Atordoante**. Cita **Megalokk** → relação. Cabeçalho na coluna direita inferior da PDF 34, conteúdo segue no topo da PDF 35. |
| osteon | Osteon | 35 | 29 | Sim | **Morto-vivo.** Modificador atípico: **+1 em três atributos diferentes (exceto Con), Con −1**. Traços: **Armadura Óssea**, **Memória Póstuma**, **Natureza Esquelética** (tipo morto-vivo — visão no escuro, não respira/dorme/come, afetado por cura/dano negativo de forma especial), **Preço da Não-Vida**. Cita **Ferren Asloth** / **Deus da Morte** → relação. Capturar regra de tipo morto-vivo por completo. |
| sereia-tritao | Sereia/Tritão | 35–36 | 29–30 | Sim | Modificador atípico: **+1 em três atributos diferentes**. **Anfíbio / formas:** sereia (feminino) ou tritão (masculino); "Transformação Anfíbia" (pode caminhar em terra firme — confirmar regra de pernas/cauda). Habilidades: Canção dos Mares, Mestre do Tridente, deslocamento de natação 12m. Entrada inicia na coluna direita da PDF 35 e segue na PDF 36. |
| silfide | Sílfide | 36 | 30 | Sim | Car +2, Des +1, For −2. **Pequeno / fada** ("estas criaturinhas"). Habilidades: **Asas de Borboleta** (deslocamento de voo 1,5m — confirmar tamanho Pequeno e deslocamento terrestre), **Espírito da Natureza**, **Magia das Fadas**. Verificar tamanho/deslocamento na extração. |
| suraggel | Suraggel | 36–37 | 30–31 | Sim | **Duas heranças** (modificadores variantes): **aggelus** = Sab +2, Car +1; **sulfure** = Des +2, Int +1. Descendentes de extraplanares (celestiais/demônios). Habilidades: **Herança Divina**, e traços específicos por herança — **Luz Sagrada (aggelus)** e **Sombras Profanas (sulfure)**. Modelar a escolha de herança no schema (duas listas de modificadores + habilidades condicionais). Entrada inicia na coluna direita inferior da PDF 36 e segue no topo da PDF 37. |
| trog | Trog | 37 | 31 | Sim | Con +2, For +1, Int −1. Troglodita reptiliano. Habilidades: **Mau Cheiro** (gás fétido), **Mordida**, **Reptiliano** (criatura do tipo monstro, visão no escuro, +1 Defesa/+5 Furtividade), **Sangue Frio**. Última raça do capítulo; CLASSES começa na PDF 38. |

## Notas e surpresas

- **17 raças mapeadas** (todas, incluindo Humano).
- **Offset constante +6** em todo o capítulo — não houve deslocamento por página de ilustração de abertura dentro do bloco de raças (a abertura do Capítulo Um já estava antes da Tabela 1-1).
- **6 raças com modificador atípico "à escolha"** (Humano, Lefou, Osteon, Sereia/Tritão; Lefou e Osteon com exceção; Suraggel com duas heranças fixas) — exigem `escolha`/`quantidade`/`observacao` (e, no Suraggel, duas variantes) no `RacaMecanicaSchema`.
- **5 raças extras dividem página** (atravessam a quebra): Hynne (33–34), Medusa (34–35), Sereia/Tritão (35–36), Suraggel (36–37). Ao renderizar para extração, **renderizar o par de páginas** dessas raças.
- **Layout em duas colunas** nas extras (PDF 33–37): o `pdftotext -layout` interleia colunas; preferir a **leitura visual** (imagem) como fonte da estrutura, usando o texto só para grafia/acentos fiéis.
- **Tipos especiais a capturar com rigor:** Golem (construto), Osteon (morto-vivo), Trog (monstro), Medusa (Cria de Megalokk) — traços de tipo de criatura completos.
- **Raças possivelmente Pequeno** (conferir tamanho/deslocamento na extração): **Hynne** (confirmado Pequeno, 6m), **Sílfide** (fada pequena, voo), **Goblin** (verificar). Demais comuns são presumivelmente Médio/9m, mas confirmar no bloco de cada raça (não assumir).
- Todas as 17 raças têm **ilustração própria**: as 8 comuns em página inteira; as 9 extras com arte menor integrada à coluna.
