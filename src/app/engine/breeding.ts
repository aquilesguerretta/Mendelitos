// ===== Algoritmo de cruzamento / segregação (seção 4.3) =====
// Mãe (XX) × Pai (XY) -> ninhada de 4 filhotes. NÃO ALTERAR a lógica.

import type { Creature, Genes, Sex } from "./types";

export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

const AUTOSOMAL: (keyof Genes)[] = ["cor", "orelhas", "padrao", "crista", "escamas"];

function pickOne(pair: string[]): string {
  return pair[Math.random() < 0.5 ? 0 : 1];
}

export interface BreedDetail {
  child: Creature;
  // De onde veio cada alelo, para a animação de segregação.
  inheritance: Record<string, { from: "mae" | "pai"; allele: string }[]>;
  sexFrom: "X" | "Y"; // o que o pai contribuiu
}

export function breedDetailed(mother: Creature, father: Creature): BreedDetail[] {
  const litter: BreedDetail[] = [];
  for (let i = 0; i < 4; i++) {
    const fromFather: "X" | "Y" = Math.random() < 0.5 ? "X" : "Y";
    const sex: Sex = fromFather === "X" ? "XX" : "XY";
    const genes = {} as Genes;
    const inheritance: BreedDetail["inheritance"] = {};

    for (const g of AUTOSOMAL) {
      const fromMom = pickOne(mother.genes[g]);
      const fromDad = pickOne(father.genes[g]);
      genes[g] = [fromMom, fromDad];
      inheritance[g] = [
        { from: "mae", allele: fromMom },
        { from: "pai", allele: fromDad },
      ];
    }

    // Ligado ao X
    const momX = pickOne(mother.genes.olhos); // mãe sempre tem 2 alelos
    if (sex === "XX") {
      const dadX = father.genes.olhos[0];
      genes.olhos = [momX, dadX];
      inheritance.olhos = [
        { from: "mae", allele: momX },
        { from: "pai", allele: dadX },
      ];
    } else {
      genes.olhos = [momX]; // filho só herda da mãe (recebe Y do pai)
      inheritance.olhos = [{ from: "mae", allele: momX }];
    }

    litter.push({
      child: { id: uid(), sex, genes },
      inheritance,
      sexFrom: fromFather,
    });
  }
  return litter;
}

export function breed(mother: Creature, father: Creature): Creature[] {
  return breedDetailed(mother, father).map((d) => d.child);
}

// Garante que a criatura tenha todos os genes definidos (mesmo os ocultos do Mundo 3).
export function ensureFullGenes(c: Creature): Creature {
  const g = c.genes;
  const filled: Genes = {
    cor: g.cor ?? ["C", "c"],
    orelhas: g.orelhas ?? ["O", "o"],
    padrao: g.padrao ?? ["M", "m"],
    crista: g.crista ?? ["V", "B"],
    escamas: g.escamas ?? ["A", "R"],
    olhos: g.olhos ?? (c.sex === "XX" ? ["G", "g"] : ["G"]),
  };
  return { ...c, genes: filled };
}
