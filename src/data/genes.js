// ============================================================================
// genes.js — Definição dos genes, alelos e metadados.
//
// REGRA DE OURO (seção 4 da spec): a corretude biológica é inegociável.
// Este arquivo só DESCREVE os genes (rótulos, alelos, mundo, tipo de herança).
// O mapeamento genótipo -> fenótipo vive em src/engine/phenotype.js e o
// cruzamento em src/engine/breeding.js. Não duplique a lógica aqui.
//
// Convenção: MAIÚSCULA = dominante, minúscula = recessivo (genes de
// dominância completa). Em crista (dominância incompleta) e escamas
// (codominância) não há "vencedor": ver phenotype.js.
// ============================================================================

// Tipos de herança (para textos da Lente/Codex)
export const HERANCA = {
  COMPLETA: 'dominancia-completa',
  INCOMPLETA: 'dominancia-incompleta',
  CODOMINANCIA: 'codominancia',
  X_LINKED: 'ligado-ao-x',
}

// Cada gene: chave interna, rótulo PT-BR, mundo em que é introduzido,
// tipo de herança, e os alelos com seus rótulos/cores de fenótipo.
export const GENES = {
  cor: {
    key: 'cor',
    label: 'Cor',
    world: 1,
    autossomico: true,
    heranca: HERANCA.COMPLETA,
    dominante: 'C',
    alelos: ['C', 'c'],
    rotuloAlelo: { C: 'roxo (C)', c: 'verde (c)' },
  },
  orelhas: {
    key: 'orelhas',
    label: 'Orelhas',
    world: 2,
    autossomico: true,
    heranca: HERANCA.COMPLETA,
    dominante: 'O',
    alelos: ['O', 'o'],
    rotuloAlelo: { O: 'curtas (O)', o: 'longas (o)' },
  },
  padrao: {
    key: 'padrao',
    label: 'Padrão',
    world: 2,
    autossomico: true,
    heranca: HERANCA.COMPLETA,
    dominante: 'M',
    alelos: ['M', 'm'],
    rotuloAlelo: { M: 'liso (M)', m: 'manchado (m)' },
  },
  crista: {
    key: 'crista',
    label: 'Crista',
    world: 3,
    autossomico: true,
    heranca: HERANCA.INCOMPLETA,
    dominante: null, // sem dominância
    alelos: ['V', 'B'],
    rotuloAlelo: { V: 'vermelha (V)', B: 'branca (B)' },
  },
  escamas: {
    key: 'escamas',
    label: 'Escamas',
    world: 3,
    autossomico: true,
    heranca: HERANCA.CODOMINANCIA,
    dominante: null, // codominância
    alelos: ['A', 'R'],
    rotuloAlelo: { A: 'azul (A)', R: 'vermelha (R)' },
  },
  olhos: {
    key: 'olhos',
    label: 'Olhos',
    world: 3,
    autossomico: false, // ligado ao X
    heranca: HERANCA.X_LINKED,
    dominante: 'G',
    alelos: ['G', 'g'],
    rotuloAlelo: { G: 'grandes (G)', g: 'pequenos (g)' },
  },
}

// Ordem de empilhamento/leitura
export const GENE_KEYS = ['cor', 'orelhas', 'padrao', 'crista', 'escamas', 'olhos']

// Genes autossômicos (segregam igual nos dois sexos)
export const GENES_AUTOSSOMICOS = ['cor', 'orelhas', 'padrao', 'crista', 'escamas']

// Quais genes "aparecem" (são renderizados/variam) em cada mundo.
// Internamente TODA criatura carrega todos os genes desde o início
// (herança silenciosa); o mundo só controla o que é exibido/desbloqueado.
export const GENES_POR_MUNDO = {
  1: ['cor'],
  2: ['cor', 'orelhas', 'padrao'],
  3: ['cor', 'orelhas', 'padrao', 'crista', 'escamas', 'olhos'],
}

export function genesAtivos(mundo) {
  return GENES_POR_MUNDO[Math.max(1, Math.min(3, mundo))] || GENES_POR_MUNDO[1]
}

// Nomes dos mundos (para a mensagem "Novo mundo desbloqueado")
export const MUNDOS = {
  1: { id: 1, nome: 'Vale das Cores', descricao: 'Onde tudo começa: um gene, dois alelos.' },
  2: { id: 2, nome: 'Bosque das Formas', descricao: 'Vários genes ao mesmo tempo.' },
  3: { id: 3, nome: 'Recife Curioso', descricao: 'Heranças que fogem do simples.' },
}
