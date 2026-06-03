# Auditoria de Completude — Livro Básico (2026-06-03)

> Varredura capítulo a capítulo do Livro Básico cruzada com `data/livro-basico/`, por 9 auditores
> independentes (visão + pdftotext). Objetivo: garantir que NADA do livro foi pulado.
> Princípio do usuário: "se não está no site, não existe" — o site deve ser confiável.

## Catálogos — ÍNTEGROS ✅
Conferidos item a item, sem lacunas: **Raças 17/17, Classes 14/14, Origens 35/35, Divindades 20/20,
Perícias 29, Poderes 162, Magias 198, Itens 171, Itens Mágicos 186, Criaturas 78, Regiões 32.**
Habilidades de raça/classe, caminhos, tabelas de progressão (20 níveis), poderes concedidos, encantos —
todos presentes. **Cap. 6 (O Mestre): 0 lacunas.** Cap. 7/8/9 (catálogos + regras): completos.

## LACUNAS (conteúdo do livro ausente do site)

### Grandes — seções inteiras ausentes
1. **[INTRODUÇÃO inteira]** (impressas 6–13) — nenhum JSON cobre. Falta: "O que é Tormenta20?",
   "Mecânica Básica" (1d20+mod vs CD — a regra-mãe), "Começando", "Dados" (notação d4–d%), "Termos
   Importantes" (glossário introdutório), "20 Coisas a Saber", quadro "Suporte para o Jogo".
2. **[ALINHAMENTO]** (impressas 109–111) — seção inteira ausente: intro, Eixo Ético (Bem/Neutro/Mal),
   Eixo Moral (Lei/Neutro/Caos), os 9 alinhamentos (LB…CM) com exemplos.
3. **[INTERPRETAÇÃO / Papel do Jogador]** (Cap. 5, impressas 214–219) — ausente: declarar ações,
   interpretar o personagem, **regra de testes para questões sociais** (interpretar não substitui rolagem),
   Vitórias & Derrotas + quadros "Não Seja Fominha!", "O Objetivo do RPG", "Não Seja Babaca!" (segurança de mesa).

### Médias — regras/tabelas intercaladas
4. **Toques Finais: Nome, Idade, Envelhecimento** (108) — rolagem de idade inicial por grupo de classe;
   modificadores de Maduro/Velho; quadro "Raças Longevas" (multiplicadores ×2/×5). Ausente.
5. **Escolhendo Perícias** (113) — quantas perícias treinadas (classe + Inteligência). Falta em `pericias-como-funcionam`.
6. **Tabela 3-1: Dinheiro Inicial** (138) — T$ por nível (2º=300 … 20º=260.000). Referenciada mas sem dados (`riqueza-e-equipamento`/`tesouros`).
7. **Regras de grupo de Poderes** — Tormenta (perde Carisma ao escolher; vira NPC abaixo de –5, 136),
   Concedidos (atributo-chave = Sabedoria, 132), intro Poderes de Aprimoramento (131). Falta em `poderes-como-funcionam`.
8. **Tipo "Universal" de magia** — `magia-como-funciona.mecanica.tipos` só tem arcana/divina, mas há magias Universal (Visão da Verdade etc.). Tipo não explicado.
9. **Intro "Classes" + Tabela 1-3** (32) — porta de entrada do capítulo (como ler PV/PM/perícias/proficiências). Só existe o grid `/classes`.

### Pequenas — quadros de flavor/etiqueta
10. Quadro **"Variante: Mapa de Batalha"** (235) — grid 2,5cm=1,5m, deslocamento em quadrados. [REGRA opcional]
11. Quadro **"Carga: Bastidores"** (140) — filosofia da regra de 1 item = 1 espaço.
12. Quadro **"Deuses Menores"** (104) — Tibar (Comércio), Rhond (Armas), Sckhar; ascensão à divindade.
13. Quadro **"Nomes em Arton"** (361–364) — tradições de nomes por povo (humanos, anões, dahllan, élficos, goblins, lefou, qareen, táuricos).

### Não-lacunas (navegação, não dados faltando)
- **Listas de Magias Arcanas/Divinas** (174–177): índice-resumo por círculo/escola. O conteúdo mecânico está nas 198 fichas;
  o que falta é a *view* de índice navegável (melhoria de UX, não dado ausente).
- "Escolhendo sua Raça/Classe/Deus": prosa de aconselhamento (flavor), parcialmente presente.

## Plano de correção sugerido (ordem)
1. Regras novas (`regra-de-criacao`): `introducao-ao-jogo` (ou dividir em mecânica-básica/dados/termos),
   `alinhamento`, `interpretacao`, `nome-idade-e-envelhecimento`.
2. Completar regras existentes: `pericias-como-funcionam` (Escolhendo Perícias), `poderes-como-funcionam`
   (grupos Tormenta/Concedidos/Aprimoramento), `magia-como-funciona` (tipo Universal),
   `riqueza-e-equipamento` (Tabela 3-1 + quadro Carga). Intro de Classes (+ Tabela 1-3) na página `/classes` ou regra.
3. Quadros: Deuses Menores, Nomes em Arton, Variante Mapa de Batalha (regra/referência).
4. (UX) Listas de Magias por círculo/escola como índice.
