// ===== Abertura / Intro (mostrada uma vez antes do laboratório) =====

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Blobs, CuteButton, Panel } from "../components/CuteUI";
import { Creature } from "../components/Creature/Creature";
import { STRINGS } from "../data/strings";
import type { Creature as CreatureT } from "../engine/types";

// Criaturas demo (uma por slide) para dar vida à abertura.
const DEMO: CreatureT[] = [
  {
    id: "i1",
    sex: "XX",
    genes: { cor: ["C", "c"], orelhas: ["O", "o"], padrao: ["M", "m"], crista: ["V", "B"], escamas: ["A", "R"], olhos: ["G", "g"] },
  },
  {
    id: "i2",
    sex: "XY",
    genes: { cor: ["c", "c"], orelhas: ["o", "o"], padrao: ["m", "m"], crista: ["V", "V"], escamas: ["A", "R"], olhos: ["g"] },
  },
  {
    id: "i3",
    sex: "XX",
    genes: { cor: ["C", "C"], orelhas: ["O", "O"], padrao: ["M", "M"], crista: ["B", "B"], escamas: ["A", "A"], olhos: ["G", "G"] },
  },
];

export function IntroScreen({ onDone }: { onDone: () => void }) {
  const slides = STRINGS.intro.slides;
  const [i, setI] = useState(0);
  const slide = slides[i];
  const last = i === slides.length - 1;

  const next = () => (last ? onDone() : setI((n) => n + 1));

  return (
    <div className="relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden px-6">
      <Blobs />

      {/* pular */}
      <button
        onClick={onDone}
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#4A4063] backdrop-blur m-soft-shadow"
      >
        {STRINGS.buttons.pular} ⏭
      </button>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Creature creature={DEMO[i]} world={3} size={150} />
            </motion.div>

            <Panel className="mt-4 w-full p-6 text-center">
              <div className="text-4xl">{slide.emoji}</div>
              <h2 className="mt-2 font-display text-[#7E64B0]" style={{ fontSize: "1.4rem" }}>
                {slide.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#4A4063]/90 font-body">
                {slide.body}
              </p>
            </Panel>
          </motion.div>
        </AnimatePresence>

        {/* dots */}
        <div className="mt-5 flex gap-2">
          {slides.map((_, k) => (
            <span
              key={k}
              className={`h-2.5 rounded-full transition-all ${
                k === i ? "w-6 bg-[#BCA2E6]" : "w-2.5 bg-[#BCA2E6]/30"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 w-full">
          <CuteButton variant="primary" onClick={next} full>
            {last ? `${STRINGS.buttons.comecar} ▶` : `${STRINGS.buttons.proximo} →`}
          </CuteButton>
        </div>
      </div>
    </div>
  );
}
