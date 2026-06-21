# PROMPT DEFINITIVO — CLAUDE CODE — JOGO "MENDELITOS"

> **Como usar:** cole este documento inteiro no Claude Code como a especificação do projeto. Ele contém TODO o conteúdo do jogo (genética, textos, telas, deploy). Não precisa inventar nada — tudo que você precisa está aqui. Use `/effort high` (ou `xhigh`) e trabalhe em etapas, na ordem da seção 11.

---

## 0. O QUE VOCÊ VAI CONSTRUIR

Um jogo web chamado **Mendelitos**: criar e colecionar criaturas fofas onde a **herança genética é a mecânica central**. O jogador cruza bichinhos, eles geram filhotes seguindo as Leis de Mendel **de verdade**, e a aparência de cada filhote *é* o genótipo dele renderizado na tela.

É um jogo educativo de Genética (disciplina de Biomedicina), mas a parte educativa é embutida no loop — nunca um quiz com fantasia. O jogo explica cada conceito **no momento em que o jogador o causa**, em dose pequena, com a explicação longa guardada num Codex.

**Requisitos absolutos:**
- **Responsivo e baseado em toque.** Roda igual no celular, iPad e PC. Nenhuma ação pode depender de `hover` — tudo é toque/clique. Layout reflui em telas estreitas.
- **Visual fofo e colorido** (estilo Pokémon/Tamagotchi). Paleta na seção 8.
- **Português do Brasil** em toda a interface.
- **Sem backend.** Tudo roda no navegador. Progresso salvo em `localStorage`.
- Deploy final no **Vercel via GitHub**.

---

## 1. STACK E SETUP

- **Vite + React (JavaScript ou TypeScript, sua escolha — prefira TS se ajudar a manter os dados consistentes).**
- **Tailwind CSS** para estilo.
- **Criaturas montadas em camadas de SVG** (componentes React), não imagens pré-renderizadas. O jogador vai trocar as sprites depois, então cada parte é um componente isolado que recebe a peça/cor como prop.
- **Sem bibliotecas pesadas.** Animação pode ser CSS + Framer Motion (opcional, se facilitar o "suco").
- Single-page app. Sem rotas complexas — navegação por estado (uma tela ativa por vez).
- Áudio com a Web Audio API ou tags `<audio>` simples.

Crie um `CLAUDE.md` na raiz resumindo: stack, estrutura de pastas, o modelo de dados dos genes (seção 3–4) e a regra de "nunca quebrar a corretude genética da seção 4".

---

## 2. ESTRUTURA DE ARQUIVOS SUGERIDA

```
src/
  data/
    genes.js          // definição dos genes, alelos, mapeamento genótipo→fenótipo
    cards.js          // textos das cartas de descoberta
    codex.js          // as 11 entradas do Codex
    missions.js       // as missões
    strings.js        // todas as strings de interface
  engine/
    breeding.js       // algoritmo de cruzamento (seção 4.3)
    phenotype.js      // genótipo → fenótipo (seção 4.4)
    save.js           // load/save em localStorage
  components/
    Creature/         // o bichinho montado em camadas (Body, Ears, Pattern, Crest, Scales, Eyes)
    PredictionLens.jsx
    DiscoveryCard.jsx
    Codex.jsx
    Dex.jsx
    Missions.jsx
  screens/
    TitleScreen.jsx
    Lab.jsx
    BreedScreen.jsx
  App.jsx
  state/                // contexto/estado global (coleção, descobertas, missões, progresso)
```

---

## 3. O MODELO DE DADOS

Cada criatura é um objeto:

```js
creature = {
  id: string,              // único
  sex: 'XX' | 'XY',        // determina silhueta sutil + necessário pro gene ligado ao X
  genes: {
    cor:     ['C','c'],    // par de alelos (autossômico)
    orelhas: ['O','o'],
    padrao:  ['M','m'],
    crista:  ['V','B'],    // Mundo 3 (dominância incompleta)
    escamas: ['A','R'],    // Mundo 3 (codominância)
    olhos:   ['G','g'] | ['G'] // X-linked: 2 alelos se XX, 1 se XY (fica no X)
  },
  nickname?: string
}
```

