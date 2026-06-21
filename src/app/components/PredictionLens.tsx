// ===== Lente de Previsão com Quadro de Punnett (seção 11 #12) =====

import { Fragment } from "react";
import { motion } from "motion/react";
import type { Creature, WorldId, GeneKey } from "../engine/types";
import { WORLD_GENES, GENES, PALETTE } from "../data/genes";
import { autosomalPunnett, xLinkedPunnett, phenoCounts } from "../engine/punnett";
import { phenotype } from "../engine/phenotype";
import { CuteButton, Panel } from "./CuteUI";
import { STRINGS } from "../data/strings";

function phenoColor(pheno: string): string {
  switch (pheno) {
    case "roxo":
      return PALETTE.purple;
    case "amarelo":
      return PALETTE.yellow;
    case "vermelha":
      return PALETTE.crestRed;
    case "rosa":
      return PALETTE.crestPink;
    case "branca":
      return "#d8d8d8";
    case "azul":
      return PALETTE.scaleBlue;
    case "azul+vermelha":
      return PALETTE.scaleRed;
    default:
      return PALETTE.purple;
  }
}

function ratioText(counts: Record<string, number>): string {
  return Object.entries(counts)
    .map(([k, v]) => `${v} ${k}`)
    .join(" : ");
}

function PunnettGrid({
  gene,
  mother,
  father,
}: {
  gene: GeneKey;
  mother: Creature;
  father: Creature;
}) {
  const def = GENES[gene];
  const cells = autosomalPunnett(gene, mother, father);
  const m = mother.genes[gene];
  const f = father.genes[gene];
  const counts = phenoCounts(cells);

  return (
    <div className="rounded-2xl bg-[#F6F1FC] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-display font-semibold text-[#463A5E]">{def.label}</span>
        <span className="text-xs text-[#463A5E]/70">{def.type.replace(/-/g, " ")}</span>
      </div>
      <div className="grid grid-cols-[24px_1fr_1fr] gap-1 text-center text-xs">
        <div />
        {f.map((a, i) => (
          <div key={i} className="font-bold text-[#463A5E]">{a}</div>
        ))}
        {m.map((ma, r) => (
          <Fragment key={r}>
            <div className="flex items-center justify-center font-bold text-[#463A5E]">{ma}</div>
            {f.map((_fa, c) => {
              const cell = cells[r * 2 + c];
              return (
                <div
                  key={c}
                  className="rounded-lg py-1.5 font-semibold text-white"
                  style={{ backgroundColor: phenoColor(cell.phenotype) }}
                >
                  {cell.genotype}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
      <div className="mt-2 text-center text-xs font-semibold text-[#463A5E]/80">
        {ratioText(counts)}
      </div>
    </div>
  );
}

function XLinkedGrid({ mother, father }: { mother: Creature; father: Creature }) {
  const { daughters, sons } = xLinkedPunnett(mother, father);
  return (
    <div className="rounded-2xl bg-[#F6F1FC] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-display font-semibold text-[#463A5E]">Olhos</span>
        <span className="text-xs text-[#463A5E]/70">ligado ao X</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center text-xs">
        <div>
          <div className="mb-1 font-bold text-[#463A5E]">♀ Filhas</div>
          <div className="flex justify-center gap-1">
            {daughters.map((c, i) => (
              <div key={i} className="rounded-lg bg-[#AE96E8] px-2 py-1.5 font-semibold text-white">
                {c.genotype}
                <div className="text-[10px] opacity-90">{c.phenotype}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 font-bold text-[#463A5E]">♂ Filhos</div>
          <div className="flex justify-center gap-1">
            {sons.map((c, i) => (
              <div key={i} className="rounded-lg bg-[#A9C9F2] px-2 py-1.5 font-semibold text-white">
                {c.genotype}
                <div className="text-[10px] opacity-90">{c.phenotype}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PredictionLens({
  mother,
  father,
  world,
  onClose,
}: {
  mother: Creature;
  father: Creature;
  world: WorldId;
  onClose: () => void;
}) {
  const genes = WORLD_GENES[world];
  const autosomal = genes.filter((g) => g !== "olhos");
  const hasX = genes.includes("olhos");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Panel className="max-h-[85vh] overflow-y-auto p-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <h2 className="text-[#463A5E]">{STRINGS.lensTitle}</h2>
          </div>
          <p className="mb-4 text-sm text-[#463A5E]/70">
            As chances de cada característica dos filhotes.
          </p>
          <div className="space-y-3">
            {autosomal.map((g) => (
              <PunnettGrid key={g} gene={g} mother={mother} father={father} />
            ))}
            {hasX && <XLinkedGrid mother={mother} father={father} />}
          </div>
          <div className="mt-5">
            <CuteButton variant="ghost" onClick={onClose} full>
              {STRINGS.buttons.voltar}
            </CuteButton>
          </div>
        </Panel>
      </motion.div>
    </div>
  );
}

// usado indiretamente; mantém import enxuto
void phenotype;
