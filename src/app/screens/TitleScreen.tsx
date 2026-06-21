// ===== Tela de título (seção 5) =====

import { motion } from "motion/react";
import { CuteButton, Blobs } from "../components/CuteUI";
import { Creature } from "../components/Creature/Creature";
import { STRINGS } from "../data/strings";
import type { Creature as CreatureT } from "../engine/types";

const DEMO: CreatureT[] = [
  { id: "d1", sex: "XX", genes: { cor: ["C", "C"], orelhas: ["o", "o"], padrao: ["M", "M"], crista: ["V", "B"], escamas: ["A", "A"], olhos: ["G", "G"] } },
  { id: "d2", sex: "XY", genes: { cor: ["c", "c"], orelhas: ["O", "O"], padrao: ["m", "m"], crista: ["V", "V"], escamas: ["A", "R"], olhos: ["g"] } },
  { id: "d3", sex: "XX", genes: { cor: ["C", "c"], orelhas: ["O", "o"], padrao: ["M", "m"], crista: ["B", "B"], escamas: ["R", "R"], olhos: ["G", "g"] } },
];

export function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
      <Blobs />

      {/* selo / logo */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, rotate: -4 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="relative z-10 rounded-[34px] border border-white/70 bg-white/55 px-7 py-6 backdrop-blur-md m-soft-shadow"
      >
        <div className="mb-2 flex justify-center gap-1.5">
          {["💜", "💛", "🩷"].map((e, i) => (
            <motion.span
              key={e}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
              className="text-lg"
            >
              {e}
            </motion.span>
          ))}
        </div>
        <h1
          className="font-display leading-none text-[#7E64B0]"
          style={{ fontSize: "clamp(2.8rem, 11vw, 4.6rem)" }}
        >
          Mendelitos
        </h1>
        <p className="mt-2 font-display text-[#4A4063]" style={{ fontSize: "clamp(0.95rem, 4vw, 1.25rem)" }}>
          {STRINGS.subtitle}
        </p>
      </motion.div>

      {/* trio de criaturas — interativas */}
      <div className="relative z-10 mt-10 flex items-end justify-center gap-1">
        {DEMO.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: [0, i === 1 ? -10 : -6, 0], opacity: 1 }}
            transition={{
              y: { duration: 2.4 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: 0.3 + i * 0.12 },
              opacity: { delay: 0.3 + i * 0.12 },
            }}
          >
            <Creature creature={c} world={3} size={i === 1 ? 150 : 112} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 mt-10"
      >
        <CuteButton variant="primary" onClick={onStart} className="px-12 text-lg">
          {STRINGS.buttons.jogar} ▶
        </CuteButton>
      </motion.div>

      <p className="relative z-10 mt-6 max-w-xs text-xs text-[#4A4063]/60 font-body">
        Toque nos bichinhos! Cruze, descubra as Leis de Mendel de verdade e colecione todos os fenótipos.
      </p>
    </div>
  );
}
