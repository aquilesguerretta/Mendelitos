// ===== As regiões de Pangênia (v2) — qual alelo cada bioma favorece e por quê =====
// A genética (qual fenótipo é favorecido) é fixa; o visual usa a linguagem da v1.

import type { GeneKey } from "../engine/types";
import type { Selection } from "../engine/population";

export interface Region {
  id: string;
  name: string;
  emoji: string;
  color: string; // cor-tema (pastel da v1)
  ambiente: string;
  favorece: string; // texto curto
  porque: string; // motivo ecológico
  selection: Selection | null;
  trackGene: GeneKey;
  trackAllele: string; // alelo cuja frequência (p) é plotada
  trackLabel: string; // legenda do eixo (ex.: "% alelo roxo (C)")
  core: boolean; // faz parte do núcleo (gene da cor) — A Grande Divisão
}

export const REGIONS: Region[] = [
  {
    id: "berco",
    name: "Berço",
    emoji: "🏡",
    color: "#BCA2E6",
    ambiente: "Ameno, origem de todos.",
    favorece: "Nada (neutro)",
    porque: "Sem pressão: as frequências ficam paradas — Hardy-Weinberg ao vivo.",
    selection: null,
    trackGene: "cor",
    trackAllele: "C",
    trackLabel: "% alelo roxo (C)",
    core: true,
  },
  {
    id: "selva",
    name: "Selva Roxa",
    emoji: "🌴",
    color: "#A78BD8",
    ambiente: "Copa roxa densa.",
    favorece: "Roxo (C)",
    porque: "O roxo se camufla na copa; o amarelo é avistado pelo predador.",
    selection: { gene: "cor", favored: ["roxo"], s: 0.55 },
    trackGene: "cor",
    trackAllele: "C",
    trackLabel: "% alelo roxo (C)",
    core: true,
  },
  {
    id: "dunas",
    name: "Dunas Douradas",
    emoji: "🏜️",
    color: "#F0C766",
    ambiente: "Areia dourada.",
    favorece: "Amarelo (c)",
    porque: "O amarelo se camufla na areia; o roxo vira alvo — o oposto da Selva.",
    selection: { gene: "cor", favored: ["amarelo"], s: 0.55 },
    trackGene: "cor",
    trackAllele: "C",
    trackLabel: "% alelo roxo (C)",
    core: true,
  },
  {
    id: "tundra",
    name: "Tundra Gelada",
    emoji: "❄️",
    color: "#9CC8F0",
    ambiente: "Frio extremo.",
    favorece: "Orelhas curtas (O)",
    porque: "Orelha longa perde calor; curta conserva (regra de Allen).",
    selection: { gene: "orelhas", favored: ["curtas"], s: 0.5 },
    trackGene: "orelhas",
    trackAllele: "O",
    trackLabel: "% alelo orelha curta (O)",
    core: false,
  },
  {
    id: "pradaria",
    name: "Pradaria Aberta",
    emoji: "🌾",
    color: "#BFD3A2",
    ambiente: "Chão uniforme.",
    favorece: "Liso (M)",
    porque: "Liso se mistura ao fundo; manchado se destaca.",
    selection: { gene: "padrao", favored: ["liso"], s: 0.5 },
    trackGene: "padrao",
    trackAllele: "M",
    trackLabel: "% alelo liso (M)",
    core: false,
  },
  {
    id: "arquipelago",
    name: "Arquipélago das Brumas",
    emoji: "🏝️",
    color: "#F6A8C0",
    ambiente: "Ilhas de terreno misto (rocha vermelha + areia branca).",
    favorece: "Intermediário (asas rosa)",
    porque:
      "Nem o vermelho puro nem o branco puro se escondem bem; quem mistura as duas se camufla em tudo — vantagem do heterozigoto, ecológica.",
    selection: { gene: "crista", favored: ["rosa"], s: 0.5 },
    trackGene: "crista",
    trackAllele: "V",
    trackLabel: "% alelo vermelho (V)",
    core: false,
  },
  {
    id: "cavernas",
    name: "Cavernas da Penumbra",
    emoji: "🕳️",
    color: "#8C7BB0",
    ambiente: "Escuridão.",
    favorece: "Olhos grandes (G)",
    porque: "Enxergam melhor no escuro; a seleção pega os machos mais rápido (ligado ao X).",
    selection: { gene: "olhos", favored: ["grandes"], s: 0.5 },
    trackGene: "olhos",
    trackAllele: "G",
    trackLabel: "% alelo olhos grandes (G)",
    core: false,
  },
];

export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r]));
