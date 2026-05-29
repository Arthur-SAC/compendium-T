# Mapa de Páginas — Classes do Livro Básico (T20)

> Insumo da **Task 4** do plano `2026-05-29-demais-classes-plano.md`. Guia a extração
> (visão, 2 passadas) das classes. Páginas confirmadas por renderização (`pdftoppm`) e
> leitura das imagens, mais o sumário e o corpo de `extracao/cache/basico-full.txt`.

## Offset e limites do capítulo

- **Offset confirmado: `PDF = impressa + 6`.** (Sumário lista "Classes....32"; a página de
  abertura "CLASSES" está em **PDF 38** = impressa **32**, com o rodapé "Capítulo Um / 32".)
- **Capítulo de Classes:** abertura em **PDF 38** (impressa 32); a última classe (Paladino)
  termina em **PDF 90** (impressa 84). **Origens** começa na **impressa 85 = PDF 91**.
- **PDF 38–41** (impressas 32–35): material introdutório do capítulo — "Escolhendo sua Classe",
  **Tabela 1-3: Classes** (resumo de todas as classes: descrição, atributo, PV1, PM, perícias),
  regras de nível/experiência, multiclasse, atributo-chave etc. Útil como fonte do resumo de
  cada classe e dos atributos-chave. A **1ª classe (Arcanista) começa em PDF 42** (impressa 36).
- Cada classe segue o padrão: **flavor + ilustração** → **bloco mecânico** (Características de
  Classe: PV, PM, Perícias, Proficiências) → **Tabela de progressão 1–20** → **Habilidades de
  Classe** → **lista de Poderes da classe**. Conjuradoras acrescentam a habilidade **Magias** e
  (no Arcanista) os **Caminhos**.

## Tabela de páginas

| slug | nome | conjuradora? | tipo conjuração / atributo-chave | PDF | impressas | ilustração própria? | observações (Tabela de progressão; caminhos; quadros) |
|---|---|---|---|---|---|---|---|
| arcanista | Arcanista | **Sim** | Arcana · Inteligência **ou** Carisma | **42–45** | 36–39 | Sim (PDF 42) | **Tabela 1-6** na PDF 42. **Caminhos** (habilidade "Caminho do Arcanista", PDF 43–45): **Bruxo** (Int), **Mago** (Int), **Feiticeiro** (Car). Feiticeiro tem sub-**Linhagens**: Dracônica, Feérica, Rubra (PDF 45). Habilidade **Magias** (1º círculo); poder "Familiares". |
| barbaro | Bárbaro | Não | — / Força | **46–48** | 40–42 | Sim (PDF 46) | **Tabela 1-7** na PDF 47. Marcial. Habilidades: Fúria etc.; poderes "Animais Totêmicos". |
| bardo | Bardo | **Sim** | Arcana · Carisma | **49–51** | 43–45 | Sim (PDF 49) | **Tabela 1-8** na PDF 50. Habilidade **Magias** (escolhe 3 escolas) + **Inspiração**. **Sem caminhos nomeados** — repertório de magias por escola; abilidades especiais = **Músicas de Bardo** (PDF 51) e poder "Eclético". |
| bucaneiro | Bucaneiro | Não | — / Destreza | **52–54** | 46–48 | Sim (PDF 52) | **Tabela 1-9** na PDF 53. Marcial. |
| cacador | Caçador | Não (marcial) | — / Força **ou** Destreza | **55–57** | 49–51 | Sim (PDF 55) | **Tabela 1-10** na PDF 56. **Sem magia** (a "Magia Natural" próxima no texto é do Druida). Habilidades: **Marca da Presa**, rastreador, **Companheiro Animal**; poderes de caçador. |
| cavaleiro | Cavaleiro | Não | — / Força | **58–61** | 52–55 | Sim (PDF 58) | **Tabela 1-11** na PDF 59. Marcial. Habilidades: **Posturas de Combate** (PDF 60). **Quadro/sidebar:** "As Ordens de Cavalaria de Arton" (PDF 61). |
| clerigo | Clérigo | **Sim** | Divina · Sabedoria | **62–64** | 56–58 | Sim (PDF 62) | **Tabela 1-12** na PDF 63. Habilidade **Magias** (divinas, 1º círculo) na PDF 64. **Modelo de "caminho" = Devoção a um deus + Poderes Concedidos** (não há caminhos nomeados de classe). **PDF 65** (impressa 59) é **ilustração de página inteira** (panteão) — fecha a seção antes do Druida. |
| druida | Druida | **Sim** | Divina · Sabedoria | **66–69** | 60–63 | Sim (PDF 66) | **Tabela 1-13** na PDF 67. Habilidade **Magias** (divinas, escolhe 3 escolas). **Sem caminhos nomeados**; habilidades especiais: **Companheiro Animal** (PDF 68), **Forma Selvagem**/"Magia Natural" (PDF 69); poderes "Aspecto das estações". |
| guerreiro | Guerreiro | Não | — / Força **ou** Destreza | **70–72** | 64–66 | Sim | **JÁ EXTRAÍDO** (spike). **Tabela 1-* ** na PDF 70. Marcial. |
| inventor | Inventor | Não | — / Inteligência | **73–77** | 67–71 | Sim (PDF 73) | **Tabela 1-14** na PDF 74. Marcial. Habilidades: **Engenhocas** (PDF 75), **Livro de Fórmulas**; **quadro/tabela "Catálogo de Engenhocas"** (PDF 76–77). Seção longa (5 págs). |
| ladino | Ladino | Não | — / Destreza **ou** Inteligência | **78–80** | 72–74 | Sim (PDF 78) | **Tabela 1-15** na PDF 79. Marcial. Habilidades: **Ataque Furtivo** etc. |
| lutador | Lutador | Não | — / Força | **81–83** | 75–77 | Sim (PDF 81) | **Tabela 1-16** na PDF 82. Marcial. Habilidades: **Golpes de Lutador** (PDF 83). |
| nobre | Nobre | Não | — / Carisma | **84–86** | 78–80 | Sim (PDF 84) | **Tabela 1-17** na PDF 85. Marcial (social). |
| paladino | Paladino | Não (marcial) | — / Força **e** Carisma | **87–90** | 81–84 | Sim (PDF 87) | **Tabela 1-18** na PDF 88. **Sem magia/conjuração** (PV 20+Con, PM 3/nível; sem habilidade "Magias"). Habilidades: **Cura pelas Mãos**, **Golpe Divino**, **Aura**, **Julgamentos Divinos** (PDF 89). Poderes incluem **Virtudes Paladinescas**; **PDF 90** tem o quadro "Virtudes Fanáticas" (fecha a classe antes de Origens). |