> Para o NÚCLEO (Mundos 1–2), só `cor`, `orelhas`, `padrao` importam. `sex` existe desde o início (herdado, ver 4.3) mas só afeta o jogo quando o gene `olhos` entra (Mundo 3). Os genes do Mundo 3 podem ficar inativos/ocultos até serem desbloqueados.

---

## 4. A GENÉTICA — REGRAS EXATAS (NÃO ALTERAR)

Esta é a parte mais importante. A corretude biológica é inegociável.

### 4.1 Genes essenciais (Mundos 1–2) — dominância completa

Convenção: **MAIÚSCULA = dominante, minúscula = recessivo.**

| Gene | Alelos | Mapeamento genótipo → fenótipo |
|---|---|---|
| `cor` | `C` (roxo), `c` (verde) | `CC`→roxo, `Cc`→roxo, `cc`→verde |
| `orelhas` | `O` (curtas), `o` (longas) | `OO`→curtas, `Oo`→curtas, `oo`→longas |
| `padrao` | `M` (liso), `m` (manchado) | `MM`→liso, `Mm`→liso, `mm`→manchado |

### 4.2 Genes avançados (Mundo 3 — bônus)

| Gene | Tipo | Mapeamento |
|---|---|---|
| `crista` | **Dominância incompleta** | `VV`→vermelha, `VB`→**rosa**, `BB`→branca. Sem alelo dominante; heterozigoto é meio-termo. Proporção fenotípica = 1:2:1. |
| `escamas` | **Codominância** | `AA`→azul, `AR`→**azul E vermelha juntas (as duas inteiras)**, `RR`→vermelha. NÃO misturar em roxo. |
| `olhos` | **Ligado ao X** | Fêmea (XX): `GG`→grandes, `Gg`→grandes (portadora), `gg`→pequenos. Macho (XY): `G`→grandes, `g`→pequenos (um único alelo já se manifesta). |

### 4.3 Algoritmo de cruzamento (segregação)

Ao cruzar **mãe (XX)** × **pai (XY)**, gere uma **ninhada de 4 filhotes**. Para cada filhote:

**Sexo:**
- A mãe sempre contribui um `X`.
- O pai contribui `X` (→ filha XX) ou `Y` (→ filho XY), 50/50.

**Genes autossômicos (`cor`, `orelhas`, `padrao`, `crista`, `escamas`):**
- Cada pai contribui **um** dos seus dois alelos, sorteado 50/50 e independente por gene.

**Gene ligado ao X (`olhos`):**
- A mãe contribui **um** dos seus dois alelos de X (50/50).
- Se o filhote for **filha (XX)**: recebe também o alelo do **único X do pai**. → dois alelos.
- Se o filhote for **filho (XY)**: recebe o **Y** do pai (sem alelo de olhos do pai). → um alelo, vindo só da mãe.

Pseudocódigo:
```js
function breed(mother, father) {
  const litter = [];
  for (let i = 0; i < 4; i++) {
    const fromFather = Math.random() < 0.5 ? 'X' : 'Y';
    const sex = fromFather === 'X' ? 'XX' : 'XY';
    const genes = {};
    for (const g of ['cor','orelhas','padrao','crista','escamas']) {
      genes[g] = [ pickOne(mother.genes[g]), pickOne(father.genes[g]) ];
    }
    // X-linked:
    const momX = pickOne(mother.genes.olhos);      // mãe sempre tem 2 alelos
    if (sex === 'XX') genes.olhos = [ momX, father.genes.olhos[0] ];
    else              genes.olhos = [ momX ];        // filho só herda da mãe
    litter.push({ id: uid(), sex, genes });
  }
  return litter;
}
// pickOne(pair) => pair[Math.random() < 0.5 ? 0 : 1]
```

### 4.4 Genótipo → fenótipo

Função `phenotype(creature)` que retorna o que renderizar em cada camada, seguindo as tabelas 4.1 e 4.2. Ex.: `cor: 'roxo' | 'verde'`, `orelhas: 'curtas' | 'longas'`, `padrao: 'liso' | 'manchado'`, `crista: 'vermelha' | 'rosa' | 'branca' | nenhuma`, `escamas: 'azul' | 'vermelha' | 'azul+vermelha' | nenhuma`, `olhos: 'grandes' | 'pequenos'`.

---

## 5. FLUXO DE TELAS E ESTADOS

