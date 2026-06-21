// ===== Primitivas visuais fofas (botões, painel, chip) =====
// Alvo de toque mínimo 44px, cantos redondos, bounce no toque (seção 8).

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { playSfx } from "../engine/audio";

type Variant = "primary" | "sun" | "pink" | "ghost" | "green";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-[#CBB4EE] to-[#BCA2E6] text-[#3E3360] shadow-[0_5px_0_#9B83D8,0_10px_18px_-6px_rgba(142,118,214,0.5)]",
  green:
    "bg-gradient-to-b from-[#FAE39A] to-[#F7DC83] text-[#6B5A1A] shadow-[0_5px_0_#E3C25E,0_10px_18px_-6px_rgba(229,192,74,0.45)]",
  sun:
    "bg-gradient-to-b from-[#FBE3A6] to-[#F8D08A] text-[#6B5A1A] shadow-[0_5px_0_#E8BB55,0_10px_18px_-6px_rgba(232,187,85,0.45)]",
  pink:
    "bg-gradient-to-b from-[#F8CFDE] to-[#F6C2D4] text-[#7A3A58] shadow-[0_5px_0_#E7A6C2,0_10px_18px_-6px_rgba(226,146,182,0.45)]",
  ghost:
    "bg-white text-[#4A4063] shadow-[0_5px_0_#ECE3FB,0_8px_16px_-8px_rgba(174,150,232,0.3)]",
};

export function CuteButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
  full,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  className?: string;
  full?: boolean;
}) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.94, y: 2 }}
      onClick={() => {
        if (disabled) return;
        playSfx("tap");
        onClick?.();
      }}
      disabled={disabled}
      className={`min-h-[44px] rounded-2xl px-5 py-2.5 font-display font-semibold transition-opacity active:translate-y-[2px] ${
        VARIANTS[variant]
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${
        full ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl bg-white shadow-[0_8px_24px_rgba(174,150,232,0.12)] ${className}`}
    >
      {children}
    </div>
  );
}

export function Chip({
  children,
  color = "#BCA2E6",
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}

// Blobs decorativos pastel ao fundo (profundidade)
export function Blobs() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        animate={{ y: [0, 14, 0], x: [0, 6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-16 -top-10 h-48 w-48 rounded-full bg-[#F6C2D4]/30 blur-2xl"
      />
      <motion.div
        animate={{ y: [0, -12, 0], x: [0, -8, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-20 top-20 h-56 w-56 rounded-full bg-[#9CC8F0]/30 blur-2xl"
      />
      <motion.div
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 -left-20 h-52 w-52 rounded-full bg-[#F7DC83]/30 blur-2xl"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-10 right-0 h-44 w-44 rounded-full bg-[#BCA2E6]/25 blur-2xl"
      />
    </div>
  );
}
