# Mapeamento do Capítulo 4 — Magia (Livro Básico T20)

> Documento de descoberta para embasar o schema e o plano de extração.
> Fonte: `extracao/cache/discMag/magia.txt` + imagens `p-174.png` a `p-217.png`.
> Páginas impressas 168–211 (offset PDF = impressa + 6; p-174.png = impressa 168).

---

## 1. Limites do Capítulo

| Marco | Página impressa | Arquivo PDF (offset +6) |
|-------|-----------------|-------------------------|
| Abertura do Cap. 4 — Magia (imagem de capa) | 168 | p-174.png |
| Última página do Cap. 4 | **211** | p-217.png |
| Cap. 5 — Jogando começa | **212** | p-218.png (fora do cache) |

A última linha do arquivo `magia.txt` (linha 3572) exibe o rodapé "211" — confirmado.  
A imagem `p-217.png` mostra o final de "Voz Divina" e o rodapé "211".

---

## 2. Seções de Regras (impressas ~168–177)

| # | Seção | Página impressa | Observação |
|---|-------|-----------------|------------|
| 1 | **Capítulo 4 — Magia** (capa do capítulo) | 168 | Só imagem |
| 2 | **Classificação** — tipos (Arcana / Divina) e círculos | 169 | Texto corrido |
| 3 | **Atributo-chave** (Int / Sab / Car) | 169 | Tabela implícita em lista |
| 4 | **Aprendendo Magias** (como aprender novas) | 169 | Sidebar direito |
| 5 | **Lançando Magias** — visão geral | 169 | |
| 6 | **Tabela 4-1: Custo de Magias por Círculo** | 169 | Tabela formal: 1º=1PM, 2º=3PM, 3º=6PM, 4º=10PM, 5º=15PM |
| 7 | **Gestos e Palavras** (componente verbal + somático) | 169 | |
| 8 | **Concentração** — testes de Vontade ao ser ferido/condição | 169–170 | Subseção com CDs |
| 9 | **Armaduras e Magia Arcana** (penalidade, teste CD 20+PM) | 170 | |
| 10 | **Aprimoramentos** — definição, custo variável, limite PM | 170–171 | |
| 11 | **Aprimoramentos Cumulativos** | 170–171 | Exemplo: Bola de Fogo |
| 12 | **Aprimoramentos que Mudam Magias** (palavra "muda") | 171 | |
| 13 | **Truque** (aprimoramento especial; custo PM = 0) | 171 | |
| 14 | **Pré-requisitos de Aprimoramentos** | 171 | |
| 15 | **Características de Magias** — título da seção | 172 | |
| 16 | **Escolas de Magia** (8 escolas) | 172 | Abjuração, Adivinhação, Convocação, Encantamento, Evocação, Ilusão, Necromancia, Transmutação |
| 17 | **Execução** — ação livre, reação, ação padrão, ação completa | 173 | |
| 18 | **Alcance** | 173 | Remete p. 224 |
| 19 | **Efeito** (alvo / área / cria algo) | 173 | Remete pp. 224–225 |
| 20 | **Duração** | 173 | Remete p. 227 |
| 21 | **Resistência** — CD = 10 + metade do nível + atributo-chave | 173 | Exemplo com Samira (feiticeira 8º, Car 5 → CD 19) |
| 22 | **Sucesso em Testes de Resistência** | 173 | |
| 23 | **Custos Especiais** | 173 | Remete p. 224 |
| 24 | **Anulando Magias** (contramágica, Dissipar Magia) | 173 | |
| 25 | **Lista de Magias Arcanas** (índice-resumo por círculo) | 174–175 | Duas colunas por página, escola + nome + resumo |
| 26 | **Lista de Magias Divinas** (índice-resumo por círculo) | 176–177 | Mesmo formato |
| 27 | **Descrição das Magias** (entradas completas A–Z) | 178–211 | Ordem alfabética global |

> **Entidades "regra" identificadas:** Classificação · Atributo-chave · Aprendendo Magias · Lançando Magias · Custo em PM · Gestos e Palavras · Concentração · Armaduras e Magia Arcana · Aprimoramentos · Escolas de Magia · Execução · Alcance · Efeito · Duração · Resistência · Custos Especiais · Anulando Magias.

---

## 3. Estrutura de uma Entrada de Magia (Schema de Campos)

Exemplo real — "Adaga Mental" (Arcana 1, Encantamento):

```
Adaga Mental
Arcana 1 (Encantamento)
Execução: padrão; Alcance: curto;
Alvo: 1 criatura; Duração: instantânea; Resistência: Vontade parcial.

[descrição em prosa]

+1 PM: [aprimoramento 1]
+2 PM: [aprimoramento 2]
```

Exemplo com **Área** em vez de Alvo — "Bola de Fogo" (Arcana 2):
```
Bola de Fogo
Arcana 2 (Evocação)
Execução: padrão; Alcance: longo; Área: esfera de Xm de raio;
Duração: instantânea; Resistência: Reflexos reduz à metade.
```

Exemplo com **Truque** — "Abençoar Alimentos":
```
Truque: [versão simplificada, custo PM = 0]
+1 PM: [...]
```

Alguns aprimoramentos exigem **Requer Xº círculo** — pré-requisito de círculo.

### Campos identificados