**Total mapeado: 14 classes** (13 a extrair + Guerreiro, já feito).

## Notas / surpresas

- **Ordem real = alfabética** (Arcanista → Bárbaro → Bardo → Bucaneiro → Caçador → Cavaleiro →
  Clérigo → Druida → Guerreiro → Inventor → Ladino → Lutador → Nobre → Paladino), batendo com o sumário.
- **Conjuradoras (4):** Arcanista (Arcana), Bardo (Arcana), Clérigo (Divina), Druida (Divina).
  Todas têm a habilidade **Magias** com progressão de círculos (1º→4º/5º).
  - **Apenas o Arcanista tem "Caminhos" de classe nomeados** → `caminhos`: **Bruxo**, **Mago**,
    **Feiticeiro**. O **Feiticeiro** tem ainda **Linhagens** (Dracônica, Feérica, Rubra) como
    sub-opções — modelar como habilidades do caminho Feiticeiro ou observação.
  - **Bardo e Druida** não têm caminhos nomeados: o "ramo" é a **escolha de 3 escolas de magia**
    + habilidades próprias (Músicas; Companheiro/Forma Selvagem). `caminhos` pode ficar vazio;
    a habilidade **Magias** entra em `habilidades` e a conjuração em `mecanica.conjuracao`.
  - **Clérigo** não tem caminhos de classe: o equivalente é **Devoção a um deus + Poderes
    Concedidos** (dependentes da divindade, fora do escopo das classes). `caminhos` vazio;
    registrar Devoção/Poderes Concedidos como habilidades.
- **Atributo-chave alternativo:** Arcanista (Int **ou** Car), Caçador (For **ou** Des),
  Ladino (Des **ou** Int), Guerreiro (For **ou** Des); Paladino usa **For e Car** (duas). Guardar
  como string no schema (`atributoChave`) — pode precisar de texto, não enum.
- **Marciais com "magia limitada"? NÃO.** Diferente do esperado, **nem Caçador nem Paladino
  conjuram** no Livro Básico: Caçador é puramente marcial (Marca da Presa, Companheiro), e
  Paladino usa poderes divinos sem lista de magias (Cura pelas Mãos, Julgamentos, Auras). Logo,
  só as 4 conjuradoras clássicas usam `conjuracao`/`Magias`.
- **PV/PM iniciais (Tabela 1-3, impressa 32):** valores-base; "+Constituição" no PV inicial e por
  nível (e Inventor/Ladino somam Inteligência em perícias). Base por classe:
  Arcanista 8/6 · Bárbaro 24/3 · Bardo 12/4 · Bucaneiro 16/3 · Caçador 16/4 · Cavaleiro 20/3 ·
  Clérigo 16/5 · Druida 16/4 · Guerreiro 20/3 · Inventor 12/4 · Ladino 12/4 · Lutador 20/3 ·
  Nobre 16/4 · Paladino 20/3. (Confirmar PV/nível e PM/nível no bloco "Características de Classe"
  de cada uma na extração — a Tabela 1-3 dá só o PV de 1º nível e o PM por nível.)
- **Páginas que NÃO são spread limpo:**
  - **PDF 65** (impressa 59): ilustração de página inteira entre Clérigo e Druida — não tem
    conteúdo mecânico; é arte (candidata a fundo/ilustração, não a dado).
  - **Clérigo ocupa só 3 págs de texto (62–64)** porque a 4ª (65) é arte.
  - **Inventor é a mais longa (5 págs, 73–77)** por causa do Catálogo de Engenhocas.
  - **Paladino vai até a PDF 90** com o quadro "Virtudes Fanáticas"; Origens começa na 91.
- **Quadros/sidebars coloridos a capturar na extração** (falha do projeto antigo): "Ordens de
  Cavalaria de Arton" (Cavaleiro, PDF 61), "Catálogo de Engenhocas" (Inventor, PDF 76–77),
  "Virtudes Fanáticas" (Paladino, PDF 90), Linhagens do Feiticeiro (Arcanista, PDF 45).
- **Nenhuma classe compartilha página de início com outra** — cada uma começa no topo de uma
  página nova (boa notícia para recortar ilustrações e delimitar intervalos).

## Cache gerado (gitignored, em `extracao/cache/discC/`)

Páginas-chave renderizadas (PNG): p-038, 042–090 (limites e interiores de cada classe). Reuso
livre na extração; recriar com `pdftoppm -f P -l P -png -r 150 "../pdfs/T20 - Livro Básico.pdf" cache/discC/p`.
