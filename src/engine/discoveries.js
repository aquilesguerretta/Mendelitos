// ============================================================================
// discoveries.js — Decide quais Cartas de Descoberta e entradas do Codex
// disparam num cruzamento. Puro/testável. (seções 7.2 / 7.3)
//
// Cada carta sobe na 1ª vez que o jogador CAUSA o fenômeno. Aqui só
// avaliamos os gatilhos; a animação/exibição fica na UI.
// ============================================================================

import { phenotype, isHeterozigoto } from './phenotype.js'
import { CARTAS, ORDEM_CARTAS } from '../data/cards.js'

// parents: { mother, father } (já normalizados por sexo)
// litter: array de 4 filhotes
// breedCount: total de cruzamentos JÁ contabilizados (incluindo este)
// world: mundo atual (1..3)
// discovered: Set de ids de cartas já descobertas
export function evaluateDiscoveries({ parents, litter, breedCount, world, discovered }) {
  const { mother, father } = parents
  const novas = []
  const tem = (id) => !discovered.has(id)

  const fenPais = [phenotype(mother), phenotype(father)]
  const fenFilhos = litter.map(phenotype)

  // 🃏 PORTADOR — 1º recessivo (verde) a partir de dois pais roxos.
  if (
    tem('portador') &&
    fenPais.every((p) => p.cor === 'roxo') &&
    fenFilhos.some((p) => p.cor === 'verde')
  ) {
    novas.push('portador')
  }

  // 🃏 A PROPORÇÃO 3:1 — cruzamento Cc × Cc (ambos heterozigotos para cor).
  if (
    tem('ratio31') &&
    isHeterozigoto(mother.genes.cor) &&
    isHeterozigoto(father.genes.cor)
  ) {
    novas.push('ratio31')
  }

  // 🃏 A LEI DA SEGREGAÇÃO — no 2º cruzamento.
  if (tem('segregacao') && breedCount >= 2) {
    novas.push('segregacao')
  }

  // 🃏 DOIS GENES DE UMA VEZ — 1º cruzamento de Mundo 2.
  if (tem('doisGenes') && world >= 2) {
    novas.push('doisGenes')
  }

  // 🃏 ROSA?! — 1º heterozigoto de crista (rosa). Só no Mundo 3.
  if (tem('rosa') && world >= 3 && fenFilhos.some((p) => p.crista === 'rosa')) {
    novas.push('rosa')
  }

  // 🃏 AS DUAS CORES — 1º heterozigoto de escamas (azul+vermelha). Mundo 3.
  if (tem('duasCores') && world >= 3 && fenFilhos.some((p) => p.escamas === 'azul+vermelha')) {
    novas.push('duasCores')
  }

  // 🃏 SÓ NOS MACHOS? — 1º macho de olhos pequenos. Mundo 3.
  if (
    tem('ligadoX') &&
    world >= 3 &&
    fenFilhos.some((p) => p.sexo === 'XY' && p.olhos === 'pequenos')
  ) {
    novas.push('ligadoX')
  }

  // Ordena pela ordem de exibição definida na spec.
  novas.sort((a, b) => ORDEM_CARTAS.indexOf(a) - ORDEM_CARTAS.indexOf(b))

  // Entradas do Codex desbloqueadas por essas cartas...
  const codex = new Set()
  for (const id of novas) {
    for (const n of CARTAS[id].desbloqueia) codex.add(n)
  }
  // ...mais as entradas fundamentais no 1º cruzamento (gene/alelo, dom/rec).
  if (breedCount === 1) {
    codex.add(1)
    codex.add(2)
  }

  return { cards: novas, codex: [...codex].sort((a, b) => a - b) }
}