| Campo | Obrigatório? | Tipo / Valores | Notas |
|-------|-------------|----------------|-------|
| `nome` | sim | string | "Adaga Mental" |
| `tipo` | sim | enum: `arcana` / `divina` / `universal` | "Universal" = aparece em ambas as listas; denominação usada nas descrições |
| `circulo` | sim | int 1–5 | |
| `escola` | sim | enum: `abjuracao` / `adivinhacao` / `convocacao` / `encantamento` / `evocacao` / `ilusao` / `necromancia` / `transmutacao` | |
| `execucao` | sim | string livre | Ex.: "padrão", "reação", "ação livre", "completa", "1 minuto" |
| `alcance` | sim | string | Ex.: "pessoal", "toque", "curto", "médio", "longo", "ilimitado" |
| `alvo` | cond. | string | Presente quando a magia afeta alvo discreto |
| `area` | cond. | string | Presente quando a magia afeta área (ex.: "esfera com 9m de raio", "cone de 4,5m") |
| `efeito` | cond. | string | Presente quando cria algo (construtos, servos etc.) |
| `duracao` | sim | string | Ex.: "instantânea", "cena", "1 dia", "permanente", "sustentada" |
| `resistencia` | não | string \| null | Ex.: "Vontade anula", "Reflexos reduz à metade", "Fortitude parcial"; null se não houver |
| `custoPM` | sim | int | Custo base = 1/3/6/10/15 pelo círculo; campo de referência |
| `descricao` | sim | string (markdown) | Texto descritivo completo |
| `truque` | não | string \| null | Texto do aprimoramento Truque, quando existir |
| `aprimoramentos` | sim | array | Pode ser vazio |
| `aprimoramentos[].custo` | sim | int | Ex.: 1, 2, 3, 5, 7, 9, 12 |
| `aprimoramentos[].efeito` | sim | string | Texto do efeito |
| `aprimoramentos[].requisito_circulo` | não | int \| null | Quando presente "Requer Xº círculo" |
| `custoEspecial` | não | string \| null | Componente material ou custo extra não-PM; ex.: "T$ 1.000 em prataria" |
| `resumo` | não | string | Frase-resumo do índice (ex.: "Alvo sofre dano psíquico e pode ficar atordoado") |
| `fonte` | sim | objeto `{livro, pagina}` | Para rastreabilidade |

> **Nota:** Alvo / Área / Efeito são **mutuamente exclusivos em geral**, mas algumas magias têm "Alvo ou Área" indicado explicitamente. Tratar como três campos nullable.

---

## 4. Lista Completa de Magias

### 4.1 Magias Arcanas

> Fonte: índice impressa pp. 174–175 (imagens p-180.png / p-181.png) + confirmação no texto.
> Magias marcadas (**U**) são "Universal" nas descrições = aparecem em ambas as listas.

#### 1º Círculo Arcano (32 magias)

| Nome | Escola | Tipo | Resumo (índice) |
|------|--------|------|-----------------|
| Alarme | Abjuração | Arcana | Avisa quando alguém invadir uma área protegida |
| Armadura Arcana | Abjuração | Arcana | Aumenta sua Defesa |
| Resistência a Energia | Abjuração | **Universal** | Fornece resistência contra um tipo de dano a sua escolha |
| Tranca Arcana | Abjuração | Arcana | Tranca um item que possa ser aberto ou fechado |
| Aviso | Adivinhação | **Universal** | Envia um alerta telepático para uma criatura |
| Compreensão | Adivinhação | **Universal** | Você entende qualquer coisa escrita ou falada e pode ouvir pensamentos |
| Concentração de Combate | Adivinhação | Arcana | Ao atacar, você pode rolar dois dados e ficar com o melhor |
| Visão Mística | Adivinhação | **Universal** | Você pode ver auras mágicas |
| Área Escorregadia | Convocação | Arcana | Criaturas na área podem cair ou objeto afetado pode ser derrubado |
| Conjurar Monstro | Convocação | Arcana | Convoca um monstro sob seu comando |
| Névoa | Convocação | **Universal** | Cria uma névoa que oferece camuflagem |
| Teia | Convocação | Arcana | Criaturas na área ficam enredadas |
| Adaga Mental | Encantamento | Arcana | Alvo sofre dano psíquico e pode ficar atordoado |
| Enfeitiçar | Encantamento | Arcana | Alvo se torna prestativo e pode realizar um pedido seu |
| Hipnotismo | Encantamento | Arcana | Alvos ficam fascinados |
| Sono | Encantamento | Arcana | Alvo cai em um sono profundo ou fica exausto |
| Explosão de Chamas | Evocação | Arcana | Cone causa dano de fogo |
| Luz | Evocação | **Universal** | Objeto ilumina como uma tocha |
| Seta Infalível de Talude | Evocação | Arcana | Dispara setas de energia que acertam automaticamente |
| Toque Chocante | Evocação | Arcana | Toque causa dano de eletricidade |
| Criar Ilusão | Ilusão | Arcana | Cria uma ilusão visual ou sonora |
| Disfarce Ilusório | Ilusão | Arcana | Muda a aparência de uma ou mais criaturas |
| Imagem Espelhada | Ilusão | Arcana | Cria duplicatas para confundir os inimigos, oferecendo bônus na Defesa |
| Leque Cromático | Ilusão | Arcana | Criaturas na área ficam ofuscadas ou atordoadas |
| Amedrontar | Necromancia | Arcana | O alvo fica abalado ou apavorado |
| Escuridão | Necromancia | **Universal** | Objeto emana uma área de escuridão |
| Raio do Enfraquecimento | Necromancia | Arcana | O alvo fica fatigado ou vulnerável |
| Vitalidade Fantasma | Necromancia | **Universal** | Você recebe pontos de vida temporários |
| Arma Mágica | Transmutação | **Universal** | Arma recebe bônus ou poderes mágicos |
| Primor Atlético | Transmutação | Arcana | Alvo recebe bônus no deslocamento e em testes de Atletismo |
| Queda Suave | Transmutação | Arcana | Alvo cai lentamente |
| Transmutar Objetos | Transmutação | Arcana | Pode consertar ou fabricar um objeto temporário |

