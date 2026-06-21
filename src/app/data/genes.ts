// ===== Definição dos genes, alelos e cores =====
// Dados separados da lógica (seção 14 da spec).

import type { GeneKey } from "../engine/types";

export interface AlleleInfo {
  symbol: string;
  label: string;
  color?: string;
}

export interface GeneDef {
  key: GeneKey;
  label: string;
  type: "dominancia-completa" | "dominancia-incompleta" | "codominancia" | "ligado-x";
  world: 1 | 2 | 3;
  alleles: AlleleInfo[];
}

// Cores da paleta (seção 8)
export const PALETTE = {
  bg: "#F6F1FC",
  purple: "#AE96E8",
  yellow: "#F3DA86",
  sun: "#F7D17A",
  pink: "#F3AECB",
  text: "#463A5E",
  card: "#FFFFFF",
  crestRed: "#F2A0A0",
  crestPink: "#F7C8DD",
  crestWhite: "#FAFAFA",
  scaleBlue: "#A9C9F2",
  scaleRed: "#F2A0A0",
} as const;

export const GENES: Record<GeneKey, GeneDef> = {
  cor: {
    key: "cor",
    label: "Cor",
    type: "dominancia-completa",
    world: 1,
    alleles: [
      { symbol: "C", label: "roxo", color: PALETTE.purple },
      { symbol: "c", label: "amarelo", color: PALETTE.yellow },
    ],
  },
  orelhas: {
    key: "orelhas",
    label: "Orelhas",
    type: "dominancia-completa",
    world: 2,
    alleles: [
      { symbol: "O", label: "curtas" },
      { symbol: "o", label: "longas" },
    ],
  },
  padrao: {
    key: "padrao",
    label: "Padrão",
    type: "dominancia-completa",
    world: 2,
    alleles: [
      { symbol: "M", label: "liso" },
      { symbol: "m", label: "manchado" },
    ],
  },
  crista: {
    key: "crista",
    label: "Asas",
    type: "dominancia-incompleta",
    world: 3,
    alleles: [
      { symbol: "V", label: "vermelha", color: PALETTE.crestRed },
      { symbol: "B", label: "branca", color: PALETTE.crestWhite },
    ],
  },
  escamas: {
    key: "escamas",
    label: "Escamas",
    type: "codominancia",
    world: 3,
    alleles: [
      { symbol: "A", label: "azul", color: PALETTE.scaleBlue },
      { symbol: "R", label: "vermelha", color: PALETTE.scaleRed },
    ],
  },
  olhos: {
    key: "olhos",
    label: "Olhos",
    type: "ligado-x",
    world: 3,
    alleles: [
      { symbol: "G", label: "grandes" },
      { symbol: "g", label: "pequenos" },
    ],
  },
};

// Genes ativos por mundo (acumulativo)
export const WORLD_GENES: Record<1 | 2 | 3, GeneKey[]> = {
  1: ["cor"],
  2: ["cor", "orelhas", "padrao"],
  3: ["cor", "orelhas", "padrao", "crista", "escamas", "olhos"],
};

export const WORLD_NAMES: Record<1 | 2 | 3, string> = {
  1: "Vale das Cores",
  2: "Bosque das Formas",
  3: "Caverna Cristalina",
};
