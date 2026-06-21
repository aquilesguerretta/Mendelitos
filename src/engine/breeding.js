// ============================================================================
// breeding.js — Algoritmo de cruzamento / segregação. (seção 4.3 da spec)
//
// Puro (testável no Node). NÃO ALTERAR as regras de segregação sem conferir a
// seção 4.3. Cada filhote recebe UM alelo de cada pai por gene autossômico;
// o gene `olhos` é ligado ao X (ver abaixo).
// ============================================================================

import { uid, pickOne, coin } from './rng.js'
import { GENES_AUTOSSOMICOS } from '../data/genes.js'

// Garante mãe=XX e pai=XY independom da ordem em que vieram (conveniência da UI).
export function normalizePair(a, b) {
  if (a.sex === 'XX' && b.sex === 'XY') return { mother: a, father: b }
  if (a.sex === 'XY' && b.sex === 'XX') return { mother: b, father: a }
  return null // par inválido (mesmo sexo)
}

// Cruza UMA mãe (XX) × UM pai (XY) e devolve uma ninhada de 4 filhotes.
// Cada filhote inclui `trace`: a origem de cada alelo, para a animação de
// segregação (a parte educativa central). O `trace` é puramente cosmético —
// os testes só conferem `genes` e `sex`.
export function breed(mother, father) {
  if (mother.sex !== 'XX' || father.sex !== 'XY') {
    throw new Error('breed espera mother XX e father XY (use normalizePair).')
  }

  const litter = []
  for (let i = 0; i < 4; i++) {
    // Sexo: a mãe sempre dá um X; o pai dá X (filha) ou Y (filho), 50/50.
    const fromFather = coin() ? 'X' : 'Y'
    const sex = fromFather === 'X' ? 'XX' : 'XY'

    const genes = {}
    const trace = { sexFromFather: fromFather }

    // Genes autossômicos: um alelo de cada pai, 50/50, independente por gene.
    for (const g of GENES_AUTOSSOMICOS) {
      const m = pickOne(mother.genes[g])
      const f = pickOne(father.genes[g])
      genes[g] = [m, f]
      trace[g] = { fromMother: m, fromFather: f }
    }

    // Gene ligado ao X (`olhos`):
    //  - a mãe sempre contribui um dos seus 2 alelos (50/50);
    //  - filha (XX) recebe também o alelo do ÚNICO X do pai -> 2 alelos;
    //  - filho (XY) recebe o Y do pai (sem alelo de olhos do pai) -> 1 alelo, só da mãe.
    const momX = pickOne(mother.genes.olhos)
    if (sex === 'XX') {
      const dadX = father.genes.olhos[0]
      genes.olhos = [momX, dadX]
      trace.olhos = { fromMother: momX, fromFather: dadX }
    } else {
      genes.olhos = [momX]
      trace.olhos = { fromMother: momX, fromFather: null }
    }

    litter.push({ id: uid('f'), sex, genes, trace, geracao: 'filhote' })
  }
  return litter
}

// Versão "limpa" para guardar na coleção (sem o trace de animação).
export function semTrace(creature) {
  const { trace, ...resto } = creature
  return resto
}