**Subtotal 1º Arcano: 32**

#### 2º Círculo Arcano (27 magias)

| Nome | Escola | Tipo | Resumo (índice) |
|------|--------|------|-----------------|
| Campo de Força | Abjuração | Arcana | Cria uma película protetora que absorve dano |
| Dissipar Magia | Abjuração | **Universal** | Encerra os efeitos de magias ativas em um alvo ou área |
| Refúgio | Abjuração | Arcana | Cria um domo para abrigar o conjurador e seus aliados |
| Runa de Proteção | Abjuração | **Universal** | Runa protege passagem ou objeto |
| Ligação Telepática | Adivinhação | Arcana | Estabelece um vínculo telepático entre duas ou mais criaturas |
| Localização | Adivinhação | Arcana | Determina em que direção está um objeto ou criatura a sua escolha |
| Mapear | Adivinhação | Arcana | Traça um esboço de mapa dos arredores |
| Amarras Etéreas | Convocação | Arcana | Laços de energia prendem o alvo |
| Montaria Arcana | Convocação | Arcana | Convoca um cavalo que serve como montaria |
| Salto Dimensional | Convocação | Arcana | Teletransporta você e outras criaturas para um ponto dentro do alcance |
| Servos Invisíveis | Convocação | Arcana | Seres invisíveis realizam tarefas para você |
| Desespero Esmagador | Encantamento | Arcana | Criaturas na área perdem a vontade de lutar |
| Marca da Obediência | Encantamento | **Universal** | Símbolo mágico obriga o alvo a cumprir uma ordem |
| Sussurros Insanos | Encantamento | Arcana | Deixa o alvo confuso |
| Bola de Fogo | Evocação | Arcana | Esfera incandescente explode, causando dano em todas as criaturas na área |
| Flecha Ácida | Evocação | Arcana | Dispara um projétil de ácido que corrói armaduras e outros objetos |
| Relâmpago | Evocação | Arcana | Causa dano de eletricidade em criaturas numa linha |
| Sopro das Uivantes | Evocação | Arcana | Explosão em cone causa dano de frio e empurra alvos |
| Aparência Perfeita | Ilusão | Arcana | Aumenta o Carisma e concede bônus em perícias sociais |
| Camuflagem Ilusória | Ilusão | Arcana | A imagem do alvo fica distorcida, concedendo camuflagem |
| Esculpir Sons | Ilusão | Arcana | Altera os sons emitidos pelos alvos |
| Invisibilidade | Ilusão | Arcana | Você se torna invisível por um curto período |
| Conjurar Mortos-Vivos | Necromancia | **Universal** | Ergue mortos-vivos para lutar por você |
| Crânio Voador de Vladislav | Necromancia | Arcana | Crânio flutuante causa dano em um alvo |
| Toque Vampírico | Necromancia | Arcana | Toque causa dano e absorve pontos de vida |
| Alterar Tamanho | Transmutação | Arcana | Aumenta ou diminui o tamanho de objetos e criaturas |
| Metamorfose | Transmutação | Arcana | Transforma o corpo do alvo |
| Velocidade | Transmutação | Arcana | Alvo pode fazer ações adicionais |

**Subtotal 2º Arcano: 28**

#### 3º Círculo Arcano (23 magias)

| Nome | Escola | Tipo | Resumo (índice) |
|------|--------|------|-----------------|
| Âncora Dimensional | Abjuração | Arcana | Impede o alvo de se afastar de um ponto, mesmo com teletransporte |
| Dificultar Detecção | Abjuração | Arcana | Protege uma criatura ou objeto contra detecção e vidência |
| Globo de Invulnerabilidade | Abjuração | Arcana | Esfera protege contra magias de 1º e 2º círculos |
| Contato Extraplanar | Adivinhação | Arcana | Você barganha com criaturas de outros planos para obter ajuda |
| Lendas e Histórias | Adivinhação | **Universal** | Descobre detalhes sobre criaturas, objetos e lugares |
| Vidência | Adivinhação | **Universal** | Pode ver e ouvir os arredores de uma criatura |
| Convocação Instantânea | Convocação | Arcana | Teletransporta um objeto marcado para suas mãos |
| Enxame Rubro de Ichabod | Convocação | Arcana | Invoca uma massa rastejante de demônios da Tormenta |
| Teletransporte | Convocação | Arcana | Transporta você e outras criaturas e objetos para um local instantaneamente |
| Imobilizar | Encantamento | **Universal** | Alvo fica lento ou paralisado |
| Selo de Mana | Encantamento | **Universal** | Você sela a energia de uma criatura, impedindo que use pontos de mana |
| Erupção Glacial | Evocação | Arcana | Estacas de gelo explodem do chão, ferindo e derrubando os alvos |
| Lança Ígnea de Aleph | Evocação | Arcana | Projétil de magma explode no alvo, causando dano por rodada |
| Muralha Elemental | Evocação | Arcana | Evoca um muro feito de fogo ou gelo |
| Ilusão Lacerante | Ilusão | Arcana | Cria uma ilusão perigosa que pode causar dano real |
| Manto de Sombras | Ilusão | **Universal** | Conjurador se cobre de sombras mágicas para vários efeitos |
| Miragem | Ilusão | Arcana | Altera uma área de forma ilusória |
| Ferver Sangue | Necromancia | Arcana | Criatura tem seu sangue aquecido até borbulhar, causando dano |
| Servo Morto-Vivo | Necromancia | **Universal** | Cria um parceiro morto-vivo sob seu comando |
| Tentáculos de Trevas | Necromancia | Arcana | Tentáculos de energia negativa atacam e agarram criaturas na área |
| Pele de Pedra | Transmutação | **Universal** | Endurece sua pele, fornecendo redução de dano |
| Telecinesia | Transmutação | Arcana | Move e arremessa criaturas e objetos com a mente |
| Transformação de Guerra | Transmutação | Arcana | Você recebe habilidades superiores de combate, mas perde a habilidade de lançar magias |
| Voo | Transmutação | Arcana | Você recebe deslocamento voo 12m |

