// ===== Enumeração de fenótipos para a Dex =====

import type { Creature, GeneKey, WorldId } from "./types";
import { WORLD_GENES } from "../data/genes";
import { phenotypeKey } from "./phenotype";

// Opções de fenótipo por gene + genótipo representativo que o produz.
const OPTIONS: Record<GeneKey, { pheno: string; alleles: string[] }[]> = {
  cor: [
    { pheno: "roxo", alleles: ["C", "C"] },
    { pheno: "amarelo", alleles: ["c", "c"] },
  ],
  orelhas: [
    { pheno: "curtas", alleles: ["O", "O"] },
    { pheno: "longas", alleles: ["o", "o"] },
  ],
  padrao: [
    { pheno: "liso", alleles: ["M", "M"] },
    { pheno: "manchado", alleles: ["m", "m"] },
  ],
  crista: [
    { pheno: "vermelha", alleles: ["V", "V"] },
    { pheno: "rosa", alleles: ["V", "B"] },
    { pheno: "branca", alleles: ["B", "B"] },
  ],
  escamas: [
    { pheno: "azul", alleles: ["A", "A"] },
    { pheno: "azul+vermelha", alleles: ["A", "R"] },
    { pheno: "vermelha", alleles: ["R", "R"] },
  ],
  olhos: [
    { pheno: "grandes", alleles: ["G", "G"] },
    { pheno: "pequenos", alleles: ["g", "g"] },
  ],
};

export interface DexEntry {
  key: string;
  creature: Creature;
}

export function dexCatalog(world: WorldId): DexEntry[] {
  const genes = WORLD_GENES[world];
  let combos: Record<string, string[]>[] = [{}];
  for (const g of genes) {
    const next: Record<string, string[]>[] = [];
    for (const base of combos) {
      for (const opt of OPTIONS[g]) {
        next.push({ ...base, [g]: opt.alleles });
      }
    }
    combos = next;
  }

  return combos.map((c, i) => {
    const creature: Creature = {
      id: `dex-${i}`,
      sex: "XX",
      genes: {
        cor: c.cor ?? ["C", "C"],
        orelhas: c.orelhas ?? ["O", "O"],
        padrao: c.padrao ?? ["M", "M"],
        crista: c.crista ?? ["V", "V"],
        escamas: c.escamas ?? ["A", "A"],
        olhos: c.olhos ?? ["G", "G"],
      },
    };
    return { key: phenotypeKey(creature, world), creature };
  });
}
