// ===== Painéis: Dex, Codex, Missões, Configurações =====

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useGame } from "../state/GameContext";
import { Creature } from "./Creature/Creature";
import { CuteButton, Panel } from "./CuteUI";
import { STRINGS } from "../data/strings";
import { CODEX } from "../data/codex";
import { MISSIONS } from "../data/missions";
import { dexCatalog } from "../engine/dex";
import { WORLD_NAMES, WORLD_GENES, GENES } from "../data/genes";

function Overlay({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="m-app-bg fixed inset-0 z-40 mx-auto flex max-w-md flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/60 bg-white/70 px-4 py-3 backdrop-blur-md">
        <button
          onClick={onClose}
          className="rounded-full border border-white/70 bg-white/90 px-3.5 py-2 text-sm font-semibold text-[#4A4063] m-soft-shadow"
        >
          ← {STRINGS.buttons.voltar}
        </button>
        <h2 className="font-display text-[#7E64B0]">{title}</h2>
        <span className="w-16" />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
    </div>
  );
}

export function DexPanel({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const catalog = dexCatalog(game.world);
  const discovered = new Set(game.discoveredPhenotypes);
  const found = catalog.filter((e) => discovered.has(e.key)).length;

  return (
    <Overlay title={`${STRINGS.buttons.dex} — ${WORLD_NAMES[game.world]}`} onClose={onClose}>
      <p className="mb-3 text-center text-sm font-semibold text-[#4A4063]/80">
        {found} / {catalog.length} catalogados
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {catalog.map((e) => {
          const seen = discovered.has(e.key);
          return (
            <div
              key={e.key}
              className={`flex flex-col items-center rounded-3xl border p-2 ${
                seen ? "border-white bg-white m-soft-shadow" : "border-white/50 bg-white/50"
              }`}
            >
              {seen ? (
                <Creature creature={e.creature} world={game.world} size={70} interactive={false} />
              ) : (
                <div className="flex h-[77px] w-[70px] items-center justify-center text-3xl opacity-30">
                  ❔
                </div>
              )}
              <span className="mt-1 text-center text-[10px] leading-tight text-[#4A4063]/70">
                {seen ? phenoLabel(e.key, game.world) : STRINGS.dexLocked}
              </span>
            </div>
          );
        })}
      </div>
    </Overlay>
  );
}

function phenoLabel(key: string, world: 1 | 2 | 3): string {
  // key = "cor:roxo|orelhas:curtas|..."
  const parts = key.split("|").map((p) => p.split(":")[1]);
  void world;
  return parts.join(", ");
}

export function CodexPanel({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Overlay title={STRINGS.buttons.codex} onClose={onClose}>
      <div className="mx-auto max-w-2xl space-y-2">
        {CODEX.map((entry) => {
          const unlocked = game.isConceptUnlocked(entry.id) || game.isConceptUnlocked(entry.unlockHint);
          const isOpen = open === entry.id;
          return (
            <Panel key={entry.id} className="overflow-hidden">
              <button
                onClick={() => unlocked && setOpen(isOpen ? null : entry.id)}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#BCA2E6] font-display text-sm font-bold text-white">
                  {unlocked ? entry.n : "🔒"}
                </span>
                <span className="flex-1 font-display font-semibold text-[#4A4063]">
                  {unlocked ? entry.title : "???"}
                </span>
                {unlocked && <span className="text-[#7E64B0]">{isOpen ? "▲" : "▼"}</span>}
              </button>
              {unlocked && isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-4 pb-4"
                >
                  <p className="mb-2 text-sm italic text-[#7E64B0]">{entry.found}</p>
                  <p className="text-sm leading-relaxed text-[#4A4063]/90 font-body">{entry.body}</p>
                  <div className="mt-2 rounded-xl bg-[#F3F1E4] px-3 py-2 text-xs text-[#4A4063]/80">
                    📊 {entry.diagram}
                  </div>
                </motion.div>
              )}
            </Panel>
          );
        })}
      </div>
    </Overlay>
  );
}