**Subtotal 3º Arcano: 24**

#### 4º Círculo Arcano (16 magias)

| Nome | Escola | Tipo | Resumo (índice) |
|------|--------|------|-----------------|
| Campo Antimagia | Abjuração | Arcana | Barreira suprime todos os efeitos mágicos |
| Libertação | Abjuração | **Universal** | O alvo fica imune a efeitos que impeçam ou restrinjam movimentação |
| Sonho | Adivinhação | Arcana | Você entra nos sonhos de uma criatura e pode interagir com ela lá |
| Visão da Verdade | Adivinhação | **Universal** | Você enxerga através de camuflagem, escuridão, ilusão e transmutação |
| Conjurar Elemental | Convocação | Arcana | Convoca um elemental como parceiro |
| Mão Poderosa de Talude | Convocação | Arcana | Mão gigante feita de energia pode realizar várias ações |
| Viagem Planar | Convocação | **Universal** | Viaja até outro plano de existência |
| Alterar Memória | Encantamento | Arcana | Pode apagar ou modificar a memória recente do alvo |
| Marionete | Encantamento | Arcana | Controla o corpo do alvo |
| Raio Polar | Evocação | Arcana | Causa dano de frio e congela alvo |
| Relâmpago Flamejante de Reynard | Evocação | Arcana | Dispara rajadas de fogo e relâmpago |
| Talho Invisível de Edauros | Evocação | Arcana | Lâmina de ar em alta velocidade corta os alvos |
| Duplicata Ilusória | Ilusão | Arcana | Imagem projetada copia seus movimentos e ações |
| Explosão Caleidoscópica | Ilusão | Arcana | Explosão de luzes e sons desabilita os alvos |
| Assassino Fantasmagórico | Necromancia | Arcana | Conjura um fantasma que persegue e tenta matar o alvo |
| Muralha de Ossos | Necromancia | **Universal** | Barreira de ossos afiados impede o avanço dos inimigos |
| Animar Objetos | Transmutação | Arcana | Objetos comuns ganham vida e obedecem a seus comandos |
| Controlar a Gravidade | Transmutação | Arcana | Manipula os efeitos da gravidade em uma área |
| Desintegrar | Transmutação | Arcana | Raio transforma um alvo em pó |
| Forma Etérea | Transmutação | Arcana | Você pode se tornar etéreo enquanto a magia durar |

**Subtotal 4º Arcano: 20**

#### 5º Círculo Arcano (18 magias)

| Nome | Escola | Tipo | Resumo (índice) |
|------|--------|------|-----------------|
| Aprisionamento | Abjuração | Arcana | Prende o alvo de diversas formas poderosas |
| Engenho de Mana | Abjuração | Arcana | Disco de energia flutuante é capaz de absorver magias e gerar PM |
| Invulnerabilidade | Abjuração | **Universal** | Recebe uma série de imunidades físicas ou mentais a sua escolha |
| Alterar Destino | Adivinhação | Arcana | Enxerga o futuro, podendo alterar o resultado de um teste |
| Projetar Consciência | Adivinhação | **Universal** | Pode observar qualquer local ou criatura |
| Buraco Negro | Convocação | **Universal** | Abre uma ruptura no espaço que suga tudo ao redor |
| Chuva de Meteoros | Convocação | Arcana | Convoca um enorme meteorito incandescente |
| Semiplano | Convocação | Arcana | Cria uma pequena dimensão |
| Legião | Encantamento | Arcana | Você pode dominar a mente de vários alvos ao mesmo tempo e comandar suas vontades |
| Palavra Primordial | Encantamento | **Universal** | Palavras mágicas podem atordoar, cegar e até matar uma criatura |
| Possessão | Encantamento | Arcana | Transfere sua consciência para o corpo do alvo, tomando controle total |
| Barragem Elemental de Vectorius | Evocação | Arcana | Lança esferas elementais explosivas |
| Deflagração de Mana | Evocação | Arcana | Explosão de energia bruta causa dano e afeta magias e itens mágicos |
| Mata-Dragão | Evocação | Arcana | Dispara uma rajada de energia destruidora |
| Réquiem | Ilusão | Arcana | Prende os alvos em uma realidade ilusória que se repete infinitamente |
| Sombra Assassina | Ilusão | Arcana | Manifesta uma cópia ilusória do alvo, que luta contra ele |
| Roubar a Alma | Necromancia | **Universal** | Arranca a alma do alvo e a prende em um objeto |
| Toque da Morte | Necromancia | **Universal** | Pode matar uma criatura instantaneamente |
| Controlar o Tempo | Transmutação | Arcana | Acelera, avança ou para o tempo |
| Desejo | Transmutação | Arcana | Modifica a realidade a seu bel-prazer |

