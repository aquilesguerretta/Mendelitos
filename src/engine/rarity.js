// ============================================================================
// rarity.js — Decide se um filhote é "raro" (✨), para o momento especial.
// Recessivos difíceis e combinações somam pontos. Puro/testável.
// ============================================================================

import { phenotype } from './phenotype.js'

export function rarityScore(creature, world = 3) {
  const p = phenotype(creature)
  let s = 0
  if (p.cor === 'verde') s += 1
  if (p.orelhas === 'longas') s += 1
  if (p.padrao === 'manchado') s += 1
  if (world >= 3) {
    if (p.crista === 'rosa') s += 1
    if (p.escamas === 'azul+vermelha') s += 1
    if (p.olhos === 'pequenos') s += p.sexo === 'XX' ? 2 : 1 // fêmea gg é bem mais difícil
  }
  return s
}

// Raro a partir de 2 traços incomuns acumulados.
export function isRare(creature, world = 3) {
  return rarityScore(creature, world) >= 2
}
