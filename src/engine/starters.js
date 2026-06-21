// ============================================================================
// starters.js — O par inicial de Mendelitos (Adão & Eva).
//
// Ambos são PORTADORES de tudo (heterozigotos), para que o jogador descubra
// recessivos logo no 1º cruzamento (Cc × Cc -> pode nascer verde) — é a porta
// de entrada pedagógica. Por fora parecem roxos comuns, mas guardam segredos.
// ============================================================================

import { uid } from './rng.js'

export function makeStarterPair() {
  const mother = {
    id: uid('starter'),
    sex: 'XX',
    nickname: 'Lila',
    geracao: 'fundador',
    genes: {
      cor: ['C', 'c'],
      orelhas: ['O', 'o'],
      padrao: ['M', 'm'],
      crista: ['V', 'B'],
      escamas: ['A', 'R'],
      olhos: ['G', 'g'], // fêmea: 2 alelos (portadora)
    },
  }
  const father = {
    id: uid('starter'),
    sex: 'XY',
    nickname: 'Tito',
    geracao: 'fundador',
    genes: {
      cor: ['C', 'c'],
      orelhas: ['O', 'o'],
      padrao: ['M', 'm'],
      crista: ['V', 'B'],
      escamas: ['A', 'R'],
      olhos: ['G'], // macho: 1 alelo (no único X)
    },
  }
  return [mother, father]
}
