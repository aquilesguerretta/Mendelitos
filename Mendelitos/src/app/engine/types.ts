// ===== Modelo de dados central dos Mendelitos =====
// A corretude genética (seção 4 da spec) é INEGOCIÁVEL.

export type Sex = "XX" | "XY";

export type GeneKey =
  | "cor"
  | "orelhas"
  | "padrao"
  | "crista"
  | "escamas"
  | "olhos";

// Pares de alelos. `olhos` é ligado ao X: 2 alelos se XX, 1 se XY.
export interface Genes {
  cor: string[]; // ['C','c']
  orelhas: string[]; // ['O','o']
  padrao: string[]; // ['M','m']
  crista: string[]; // ['V','B']  (Mundo 3)
  escamas: string[]; // ['A','R'] (Mundo 3)
  olhos: string[]; // ['G','g'] (XX) | ['G'] (XY)
}

export interface Creature {
  id: string;
  sex: Sex;
  genes: Genes;
  nickname?: string;
}

export interface Phenotype {
  cor: "roxo" | "amarelo";
  orelhas: "curtas" | "longas";
  padrao: "liso" | "manchado";
  crista: "vermelha" | "rosa" | "branca";
  escamas: "azul" | "vermelha" | "azul+vermelha";
  olhos: "grandes" | "pequenos";
}

export type WorldId = 1 | 2 | 3;
