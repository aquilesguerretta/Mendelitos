// ============================================================================
// engine.test.mjs — prova de corretude da genética (seção 4 da spec).
// Roda no Node puro:  node scripts/engine.test.mjs   (ou npm run test:engine)
// ============================================================================

import {
  phenotype,
  fenotipoCor,
  fenotipoOrelhas,
  fenotipoPadrao,
  fenotipoCrista,
  fenotipoEscamas,
  fenotipoOlhos,
} from '../src/engine/phenotype.js'
import { breed } from '../src/engine/breeding.js'
import { evaluateDiscoveries } from '../src/engine/discoveries.js'
import { allDexSlots, totalDex, dexKey } from '../src/engine/dex.js'
import { isRare } from '../src/engine/rarity.js'

let passes = 0
let fails = 0
function assert(cond, msg) {
  if (cond) {
    passes += 1
  } else {
    fails += 1
    console.error('  ✗ FALHOU:', msg)
  }
}
function approx(actual, expected, tol, msg) {
  const ok = Math.abs(actual - expected) <= tol
  assert(ok, `${msg} (esperado ~${expected}±${tol}, obteve ${actual.toFixed(4)})`)
}

console.log('— 4.1/4.2 Genótipo -> Fenótipo (exaustivo) —')

// cor
assert(fenotipoCor(['C', 'C']) === 'roxo', 'CC->roxo')
assert(fenotipoCor(['C', 'c']) === 'roxo', 'Cc->roxo')
assert(fenotipoCor(['c', 'C']) === 'roxo', 'cC->roxo (ordem)')
assert(fenotipoCor(['c', 'c']) === 'verde', 'cc->verde')

// orelhas
assert(fenotipoOrelhas(['O', 'O']) === 'curtas', 'OO->curtas')
assert(fenotipoOrelhas(['O', 'o']) === 'curtas', 'Oo->curtas')
assert(fenotipoOrelhas(['o', 'o']) === 'longas', 'oo->longas')

// padrao
assert(fenotipoPadrao(['M', 'M']) === 'liso', 'MM->liso')
assert(fenotipoPadrao(['M', 'm']) === 'liso', 'Mm->liso')
assert(fenotipoPadrao(['m', 'm']) === 'manchado', 'mm->manchado')

// crista — dominância incompleta (1:2:1)
assert(fenotipoCrista(['V', 'V']) === 'vermelha', 'VV->vermelha')
assert(fenotipoCrista(['V', 'B']) === 'rosa', 'VB->rosa')
assert(fenotipoCrista(['B', 'V']) === 'rosa', 'BV->rosa (ordem)')
assert(fenotipoCrista(['B', 'B']) === 'branca', 'BB->branca')

// escamas — codominância (as duas inteiras, nunca roxo)
assert(fenotipoEscamas(['A', 'A']) === 'azul', 'AA->azul')
assert(fenotipoEscamas(['A', 'R']) === 'azul+vermelha', 'AR->azul+vermelha')
assert(fenotipoEscamas(['R', 'A']) === 'azul+vermelha', 'RA->azul+vermelha (ordem)')
assert(fenotipoEscamas(['R', 'R']) === 'vermelha', 'RR->vermelha')

// olhos — ligado ao X
assert(fenotipoOlhos(['G', 'G'], 'XX') === 'grandes', 'fêmea GG->grandes')
assert(fenotipoOlhos(['G', 'g'], 'XX') === 'grandes', 'fêmea Gg->grandes (portadora)')
assert(fenotipoOlhos(['g', 'G'], 'XX') === 'grandes', 'fêmea gG->grandes (ordem)')
assert(fenotipoOlhos(['g', 'g'], 'XX') === 'pequenos', 'fêmea gg->pequenos')
assert(fenotipoOlhos(['G'], 'XY') === 'grandes', 'macho G->grandes')
assert(fenotipoOlhos(['g'], 'XY') === 'pequenos', 'macho g->pequenos (um alelo já se manifesta)')

console.log(`  ${passes} ok até aqui.`)

// ---------------------------------------------------------------------------
// 4.3 — Segregação (estatística + invariantes)
// ---------------------------------------------------------------------------
console.log('— 4.3 Segregação (estatística sobre muitas ninhadas) —')

function criatura(sex, genes) {
  return { id: 'x', sex, genes }
}

// Pais portadores em tudo, para testar todos os genes de uma vez.
const mae = criatura('XX', {
  cor: ['C', 'c'],
  orelhas: ['O', 'o'],
  padrao: ['M', 'm'],
  crista: ['V', 'B'],
  escamas: ['A', 'R'],
  olhos: ['G', 'g'],
})
const pai = criatura('XY', {
  cor: ['C', 'c'],
  orelhas: ['O', 'o'],
  padrao: ['M', 'm'],
  crista: ['V', 'B'],
  escamas: ['A', 'R'],
  olhos: ['G'],
})