```
TÍTULO → LABORATÓRIO (hub)
LABORATÓRIO: coleção em grade + botões [Cruzar] [Missões] [Codex] [Dex] [⚙]
   [Cruzar] → SELECIONAR 2 PAIS → [Lente de Previsão (opcional)] → [Cruzar!]
        → animação de SEGREGAÇÃO → 4 ovos CHOCAM (pop + confete) um a um
        → REVELAR filhotes → se algo novo: CARTA DE DESCOBERTA
        → GUARDAR / SOLTAR cada filhote → volta ao LABORATÓRIO
```

Estado global a manter: coleção (array de creatures), conjunto de fenótipos já descobertos (pra Dex), conceitos já desbloqueados (pra Codex), progresso das missões, mundo atual, moeda (se usar Scanner). Tudo persiste em `localStorage`.

---

## 6. AS CRIATURAS (render em camadas)

O bichinho é uma pilha de componentes SVG, de baixo pra cima:

```
<Creature>
  <Body color={fenotipo.cor} />       // corpo + cor
  <Ears type={fenotipo.orelhas} />    // curtas | longas
  <Pattern type={fenotipo.padrao} />  // nada | manchas
  <Crest color={fenotipo.crista} />   // Mundo 3
  <Scales color={fenotipo.escamas} /> // Mundo 3
  <Eyes size={fenotipo.olhos} />      // grandes | pequenas
</Creature>
```

Regras: todas as peças no **mesmo viewBox/tamanho**, **centralizadas e alinhadas** (registro consistente), fundo transparente. No protótipo, use formas placeholder (círculos/elipses) coloridas pela paleta — o jogador troca por sprites PNG/SVG depois. Deixe a troca trivial: cada componente só decide *qual arquivo/forma* renderizar a partir da prop.

Cada criatura tem uma **idle** (respira/pisca via CSS) e reage ao toque (pulinho + som).

---

## 7. TODO O CONTEÚDO (textos prontos — use literalmente)

### 7.1 Strings de interface
- Título: **Mendelitos**
- Subtítulo da capa: *"Crie. Descubra. Colecione."*
- Botões: `Jogar`, `Cruzar`, `Cruzar!`, `Lente de Previsão`, `Escanear`, `Guardar`, `Soltar`, `Missões`, `Codex`, `Dex`, `Voltar`, `Continuar`
- Laboratório (vazio): *"Seu laboratório está esperando. Cruze dois Mendelitos para começar a descobrir!"*
- Selecionar pais: *"Escolha dois Mendelitos para cruzar."*
- Lente (título): *"O que pode nascer?"*
- Guardar/soltar: *"Quais filhotes ficam na sua coleção?"*
- Dex (item bloqueado): *"???  — ainda não descoberto"*

### 7.2 Cartas de descoberta (sobem na 1ª vez que o jogador causa o fenômeno)

**🃏 PORTADOR** *(1º recessivo a partir de dois dominantes)*
> Você cruzou dois Mendelitos roxos e nasceu um verde. De onde veio?
> Cada pai roxo carregava um alelo verde **escondido** (`Cc`). Por fora ele parece igual a um roxo puro (`CC`), mas guarda o segredo. Isso é um **portador**.

**🃏 A PROPORÇÃO 3:1** *(quando o jogador completa um cruzamento Cc × Cc com ninhada visível)*
> Repare na ninhada: a cada 4 filhotes, mais ou menos **3 roxos para 1 verde**. Não é coincidência — é a marca registrada do cruzamento entre dois portadores.

**🃏 A LEI DA SEGREGAÇÃO** *(2º cruzamento)*
> Cada filhote recebeu **um** alelo de cada pai. Os dois alelos de um pai se *separam* ao formar os filhotes — cada um vai para um lado. Mendel descobriu isso sem nunca ver um gene. *(É o que acontece na meiose, quando os cromossomos homólogos se separam.)*

**🃏 DOIS GENES DE UMA VEZ** *(1º cruzamento de Mundo 2)*
> Agora cor E orelhas são herdadas ao mesmo tempo — e uma não interfere na outra. Genes independentes se combinam livremente. É por isso que aparece tanta variedade.