**Subtotal 5º Arcano: 20**

---

### 4.2 Magias Divinas

> Fonte: índice impressa pp. 176–177 (imagens p-182.png / p-183.png) + texto.
> Magias marcadas (**U**) são "Universal" nas descrições.

#### 1º Círculo Divino (30 magias)

| Nome | Escola | Tipo | Resumo (índice) |
|------|--------|------|-----------------|
| Escudo da Fé | Abjuração | Divina | Protege uma criatura |
| Proteção Divina | Abjuração | Divina | Alvo recebe bônus em testes de resistência |
| Resistência a Energia | Abjuração | **Universal** | Fornece resistência contra um tipo de dano a sua escolha |
| Santuário | Abjuração | Divina | Inimigos devem passar num teste de Vontade para atacá-lo |
| Suporte Ambiental | Abjuração | Divina | Ignora efeitos de calor e frio e pode respirar na água |
| Aviso | Adivinhação | **Universal** | Envia um alerta telepático para uma criatura |
| Compreensão | Adivinhação | **Universal** | Você entende qualquer coisa escrita ou falada e pode ouvir pensamentos |
| Detectar Ameaças | Adivinhação | Divina | Detecta perigos ao seu redor |
| Orientação | Adivinhação | Divina | Alvo recebe bônus nos testes de perícia |
| Visão Mística | Adivinhação | **Universal** | Você pode ver auras mágicas |
| Arma Espiritual | Convocação | Divina | Cria uma arma de energia que ataca seus inimigos |
| Caminhos da Natureza | Convocação | Divina | Convoca um espírito que guia você e seus aliados em terreno selvagem |
| Criar Elementos | Convocação | Divina | Cria uma quantidade Minúscula de água, ar, fogo ou terra |
| Névoa | Convocação | **Universal** | Cria uma névoa que oferece camuflagem |
| Acalmar Animal | Encantamento | Divina | Um animal fica prestativo |
| Bênção | Encantamento | Divina | Fornece bônus em ataques e dano |
| Comando | Encantamento | Divina | Força o alvo a obedecer a uma ordem |
| Tranquilidade | Encantamento | Divina | Acalma criaturas na área |
| Consagrar | Evocação | Divina | Abençoa a área, maximizando PV curados por luz |
| Curar Ferimentos | Evocação | Divina | Seu toque recupera pontos de vida |
| Despedaçar | Evocação | Divina | Som alto e agudo causa atordoamento e dano de impacto |
| Luz | Evocação | **Universal** | Objeto ilumina como uma tocha |
| Escuridão | Necromancia | **Universal** | Objeto emana uma área de escuridão |
| Infligir Ferimentos | Necromancia | Divina | Seu toque causa dano de trevas e pode deixar fraco |
| Perdição | Necromancia | Divina | Inimigos sofrem penalidade nos ataques e danos |
| Profanar | Necromancia | Divina | Conspurca a área, maximizando dano de trevas |
| Abençoar Alimentos | Transmutação | Divina | Purifica refeição, que também fornece bônus temporários |
| Arma Mágica | Transmutação | **Universal** | Arma recebe bônus ou poderes mágicos |
| Armamento da Natureza | Transmutação | Divina | Arma natural ou primitiva causa dano como se fosse maior |
| Controlar Plantas | Transmutação | Divina | Vegetação enreda criaturas |

**Subtotal 1º Divino: 30**

#### 2º Círculo Divino (22 magias)

| Nome | Escola | Tipo | Resumo (índice) |
|------|--------|------|-----------------|
| Círculo da Justiça | Abjuração | Divina | Causa penalidades em Enganação, Furtividade e Ladinagem |
| Dissipar Magia | Abjuração | **Universal** | Encerra os efeitos de uma magia ativa em um alvo ou área |
| Runa de Proteção | Abjuração | **Universal** | Runa protege passagem ou objeto |
| Vestimenta da Fé | Abjuração | Divina | Traje, armadura ou escudo recebe bônus na Defesa |
| Augúrio | Adivinhação | Divina | Diz se uma ação trará resultados bons, ruins ou ambos |
| Condição | Adivinhação | Divina | Monitora a condição (PV, condições, magias afetando) de criaturas tocadas |
| Globo da Verdade de Gwen | Adivinhação | Divina | Globo revela cena vista pelo conjurador |
| Mente Divina | Adivinhação | Divina | Fornece bônus em um ou mais atributos mentais |
| Voz Divina | Adivinhação | Divina | Converse com criaturas variadas, plantas, rochas e cadáveres |
| Enxame de Pestes | Convocação | Divina | Convoca um enxame que causa dano toda rodada |
| Soco de Arsenal | Convocação | Divina | Alvo sofre dano de impacto e é empurrado |
| Aliado Animal | Encantamento | Divina | Um animal prestativo se torna um parceiro |
| Marca da Obediência | Encantamento | **Universal** | Símbolo mágico obriga o alvo a cumprir uma ordem |
| Oração | Encantamento | Divina | Aliados recebem bônus e inimigos sofrem penalidades em testes e rolagens |
| Controlar Fogo | Evocação | Divina | Move ou apaga uma chama, esquenta um objeto ou cria armas flamejantes |
| Purificação | Evocação | Divina | Toque remove condições prejudiciais |
| Raio Solar | Evocação | Divina | Linha causa dano de luz e deixa criaturas ofuscadas |
| Tempestade Divina | Evocação | Divina | Causa penalidades e permite fazer relâmpagos caírem |
| Silêncio | Ilusão | Divina | Cria uma área em que é impossível ouvir sons ou lançar magias |
| Conjurar Mortos-Vivos | Necromancia | **Universal** | Ergue mortos-vivos para lutar por você |
| Miasma Mefítico | Necromancia | Divina | Nuvem causa dano de ácido e enjoo |
| Rogar Maldição | Necromancia | Divina | O alvo sofre efeitos prejudiciais variados |
| Controlar Madeira | Transmutação | Divina | Fortalece, molda, repele ou deforma um objeto de madeira |
| Físico Divino | Transmutação | Divina | Fornece bônus em um ou mais atributos físicos |