const N = 50000
let nXX = 0
let nXY = 0
let roxo = 0
let verde = 0
let machoOlhosVindoDaMae = 0
let machos = 0
let filhasComXdoPai = 0
let filhas = 0
let invariantesOk = true
let traceOk = true

// di-híbrido cor×orelhas (9:3:3:1)
let roxoCurta = 0
let roxoLonga = 0
let verdeCurta = 0
let verdeLonga = 0

for (let i = 0; i < N; i++) {
  const litter = breed(mae, pai)
  for (const f of litter) {
    // invariantes de comprimento
    for (const g of ['cor', 'orelhas', 'padrao', 'crista', 'escamas']) {
      if (f.genes[g].length !== 2) invariantesOk = false
    }
    if (f.sex === 'XX' && f.genes.olhos.length !== 2) invariantesOk = false
    if (f.sex === 'XY' && f.genes.olhos.length !== 1) invariantesOk = false

    // trace consistente com os genes
    if (f.genes.cor[0] !== f.trace.cor.fromMother || f.genes.cor[1] !== f.trace.cor.fromFather) {
      traceOk = false
    }

    // sexo
    if (f.sex === 'XX') nXX++
    else nXY++

    // cor 3:1
    const ph = phenotype(f)
    if (ph.cor === 'roxo') roxo++
    else verde++

    // di-híbrido
    if (ph.cor === 'roxo' && ph.orelhas === 'curtas') roxoCurta++
    else if (ph.cor === 'roxo' && ph.orelhas === 'longas') roxoLonga++
    else if (ph.cor === 'verde' && ph.orelhas === 'curtas') verdeCurta++
    else verdeLonga++

    // X-linked: filho herda olhos só da mãe; filha herda o X do pai (['G'][0]='G')
    if (f.sex === 'XY') {
      machos++
      if (mae.genes.olhos.includes(f.genes.olhos[0])) machoOlhosVindoDaMae++
    } else {
      filhas++
      if (f.genes.olhos[1] === pai.genes.olhos[0]) filhasComXdoPai++
    }
  }
}

const total = N * 4
approx(nXX / total, 0.5, 0.02, 'proporção de fêmeas ~50%')
approx(nXY / total, 0.5, 0.02, 'proporção de machos ~50%')
approx(roxo / total, 0.75, 0.02, 'Cc×Cc -> ~3/4 roxo (3:1)')
approx(verde / total, 0.25, 0.02, 'Cc×Cc -> ~1/4 verde (3:1)')
assert(invariantesOk, 'invariantes de comprimento de alelos (XX olhos=2, XY olhos=1, autossômicos=2)')
assert(traceOk, 'trace de segregação bate com os alelos herdados')
assert(machoOlhosVindoDaMae === machos, 'TODO macho herda o alelo de olhos exclusivamente da mãe')
assert(filhasComXdoPai === filhas, 'TODA filha recebe o alelo de olhos do único X do pai')

// di-híbrido 9:3:3:1 (tolerância maior)
approx(roxoCurta / total, 9 / 16, 0.02, 'di-híbrido roxo+curtas ~9/16')
approx(roxoLonga / total, 3 / 16, 0.02, 'di-híbrido roxo+longas ~3/16')
approx(verdeCurta / total, 3 / 16, 0.02, 'di-híbrido verde+curtas ~3/16')
approx(verdeLonga / total, 1 / 16, 0.015, 'di-híbrido verde+longas ~1/16')

// ---------------------------------------------------------------------------
// Gatilhos de descoberta (cartas + codex) — determinístico
// ---------------------------------------------------------------------------
console.log('— Gatilhos de Cartas de Descoberta / Codex —')

const DEF = {
  cor: ['C', 'c'], orelhas: ['O', 'o'], padrao: ['M', 'm'],
  crista: ['V', 'B'], escamas: ['A', 'R'], olhos: ['G', 'g'],
}
function mk(sex, over = {}) {
  const genes = { ...DEF, ...over }
  if (sex === 'XY' && genes.olhos.length === 2) genes.olhos = [genes.olhos[0]]
  return { id: 'x', sex, genes }
}
function evalDisc(parents, litter, breedCount, world, discovered = []) {
  return evaluateDiscoveries({
    parents,
    litter,
    breedCount,
    world,
    discovered: new Set(discovered),
  })
}

// portador + ratio31 (pais Cc roxos -> filho cc verde), 1º cruzamento
{
  const mae = mk('XX', { cor: ['C', 'c'] })
  const pai = mk('XY', { cor: ['C', 'c'] })
  const litter = [mk('XX', { cor: ['c', 'c'] }), mk('XY', { cor: ['C', 'c'] })]
  const d = evalDisc({ mother: mae, father: pai }, litter, 1, 1)
  assert(d.cards.includes('portador'), 'portador dispara (verde de dois roxos)')
  assert(d.cards.includes('ratio31'), 'ratio31 dispara (Cc × Cc)')
  assert([1, 2, 3, 4, 5].every((n) => d.codex.includes(n)), 'portador desbloqueia codex 1–5')
  assert(d.codex.includes(7), 'ratio31 desbloqueia codex 7')
}

