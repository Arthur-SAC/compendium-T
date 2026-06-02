# Capítulo 5 — Jogando (Combate & Testes) — Plano

> Fatia de REGRAS. Reusa `regra-de-criacao` + `Ficha` genérico (tabelas na `mecanica`). Sem schema/componente novo.
> Texto de apoio: `extracao/cache/jogando/jogando.txt` (pdftotext PDF 218–268). Cap. 5 = ~linhas 1–1500; depois é Cap. 6 (O Mestre).

**Goal:** As regras de "como jogar e combater" do Cap. 5 no site: resolução por testes/CD, como habilidades/efeitos
funcionam, e o sistema de combate. Completa a camada "jogável sem o livro".

## Limites (descoberto via rodapés do pdftotext)
- **Cap. 5 — Jogando:** splash PDF 218–219 (impressas 212–213); conteúdo PDF 220–~233 (impressas 214–~227), **~14 páginas densas (2 colunas)**.
- **Cap. 6 — O Mestre** começa ~PDF 234 (futura fatia **Mestrar**). NÃO entra aqui.
- ⚠️ **Evolução de personagem (Nível / XP / Patamares Iniciante-Veterano-Campeão-Lenda / Multiclasse) está no Capítulo 8: Recompensas**
  (o texto remete "veja isso no Capítulo 8: Recompensas") — **NÃO** está no Cap. 1 nem no Cap. 5. → tratar na futura fatia **Recompensas (Cap. 8)**.
  (Patamares são referenciados de passagem: iniciante até 4º nível, veterano/campeão 5º–16º, lenda 17º+.)

## Decomposição em regras (`regra-de-criacao`) — extrair por visão (páginas renderizadas), 2 passadas
- [ ] **`testes-e-dificuldades`** (SPIKE) — Fazendo Testes (de atributo, de perícia, comuns, opostos, misturando testes),
  **Tabela 5-1: Dificuldades** (CDs), Condições Favoráveis/Desfavoráveis, **Testes Estendidos** (abertos, em grupo, ajuda).
- [ ] **`habilidades-e-efeitos`** — como habilidades funcionam: tipos de efeito (dano, cura, movimento, condição…),
  área e duração de efeitos, **bônus que não acumulam** (mesma fonte), Redução de Dano (RD), Vulnerabilidade, **Tipos de Dano**
  (corte/impacto/perfuração, fogo/frio/eletricidade/ácido, essência/luz/trevas, psíquico).
- [ ] **`combate`** — Iniciativa, Surpresa/desprevenido, Rodada e Turno, **Ações** (padrão, movimento, livre, completa, reação),
  **Teste de Ataque** (CD = Defesa), **Dano** (corpo a corpo = arma + Força; disparo = arma), **Acertos Críticos**,
  **Defesa**, **Cobertura**, Movimento em combate, **Manobras** (derrubar, agarrar, empurrar…), Ataques de Oportunidade.
  (Talvez dividir em `combate` + `acoes-e-manobras` se ficar grande.)

> Condições já existem como tooltips (`data/referencia/condicoes.json`, 35 condições) e Recuperação/Descanso já está em
> `caracteristicas-derivadas` — não reextrair; linkar/cruzar.

## Integração
- [ ] Cada regra: tabelas (5-1 etc.) na `mecanica` → renderizam via `Ficha`. Auto-link acende termos/condições/perícias.
- [ ] Adicionar as regras de combate num índice/painel (ex.: estender a landing `/personagem` ou criar `/regras`/`/combate`).
- [ ] build + testes verdes; atualizar PROGRESSO. Commit por regra.

## Encerramento
Cap. 5 (combate & testes) no site. Próximas fatias: **Recompensas (Cap. 8 — inclui Nível/XP/Patamares/Multiclasse)**,
**Mundo de Arton**, **Mestrar (Cap. 6)**.
