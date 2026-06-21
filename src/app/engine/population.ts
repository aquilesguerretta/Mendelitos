// ===== Genética de populações (v2 — Pangênia) =====
// Roda o MESMO motor de Mendel da v1 (breedDetailed) numa população, geração
// após geração. A SELEÇÃO AGE SOBRE O FENÓTIPO (não o genótipo): por isso um
// recessivo se esconde no heterozigoto e custa a sumir. Puro/testável.

import type { Creature, GeneKey, Phenotype, Sex } from "./types";
import { phenotype } from "./phenotype";
import { breedDetailed } from "./breeding";

export interface Selection {
  gene: GeneKey;
  favored: string[]; // valores de fenótipo favorecidos pelo ambiente
  s: number; // coeficiente de seleção (0..1): desfavorecido tem aptidão 1 - s
}

// Aptidão = sucesso reprodutivo do FENÓTIPO naquele ambiente.
export function fitness(p: Phenotype, sel: Selection | null): number {
  if (!sel) return 1;
  const v = (p as unknown as Record<string, string>)[sel.gene];
  return sel.favored.includes(v) ? 1 : Math.max(0.02, 1 - sel.s);
}

function weightedPick<T>(arr: T[], w: number[]): T {
  let total = 0;
  for (const x of w) total += x;
  if (total <= 0) return arr[Math.floor(Math.random() * arr.length)];
  let r = Math.random() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= w[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}

// Uma geração: reprodução ponderada pela aptidão -> filhotes pelo motor de Mendel.
// Mantém a população em torno da capacidade de suporte K.
export function step(pop: Creature[], sel: Selection | null, K: number): Creature[] {
  const females = pop.filter((c) => c.sex === "XX");
  const males = pop.filter((c) => c.sex === "XY");
  if (!females.length || !males.length) return pop;
  const fW = females.map((c) => fitness(phenotype(c), sel));
  const mW = males.map((c) => fitness(phenotype(c), sel));
  const next: Creature[] = [];
  for (let i = 0; i < K; i++) {
    const mom = weightedPick(females, fW);
    const dad = weightedPick(males, mW);
    const litter = breedDetailed(mom, dad);
    next.push(litter[Math.floor(Math.random() * litter.length)].child);
  }
  return next;
}

// Frequência de um alelo na população (conta alelos; ligado ao X conta 1 nos machos).
export function alleleFreq(pop: Creature[], gene: GeneKey, allele: string): number {
  let count = 0;
  let total = 0;
  for (const c of pop) {
    for (const a of c.genes[gene]) {
      total++;
      if (a === allele) count++;
    }
  }
  return total ? count / total : 0;
}

// Cria um indivíduo: alelos de `gene` sorteados pela frequência p; demais genes
// fixos (homozigotos dominantes), pra não poluir o gráfico do gene observado.
let _seq = 0;
function newId(): string {
  _seq += 1;
  return `pg_${_seq}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function makeIndividual(gene: GeneKey, domAllele: string, recAllele: string, p: number): Creature {
  const sex: Sex = Math.random() < 0.5 ? "XX" : "XY";
  const pick = () => (Math.random() < p ? domAllele : recAllele);
  const base: Record<GeneKey, string[]> = {
    cor: ["C", "C"],
    orelhas: ["O", "O"],
    padrao: ["M", "M"],
    crista: ["V", "V"],
    escamas: ["A", "A"],
    olhos: sex === "XX" ? ["G", "G"] : ["G"],
  };
  if (gene === "olhos") {
    base.olhos = sex === "XX" ? [pick(), pick()] : [pick()];
  } else {
    base[gene] = [pick(), pick()];
  }
  return { id: newId(), sex, genes: { ...base } };
}

// Semeia uma população em equilíbrio (frequência p) para um gene.
export function seedPopulation(
  K: number,
  gene: GeneKey,
  domAllele: string,
  recAllele: string,
  p: number,
): Creature[] {
  return Array.from({ length: K }, () => makeIndividual(gene, domAllele, recAllele, p));
}

// Alelo alternativo de cada alelo (para mutação: cria a outra versão).
const ALT: Record<string, string> = {
  C: "c", c: "C", O: "o", o: "O", M: "m", m: "M",
  V: "B", B: "V", A: "R", R: "A", G: "g", g: "G",
};

// Mutação: cada alelo do gene observado tem chance `rate` de virar a outra
// versão. É assim que um alelo NOVO (que sumiu/nunca houve) pode reaparecer.
export function mutate(pop: Creature[], gene: GeneKey, rate: number): Creature[] {
  for (const c of pop) {
    const arr = c.genes[gene];
    let changed = false;
    const out = arr.map((a) => {
      if (ALT[a] && Math.random() < rate) {
        changed = true;
        return ALT[a];
      }
      return a;
    });
    if (changed) c.genes = { ...c.genes, [gene]: out };
  }
  return pop;
}

// Amostra aleatória de `n` indivíduos (para colonização / efeito fundador).
export function sample(pop: Creature[], n: number): Creature[] {
  const copy = [...pop];
  const out: Creature[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}