// sem ratio31 quando não é Cc × Cc; sem portador sem verde
{
  const mae = mk('XX', { cor: ['C', 'C'] })
  const pai = mk('XY', { cor: ['c', 'c'] })
  const litter = [mk('XX', { cor: ['C', 'c'] })]
  const d = evalDisc({ mother: mae, father: pai }, litter, 1, 1)
  assert(!d.cards.includes('ratio31'), 'ratio31 NÃO dispara se algum pai é homozigoto')
  assert(!d.cards.includes('portador'), 'portador NÃO dispara sem filho verde')
}

// segregacao no 2º cruzamento
{
  const d = evalDisc({ mother: mk('XX'), father: mk('XY') }, [mk('XX')], 2, 1)
  assert(d.cards.includes('segregacao'), 'segregacao dispara no 2º cruzamento')
  assert(d.codex.includes(6), 'segregacao desbloqueia codex 6')
}

// doisGenes a partir do mundo 2
{
  const d = evalDisc({ mother: mk('XX'), father: mk('XY') }, [mk('XX')], 5, 2, ['segregacao'])
  assert(d.cards.includes('doisGenes'), 'doisGenes dispara no mundo 2')
  assert(d.codex.includes(8), 'doisGenes desbloqueia codex 8')
}

// rosa / duasCores / ligadoX só no mundo 3
{
  const mae = mk('XX', { crista: ['V', 'B'], escamas: ['A', 'R'], olhos: ['G', 'g'] })
  const pai = mk('XY', { crista: ['V', 'B'], escamas: ['A', 'R'], olhos: ['G'] })
  const litter = [
    mk('XX', { crista: ['V', 'B'], escamas: ['A', 'R'] }), // rosa + azul+vermelha
    mk('XY', { olhos: ['g'] }), // macho olhos pequenos
  ]
  const jaVistos = ['segregacao', 'doisGenes', 'portador', 'ratio31']
  // mundo 2: nenhum dos três world-3 deve disparar
  const d2 = evalDisc({ mother: mae, father: pai }, litter, 7, 2, jaVistos)
  assert(!d2.cards.includes('rosa') && !d2.cards.includes('duasCores') && !d2.cards.includes('ligadoX'),
    'cartas de mundo 3 NÃO disparam fora do mundo 3')
  // mundo 3: os três disparam
  const d3 = evalDisc({ mother: mae, father: pai }, litter, 7, 3, jaVistos)
  assert(d3.cards.includes('rosa'), 'rosa dispara (crista VB no mundo 3)')
  assert(d3.cards.includes('duasCores'), 'duasCores dispara (escamas AR no mundo 3)')
  assert(d3.cards.includes('ligadoX'), 'ligadoX dispara (macho olhos pequenos no mundo 3)')
  assert([9, 10, 11].every((n) => d3.codex.includes(n)), 'mundo 3 desbloqueia codex 9–11')
  // já vistos não disparam de novo
  const d4 = evalDisc({ mother: mae, father: pai }, litter, 8, 3, [...jaVistos, 'rosa', 'duasCores', 'ligadoX'])
  assert(d4.cards.length === 0, 'cartas já vistas não disparam de novo')
}

// ---------------------------------------------------------------------------
// Dex e raridade
// ---------------------------------------------------------------------------
console.log('— Dex e raridade —')
assert(totalDex(1) === 2, 'Dex mundo 1 = 2 aparências (roxo/verde)')
assert(totalDex(2) === 8, 'Dex mundo 2 = 8 aparências (2×2×2)')
assert(totalDex(3) === 144, 'Dex mundo 3 = 144 aparências (2×2×2×3×3×2)')
{
  const slots = allDexSlots(2)
  const chaves = new Set(slots.map((s) => s.key))
  assert(chaves.size === 8, 'todas as chaves da Dex mundo 2 são únicas')
  // a criatura canônica de cada slot reproduz a chave do slot
  const ok = slots.every((s) => dexKey(s.creature, 2) === s.key)
  assert(ok, 'criatura canônica de cada slot reproduz sua aparência')
}
assert(isRare(mk('XX', { cor: ['c', 'c'], orelhas: ['o', 'o'] }), 3) === true, 'verde+longa é raro')
// criatura totalmente comum (todos os traços dominantes/comuns)
const comum = mk('XX', {
  cor: ['C', 'C'], orelhas: ['O', 'O'], padrao: ['M', 'M'],
  crista: ['V', 'V'], escamas: ['A', 'A'], olhos: ['G', 'G'],
})
assert(isRare(comum, 3) === false, 'roxo comum (tudo dominante) não é raro')
assert(isRare(mk('XX', { olhos: ['g', 'g'], crista: ['V', 'V'], escamas: ['A', 'A'] }), 3) === true, 'fêmea olhos pequenos é rara')

console.log('')
console.log('============================================')
console.log(`RESULTADO: ${passes} passaram, ${fails} falharam.`)
console.log('============================================')
process.exit(fails === 0 ? 0 : 1)
