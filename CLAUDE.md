# CLAUDE.md — Mendelitos

Jogo web educativo de **Genética** (Leis de Mendel). O jogador cruza criaturas
fofas e os filhotes seguem as Leis de Mendel **de verdade** — a aparência de
cada filhote *é* o genótipo dele renderizado na tela.

## Stack

- **Vite + React (JavaScript/JSX)**
- **Tailwind CSS** (config com a paleta travada da spec — `tailwind.config.js`)
- Criaturas montadas em **camadas de SVG** (componentes React), não imagens.
- **framer-motion** para a animação de segregação.
- **Sem backend.** Progresso em `localStorage` (`mendelitos_save_v1`).
- Áudio sintetizado via **Web Audio API** (`src/audio/sfx.js`).
- Deploy: **Vercel via GitHub** (preset Vite, build `npm run build`, output `dist`).

## Estrutura de pastas

```
src/
  data/      genes, cards, codex, missions, strings  (CONTEÚDO — separado da lógica)
  engine/    breeding, phenotype, rng, discoveries, rarity, dex, save, starters  (LÓGICA pura)
  audio/     sfx.js (Web Audio)
  components/ Creature/ (Body, Ears, Pattern, Crest, Scales, Eyes), Codex, Dex,
             Missions, PredictionLens, DiscoveryCard, Segregation, Egg, Toasts, ...
  screens/   TitleScreen, Lab, BreedScreen
  state/     GameContext.jsx (estado global + reducer + persistência)
  App.jsx, main.jsx, index.css
scripts/
  engine.test.mjs   // prova de corretude da genética — `npm run test:engine`
```

## Modelo de dados (criatura)

```js
creature = {
  id, sex: 'XX' | 'XY',
  genes: {
    cor: ['C','c'], orelhas: ['O','o'], padrao: ['M','m'],   // Mundos 1–2 (dominância completa)
    crista: ['V','B'],   // Mundo 3 — dominância incompleta (VV vermelha, VB rosa, BB branca)
    escamas: ['A','R'],  // Mundo 3 — codominância (AA azul, AR azul+vermelha, RR vermelha)
    olhos: ['G','g'] | ['G'], // Mundo 3 — ligado ao X: 2 alelos se XX, 1 se XY
  },
  nickname?
}
```

Toda criatura carrega **todos** os genes desde o início (herança silenciosa). O
`mundo` só controla o que é **exibido/desbloqueado** (`genesAtivos`), nunca a
genética em si.

## REGRA DE OURO — não quebrar a corretude genética (seção 4 da spec)

A genética é **inegociável**. As regras vivem em:

- `src/engine/phenotype.js` — genótipo → fenótipo (tabelas 4.1/4.2).
- `src/engine/breeding.js` — segregação (4.3): cada filhote recebe **um** alelo
  de cada pai por gene autossômico; `olhos` é ligado ao X (filho macho herda só
  da mãe; filha recebe o X do pai).

**Sempre** que mexer em genética, rode `npm run test:engine`. O teste prova:
dominância/recessividade, 3:1 (Cc×Cc), 9:3:3:1 (di-híbrido), 1:2:1 (incompleta),
codominância, e a herança ligada ao X (invariantes de comprimento de alelos e
origem dos alelos). Tudo deve passar (0 falhas).

## Comandos

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção (`dist/`)
- `npm run preview` — servir o build
- `npm run test:engine` — provar a corretude da genética
