// ===== Tela de cruzamento: seleção -> segregação -> choco -> revelar -> guardar =====
// A animação de segregação é a peça educativa central (seção 10).

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import type { Creature as CreatureT } from "../engine/types";
import { breedDetailed, type BreedDetail } from "../engine/breeding";
import { Creature } from "../components/Creature/Creature";
import { CuteButton, Panel, Blobs } from "../components/CuteUI";
import { PredictionLens } from "../components/PredictionLens";
import { DiscoveryCardOverlay } from "../components/DiscoveryCard";
import { STRINGS } from "../data/strings";
import { PALETTE } from "../data/genes";
import { useGame } from "../state/GameContext";
import { playSfx } from "../engine/audio";

type Phase = "select" | "segregation" | "hatch" | "reveal";

function nameOf(c: CreatureT, fallback: string) {
  return c.nickname || fallback;
}

export function BreedScreen({ onBack }: { onBack: () => void }) {
  const game = useGame();
  const [selected, setSelected] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("select");
  const [showLens, setShowLens] = useState(false);
  const [litter, setLitter] = useState<BreedDetail[]>([]);
  const [hatched, setHatched] = useState<boolean[]>([false, false, false, false]);
  const [keep, setKeep] = useState<Record<string, boolean>>({});
  const [cardQueue, setCardQueue] = useState<string[]>([]);
  const [rareIds, setRareIds] = useState<Set<string>>(new Set());

  const collection = game.collection;
  const picked = collection.filter((c) => selected.includes(c.id));
  const mother = picked.find((c) => c.sex === "XX");
  const father = picked.find((c) => c.sex === "XY");
  const canBreed = !!mother && !!father && selected.length === 2;
  const sameSexError =
    selected.length === 2 && (!mother || !father);

  const toggle = (id: string) => {
    setSelected((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      if (s.length >= 2) return [s[1], id];
      return [...s, id];
    });
  };

  const surprise = () => {
    const females = collection.filter((c) => c.sex === "XX");
    const males = collection.filter((c) => c.sex === "XY");
    if (!females.length || !males.length) return;
    const f = females[Math.floor(Math.random() * females.length)];
    const m = males[Math.floor(Math.random() * males.length)];
    setSelected([f.id, m.id]);
    playSfx("tap");
  };

  const startBreed = () => {
    if (!mother || !father) return;
    // Linhagem: cada filhote guarda de quem nasceu (árvore genealógica).
    const lineage = {
      motherId: mother.id,
      fatherId: father.id,
      motherName: nameOf(mother, "Mãe"),
      fatherName: nameOf(father, "Pai"),
    };
    const detail = breedDetailed(mother, father).map((d) => ({
      ...d,
      child: { ...d.child, parents: lineage },
    }));
    setLitter(detail);
    setHatched([false, false, false, false]);
    setKeep(Object.fromEntries(detail.map((d) => [d.child.id, true])));
    setPhase("segregation");
    playSfx("chime");
  };

  // Sequência da segregação -> choco
  useEffect(() => {
    if (phase !== "segregation") return;
    const snaps = [1100, 1300, 1500, 1700];
    const timers = snaps.map((t) => setTimeout(() => playSfx("snap"), t));
    const toHatch = setTimeout(() => setPhase("hatch"), 2100);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(toHatch);
    };
  }, [phase]);

  // Choco dos ovos um a um
  useEffect(() => {
    if (phase !== "hatch") return;
    const timers: number[] = [];
    litter.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setHatched((h) => {
            const n = [...h];
            n[i] = true;
            return n;
          });
          playSfx("pop");
          confetti({
            particleCount: 40,
            spread: 55,
            origin: { y: 0.6, x: 0.25 + i * 0.17 },
            colors: [PALETTE.purple, PALETTE.yellow, PALETTE.sun, PALETTE.pink],
          });
        }, 500 + i * 650),
      );
    });
    timers.push(
      window.setTimeout(() => {
        // registra descobertas
        const outcome = game.recordBreed(
          mother!,
          father!,
          litter.map((d) => d.child),
        );
        setRareIds(new Set(outcome.rareIds));
        if (outcome.rareIds.length) setTimeout(() => playSfx("rare"), 200);
        setCardQueue(outcome.newCardIds);
        setPhase("reveal");
      }, 500 + litter.length * 650 + 400),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const finishKeep = () => {
    const toKeep = litter.filter((d) => keep[d.child.id]).map((d) => d.child);
    game.keepCreatures(toKeep);
    onBack();
  };

  // ---------- RENDER ----------
  if (phase === "select") {
    return (
      <div className="relative flex min-h-[100dvh] flex-col overflow-hidden px-4 py-4">
        <Blobs />
        <div className="relative z-10 flex flex-1 flex-col">
          <Header title={STRINGS.buttons.cruzar} onBack={onBack} />
          <p className="mb-3 text-center text-sm text-[#4A4063]/80 font-body">
            {selected.length === 0
              ? STRINGS.selectParents
              : `${picked.map((c) => c.sex === "XX" ? "♀" : "♂").join(" + ")} selecionado${selected.length > 1 ? "s" : ""}`}
          </p>
          {collection.length >= 2 && (
            <div className="mb-3 flex justify-center">
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={surprise}
                className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#7E64B0] backdrop-blur m-soft-shadow"
              >
                🎲 {STRINGS.buttons.surpreenda}
              </motion.button>
            </div>
          )}
          {collection.length < 2 ? (
            <Panel className="mt-6 p-6 text-center text-[#4A4063]">
              Você precisa de pelo menos 2 Mendelitos.
            </Panel>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {collection.map((c, i) => {
                const sel = selected.includes(c.id);
                return (
                  <motion.button
                    key={c.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => toggle(c.id)}
                    className={`relative flex flex-col items-center rounded-3xl border-2 bg-white p-2 pt-4 transition-all ${
                      sel
                        ? "border-[#BCA2E6] ring-4 ring-[#BCA2E6]/20"
                        : "border-white"
                    } m-soft-shadow`}
                  >
                    <span className="absolute left-2.5 top-2 z-10 text-xs text-[#4A4063]/50">
                      {c.sex === "XX" ? "♀" : "♂"}
                    </span>
                    {sel && (
                      <span className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#BCA2E6] text-xs text-white">
                        ✓
                      </span>
                    )}
                    <Creature creature={c} world={game.world} size={76} interactive={false} />
                    <span className="mt-1 max-w-full truncate text-[11px] font-bold text-[#4A4063] font-body">
                      {nameOf(c, `#${i + 1}`)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {sameSexError && (
            <p className="mt-3 rounded-2xl bg-[#F6C2D4]/20 px-3 py-2 text-center text-sm font-semibold text-[#9E4E72]">
              Para cruzar você precisa de uma fêmea (♀) e um macho (♂).
            </p>
          )}

          <div className="sticky bottom-0 mt-auto flex gap-2 pt-4">
            <CuteButton
              variant="ghost"
              onClick={() => setShowLens(true)}
              disabled={!canBreed}
              className="flex-1"
            >
              🔮 {STRINGS.buttons.lente}
            </CuteButton>
            <CuteButton
              variant="pink"
              onClick={startBreed}
              disabled={!canBreed}
              className="flex-1"
            >
              💞 {STRINGS.buttons.cruzarConfirm}
            </CuteButton>
          </div>
        </div>

        {showLens && canBreed && (
          <PredictionLens
            mother={mother!}
            father={father!}
            world={game.world}
            onClose={() => {
              game.markLensUsed();
              setShowLens(false);
            }}
          />
        )}
      </div>
    );
  }

  // Segregação + choco + revelar compartilham o palco
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden px-4 py-4">
      <Blobs />
      <div className="relative z-10 flex flex-1 flex-col">
        <Header
          title={phase === "reveal" ? "Filhotes!" : "Cruzando..."}
          onBack={phase === "reveal" ? undefined : onBack}
        />

        {/* Pais — palco frosted */}
        <div className="relative mb-4 flex items-center justify-between gap-2 rounded-[26px] border border-white/70 bg-white/55 px-3 py-3 backdrop-blur-md m-soft-shadow">
          <div className="flex flex-col items-center">
            <Creature creature={mother!} world={game.world} size={90} interactive={false} />
            <span className="text-xs font-bold text-[#4A4063]">♀ {nameOf(mother!, "Mãe")}</span>
          </div>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: phase === "segregation" ? Infinity : 0, duration: 0.8 }}
            className="text-3xl"
          >
            💞
          </motion.div>
          <div className="flex flex-col items-center">
            <Creature creature={father!} world={game.world} size={90} interactive={false} />
            <span className="text-xs font-bold text-[#4A4063]">♂ {nameOf(father!, "Pai")}</span>
          </div>
        </div>

        {phase === "segregation" && (
          <p className="mb-2 rounded-2xl bg-[#BCA2E6]/12 px-3 py-2 text-center text-sm font-semibold text-[#7E64B0] font-body">
            Cada filhote recebe 1 alelo da mãe e 1 do pai…
          </p>
        )}

        {/* Ninhada / ovos */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {litter.map((d, i) => (
            <EggSlot
              key={d.child.id}
              detail={d}
              index={i}
              phase={phase}
              hatched={hatched[i]}
              world={game.world}
              rare={rareIds.has(d.child.id)}
              keep={keep[d.child.id]}
              onToggleKeep={() =>
                setKeep((k) => ({ ...k, [d.child.id]: !k[d.child.id] }))
              }
            />
          ))}
        </div>

        {phase === "reveal" && (
          <div className="mt-auto pt-5">
            <p className="mb-2 text-center text-sm font-semibold text-[#4A4063] font-body">
              {STRINGS.keepRelease}
            </p>
            <CuteButton variant="primary" onClick={finishKeep} full>
              {STRINGS.buttons.continuar} →
            </CuteButton>
          </div>
        )}
      </div>

      {cardQueue.length > 0 && (
        <DiscoveryCardOverlay
          cardIds={cardQueue}
          onClose={() => setCardQueue([])}
        />
      )}
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      {onBack ? (
        <button
          onClick={onBack}
          className="rounded-full border border-white/70 bg-white/80 px-3.5 py-2 text-sm font-semibold text-[#4A4063] backdrop-blur m-soft-shadow"
        >
          ← {STRINGS.buttons.voltar}
        </button>
      ) : (
        <span className="w-20" />
      )}
      <h2 className="font-display text-[#7E64B0]">{title}</h2>
      <span className="w-20" />
    </div>
  );
}

function AlleleToken({
  allele,
  from,
  delay,
}: {
  allele: string;
  from: "mae" | "pai";
  delay: number;
}) {
  const startX = from === "mae" ? -130 : 130;
  const isDom = allele === allele.toUpperCase();
  return (
    <motion.div
      initial={{ x: startX, y: -120, opacity: 0, scale: 0.5 }}
      animate={{ x: 0, y: 0, opacity: [0, 1, 1], scale: 1 }}
      transition={{ delay, duration: 0.7, ease: "easeOut" }}
      className="flex h-7 w-7 items-center justify-center rounded-full font-display font-bold shadow-md"
      style={{
        backgroundColor: isDom ? PALETTE.purple : PALETTE.yellow,
        color: isDom ? "#fff" : "#6B5A1A",
      }}
    >
      {allele}
    </motion.div>
  );
}

function EggSlot({
  detail,
  index,
  phase,
  hatched,
  world,
  rare,
  keep,
  onToggleKeep,
}: {
  detail: BreedDetail;
  index: number;
  phase: Phase;
  hatched: boolean;
  world: 1 | 2 | 3;
  rare: boolean;
  keep: boolean;
  onToggleKeep: () => void;
}) {
  const corAlleles = detail.inheritance.cor; // [{from:'mae'},{from:'pai'}]
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-28 w-full items-center justify-center">
        {phase === "segregation" && (
          <div className="flex gap-1">
            {corAlleles.map((a, k) => (
              <AlleleToken
                key={k}
                allele={a.allele}
                from={a.from}
                delay={0.4 + index * 0.18 + k * 0.12}
              />
            ))}
          </div>
        )}

        {(phase === "hatch" || phase === "reveal") && !hatched && (
          <motion.div
            animate={{ rotate: [-6, 6, -6], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="text-5xl"
          >
            🥚
          </motion.div>
        )}

        {hatched && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 14 }}
          >
            <Creature creature={detail.child} world={world} size={96} shiny={rare} />
          </motion.div>
        )}
      </div>

      {hatched && (
        <>
          <span className="text-xs font-semibold text-[#4A4063]">
            {detail.child.sex === "XX" ? "♀" : "♂"}
            {rare && " ✨"}
          </span>
          {phase === "reveal" && (
            <button
              onClick={onToggleKeep}
              className={`mt-1 rounded-full px-3 py-1 text-xs font-semibold ${
                keep
                  ? "bg-[#F7DC83] text-white"
                  : "bg-white text-[#4A4063] line-through opacity-60"
              }`}
            >
              {keep ? STRINGS.buttons.guardar : STRINGS.buttons.soltar}
            </button>
          )}
        </>
      )}
    </div>
  );
}