**🃏 ROSA?! — DOMINÂNCIA INCOMPLETA** *(1º heterozigoto de crista)*
> Crista vermelha + crista branca não deu nem uma nem outra: deu **rosa**. Aqui nenhum alelo "vence" — eles se misturam num meio-termo. Isso é **dominância incompleta**.

**🃏 AS DUAS CORES — CODOMINÂNCIA** *(1º heterozigoto de escamas)*
> As escamas saíram **azuis E vermelhas ao mesmo tempo**, inteiras. Não viraram roxo. Quando os dois alelos aparecem por completo juntos, isso é **codominância**.

**🃏 SÓ NOS MACHOS? — LIGADO AO X** *(quando surge o 1º macho de olhos pequenos)*
> Olhos pequenos apareceram mais nos machos. O gene dos olhos fica no cromossomo **X**. O macho tem só um X — então um único alelo recessivo já se mostra nele. A fêmea tem dois X e pode ser só **portadora**.

### 7.3 Codex — as 11 entradas (cada uma: "Você encontrou" + explicação + ideia de mini-diagrama)

1. **Gene e Alelo** — *Você viu que cor, orelhas e padrão vêm de "genes".* Um gene é o trecho de DNA com a instrução de uma característica. Cada gene tem versões diferentes, os **alelos** (ex.: alelo roxo e alelo verde). Todo Mendelito tem **dois alelos** de cada gene: um da mãe, um do pai. *(Diagrama: gene = caixa; alelos = `C` e `c`.)*
2. **Dominante e Recessivo** — *Roxo sempre "ganhava" do verde.* Com dois alelos diferentes, às vezes só um se manifesta: o **dominante** (MAIÚSCULA, `C`). O outro fica escondido: o **recessivo** (minúscula, `c`). O recessivo só aparece quando o bichinho tem dois deles (`cc`). *(Diagrama: `Cc`→roxo; `cc`→verde.)*
3. **Homozigoto e Heterozigoto** — *Alguns roxos eram `CC`, outros `Cc`.* **Homozigoto** = dois alelos iguais (`CC` ou `cc`). **Heterozigoto** = dois diferentes (`Cc`). O heterozigoto mostra o dominante mas carrega o recessivo. *(Diagrama: `CC`/`cc` vs `Cc`.)*
4. **Genótipo × Fenótipo** — *Dois roxos podiam ter "fórmulas" diferentes.* **Genótipo** = os alelos que o bichinho tem (`Cc`). **Fenótipo** = o que aparece (corpo roxo). Genótipos diferentes podem dar o mesmo fenótipo — por isso você não sabe o genótipo só olhando. *(Diagrama: `CC` e `Cc` → mesmo roxo.)*
5. **Portador** — *Dois pais roxos geraram um filho verde.* Portador é o heterozigoto (`Cc`) que mostra o traço dominante mas guarda o recessivo. Cruzando dois portadores, o recessivo reaparece. Por isso traços recessivos "somem" e voltam gerações depois. *(Diagrama: `Cc × Cc` → pode nascer `cc`.)*
6. **Lei da Segregação (1ª Lei de Mendel)** — *Cada filhote recebeu um alelo de cada pai.* Os dois alelos de um gene se separam na formação dos gametas — cada gameta leva só um. Na fecundação, o filhote junta um da mãe e um do pai. *(É a meiose: os cromossomos homólogos se separam, e cada gameta leva uma versão de cada gene.)* *(Diagrama: `Cc` → gametas `C` e `c`.)*
7. **Quadro de Punnett** — *A Lente mostrava as chances dos filhotes.* O quadro cruza os alelos possíveis de cada pai numa tabela e mostra todas as combinações e proporções. `Cc × Cc` dá **1 `CC` : 2 `Cc` : 1 `cc`** (genótipo) e **3 roxos : 1 verde** (fenótipo). *(Diagrama: grade 2×2.)*
8. **Distribuição Independente (2ª Lei de Mendel)** — *Cor e orelhas não interferiam uma na outra.* Genes em pares de cromossomos diferentes são herdados de forma independente. Por isso `CcOo × CcOo` dá a proporção **9:3:3:1** no fenótipo. *(Diagrama: 9:3:3:1.)*
9. **Dominância Incompleta** — *Vermelha + branca deu rosa.* Nenhum alelo domina totalmente; o heterozigoto fica num **meio-termo**. A proporção fenotípica é igual à genotípica: **1:2:1**. *(Diagrama: `VV` vermelha, `VB` rosa, `BB` branca.)*
10. **Codominância** — *Azul + vermelha apareceram juntas.* Os dois alelos se manifestam **por completo e ao mesmo tempo** — não viram um meio-termo. O heterozigoto mostra as duas características inteiras. *(Diagrama: `AA` azul, `AR` azul+vermelha, `RR` vermelha.)*
11. **Herança Ligada ao X** — *Olhos pequenos eram mais comuns nos machos.* O gene fica no cromossomo X. A fêmea tem dois X (pode ser portadora); o macho tem um X e um Y, então um único alelo recessivo já se manifesta. A mãe portadora passa para os filhos. *(Diagrama: `X^G X^g` fêmea portadora; `X^g Y` macho afetado.)*

