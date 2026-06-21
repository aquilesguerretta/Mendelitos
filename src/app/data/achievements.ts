// ===== Conquistas (troféus) — derivadas do estado que já existe =====

import type { Creature, WorldId } from "../engine/types";
import { phenotype } from "../engine/phenotype";
import { dexCatalog } from "../engine/dex";

export interface AchievementCtx {
  collection: Creature[];
  breedCount: number;
  completedMissions: string[];
  discoveredPhenotypes: string[];
  world: WorldId;
  favorites: string[];
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  check: (g: AchievementCtx) => boolean;
}

const some = (g: AchievementCtx, fn: (p: ReturnType<typeof phenotype>, c: Creature) => boolean) =>
  g.collection.some((c) => fn(phenotype(c), c));

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "primeiro-cruzamento",
    icon: "💞",
    title: "Primeiro amor",
    desc: "Faça seu primeiro cruzamento.",
    check: (g) => g.breedCount >= 1,
  },
  {
    id: "primeiro-amarelo",
    icon: "💛",
    title: "Surpresa amarela",
    desc: "Tenha um Mendelito amarelo (recessivo).",
    check: (g) => some(g, (p) => p.cor === "amarelo"),
  },
  {
    id: "colecionador",
    icon: "🗂️",
    title: "Colecionador",
    desc: "Reúna 10 Mendelitos.",
    check: (g) => g.collection.length >= 10,
  },
  {
    id: "criador",
    icon: "🥚",
    title: "Criador dedicado",
    desc: "Faça 10 cruzamentos.",
    check: (g) => g.breedCount >= 10,
  },
  {
    id: "favorito",
    icon: "⭐",
    title: "Xodó",
    desc: "Favorite um Mendelito.",
    check: (g) => g.favorites.length >= 1,
  },
  {
    id: "mundo-2",
    icon: "🌲",
    title: "Novos horizontes",
    desc: "Chegue ao Bosque das Formas.",
    check: (g) => g.world >= 2,
  },
  {
    id: "mundo-3",
    icon: "✨",
    title: "Mestre dos genes",
    desc: "Chegue à Caverna Encantada.",
    check: (g) => g.world >= 3,
  },
  {
    id: "asas-rosa",
    icon: "🌸",
    title: "Meio-termo",
    desc: "Crie um Mendelito de asas rosa.",
    check: (g) => some(g, (p) => p.crista === "rosa"),
  },
  {
    id: "escamas-duplas",
    icon: "🌀",
    title: "Duas cores",
    desc: "Crie escamas azuis e vermelhas juntas.",
    check: (g) => some(g, (p) => p.escamas === "azul+vermelha"),
  },
  {
    id: "femea-olhos-pequenos",
    icon: "👁️",
    title: "Ligada ao X",
    desc: "Crie uma fêmea de olhos pequenos.",
    check: (g) => some(g, (p, c) => c.sex === "XX" && p.olhos === "pequenos"),
  },
  {
    id: "dex-mundo-1",
    icon: "🎨",
    title: "Cores completas",
    desc: "Catalogue toda a Dex do Vale das Cores.",
    check: (g) => {
      const cat = dexCatalog(1);
      const set = new Set(g.discoveredPhenotypes);
      return cat.every((e) => set.has(e.key));
    },
  },
  {
    id: "geneticista",
    icon: "🧬",
    title: "Geneticista",
    desc: "Complete as missões M1 a M5.",
    check: (g) => ["M1", "M2", "M3", "M4", "M5"].every((m) => g.completedMissions.includes(m)),
  },
];