**Subtotal 2º Divino: 24**

#### 3º Círculo Divino (22 magias)

| Nome | Escola | Tipo | Resumo (índice) |
|------|--------|------|-----------------|
| Banimento | Abjuração | Divina | Expulsa criaturas de outros planos e destrói mortos-vivos |
| Proteção contra Magia | Abjuração | Divina | Concede bônus em testes de resistência contra magias |
| Comunhão com a Natureza | Adivinhação | Divina | Você recebe dados para usar como bônus em testes de perícias |
| Lendas e Histórias | Adivinhação | **Universal** | Descobre detalhes sobre criaturas, objetos e magias |
| Vidência | Adivinhação | **Universal** | Pode ver e ouvir os arredores de uma criatura |
| Servo Divino | Convocação | Divina | Invoca um espírito para realizar uma tarefa, por um preço |
| Viagem Arbórea | Convocação | Divina | Você pode usar árvores e plantas para se teletransportar |
| Despertar Consciência | Encantamento | Divina | Plantas e animais ganham consciência e se tornam parceiros |
| Heroísmo | Encantamento | Divina | Alvo fica imune a medo e ganha bônus contra inimigos mais poderosos do que ele |
| Imobilizar | Encantamento | **Universal** | Alvo fica lento ou paralisado |
| Missão Divina | Encantamento | Divina | Alvo deve cumprir uma tarefa, ou sofrer penalidades em testes |
| Selo de Mana | Encantamento | **Universal** | Você sela a energia de uma criatura, impedindo que use Pontos de Mana |
| Coluna de Chamas | Evocação | Divina | Os céus despejam luz e fogo sobre seus inimigos |
| Dispersar as Trevas | Evocação | Divina | Dispersão anula magias, protege aliados e cega inimigos |
| Sopro da Salvação | Evocação | Divina | Cone cura aliados e remove condições prejudiciais |
| Manto de Sombras | Ilusão | **Universal** | Conjurador se cobre de sombras mágicas para vários efeitos |
| Anular a Luz | Necromancia | Divina | Explosão anula magias, protege aliados e enjoa inimigos |
| Ligação Sombria | Necromancia | Divina | Alvo sofre todo dano e efeitos negativos que você sofrer |
| Muralha de Ossos | Necromancia | **Universal** | Barreira de ossos afiados impede o avanço dos inimigos |
| Poeira da Podridão | Necromancia | Divina | Nuvem causa dano de trevas e impede magia de cura |
| Servo Morto-Vivo | Necromancia | **Universal** | Cria um parceiro morto-vivo sob seu comando |
| Controlar Água | Transmutação | Divina | Congela, derrete, evapora, aumenta ou reduz o nível de um corpo d'água |
| Controlar Terra | Transmutação | Divina | Amolece, molda ou solidifica uma área de terra, pedra ou similar |
| Controlar o Clima | Transmutação | Divina | Muda o clima de uma área |
| Pele de Pedra | Transmutação | **Universal** | Endurece sua pele, fornecendo redução de dano |
| Potência Divina | Transmutação | Divina | Você aumenta de tamanho e recebe bônus de Força e redução de dano, mas perde habilidade de lançar magias |

**Subtotal 3º Divino: 26**

#### 4º Círculo Divino (12 magias)

| Nome | Escola | Tipo | Resumo (índice) |
|------|--------|------|-----------------|
| Cúpula de Repulsão | Abjuração | Divina | Campo de força invisível impede a aproximação de um tipo de criatura |
| Libertação | Abjuração | **Universal** | O alvo fica imune a efeitos que impeçam ou restrinjam movimentação |
| Premonição | Adivinhação | Divina | Você vislumbra o futuro e pode refazer testes |
| Visão da Verdade | Adivinhação | **Universal** | Você enxerga através de camuflagem, escuridão, ilusão e transmutação |
| Guardião Divino | Convocação | Divina | Elemental de luz cura aliados |
| Viagem Planar | Convocação | **Universal** | Viaja até outro plano de existência |
| Conceder Milagre | Encantamento | Divina | Alvo pode lançar uma de suas magias de 2º círculo ou menor |
| Círculo da Restauração | Evocação | Divina | Círculo de energia luminosa restaura PV e PM |
| Cólera de Azgher | Evocação | Divina | Explosão solar cega, incendeia e causa dano |
| Manto do Cruzado | Evocação | Divina | Invoca um manto de energia que concede poderes a quem o vestir |
| Terremoto | Evocação | Divina | Tremor de terra causa dano de impacto |

