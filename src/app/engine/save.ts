// ===== Persistência em localStorage (seção 12) =====

import type { Creature, WorldId } from "./types";
import { uid } from "./breeding";

const KEY = "mendelitos_save_v1";

export interface SaveState {
  collection: Creature[];
  discoveredPhenotypes: string[]; // chaves de fenótipo (Dex)
  unlockedConcepts: string[]; // ids de cartas/codex desbloqueados
  completedMissions: string[];
  world: WorldId;
  coins: number;
  muted: boolean;
  seenTitle: boolean;
  seenIntro: boolean;
  breedCount: number;
  favorites: string[]; // ids de Mendelitos favoritados
}

export function starterCreatures(): Creature[] {
  return [
    {
      id: uid(),
      sex: "XX",
      nickname: "Gabriela",
      genes: {
        cor: ["C", "c"],
        orelhas: ["O", "o"],
        padrao: ["M", "m"],
        crista: ["V", "B"],
        escamas: ["A", "R"],
        olhos: ["G", "g"],
      },
    },
    {
      id: uid(),
      sex: "XY",
      nickname: "Aquiles",
      genes: {
        cor: ["C", "c"],
        orelhas: ["O", "o"],
        padrao: ["M", "m"],
        crista: ["V", "B"],
        escamas: ["A", "R"],
        olhos: ["G"],
      },
    },
  ];
}

export function defaultState(): SaveState {
  return {
    collection: starterCreatures(),
    discoveredPhenotypes: [],
    unlockedConcepts: [],
    completedMissions: [],
    world: 1,
    coins: 3,
    muted: false,
    seenTitle: false,
    seenIntro: false,
    breedCount: 0,
    favorites: [],
  };
}

// Migração: renomeia os fundadores antigos (Lila/Theo) para Gabriela/Aquiles,
// incluindo os nomes guardados na linhagem dos filhotes.
const ren = (n: string | undefined) =>
  n === "Lila" ? "Gabriela" : n === "Theo" ? "Aquiles" : n;

function migrate(state: SaveState): SaveState {
  return {
    ...state,
    collection: (state.collection || []).map((c) => ({
      ...c,
      nickname: ren(c.nickname),
      parents: c.parents
        ? {
            ...c.parents,
            motherName: ren(c.parents.motherName) ?? c.parents.motherName,
            fatherName: ren(c.parents.fatherName) ?? c.parents.fatherName,
          }
        : c.parents,
    })),
  };
}

export function loadState(): SaveState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    return migrate({ ...defaultState(), ...parsed });
  } catch {
    return defaultState();
  }
}

export function saveState(state: SaveState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignora cota cheia */
  }
}

export function resetState(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}
