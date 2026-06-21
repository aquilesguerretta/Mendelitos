// ===== Áudio via Web Audio API (seção 9) =====
// Efeitos sintetizados + trilha de fundo lo-fi em loop. Tudo controlável por mute.

type SfxName = "pop" | "squeak" | "snap" | "chime" | "ding" | "rare" | "tap";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;
let musicTimer: number | null = null;
let musicStep = 0;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.6;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType,
  vol: number,
  bend?: number,
) {
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (bend) osc.frequency.exponentialRampToValueAtTime(Math.max(1, bend), start + dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

export function playSfx(name: SfxName): void {
  const c = getCtx();
  if (!c || muted) return;
  const t = c.currentTime;
  switch (name) {
    case "pop":
      tone(420, t, 0.12, "sine", 0.5, 880);
      break;
    case "squeak":
      tone(700, t, 0.1, "triangle", 0.4, 1200);
      break;
    case "snap":
      tone(900, t, 0.06, "square", 0.25, 600);
      break;
    case "tap":
      tone(520, t, 0.07, "sine", 0.3, 700);
      break;
    case "chime":
      [523, 659, 784].forEach((f, i) => tone(f, t + i * 0.08, 0.3, "sine", 0.35));
      break;
    case "ding":
      [659, 988].forEach((f, i) => tone(f, t + i * 0.1, 0.35, "triangle", 0.4));
      break;
    case "rare":
      [523, 659, 784, 1047, 1319].forEach((f, i) =>
        tone(f, t + i * 0.09, 0.4, "triangle", 0.4),
      );
      break;
  }
}

// Trilha de fundo: pequena progressão em loop, suave.
const MELODY = [523, 587, 659, 784, 659, 587, 523, 440];
const BASS = [131, 131, 165, 196];

export function startMusic(): void {
  const c = getCtx();
  if (!c || musicTimer !== null) return;
  const beat = 0.42;
  musicStep = 0;
  musicTimer = window.setInterval(() => {
    if (!ctx || muted) return;
    const t = ctx.currentTime + 0.05;
    const m = MELODY[musicStep % MELODY.length];
    tone(m, t, beat * 0.9, "sine", 0.12);
    if (musicStep % 2 === 0) {
      const b = BASS[(musicStep / 2) % BASS.length];
      tone(b, t, beat * 1.6, "triangle", 0.1);
    }
    musicStep++;
  }, beat * 1000);
}

export function stopMusic(): void {
  if (musicTimer !== null) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

export function setMuted(m: boolean): void {
  muted = m;
  if (master && ctx) {
    master.gain.setTargetAtTime(m ? 0 : 0.6, ctx.currentTime, 0.05);
  }
}

export function isMuted(): boolean {
  return muted;
}
