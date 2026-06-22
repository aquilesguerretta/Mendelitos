// ===== Missões (seção 7.4) =====
// Cada missão treina um conceito de genética.

import type { Creature } from "../engine/types";
import { phenotype } from "../engine/phenotype";

export interface Mission {
  id: string;
  label: string;
  text: string;
  concept: string;
  world: 1 | 2 | 3;
  bonus?: boolean;
  reward: number; // moedas
  // Verifica se a coleção satisfaz a missão.
  check: (collection: Creature[]) => boolean;
}

const isGreen = (c: Creature) => phenotype(c).cor === "amarelo";
const isLongEars = (c: Creature) => phenotype(c).orelhas === "longas";
const isSpotted = (c: Creature) => phenotype(c).padrao === "manchado";

export const MISSIONS: Mission[] = [
  {
    id: "M1",
    label: "M1",
    text: "Faça nascer seu primeiro Mendelito amarelo.",
    concept: "recessivo / portador",
    world: 1,
    reward: 2,
    check: (col) => col.some(isGreen),
  },
  {
    id: "M2",
    label: "M2",
    text: "Tenha 3 Mendelitos amarelos na coleção ao mesmo tempo.",
    concept: "reforço de recessivo",
    world: 1,
    reward: 3,
    check: (col) => col.filter(isGreen).length >= 3,
  },
  {
    id: "M3",
    label: "M3",
    text: "Crie um Mendelito de orelhas longas.",
    concept: "2º recessivo",
    world: 2,
    reward: 2,
    check: (col) => col.some(isLongEars),
  },
  {
    id: "M4",
    label: "M4",
    text: "Crie um Mendelito amarelo de orelhas longas.",
    concept: "di-híbrido (dois recessivos)",
    world: 2,
    reward: 3,
    check: (col) => col.some((c) => isGreen(c) && isLongEars(c)),
  },
  {
    id: "M5",
    label: "M5",
    text: "Crie um Mendelito amarelo, de orelhas longas e manchado.",
    concept: "três recessivos juntos",
    world: 2,
    reward: 4,
    check: (col) => col.some((c) => isGreen(c) && isLongEars(c) && isSpotted(c)),
  },
  {
    id: "M6",
    label: "M6",
    text: "Crie um Mendelito de asas rosa.",
    concept: "dominância incompleta",
    world: 3,
    bonus: true,
    reward: 3,
    check: (col) => col.some((c) => phenotype(c).crista === "rosa"),
  },
  {
    id: "M7",
    label: "M7",
    text: "Crie um Mendelito com escamas azuis e vermelhas.",
    concept: "codominância",
    world: 3,
    bonus: true,
    reward: 3,
    check: (col) => col.some((c) => phenotype(c).escamas === "azul+vermelha"),
  },
  {
    id: "M8",
    label: "M8",
    text: "Crie uma fêmea de olhos pequenos.",
    concept: "ligado ao X (mais difícil que o macho)",
    world: 3,
    bonus: true,
    reward: 5,
    check: (col) =>
      col.some((c) => c.sex === "XX" && phenotype(c).olhos === "pequenos"),
  },
];