### 7.4 Missões (cada uma força o jogador a entender a genética por trás)

| Missão | Texto pro jogador | Conceito que treina |
|---|---|---|
| M1 | "Faça nascer seu primeiro Mendelito **verde**." | recessivo / portador |
| M2 | "Tenha 3 Mendelitos verdes na coleção ao mesmo tempo." | reforço de recessivo |
| M3 | "Crie um Mendelito de **orelhas longas**." | 2º recessivo |
| M4 | "Crie um Mendelito **verde de orelhas longas**." | di-híbrido (dois recessivos) |
| M5 | "Crie um Mendelito **verde, de orelhas longas e manchado**." | três recessivos juntos |
| M6 *(bônus)* | "Crie um Mendelito de **crista rosa**." | dominância incompleta |
| M7 *(bônus)* | "Crie um Mendelito com **escamas azuis e vermelhas**." | codominância |
| M8 *(bônus)* | "Crie uma **fêmea de olhos pequenos**." | ligado ao X (mais difícil que o macho) |

Cada missão concluída: animação de "✓ Missão completa!", recompensa (moeda/slot/cosmético), e desbloqueia a próxima.

### 7.5 Mensagens diversas
- Filhote raro (recessivo difícil): *"✨ Raro! Você conseguiu um Mendelito incomum."*
- Dex completa de um mundo: *"Você catalogou todos os Mendelitos deste mundo! 🎉"*
- Avançar de mundo: *"Novo mundo desbloqueado: [nome]. Novos genes para descobrir!"*
- Scanner usado: *"Genótipo revelado: [ex.: `Cc` — roxo portador]."*

---

## 8. IDENTIDADE VISUAL (TRAVADA: FOFO)

- **Estilo:** arredondado, amigável, saturado mas suave. Cantos bem redondos, sombras leves, sem linhas duras.
- **Paleta:**
  - Fundo: lavanda-creme suave `#F5F0FA`
  - Roxo (corpo dominante): `#8B5CF6`
  - Verde (corpo recessivo): `#5FC96B`
  - Acento sol: `#FACC15`
  - Acento rosa: `#F472B6`
  - Texto: roxo-escuro acinzentado `#3B2E4D`
  - Cards/painéis: branco `#FFFFFF` com sombra suave
  - Cores extras (Mundo 3): crista vermelha `#EF4444` / rosa `#F9A8D4` / branca `#FAFAFA`; escamas azul `#3B82F6` / vermelha `#EF4444`
- **Fontes (Google Fonts):** títulos **Fredoka** (bold, redonda); corpo **Nunito**. Ambas redondas e fofas.
- **Botões:** grandes, redondos, com leve bounce no toque (alvo mínimo de 44px — importante pro celular).
- **Cartas de descoberta:** estilo "carta colecionável" com brilho na borda ao surgir.

---

## 9. ÁUDIO

- Trilha de fundo fofa em loop (lo-fi/chiptune leve), com botão de mute persistente.
- Efeitos: `pop` do ovo, `squeak` do filhote ao toque, `snap` dos alelos ao encaixar, `chime` de descoberta, `ding` de Dex/missão completa, som especial pro raro.
- Comece com efeitos simples (até gerados via Web Audio). Áudio multiplica o "game feel" — não deixe pro fim.

---

## 10. GAME FEEL OBRIGATÓRIO (o "suco")

