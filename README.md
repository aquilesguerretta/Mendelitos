# 🧬 Mendelitos

> **Crie. Descubra. Colecione.**

Um jogo web fofo onde a **herança genética é a mecânica central**. Você cruza
bichinhos, eles geram filhotes seguindo as **Leis de Mendel de verdade**, e a
aparência de cada filhote *é* o genótipo dele renderizado na tela.

Jogo educativo de Genética (Biomedicina) — a parte educativa está embutida no
loop: cada conceito é explicado **no momento em que você o causa**, em dose
pequena (Cartas de Descoberta), com a explicação longa guardada no **Codex**.

## ✨ O que tem

- **Cruzamento real** com ninhada de 4 filhotes e animação de **segregação**
  (os alelos voam de cada pai e encaixam no filhote).
- **Mundos 1–2:** dominância completa (cor, orelhas, padrão).
- **Mundo 3:** dominância incompleta (crista), codominância (escamas) e
  herança ligada ao X (olhos).
- **Codex** (11 conceitos), **Dex** (catálogo de aparências) e **Missões** (M1–M8).
- **Lente de Previsão** com Quadro de Punnett por gene.
- **Scanner de Genes** (revela o genótipo, custa moeda).
- Responsivo (celular/iPad/PC), 100% por toque, áudio fofo, progresso salvo.

## 🚀 Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (ex.: `http://localhost:5173`).

## 🧪 Provar a genética

```bash
npm run test:engine
```

Verifica dominância/recessividade, 3:1, 9:3:3:1, 1:2:1, codominância e herança
ligada ao X. Deve passar com **0 falhas**.

## ☁️ Deploy no Vercel

1. Faça `push` deste repositório para o GitHub.
2. Em [vercel.com](https://vercel.com) → **Add New → Project → Import** o repo.
3. Preset **Vite** (detectado automaticamente): build `npm run build`, output `dist`.
4. **Deploy.** Cada `push` na branch principal redeploya e gera um link público.

## 🛠️ Stack

Vite · React · Tailwind CSS · framer-motion · Web Audio API · localStorage.

Sem backend. As criaturas são montadas em **camadas de SVG** — cada peça lê só
uma prop, então trocar por sprites depois é trivial.

Veja [`CLAUDE.md`](CLAUDE.md) para a arquitetura e a **regra de ouro** da
corretude genética.
