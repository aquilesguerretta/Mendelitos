// ============================================================================
// rng.js — utilitários de aleatoriedade e ids. Puro (testável no Node).
// ============================================================================

let _counter = 0

// Id único e estável dentro da sessão.
export function uid(prefix = 'm') {
  _counter += 1
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${Date.now().toString(36)}_${_counter}_${rand}`
}

// Sorteia um dos dois alelos de um par, 50/50.
export function pickOne(par) {
  return par[Math.random() < 0.5 ? 0 : 1]
}

// Sorteio booleano 50/50.
export function coin() {
  return Math.random() < 0.5
}
