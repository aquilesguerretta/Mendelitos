// ===== Laboratório (hub) — layout mobile com navegação inferior =====

import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useGame } from "../state/GameContext";
import { Creature } from "../components/Creature/Creature";
import { CuteButton, Blobs } from "../components/CuteUI";
import { DexPanel, CodexPanel, MissionsPanel, SettingsPanel, HowToPlayPanel } from "../components/Panels";
import { STRINGS } from "../data/strings";
import { WORLD_NAMES, WORLD_GENES, GENES, PALETTE } from "../data/genes";
import { phenotype } from "../engine/phenotype";
import { MISSIONS } from "../data/missions";
import { playSfx } from "../engine/audio";
import type { Creature as CreatureT, GeneKey } from "../engine/types";

type PanelName = "dex" | "codex" | "missions" | "settings" | "howto" | null;

export function Lab({ onBreed }: { onBreed: () => void }) {
  const game = useGame();
  const [panel, setPanel] = useState<PanelName>(null);
  const [detail, setDetail] = useState<CreatureT | null>(null);

  const missionsAvail = MISSIONS.filter((m) => m.world <= game.world);
  const missionsDone = missionsAvail.filter((m) =>
    game.completedMissions.includes(m.id),
  ).length;

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden">
      {/* blobs decorativos */}
      <Blobs />

      {/* topo */}
      <header className="relative z-10 shrink-0 px-4 pt-5 pb-3">
        <div className="flex items-center justify-between rounded-[26px] border border-white/70 bg-white/55 px-4 py-3 backdrop-blur-md m-soft-shadow">
          <div>
            <h1 className="font-display leading-none text-[#7E64B0]" style={{ fontSize: "1.7rem" }}>
              Mendelitos
            </h1>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#BCA2E6]/15 px-2.5 py-0.5 text-xs font-bold text-[#7E64B0]">
              🌍 {WORLD_NAMES[game.world]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-b from-[#FBE3A6] to-[#F8D08A] px-3 py-1.5 text-sm font-bold text-[#6B5A1A] shadow-[0_3px_0_#E8BB55]">
              🪙 {game.coins}
            </span>
            <button
              onClick={() => {
                playSfx("tap");
                setPanel("howto");
              }}
              aria-label="Como jogar"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg m-soft-shadow"
            >
              ❓
            </button>
            <button
              onClick={game.toggleMute}
              aria-label={game.muted ? "Ativar som" : "Silenciar"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg m-soft-shadow"
            >
              {game.muted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>
      </header>

      {/* coleção (rolável) */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 pb-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-[#4A4063]" style={{ fontSize: "1rem" }}>
            Sua coleção
          </h2>
          <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-bold text-[#7E64B0]">
            {game.collection.length} Mendelitos
          </span>
        </div>

        {game.collection.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/70 bg-white/80 p-8 text-center text-[#4A4063] m-soft-shadow font-body">
            {STRINGS.labEmpty}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {[...game.collection]
              .sort(
                (a, b) =>
                  (game.favorites.includes(b.id) ? 1 : 0) -
                  (game.favorites.includes(a.id) ? 1 : 0),
              )
              .map((c, i) => {
                const corHex = phenotype(c).cor === "roxo" ? PALETTE.purple : PALETTE.yellow;
                const fav = game.favorites.includes(c.id);
                return (
                  <motion.button
                    key={c.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setDetail(c)}
                    className={`relative flex flex-col items-center overflow-hidden rounded-3xl border bg-white p-2 pt-5 m-soft-shadow ${
                      fav ? "border-[#F8D08A]" : "border-white"
                    }`}
                  >
                    {/* faixa de cor no topo do card */}
                    <span
                      className="absolute inset-x-0 top-0 h-9 opacity-25"
                      style={{ background: `linear-gradient(180deg, ${corHex}, transparent)` }}
                    />
                    <span className="absolute left-2.5 top-2 z-10 text-xs text-[#4A4063]/50">
                      {c.sex === "XX" ? "♀" : "♂"}
                    </span>
                    {fav && (
                      <span className="absolute right-2 top-1.5 z-10 text-sm">⭐</span>
                    )}
                    <Creature creature={c} world={game.world} size={74} interactive={false} />
                    <span className="mt-1 max-w-full truncate text-[11px] font-bold text-[#4A4063] font-body">
                      {c.nickname || `#${i + 1}`}
                    </span>
                  </motion.button>
                );
              })}
          </div>
        )}
      </main>

      {/* navegação inferior */}
      <nav className="relative z-10 shrink-0 border-t border-white/60 bg-white/85 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end">
          <NavItem
            icon="🎯"
            label={STRINGS.buttons.missoes}
            badge={`${missionsDone}/${missionsAvail.length}`}
            onClick={() => setPanel("missions")}
          />
          <NavItem icon="📕" label={STRINGS.buttons.dex} onClick={() => setPanel("dex")} />
          <CenterBreed onClick={onBreed} />
          <NavItem icon="📖" label={STRINGS.buttons.codex} onClick={() => setPanel("codex")} />
          <NavItem icon="⚙️" label="Config" onClick={() => setPanel("settings")} />
        </div>
      </nav>

      {panel === "dex" && <DexPanel onClose={() => setPanel(null)} />}
      {panel === "codex" && <CodexPanel onClose={() => setPanel(null)} />}
      {panel === "missions" && <MissionsPanel onClose={() => setPanel(null)} />}
      {panel === "settings" && <SettingsPanel onClose={() => setPanel(null)} />}
      {panel === "howto" && <HowToPlayPanel onClose={() => setPanel(null)} />}

      {detail && <CreatureDetail creature={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function NavItem({
  icon,
  label,
  badge,
  onClick,
}: {
  icon: string;
  label: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        playSfx("tap");
        onClick();
      }}
      className="relative flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[#4A4063]"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-bold">{label}</span>
      {badge && (
        <span className="absolute -top-0.5 right-1 rounded-full bg-[#BCA2E6] px-1.5 text-[9px] font-bold text-white">
          {badge}
        </span>
      )}
    </motion.button>
  );
}

function CenterBreed({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex flex-col items-center">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          playSfx("chime");
          onClick();
        }}
        className="-mt-7 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#F8CFDE] to-[#F6C2D4] text-3xl text-white shadow-[0_8px_20px_-4px_rgba(226,146,182,0.6)] ring-4 ring-white"
      >
        💞
      </motion.button>
      <span className="mt-0.5 text-[10px] font-bold text-[#F6C2D4]">{STRINGS.buttons.cruzar}</span>
    </div>
  );
}

function CreatureDetail({
  creature,
  onClose,
}: {
  creature: CreatureT;
  onClose: () => void;
}) {
  const game = useGame();
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [name, setName] = useState(creature.nickname || "");
  const p = phenotype(creature);
  const genes = WORLD_GENES[game.world];
  const corHex = p.cor === "roxo" ? PALETTE.purple : PALETTE.yellow;
  const fav = game.favorites.includes(creature.id);

  const doScan = (gene: GeneKey) => {
    const res = game.scan(creature.id, gene);
    if (!res) {
      toast("Sem moedas para escanear. Complete missões!", { icon: "🪙" });
      return;
    }
    setRevealed((r) => ({ ...r, [gene]: res }));
    toast.success(STRINGS.messages.scanner(res));
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-[28px] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-[28px]"
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#4A4063]/15 sm:hidden" />
        <div className="flex items-start gap-4">
          <div className="rounded-3xl p-2" style={{ backgroundColor: `${corHex}1f` }}>
            <Creature creature={creature} world={game.world} size={110} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => game.renameCreature(creature.id, name.trim())}
                placeholder="Dar um nome…"
                maxLength={16}
                className="w-full rounded-2xl bg-[#F3F1E4] px-3 py-2 font-display font-semibold text-[#4A4063] outline-none"
              />
              <button
                onClick={() => {
                  game.toggleFavorite(creature.id);
                  playSfx("tap");
                  toast(fav ? STRINGS.messages.unfavorited : STRINGS.messages.favorited);
                }}
                aria-label="Favoritar"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3F1E4] text-xl"
              >
                {fav ? "⭐" : "☆"}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-[#4A4063]/70">
              {creature.sex === "XX" ? "♀ fêmea (XX)" : "♂ macho (XY)"}
            </p>
            {creature.parents && (
              <p className="mt-0.5 text-[11px] text-[#4A4063]/55 font-body">
                🧬 Filhote de ♀ {creature.parents.motherName} × ♂ {creature.parents.fatherName}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          {genes.map((g) => {
            const def = GENES[g];
            const phenoVal = (p as Record<string, string>)[g];
            const geno = revealed[g];
            return (
              <div
                key={g}
                className="flex items-center justify-between rounded-2xl bg-[#F3F1E4] px-3 py-2"
              >
                <div>
                  <span className="text-sm font-semibold text-[#4A4063]">{def.label}: </span>
                  <span className="text-sm text-[#4A4063]/80">{phenoVal}</span>
                  {geno && (
                    <span className="ml-2 rounded-full bg-[#BCA2E6] px-2 py-0.5 text-xs font-bold text-white">
                      {geno.split(" — ")[0]}
                    </span>
                  )}
                </div>
                {!geno && (
                  <button
                    onClick={() => doScan(g)}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#7E64B0] m-soft-shadow"
                  >
                    🔍 {STRINGS.buttons.escanear}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <CuteButton variant="ghost" onClick={onClose} className="flex-1">
            {STRINGS.buttons.voltar}
          </CuteButton>
          <CuteButton
            variant="pink"
            onClick={() => {
              game.releaseCreature(creature.id);
              onClose();
            }}
            className="flex-1"
          >
            🕊️ {STRINGS.buttons.soltar}
          </CuteButton>
        </div>
      </motion.div>
    </div>
  );
}