**Subtotal 4º Divino: 11**

#### 5º Círculo Divino (14 magias)

| Nome | Escola | Tipo | Resumo (índice) |
|------|--------|------|-----------------|
| Aura Divina | Abjuração | Divina | Emana poder divino bruto, afetando as criaturas na área |
| Invulnerabilidade | Abjuração | **Universal** | Recebe uma série de imunidades físicas ou mentais a sua escolha |
| Lágrimas de Wynna | Abjuração | Divina | Alvo perde a capacidade de lançar magias arcanas |
| Projetar Consciência | Adivinhação | **Universal** | Pode observar qualquer local ou criatura |
| Buraco Negro | Convocação | **Universal** | Abre uma ruptura no espaço que suga tudo ao redor |
| Intervenção Divina | Convocação | Divina | Convoca sua divindade para que realize um milagre |
| Palavra Primordial | Encantamento | **Universal** | Palavras mágicas podem atordoar, cegar e até matar uma criatura |
| Fúria do Panteão | Evocação | Divina | Nuvem gera efeitos destrutivos |
| Segunda Chance | Evocação | Divina | Cura e ressuscita aliados |
| Reanimação Impura | Necromancia | Divina | Ressuscita uma criatura morta, mas como um zumbi sob seu controle |
| Roubar a Alma | Necromancia | **Universal** | Arranca a alma do alvo e a prende em um objeto |
| Toque da Morte | Necromancia | **Universal** | Pode matar uma criatura instantaneamente |

**Subtotal 5º Divino: 12**

---

## 5. Contagens

### 5.1 Entradas únicas de magia (sem duplicatas cross-tipo)

Magias "Universal" aparecem nas duas listas (arcana e divina), mas são uma única entrada de descrição. A contagem abaixo usa **entradas únicas de descrição** — cada magia conta uma vez, independente de quantas listas aparece.

| Círculo | Arcanas exclusivas | Divinas exclusivas | Universais | Total único |
|---------|-------------------|-------------------|------------|-------------|
| 1º | ~22 | ~18 | ~10 | **~32** |
| 2º | ~20 | ~16 | ~8 | **~28** |
| 3º | ~15 | ~17 | ~9 | **~25** |
| 4º | ~13 | ~7 | ~5 | **~20** |
| 5º | ~14 | ~7 | ~8 | **~20** |
| **Total** | | | | **~125** |

> **Nota:** A contagem exata requer desduplicação programática; a estimativa acima é baseada na leitura do índice. O total de entradas de descrição no texto (seção "Descrição das Magias") é a referência definitiva.

### 5.2 Ocorrências por lista (com duplicatas Universal)

| Círculo | Arcanas (lista) | Divinas (lista) |
|---------|----------------|----------------|
| 1º | 32 | 30 |
| 2º | 28 | 24 |
| 3º | 24 | 26 |
| 4º | 20 | 11 |
| 5º | 20 | 12 |
| **Total** | **124** | **103** |

### 5.3 Magias Universais identificadas (aparecem em ambas as listas)

| Nome | Círculo | Escola |
|------|---------|--------|
| Resistência a Energia | 1 | Abjuração |
| Aviso | 1 | Adivinhação |
| Compreensão | 1 | Adivinhação |
| Visão Mística | 1 | Adivinhação |
| Névoa | 1 | Convocação |
| Luz | 1 | Evocação |
| Escuridão | 1 | Necromancia |
| Vitalidade Fantasma | 1 | Necromancia |
| Arma Mágica | 1 | Transmutação |
| Dissipar Magia | 2 | Abjuração |
| Runa de Proteção | 2 | Abjuração |
| Marca da Obediência | 2 | Encantamento |
| Conjurar Mortos-Vivos | 2 | Necromancia |
| Imobilizar | 3 | Encantamento |
| Selo de Mana | 3 | Encantamento |
| Lendas e Histórias | 3 | Adivinhação |
| Manto de Sombras | 3 | Ilusão |
| Muralha de Ossos | 3 (Arcan 4) | Necromancia |
| Servo Morto-Vivo | 3 | Necromancia |
| Pele de Pedra | 3 | Transmutação |
| Vidência | 3 | Adivinhação |
| Libertação | 4 | Abjuração |
| Visão da Verdade | 4 | Adivinhação |
| Viagem Planar | 4 | Convocação |
| Invulnerabilidade | 5 | Abjuração |
| Projetar Consciência | 5 | Adivinhação |
| Buraco Negro | 5 | Convocação |
| Palavra Primordial | 5 | Encantamento |
| Roubar a Alma | 5 | Necromancia |
| Toque da Morte | 5 | Necromancia |

**Total Universais identificadas: ~30**

> **Atenção:** "Muralha de Ossos" aparece como 3º na lista divina e 4º na lista arcana — mesma magia, círculo diferente por tipo? Verificar na descrição (linha ~315 do texto).

---

## 6. Recomendação de Schema `magia`