export function MissionsPanel({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const available = MISSIONS.filter((m) => m.world <= game.world);
  return (
    <Overlay title={STRINGS.buttons.missoes} onClose={onClose}>
      <div className="mx-auto max-w-2xl space-y-2">
        {available.map((m) => {
          const done = game.completedMissions.includes(m.id);
          return (
            <Panel key={m.id} className="flex items-center gap-3 p-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${
                  done ? "bg-[#F7DC83] text-[#6B5A1A]" : "bg-[#F8D08A] text-[#4A4063]"
                }`}
              >
                {done ? "✓" : m.label}
              </span>
              <div className="flex-1">
                <p className={`font-body text-sm ${done ? "text-[#4A4063]/50 line-through" : "text-[#4A4063]"}`}>
                  {m.text}
                </p>
                <p className="text-xs text-[#7E64B0]">{m.concept} {m.bonus && "· bônus"}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-[#F8D08A]">🪙 {m.reward}</span>
            </Panel>
          );
        })}
        {game.world < 3 && (
          <p className="pt-2 text-center text-xs text-[#4A4063]/60">
            Complete missões para desbloquear novos mundos e genes!
          </p>
        )}
      </div>
    </Overlay>
  );
}

export function HowToPlayPanel({ onClose }: { onClose: () => void }) {
  return (
    <Overlay title={STRINGS.buttons.comoJogar} onClose={onClose}>
      <div className="mx-auto max-w-md space-y-2.5">
        <p className="mb-3 text-center text-sm font-semibold text-[#4A4063]/80 font-body">
          Aprenda genética cruzando criaturas fofas 💜
        </p>
        {STRINGS.howTo.map((step) => (
          <Panel key={step.title} className="flex items-start gap-3 p-3.5">
            <span className="text-2xl leading-none">{step.emoji}</span>
            <div>
              <p className="font-display font-semibold text-[#4A4063]">{step.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-[#4A4063]/80 font-body">
                {step.body}
              </p>
            </div>
          </Panel>
        ))}
        <div className="pt-2">
          <CuteButton variant="primary" onClick={onClose} full>
            Entendi! 💪
          </CuteButton>
        </div>
      </div>
    </Overlay>
  );
}

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const game = useGame();
  const [confirm, setConfirm] = useState(false);
  const activeGenes = WORLD_GENES[game.world];
  return (
    <Overlay title="Configurações" onClose={onClose}>
      <div className="mx-auto max-w-md space-y-4">
        <Panel className="flex items-center justify-between p-4">
          <span className="font-display font-semibold text-[#4A4063]">Som</span>
          <CuteButton variant={game.muted ? "ghost" : "sun"} onClick={game.toggleMute}>
            {game.muted ? "🔇 Mudo" : "🔊 Ligado"}
          </CuteButton>
        </Panel>

        <Panel className="p-4">
          <p className="mb-2 font-display font-semibold text-[#4A4063]">
            Mundo atual: {WORLD_NAMES[game.world]}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {activeGenes.map((g) => (
              <span key={g} className="rounded-full bg-[#F3F1E4] px-2.5 py-1 text-xs text-[#4A4063]">
                {GENES[g].label}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#4A4063]/60">🪙 {game.coins} moedas</p>
        </Panel>

        <Panel className="p-4">
          {!confirm ? (
            <CuteButton variant="ghost" onClick={() => setConfirm(true)} full>
              ♻️ Reiniciar progresso
            </CuteButton>
          ) : (
            <div className="space-y-2 text-center">
              <p className="text-sm text-[#4A4063]">Tem certeza? Isso apaga tudo.</p>
              <div className="flex gap-2">
                <CuteButton variant="ghost" onClick={() => setConfirm(false)} className="flex-1">
                  Cancelar
                </CuteButton>
                <CuteButton
                  variant="pink"
                  onClick={() => {
                    game.resetProgress();
                    setConfirm(false);
                    onClose();
                  }}
                  className="flex-1"
                >
                  Sim, apagar
                </CuteButton>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </Overlay>
  );
}
