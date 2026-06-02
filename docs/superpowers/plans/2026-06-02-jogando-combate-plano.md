# Capítulo 5 — Jogando (Combate & Testes) — Plano

> Fatia de REGRAS. Reusa `regra-de-criacao` + `Ficha` genérico (tabelas na `mecanica`). Sem schema/componente novo.
> Texto de apoio: `extracao/cache/jogando/jogando.txt` (pdftotext PDF 218–268). Cap. 5 = ~linhas 1–1500; depois é Cap. 6 (O Mestre).

**Goal:** As regras de "como jogar e combater" do Cap. 5 no site: resolução por testes/CD, como habilidades/efeitos
funcionam, e o sistema de combate. Completa a camada "jogável sem o livro".

## Limites (descoberto via rodapés do pdftotext)
- **Cap. 5 — Jogando:** splash PDF 218–219 (impressas 212–213); conteúdo PDF 220–~233 (impressas 214–~227), **~14 páginas densas (2 colunas)**.
- **Cap. 6 — O Mestre** começa ~PDF 234 (futura fatia **Mestrar**). NÃO entra aqui.
- ✅ **CORREÇÃO:** a **Evolução de personagem (Subir de Nível / XP / Patamares / Multiclasse) está no Cap. 1, na abertura das
  Classes** (impressas 34–35), NÃO no Cap. 8. Extraída na regra `evolucao-de-personagem` (`Subindo de Nível`, `Patamares de Jogo`
  Iniciante/Veterano/Campeão/Lenda, `Multiclasse`, `Tabela 1-4: Níveis de Personagem` — XP e bônus de perícia por nível, verificada
  em imagem 300 DPI). Linkada na landing `/personagem`. (A menção a "Capítulo 8: Recompensas" no Cap. 6 era sobre tesouro/recompensas,
  não sobre a mecânica de subir de nível.)
- **Pendente de backfill (abertura das Classes, impressas 32–34):** `classes-como-funcionam` — o que é uma classe, Características
  (atributo-chave, PV/PM, perícias, habilidades) + tabela-resumo das 14 classes + Habilidades de Classe.

## Decomposição em regras (`regra-de-criacao`) — extração via texto pdftotext (exato) + verificação de tabelas em imagem
- [x] **`testes-e-dificuldades`** (`09dbea3`) — Fazendo Testes (atributo/perícia/comuns/opostos/misturando), Tabela 5-1
  Dificuldades, sucessos/falhas automáticos, condições favoráveis, novas tentativas, ferramentas, ajudar, escolher 0/10/20,
  Testes Estendidos (+ Tabela 5-2, abertos/em grupo/ajuda/dificultando/interrupções).
- [x] **`habilidades-e-efeitos`** (`a4f9830`) — usar habilidades (passiva/ativada/engatilhada), custo de PM + custos especiais,
  alcance, alvos e áreas (linha de efeito/formas/criação), clarificações, acúmulo de efeitos, efeitos que afetam testes,
  limites de nível, duração, testes de resistência; + tabelas: alcances, formas de área, durações, 18 tipos de efeito, 15 habilidades gerais.
- [x] **`combate`** (`4b880c6`) — impressas 229-239: Teste de Ataque (CD=Defesa), Dano + 11 Tipos de Dano, Acertos Críticos,
  Iniciativa+Surpresa, Como Funciona (4 passos), A Rodada, Tipos de Ações, Ferimentos & Morte + Dano Não Letal, Movimentação,
  Situações Especiais (camuflagem/cobertura/flanquear) + Tabela 5-3 e Tabela 5-4 (objetos/armas/armaduras), Quebrando Objetos.
- [x] **`acoes-em-combate`** (`4b880c6`) — catálogo: Ações Padrão (Agredir/Atropelar/Fintar/Lançar Magia/Preparar/Usar
  Habilidade-Item), de Movimento (Movimentar/Levantar/Manipular/Sacar-Guardar/Mirar), Completas (Corrida/Investida/Golpe de
  Misericórdia/Magia longa), Livres (Falar/Jogar-se/Largar/Atrasar) e Manobras (Agarrar/Derrubar/Desarmar/Empurrar/Quebrar).

**CAP. 5 JOGANDO ✅ COMPLETO** (4 regras: testes-e-dificuldades, habilidades-e-efeitos, combate, acoes-em-combate).
Pendente de polimento: índice `/regras` (ou painel) reunindo as regras de jogo — fazer no passe de design.

> Condições já existem como tooltips (`data/referencia/condicoes.json`, 35 condições) e Recuperação/Descanso já está em
> `caracteristicas-derivadas` — não reextrair; linkar/cruzar.

## Integração
- [ ] Cada regra: tabelas (5-1 etc.) na `mecanica` → renderizam via `Ficha`. Auto-link acende termos/condições/perícias.
- [ ] Adicionar as regras de combate num índice/painel (ex.: estender a landing `/personagem` ou criar `/regras`/`/combate`).
- [ ] build + testes verdes; atualizar PROGRESSO. Commit por regra.

## Encerramento
Cap. 5 (combate & testes) no site. Próximas fatias: **Recompensas (Cap. 8 — inclui Nível/XP/Patamares/Multiclasse)**,
**Mundo de Arton**, **Mestrar (Cap. 6)**.
