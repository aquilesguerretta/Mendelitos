// ===== Quadro de Punnett (seção 7.3 #7 / Lente de Previsão) =====

import type { Creature, GeneKey } from "./types";
import { phenotype } from "./phenotype";

export interface PunnettCell {
  genotype: string; // ex.: "Cc"
  phenotype: string; // ex.: "roxo"
}

// Mapa genótipo de um gene -> fenótipo (reutiliza phenotype()).
function genoToPheno(gene: GeneKey, alleles: string[], sex: "XX" | "XY"): string {
  const fake: Creature = {
    id: "x",
    sex,
    genes: {
      cor: ["C", "C"],
      orelhas: ["O", "O"],
      padrao: ["M", "M"],
      crista: ["V", "V"],
      escamas: ["A", "A"],
      olhos: sex === "XX" ? ["G", "G"] : ["G"],
    },
  };
  (fake.genes as Record<string, string[]>)[gene] = alleles;
  return (phenotype(fake) as Record<string, string>)[gene];
}

function sortPair(a: string, b: string): string {
  // dominante (maiúscula) primeiro
  return [a, b].sort((x, y) => (x.toLowerCase() === y.toLowerCase() ? (x < y ? -1 : 1) : 0)).join("");
}

// Punnett autossômico padrão (2x2).
export function autosomalPunnett(
  gene: GeneKey,
  mother: Creature,
  father: Creature,
): PunnettCell[] {
  const m = mother.genes[gene];
  const f = father.genes[gene];
  const cells: PunnettCell[] = [];
  for (const a of m) {
    for (const b of f) {
      const genotype = sortPair(a, b);
      cells.push({ genotype, phenotype: genoToPheno(gene, [a, b], "XX") });
    }
  }
  return cells;
}

// Resumo de proporções fenotípicas a partir das células.
export function phenoCounts(cells: PunnettCell[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of cells) out[c.phenotype] = (out[c.phenotype] ?? 0) + 1;
  return out;
}

// X-linked (olhos): separa filhas (XX) e filhos (XY).
export interface XLinkedResult {
  daughters: PunnettCell[];
  sons: PunnettCell[];
}

export function xLinkedPunnett(mother: Creature, father: Creature): XLinkedResult {
  const momAlleles = mother.genes.olhos; // 2
  const dadAllele = father.genes.olhos[0]; // 1 (no X do pai)
  const daughters: PunnettCell[] = momAlleles.map((a) => ({
    genotype: sortPair(a, dadAllele),
    phenotype: genoToPheno("olhos", [a, dadAllele], "XX"),
  }));
  const sons: PunnettCell[] = momAlleles.map((a) => ({
    genotype: a, // herda só da mãe; o pai dá Y
    phenotype: genoToPheno("olhos", [a], "XY"),
  }));
  return { daughters, sons };
}
