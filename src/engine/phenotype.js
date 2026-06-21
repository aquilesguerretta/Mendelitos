// ============================================================================
// phenotype.js — Genótipo -> Fenótipo. (seção 4.4 da spec)
//
// Esta função é PURA e não depende de React/navegador, então pode ser testada
// direto no Node (ver scripts/engine.test.mjs). NÃO ALTERAR as regras sem
// conferir a seção 4 da spec — a corretude biológica é inegociável.
// ============================================================================

// Conta quantas vezes um alelo aparece no par (ordem não importa).
function tem(par, alelo) {
  return par.indexOf(alelo) !== -1
}

// --- Genes de dominância completa (Mundos 1–2) -----------------------------

// cor: CC->roxo, Cc->roxo, cc->verde
export function fenotipoCor(par) {
  return tem(par, 'C') ? 'roxo' : 'verde'
}

// orelhas: OO->curtas, Oo->curtas, oo->longas
export function fenotipoOrelhas(par) {
  return tem(par, 'O') ? 'curtas' : 'longas'
}

// padrao: MM->liso, Mm->liso, mm->manchado
export function fenotipoPadrao(par) {
  return tem(par, 'M') ? 'liso' : 'manchado'
}

// --- Genes avançados (Mundo 3) ---------------------------------------------

// crista — DOMINÂNCIA INCOMPLETA: VV->vermelha, VB->rosa, BB->branca (1:2:1)
export function fenotipoCrista(par) {
  const v = (par[0] === 'V' ? 1 : 0) + (par[1] === 'V' ? 1 : 0)
  if (v === 2) return 'vermelha'
  if (v === 1) return 'rosa' // heterozigoto = meio-termo
  return 'branca'
}

// escamas — CODOMINÂNCIA: AA->azul, AR->azul+vermelha (as duas inteiras), RR->vermelha
export function fenotipoEscamas(par) {
  const temA = tem(par, 'A')
  const temR = tem(par, 'R')
  if (temA && temR) return 'azul+vermelha' // NÃO misturar em roxo
  if (temA) return 'azul'
  return 'vermelha'
}

// olhos — LIGADO AO X.
//  Fêmea (XX) tem 2 alelos: GG/Gg -> grandes (Gg = portadora), gg -> pequenos.
//  Macho (XY) tem 1 alelo:  G -> grandes, g -> pequenos (um único alelo já se manifesta).
export function fenotipoOlhos(par, sexo) {
  if (sexo === 'XY') {
    // Um único alelo (vindo da mãe).
    return par[0] === 'G' ? 'grandes' : 'pequenos'
  }
  // Fêmea: dois alelos, G dominante.
  return tem(par, 'G') ? 'grandes' : 'pequenos'
}

// --- Fenótipo completo ------------------------------------------------------

// Retorna o que renderizar em cada camada. Sempre calcula tudo; o que é
// EXIBIDO depende do mundo (ver genesAtivos / componente <Creature>).
export function phenotype(creature) {
  const g = creature.genes
  return {
    cor: fenotipoCor(g.cor),
    orelhas: fenotipoOrelhas(g.orelhas),
    padrao: fenotipoPadrao(g.padrao),
    crista: fenotipoCrista(g.crista),
    escamas: fenotipoEscamas(g.escamas),
    olhos: fenotipoOlhos(g.olhos, creature.sex),
    sexo: creature.sex,
  }
}

// Genótipo de um gene como string legível: ['C','c'] -> "Cc".
// Para crista/escamas, ordena alelos de forma canônica para leitura estável.
const ORDEM_CANONICA = {
  cor: ['C', 'c'],
  orelhas: ['O', 'o'],
  padrao: ['M', 'm'],
  crista: ['V', 'B'],
  escamas: ['A', 'R'],
  olhos: ['G', 'g'],
}

export function genotipoStr(par, geneKey) {
  const ordem = ORDEM_CANONICA[geneKey]
  if (!ordem || par.length < 2) return par.join('')
  return [...par]
    .sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b))
    .join('')
}

// Heterozigoto? (dois alelos diferentes). Para olhos só vale em fêmeas.
export function isHeterozigoto(par) {
  return par.length === 2 && par[0] !== par[1]
}