É o que diferencia fofo de *muito legal*. Não é opcional:
- Cruzamento: coraçõezinhos/brilho entre os pais.
- **Segregação:** os aleliozinhos **voam visivelmente** dos pais (um de cada) com rastro e dão um `snap` ao encaixar no slot do filhote. **Esta animação é a peça educativa central — capriche.**
- Ovo: chacoalha, ganha tensão, **choca com `pop` + confete**.
- Filhote: idle fofa; `squeak` ao toque.
- Raro: contorno *shiny* + partículas + som especial.
- Descoberta: carta entra com animação de "selo novo".
- Dex/Codex/missões: barra de progresso com `ding` ao completar.
- Microinterações: botões com bounce, transições suaves entre telas, feedback em TODO toque.

---

## 11. ORDEM DE CONSTRUÇÃO (faça nesta sequência)

**ETAPA A — Núcleo jogável (prioridade máxima; já é um jogo completo):**
1. Setup Vite+React+Tailwind, paleta e fontes.
2. Modelo de dados + `genes.js` (Mundos 1–2) + `phenotype.js` + `breeding.js`.
3. Componente `<Creature>` em camadas (placeholders coloridos).
4. Tela Laboratório + coleção + tela de cruzamento + ninhada de 4.
5. Animação de segregação + pop do ovo + revelar filhotes.
6. Cartas de descoberta (Mundos 1–2) + Codex (entradas 1–8).
7. Dex + missões M1–M5.
8. `localStorage` (salvar/carregar).
9. Game feel básico + áudio principal.
10. Garantir responsividade nos 3 tamanhos.

**ETAPA B — Bônus (nesta ordem, só se sobrar tempo):**
11. Mundo 3: `crista` (dominância incompleta) → `escamas` (codominância) → `olhos` (ligado ao X), com cartas, Codex 9–11 e missões M6–M8.
12. Lente de Previsão com quadro de Punnett expandido (visual completo, não só %).
13. Scanner de Genes (usos limitados/moeda).
14. Momentos de "prever e revelar" + perguntas de causa (puláveis no replay).
15. Mais suco (shiny, partículas extras, trilha caprichada).

> Entregue a ETAPA A 100% funcional e bonita antes de tocar na B. Um jogo pequeno e polido > um jogo grande e quebrado.

---

## 12. PERSISTÊNCIA

- Salve coleção, descobertas, Codex, missões e progresso em `localStorage` (chave única, ex.: `mendelitos_save_v1`).
- Carregue ao abrir; salve a cada mudança relevante.
- Botão de "reiniciar progresso" nas configurações (com confirmação).
- *(Obs.: `localStorage` funciona normalmente no Vercel. A restrição de não usar `localStorage` vale só para protótipos dentro do chat do Claude — não é o caso aqui.)*

---

## 13. DEPLOY NO VERCEL VIA GITHUB

1. `git init`, commit inicial, crie um repositório no GitHub e dê `push`.
2. Em vercel.com → **Add New → Project → Import** o repositório do GitHub.
3. **Framework Preset: Vite.** Build command `npm run build`, output `dist`. (O Vercel costuma detectar sozinho.)
4. Deploy. Cada `push` na branch principal redeploya automaticamente — gera um link público pra abrir no projetor e rodar no celular na hora da apresentação.
5. Trabalhe em **branch de feature** por etapa, revise com `/diff`, teste, e só então faça merge na principal.

---

## 14. COMO VOCÊ (CLAUDE CODE) DEVE TRABALHAR

- Antes de codar, confirme o entendimento da seção 4 (genética) — é o que não pode quebrar.
- Trabalhe etapa por etapa (seção 11), em branches, com commits pequenos e mensagens claras.
- Depois de cada etapa, rode `/review` na sua própria saída e verifique: (1) a genética bate com a seção 4? (2) funciona em tela estreita (celular) sem `hover`? (3) os textos estão em PT-BR e iguais à seção 7?
- Mantenha os dados (genes, textos) **separados da lógica** (em `src/data/`), pra ficar fácil ajustar conteúdo depois.
- Use placeholders para as sprites, mas deixe a troca por arquivos do jogador trivial (cada peça lê só uma prop).
- Pergunte se algo da spec estiver ambíguo em vez de inventar genética.
```
```
```
```
```
FIM DO PROMPT.
```