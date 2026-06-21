// ============================================================================
// dex.js — Catálogo de fenótipos (Dex). Para cada mundo, enumera todas as
// aparências possíveis (com os genes ativos) e gera uma criatura canônica
// para renderizar cada slot. Puro/testável.
// ============================================================================

import { phenotype } from './phenotype.js'

const OPCOES = {
  cor: ['roxo', 'verde'],
  orelhas: ['curtas', 'longas'],
  padrao: ['liso', 'manchado'],
  crista: ['vermelha', 'rosa', 'branca'],
  escamas: ['azul', 'azul+vermelha', 'vermelha'],
  olhos: ['grandes', 'pequenos'],
}

// Genes que entram na "assinatura" de aparência de cada mundo.
function genesDoMundo(world) {
  if (world <= 1) return ['cor']
  if (world === 2) return ['cor', 'orelhas', 'padrao']
  return ['cor', 'orelhas', 'padrao', 'crista', 'escamas', 'olhos']
}

// Assinatura única da aparência de uma criatura, conforme o mundo.
export function dexKey(creature, world) {
  const p = phenotype(creature)
  return genesDoMundo(world)
    .map((g) => p[g])
    .join('|')
}

// Genótipo canônico que produz um dado fenótipo (para renderizar o slot).
function fenToCreature(fen) {
  const map = {
    cor: { roxo: ['C', 'C'], verde: ['c', 'c'] },
    orelhas: { curtas: ['O', 'O'], longas: ['o', 'o'] },
    padrao: { liso: ['M', 'M'], manchado: ['m', 'm'] },
    crista: { vermelha: ['V', 'V'], rosa: ['V', 'B'], branca: ['B', 'B'] },
    escamas: { azul: ['A', 'A'], 'azul+vermelha': ['A', 'R'], vermelha: ['R', 'R'] },
    olhos: { grandes: ['G', 'G'], pequenos: ['g', 'g'] }, // fêmea canônica
  }
  return {
    id: `dex_${Object.values(fen).join('-')}`,
    sex: 'XX',
    genes: {
      cor: map.cor[fen.cor || 'roxo'],
      orelhas: map.orelhas[fen.orelhas || 'curtas'],
      padrao: map.padrao[fen.padrao || 'liso'],
      crista: map.crista[fen.crista || 'vermelha'],
      escamas: map.escamas[fen.escamas || 'azul'],
      olhos: map.olhos[fen.olhos || 'grandes'],
    },
  }
}

// Produto cartesiano dos genes ativos -> lista de slots da Dex do mundo.
export function allDexSlots(world) {
  const genes = genesDoMundo(world)
  let combos = [{}]
  for (const g of genes) {
    const next = []
    for (const c of combos) {
      for (const v of OPCOES[g]) next.push({ ...c, [g]: v })
    }
    combos = next
  }
  return combos.map((fen) => {
    const creature = fenToCreature(fen)
    return { key: dexKey(creature, world), fen, creature }
  })
}

export function totalDex(world) {
  return allDexSlots(world).length
}
