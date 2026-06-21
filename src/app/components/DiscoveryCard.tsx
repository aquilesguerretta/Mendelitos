// ===== Carta de descoberta colecionável (seção 7.2 / 10) =====

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CARDS } from "../data/cards";
import { CuteButton } from "./CuteUI";
import { STRINGS } from "../data/strings";

export function DiscoveryCardOverlay({
  cardIds,
  onClose,
}: {
  cardIds: string[];
  onClose: () => void;
}) {
  const [i, setI] = useState(0);
  const card = CARDS[cardIds[i]];
  if (!card) return null;

  const next = () => {
    if (i < cardIds.length - 1) setI(i + 1);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="relative w-full max-w-sm"
        >
          {/* brilho da borda */}
          <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-[#F8D08A] via-[#F6C2D4] to-[#BCA2E6] opacity-80 blur-[6px]" />
          <div className="relative rounded-[26px] bg-white p-6 text-center">
            <div className="mx-auto mb-2 w-fit rounded-full bg-[#F8D08A] px-3 py-1 text-xs font-bold text-[#4A4063]">
              ✨ DESCOBERTA NOVA
            </div>
            <div className="text-5xl">{card.emoji}</div>
            <h2 className="mt-2 text-[#4A4063]">{card.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#4A4063]/90 font-body">
              {card.body}
            </p>
            <div className="mt-5">
              <CuteButton variant="primary" onClick={next} full>
                {i < cardIds.length - 1 ? STRINGS.buttons.continuar : "Entendi!"}
              </CuteButton>
            </div>
            {cardIds.length > 1 && (
              <div className="mt-3 flex justify-center gap-1.5">
                {cardIds.map((id, idx) => (
                  <span
                    key={id}
                    className={`h-2 w-2 rounded-full ${
                      idx === i ? "bg-[#BCA2E6]" : "bg-[#BCA2E6]/25"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
