// ===== Mendelito montado em camadas (seção 6) =====

import { useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Creature as CreatureT, WorldId } from "../../engine/types";
import { phenotype } from "../../engine/phenotype";
import { PALETTE } from "../../data/genes";
import { Body, Ears, Pattern, Wings, Scales, Eyes } from "./parts";
import { playSfx } from "../../engine/audio";

interface Props {
  creature: CreatureT;
  world?: WorldId;
  size?: number;
  interactive?: boolean;
  shiny?: boolean;
}

const REACTIONS = ["💕", "✨", "🫶", "💗", "😊", "⭐"];

interface Spark {
  id: number;
  emoji: string;
  x: number;
}

export function Creature({ creature, world = 3, size = 120, interactive = true, shiny = false }: Props) {
  const p = phenotype(creature);
  const [bounce, setBounce] = useState(0);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const gradId = useId().replace(/:/g, "");
  const corHex = p.cor === "roxo" ? PALETTE.purple : PALETTE.yellow;

  const showWorld3 = world >= 3;

  const handleTap = () => {
    if (!interactive) return;
    setBounce((b) => b + 1);
    playSfx("squeak");
    const spark: Spark = {
      id: Date.now() + Math.random(),
      emoji: REACTIONS[Math.floor(Math.random() * REACTIONS.length)],
      x: (Math.random() - 0.5) * size * 0.5,
    };
    setSparks((s) => [...s, spark]);
    setTimeout(() => {
      setSparks((s) => s.filter((x) => x.id !== spark.id));
    }, 900);
  };

  return (
    <div
      style={{ width: size, height: size * 1.1 }}
      className={`relative ${interactive ? "cursor-pointer select-none" : "select-none"}`}
    >
      {/* partículas de carinho */}
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 0, y: 0, scale: 0.4 }}
            animate={{ opacity: 1, y: -size * 0.55, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 text-xl"
            style={{ marginLeft: s.x }}
          >
            {s.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      <motion.div
        onClick={handleTap}
        animate={bounce ? { y: [0, -16, 0], rotate: [0, -4, 4, 0] } : {}}
        transition={{ duration: 0.45, ease: "easeOut" }}
        key={bounce}
        className="h-full w-full"
      >
        <motion.svg
          viewBox="0 0 200 220"
          width="100%"
          height="100%"
          animate={{ scaleY: [1, 1.03, 1], scaleX: [1, 0.99, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center bottom", overflow: "visible" }}
        >
          {shiny && (
            <ellipse cx="100" cy="135" rx="78" ry="76" fill="none" stroke={PALETTE.sun} strokeWidth="4" opacity="0.8">
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.2s" repeatCount="indefinite" />
            </ellipse>
          )}
          {showWorld3 && <Wings color={p.crista} />}
          <Ears type={p.orelhas} color={corHex} />
          <Body color={corHex} gradId={`body-${gradId}`} />
          {showWorld3 && <Scales color={p.escamas} />}
          <Pattern type={p.padrao} color={corHex} />
          <Eyes size={p.olhos} sex={creature.sex} />
        </motion.svg>
      </motion.div>
    </div>
  );
}
