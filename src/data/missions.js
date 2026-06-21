// ============================================================================
// missions.js — As missões (seção 7.4). Cada missão força o jogador a entender
// a genética por trás. `check(colecao)` é um predicado PURO sobre a coleção.
// Texto PT-BR LITERAL da spec.
// ============================================================================

import { phenotype } from '../engine/phenotype.js'

// Helpers de leitura de fenótipo sobre a coleção.
const algum = (colecao, fn) => colecao.some((c) => fn(phenotype(c), c))
const contar = (colecao, fn) => colecao.filter((c) => fn(phenotype(c), c)).length

export const MISSOES = [
  {
    id: 'M1',
    world: 1,
    texto: 'Faça nascer seu primeiro Mendelito verde.',
    conceito: 'recessivo / portador',
    recompensa: { moeda: 2 },
    bonus: false,
    check: (col) => algum(col, (p) => p.cor === 'verde'),
  },
  {
    id: 'M2',
    world: 1,
    texto: 'Tenha 3 Mendelitos verdes na coleção ao mesmo tempo.',
    conceito: 'reforço de recessivo',
    recompensa: { moeda: 3 },
    bonus: false,
    check: (col) => contar(col, (p) => p.cor === 'verde') >= 3,
  },
  {
    id: 'M3',
    world: 2,
    texto: 'Crie um Mendelito de orelhas longas.',
    conceito: '2º recessivo',
    recompensa: { moeda: 3 },
    bonus: false,
    check: (col) => algum(col, (p) => p.orelhas === 'longas'),
  },
  {
    id: 'M4',
    world: 2,
    texto: 'Crie um Mendelito verde de orelhas longas.',
    conceito: 'di-híbrido (dois recessivos)',
    recompensa: { moeda: 4 },
    bonus: false,
    check: (col) => algum(col, (p) => p.cor === 'verde' && p.orelhas === 'longas'),
  },
  {
    id: 'M5',
    world: 2,
    texto: 'Crie um Mendelito verde, de orelhas longas e manchado.',
    conceito: 'três recessivos juntos',
    recompensa: { moeda: 6 },
    bonus: false,
    check: (col) =>
      algum(col, (p) => p.cor === 'verde' && p.orelhas === 'longas' && p.padrao === 'manchado'),
  },
  {
    id: 'M6',
    world: 3,
    texto: 'Crie um Mendelito de crista rosa.',
    conceito: 'dominância incompleta',
    recompensa: { moeda: 5 },
    bonus: true,
    check: (col) => algum(col, (p) => p.crista === 'rosa'),
  },
  {
    id: 'M7',
    world: 3,
    texto: 'Crie um Mendelito com escamas azuis e vermelhas.',
    conceito: 'codominância',
    recompensa: { moeda: 5 },
    bonus: true,
    check: (col) => algum(col, (p) => p.escamas === 'azul+vermelha'),
  },
  {
    id: 'M8',
    world: 3,
    texto: 'Crie uma fêmea de olhos pequenos.',
    conceito: 'ligado ao X (mais difícil que o macho)',
    recompensa: { moeda: 8 },
    bonus: true,
    check: (col) => algum(col, (p) => p.sexo === 'XX' && p.olhos === 'pequenos'),
  },
]

export const MISSOES_POR_ID = Object.fromEntries(MISSOES.map((m) => [m.id, m]))
export const ORDEM_MISSOES = MISSOES.map((m) => m.id)
