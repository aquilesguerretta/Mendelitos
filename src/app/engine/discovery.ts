// ===== Detecção de descobertas a partir de um cruzamento =====
// Decide quais cartas (seção 7.2) e conceitos de Codex desbloquear.

import type { Creature, WorldId } from "./types";
import { phenotype, formatGenotype } from "./phenotype";

export interface DiscoveryResult {
  newCardIds: string[]; // cartas a mostrar (na ordem)
  newConcepts: string[]; // ids de conceitos do codex a desbloquear
  rareIds: string[]; // ids de filhotes "raros"
}

interface Ctx {
  breedCountAfter: number; // nº de cruzamentos já feitos (incluindo este)
  world: WorldId;
  alreadyUnlocked: Set<string>;
}

export function detectDiscoveries(
  mother: Creature,
  father: Creature,
  litter: Creature[],
  ctx: Ctx,
): DiscoveryResult {
  const cards: string[] = [];
  const concepts: string[] = [];
  const rare: string[] = [];
  const has = (id: string) => ctx.alreadyUnlocked.has(id) || cards.includes(id);

  const momP = phenotype(mother);
  const dadP = phenotype(father);

  // Conceitos base no 1º cruzamento
  if (ctx.breedCountAfter >= 1) {
    if (!ctx.alreadyUnlocked.has("primeiro-cruzamento")) {
      concepts.push("primeiro-cruzamento", "gene-alelo", "dominante-recessivo");
    }
  }

  // Lei da Segregação: a partir do 2º cruzamento
  if (ctx.breedCountAfter >= 2 && !has("segregacao")) {
    cards.push("segregacao");
    concepts.push("segregacao");
  }

  // Portador: dois pais roxos -> filho amarelo
  const bornGreen = litter.some((c) => phenotype(c).cor === "amarelo");
  if (momP.cor === "roxo" && dadP.cor === "roxo" && bornGreen && !has("portador")) {
    cards.push("portador");
    concepts.push("portador", "homo-hetero", "genotipo-fenotipo");
  }

  // Proporção 3:1: cruzamento Cc × Cc
  const momCorHet = formatGenotype(mother, "cor") === "Cc" || formatGenotype(mother, "cor") === "cC";
  const dadCorHet = formatGenotype(father, "cor") === "Cc" || formatGenotype(father, "cor") === "cC";
  if (momCorHet && dadCorHet && !has("proporcao31")) {
    cards.push("proporcao31");
  }

  // Dois genes de uma vez: 1º cruzamento no Mundo 2+
  if (ctx.world >= 2 && !has("doisGenes")) {
    cards.push("doisGenes");
    concepts.push("doisGenes", "independente");
  }

  // ---- Mundo 3 ----
  if (ctx.world >= 3) {
    // Dominância incompleta: surge crista rosa (heterozigoto VB)
    if (litter.some((c) => phenotype(c).crista === "rosa") && !has("dominanciaIncompleta")) {
      cards.push("dominanciaIncompleta");
      concepts.push("dominanciaIncompleta");
    }
    // Codominância: surge escamas azul+vermelha (heterozigoto AR)
    if (litter.some((c) => phenotype(c).escamas === "azul+vermelha") && !has("codominancia")) {
      cards.push("codominancia");
      concepts.push("codominancia");
    }
    // Ligado ao X: surge macho de olhos pequenos
    if (
      litter.some((c) => c.sex === "XY" && phenotype(c).olhos === "pequenos") &&
      !has("ligadoX")
    ) {
      cards.push("ligadoX");
      concepts.push("ligadoX");
    }
  }

  // Raros: recessivos difíceis (amarelo + orelhas longas + manchado), ou fêmea olhos pequenos
  for (const c of litter) {
    const p = phenotype(c);
    const tripleRec = p.cor === "amarelo" && p.orelhas === "longas" && p.padrao === "manchado";
    const femaleSmallEyes = c.sex === "XX" && p.olhos === "pequenos";
    if (tripleRec || (ctx.world >= 3 && femaleSmallEyes)) rare.push(c.id);
  }

  return { newCardIds: cards, newConcepts: concepts, rareIds: rare };
}