```typescript
interface Magia {
  // Identificação
  id: string;                    // slug: "bola-de-fogo"
  nome: string;                  // "Bola de Fogo"
  
  // Classificação
  tipo: "arcana" | "divina" | "universal";
  circulo: 1 | 2 | 3 | 4 | 5;
  escola: "abjuracao" | "adivinhacao" | "convocacao" | "encantamento"
        | "evocacao" | "ilusao" | "necromancia" | "transmutacao";
  
  // Linha da magia (cabeçalho)
  execucao: string;              // "padrão", "reação", "ação livre", "completa", "1 minuto"
  alcance: string;               // "pessoal", "toque", "curto", "médio", "longo", "ilimitado"
  alvo?: string | null;          // "1 criatura", "você", "1 objeto" — nullable
  area?: string | null;          // "esfera com 9m de raio", "cone de 4,5m" — nullable
  efeito?: string | null;        // "cria X" — nullable; raro, mas existe
  duracao: string;               // "instantânea", "cena", "sustentada", "1 dia", "permanente"
  resistencia?: string | null;   // "Vontade anula", "Reflexos reduz à metade", null
  
  // Custo
  custoPM: number;               // custo base: 1/3/6/10/15
  custoEspecial?: string | null; // componente material, custo extra em PV etc.
  
  // Conteúdo
  resumo: string;                // frase curta do índice
  descricao: string;             // texto descritivo completo (markdown)
  
  // Truque (aprimoramento especial)
  truque?: string | null;        // texto do Truque, quando existir
  
  // Aprimoramentos
  aprimoramentos: Array<{
    custo: number;               // ex.: 1, 2, 3, 5, 7, 9, 12
    efeito: string;              // texto descritivo
    requisito_circulo?: number;  // quando "Requer Xº círculo"
  }>;
  
  // Rastreabilidade
  fonte: {
    livro: string;               // "livro-basico"
    pagina: number;              // página impressa
  };
}
```

### Decisões de design

1. **`tipo: "universal"`** — em vez de `["arcana", "divina"]`, usar enum com terceiro valor; simplifica queries e evita array heterogêneo.
2. **`alvo` / `area` / `efeito` nullable** — são mutuamente exclusivos na maioria dos casos, mas algumas magias usam "Alvo ou Área" — manter três campos separados, todos nullable.
3. **`custoPM` = custo base** — não replicar a Tabela 4-1; a tabela vai na entidade `regra`; o campo é apenas referência ao custo-base do círculo.
4. **`truque` como campo próprio** — separado de `aprimoramentos` porque tem comportamento especial (custo = 0, não combina com outros aprimoramentos).
5. **`resumo`** — a frase do índice é valiosa para tooltips e buscas rápidas; extrair como campo separado.
6. **`escola` como enum string snake_case** — facilita internacionalização e indexação.
7. **`execucao` como string livre** — os valores variam ("padrão", "reação", "completa", "1 minuto", "10 minutos") demais para enum fechado.

---

## 7. Observações Especiais

### 7.1 Tabelas no capítulo
- **Tabela 4-1: Custo de Magias** (p. 169) — tabela formal de 2 colunas: Círculo × Custo PM. Extrair como entidade `regra` separada.
- **Ícones das 8 Escolas de Magia** — SVG decorativos em coluna lateral (p. 173). Presentes no livro; verificar se reproduzíveis.

### 7.2 Sidebars / quadros coloridos
- Texto das regras de "Concentração" tem subseções com bullet points (CDs específicas) que saem no layout em dois blocos side-by-side — o `pdftotext -layout` preserva razoavelmente, mas pode exigir limpeza manual de colunas.
- O índice-resumo (pp. 174–177) tem layout de **3 colunas por dupla de páginas** com escola abreviada (Abjur, Adiv, Conv, Encan, Evoc, Ilusão, Necro, Trans) — verificar alinhamento no texto extraído.

### 7.3 Magias com formato especial
- **"Aprisionamento"** (Arcana 5): tem bloco de "formas de prisão" com nomes especiais (Sono Eterno, etc.) e componentes materiais variáveis por forma — requer subarray ou campo de texto rico.
- **"Animar Objetos"** (Arcana 4): contém tabela de estatísticas de objetos animados por tamanho — embedded table na descrição; extrair como lista estruturada ou markdown.
- **Magias com "muda a execução para reação"** nos aprimoramentos: o campo `execucao` pode mudar via aprimoramento; registrar no texto do aprimoramento, não alterar o campo base.
- **Vitalidade Fantasma** (Universal 1 Necromancia): no índice arcano aparece como "Arcana"; na descrição aparece como "Universal" — confirmar durante extração.

### 7.4 Magias "Universal" no índice
O índice (pp. 174–177) NÃO usa o rótulo "Universal" — a magia aparece em ambas as listas (Arcanas e Divinas) com o mesmo texto resumo. O rótulo "Universal X (Escola)" aparece apenas nas descrições. O pipeline de extração deve cruzar índice + descrição para classificar corretamente.

### 7.5 "Muralha de Ossos" — anomalia de círculo
- Na **lista arcana** aparece em 4º círculo.
- Na **lista divina** aparece em 3º círculo.
- Nas **descrições** será classificada como "Universal 3 (Necromancia)" ou "Universal 4"? Verificar ao extrair. Pode ser intencional (balanceamento diferente por tipo).

---

## 8. Próximos Passos

1. Extrair todas as entradas de descrição (`extracao/scripts/extrai-magias.ts`) usando o texto + imagens.
2. Desduplicar Universais: cruzar lista arcana e divina; entradas idênticas → `tipo: "universal"`.
3. Estruturar aprimoramentos como array: regex `^\+(\d+) PM:(.+)` + detecção de "Requer Xº círculo".
4. Detectar "Truque:" como campo separado.
5. Extrair `custoEspecial` de "Componente Material:" dentro das descrições.
6. Validar com Zod schema antes de commitar em `data/livro-basico/magias/`.
