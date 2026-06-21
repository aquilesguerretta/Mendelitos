// ===== Genótipo -> Fenótipo (seção 4.4) =====
// Segue exatamente as tabelas 4.1 e 4.2. NÃO ALTERAR a lógica genética.

import type { Creature, Phenotype } from "./types";

function hasDominant(pair: string[], dom: string): boolean {
  return pair.some((a) => a === dom);
}

export function phenotype(c: Creature): Phenotype {
  const g = c.genes;

  // cor: C (roxo) dominante; cc -> amarelo
  const cor: Phenotype["cor"] = hasDominant(g.cor, "C") ? "roxo" : "amarelo";

  // orelhas: O (curtas) dominante; oo -> longas
  const orelhas: Phenotype["orelhas"] = hasDominant(g.orelhas, "O") ? "curtas" : "longas";

  // padrao: M (liso) dominante; mm -> manchado
  const padrao: Phenotype["padrao"] = hasDominant(g.padrao, "M") ? "liso" : "manchado";

  // crista: dominância incompleta. VV vermelha, VB rosa, BB branca
  const vCount = g.crista.filter((a) => a === "V").length;
  let crista: Phenotype["crista"];
  if (vCount === 2) crista = "vermelha";
  else if (vCount === 1) crista = "rosa";
  else crista = "branca";

  // escamas: codominância. AA azul, AR azul+vermelha, RR vermelha
  const aCount = g.escamas.filter((a) => a === "A").length;
  let escamas: Phenotype["escamas"];
  if (aCount === 2) escamas = "azul";
  else if (aCount === 1) escamas = "azul+vermelha";
  else escamas = "vermelha";

  // olhos: ligado ao X.
  // XX: GG/Gg -> grandes, gg -> pequenos.  XY: G -> grandes, g -> pequenos.
  const olhos: Phenotype["olhos"] = hasDominant(g.olhos, "G") ? "grandes" : "pequenos";

  return { cor, orelhas, padrao, crista, escamas, olhos };
}

// Chave de fenótipo para a Dex, limitada aos genes ativos do mundo.
import { WORLD_GENES } from "../data/genes";
import type { GeneKey, WorldId } from "./types";

export function phenotypeKey(c: Creature, world: WorldId): string {
  const p = phenotype(c);
  const genes = WORLD_GENES[world];
  const parts: string[] = [];
  for (const gk of genes as GeneKey[]) {
    parts.push(`${gk}:${(p as Record<string, string>)[gk]}`);
  }
  return parts.join("|");
}

// Formata genótipo de um gene para exibição (ex.: "Cc")
export function formatGenotype(c: Creature, gene: GeneKey): string {
  return c.genes[gene].join("");
}
