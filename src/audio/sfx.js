// ============================================================================
// sfx.js — Áudio via Web Audio API (seção 9). Efeitos sintetizados (sem
// arquivos) + uma trilha de fundo fofa em loop. Tudo respeita o mute.
//
// O AudioContext só é criado após o 1º gesto do usuário (política dos
// navegadores). Chame Sfx.unlock() num clique inicial.
// ============================================================================

let ctx = null
let masterGain = null
let muted = false

// Trilha de fundo
let musicGain = null
let musicTimer = null
let musicStep = 0

function ensureCtx() {
  if (ctx) return ctx
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    masterGain = ctx.createGain()
    masterGain.gain.value = muted ? 0 : 0.9
    masterGain.connect(ctx.destination)
  } catch {
    ctx = null
  }
  return ctx
}

// Toca um tom simples com envelope.
function tone({ freq = 440, dur = 0.15, type = 'sine', vol = 0.2, when = 0, slideTo = null, dest = null }) {
  const c = ensureCtx()
  if (!c) return
  const t0 = c.currentTime + when
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(dest || masterGain)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function chord(freqs, opts = {}) {
  freqs.forEach((f, i) => tone({ freq: f, when: (opts.stagger || 0) * i, ...opts, freq: f }))
}

export const Sfx = {
  unlock() {
    const c = ensureCtx()
    if (c && c.state === 'suspended') c.resume()
  },

  setMuted(v) {
    muted = !!v
    if (masterGain) masterGain.gain.value = muted ? 0 : 0.9
    if (musicGain) musicGain.gain.value = muted ? 0 : 0.06
  },

  // --- Efeitos ---
  click() {
    tone({ freq: 520, dur: 0.06, type: 'triangle', vol: 0.12 })
  },
  snap() {
    // alelos encaixando
    tone({ freq: 300, dur: 0.05, type: 'square', vol: 0.12, slideTo: 600 })
  },
  pop() {
    // ovo chocando
    tone({ freq: 200, dur: 0.18, type: 'sine', vol: 0.25, slideTo: 700 })
    tone({ freq: 500, dur: 0.12, type: 'triangle', vol: 0.12, when: 0.04 })
  },
  squeak() {
    tone({ freq: 700, dur: 0.1, type: 'sine', vol: 0.18, slideTo: 1100 })
  },
  chime() {
    // descoberta
    chord([523, 659, 784], { dur: 0.5, type: 'sine', vol: 0.16, stagger: 0.07 })
  },
  ding() {
    // dex / missão
    tone({ freq: 880, dur: 0.25, type: 'sine', vol: 0.2 })
    tone({ freq: 1320, dur: 0.35, type: 'sine', vol: 0.12, when: 0.08 })
  },
  raro() {
    // som especial do raro
    const seq = [659, 784, 988, 1319, 1568]
    seq.forEach((f, i) => tone({ freq: f, dur: 0.18, type: 'triangle', vol: 0.16, when: i * 0.07 }))
  },
  heart() {
    tone({ freq: 440, dur: 0.12, type: 'sine', vol: 0.1, slideTo: 660 })
  },

  // --- Trilha de fundo (loop fofo) ---
  startMusic() {
    const c = ensureCtx()
    if (!c || musicTimer) return
    musicGain = c.createGain()
    musicGain.gain.value = muted ? 0 : 0.06
    musicGain.connect(c.destination)

    // progressão suave em Lá maior pentatônica
    const notas = [440, 554, 659, 554, 494, 587, 659, 880]
    const baixos = [220, 220, 247, 294]
    musicStep = 0
    const passo = () => {
      const f = notas[musicStep % notas.length]
      tone({ freq: f, dur: 0.42, type: 'triangle', vol: 0.5, dest: musicGain })
      if (musicStep % 2 === 0) {
        tone({
          freq: baixos[(musicStep / 2) % baixos.length],
          dur: 0.8,
          type: 'sine',
          vol: 0.5,
          dest: musicGain,
        })
      }
      musicStep += 1
    }
    passo()
    musicTimer = setInterval(passo, 480)
  },
  stopMusic() {
    if (musicTimer) {
      clearInterval(musicTimer)
      musicTimer = null
    }
  },
}
