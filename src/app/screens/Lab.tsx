// ===== Laboratório (hub) — layout mobile tátil com navegação flutuante =====

import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Sparkles,
  BookOpen,
  Target,
  Settings2,
  HelpCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useGame } from "../state/GameContext";
import { Creature } from "../components/Creature/Creature";
import { CuteButton, Blobs, SectionLabel, ProgressBar, IconButton } from "../components/CuteUI";
import {
  DexPanel,
  CodexPanel,
  MissionsPanel,
  SettingsPanel,
  HowToPlayPanel,
} from "../components/Panels";
import { STRINGS } from "../data/strings";
import { WORLD_NAMES, WORLD_GENES, GENES, PALETTE } from "../data/genes";
import { phenotype } from "../engine/phenotype";
import { MISSIONS } from "../data/missions";
import { dexCatalog } from "../engine/dex";
import { playSfx } from "../engine/audio";
import type { Creature as CreatureT, GeneKey } from "../engine/types";

type PanelName = "dex" | "codex" | "missions" | "settings" | "howto" | null;
type Filter = "todos" | "XX" | "XY" | "fav";

export function isRare(c: CreatureT): boolean {
  const p = phenotype(c);
  const recess =
    (p.cor === "amarelo" ? 1 : 0) +
    (p.orelhas === "longas" ? 1 : 0) +
    (p.padrao === "manchado" ? 1 : 0);
  if (recess >= 3) return true;
  if (c.sex === "XX" && p.olhos === "pequenos") return true;
  return false;
}

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "XX", label: "♀" },
  { id: "XY", label: "♂" },
  { id: "fav", label: "⭐" },
];

export function Lab({ onBreed, onEvolution }: { onBreed: () => void; onEvolution: () => void }) {
  const game = useGame();
  const [panel, setPanel] = useState<PanelName>(null);
  const [detail, setDetail] = useState<CreatureT | null>(null);
  const [filter, setFilter] = useState<Filter>("todos");

  const missionsAvail = MISSIONS.filter((m) => m.world <= game.world);
  const missionsDone = missionsAvail.filter((m) => game.completedMissions.includes(m.id)).length;
  const catalog = dexCatalog(game.world);
  const dexFound = catalog.filter((e) => game.discoveredPhenotypes.includes(e.key)).length;

  const list = [...game.collection]
    .filter((c) =>
      filter === "todos"
        ? true
        : filter === "fav"
          ? game.favorites.includes(c.id)
          : c.sex === filter,
    )
    .sort(
      (a, b) =>
        (game.favorites.includes(b.id) ? 1 : 0) - (game.favorites.includes(a.id) ? 1 : 0),
    );

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden">
      <Blobs />

      {/* ===== Header ===== */}
      <header className="relative z-10 shrink-0 px-3.5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="m-glass rounded-[28px] px-4 py-3.5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display leading-none text-[#7E64B0]" style={{ fontSize: "1.75rem" }}>
                Mendelitos
              </h1>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#BCA2E6]/18 px-2.5 py-0.5 text-xs font-bold text-[#7E64B0]">
                <Sparkles size={12} strokeWidth={2.5} /> {WORLD_NAMES[game.world]}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-2xl bg-gradient-to-b from-[#FBE3A6] to-[#F8D08A] px-3 py-2 text-sm font-extrabold text-[#6B5A1A] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_0_#E8BB55]">
                🪙 <span className="tabular-nums">{game.coins}</span>
              </span>
              <IconButton label="Como jogar" onClick={() => setPanel("howto")}>
                <HelpCircle size={20} strokeWidth={2.4} />
              </IconButton>
              <IconButton label={game.muted ? "Ativar som" : "Silenciar"} onClick={game.toggleMute}>
                {game.muted ? <VolumeX size={20} strokeWidth={2.4} /> : <Volume2 size={20} strokeWidth={2.4} />}
              </IconButton>
            </div>
          </div>

          {/* progresso da Dex */}
          <div className="mt-3 flex items-center gap-2.5">
            <SectionLabel className="shrink-0">Dex</SectionLabel>
            <ProgressBar value={dexFound} max={catalog.length} color="#9CC8F0" className="flex-1" />
            <span className="shrink-0 text-[11px] font-bold tabular-nums text-[#4A4063]/70">
              {dexFound}/{catalog.length}
            </span>
          </div>
        </div>
      </header>

      {/* ===== Coleção ===== */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 pb-28 pt-1.5">
        {/* Banner: aba Evolução (Pangênia) */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            playSfx("chime");
            onEvolution();
          }}
          className="m-clay relative mb-3 flex w-full items-center gap-3 overflow-hidden rounded-[24px] p-3.5 text-left"
        >
          <span
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{ background: "linear-gradient(120deg,#BCA2E6,#9CC8F0,#BFD3A2)" }}
          />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/85 text-2xl">
            🌍
          </span>
          <span className="relative flex-1">
            <span className="block font-display font-bold text-[#4A4063]">Evolução · Pangênia</span>
            <span className="block text-xs leading-snug text-[#4A4063]/70 font-body">
              Veja uma população evoluir: seleção, deriva e adaptação ao vivo.
            </span>
          </span>
          <span className="relative text-lg font-bold text-[#7E64B0]">→</span>
        </motion.button>

        <div className="mb-2.5 flex items-center justify-between px-0.5">
          <SectionLabel>Sua coleção · {game.collection.length}</SectionLabel>
          <div className="flex gap-1 rounded-full bg-white/55 p-1 backdrop-blur">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  playSfx("tap");
                  setFilter(f.id);
                }}
                className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                  filter === f.id ? "bg-[#BCA2E6] text-white" : "text-[#4A4063]/60"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {game.collection.length === 0 ? (
          <div className="m-clay mt-10 rounded-[26px] p-8 text-center text-[#4A4063] font-body">
            {STRINGS.labEmpty}
          </div>
        ) : list.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[#4A4063]/50 font-body">
            Nenhum Mendelito neste filtro.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {list.map((c, i) => {
              const corHex = phenotype(c).cor === "roxo" ? PALETTE.purple : PALETTE.yellow;
              const fav = game.favorites.includes(c.id);
              const rare = isRare(c);
              return (
                <motion.button
                  layout
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.025, 0.3) }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => {
                    playSfx("squeak");
                    setDetail(c);
                  }}
                  className={`m-clay relative flex flex-col items-center overflow-hidden rounded-[24px] p-2 pt-6 ${
                    fav ? "ring-2 ring-[#F8D08A]" : ""
                  }`}
                >
                  <span
                    className="absolute inset-x-0 top-0 h-10 opacity-30"
                    style={{ background: `linear-gradient(180deg, ${corHex}, transparent)` }}
                  />
                  <span className="absolute left-2.5 top-2 z-10 text-xs font-bold text-[#4A4063]/45">
                    {c.sex === "XX" ? "♀" : "♂"}
                  </span>
                  {fav && <span className="absolute right-2 top-1.5 z-10 text-sm">⭐</span>}
                  {rare && (
                    <span className="m-rare-ring pointer-events-none absolute left-1/2 top-6 h-16 w-16 -translate-x-1/2 rounded-full opacity-40 blur-md" />
                  )}
                  <div className="relative z-10">
                    <Creature creature={c} world={game.world} size={72} interactive={false} />
                  </div>
                  <span className="relative z-10 mt-1 max-w-full truncate text-[11px] font-bold text-[#4A4063] font-body">
                    {rare && "✨ "}
                    {c.nickname || `#${i + 1}`}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </main>

      {/* ===== Navegação flutuante ===== */}
      <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
        <div className="m-glass pointer-events-auto grid w-full max-w-md grid-cols-5 items-end rounded-[26px] px-2 py-2">
          <NavItem
            icon={<Target size={21} strokeWidth={2.3} />}
            label={STRINGS.buttons.missoes}
            badge={`${missionsDone}/${missionsAvail.length}`}
            onClick={() => setPanel("missions")}
          />
          <NavItem icon={<BookOpen size={21} strokeWidth={2.3} />} label={STRINGS.buttons.dex} onClick={() => setPanel("dex")} />
          <CenterBreed onClick={onBreed} />
          <NavItem icon={<Sparkles size={21} strokeWidth={2.3} />} label={STRINGS.buttons.codex} onClick={() => setPanel("codex")} />
          <NavItem icon={<Settings2 size={21} strokeWidth={2.3} />} label="Ajustes" onClick={() => setPanel("settings")} />
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
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={() => {
        playSfx("tap");
        onClick();
      }}
      className="relative flex flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[#7E64B0]"
    >
      {icon}
      <span className="text-[10px] font-bold text-[#4A4063]/80">{label}</span>
      {badge && (
        <span className="absolute -top-1 right-1.5 rounded-full bg-[#BCA2E6] px-1.5 text-[9px] font-bold text-white shadow-sm">
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
        whileHover={{ rotate: -4 }}
        onClick={() => {
          playSfx("chime");
          onClick();
        }}
        className="-mt-8 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gradient-to-b from-[#F8CFDE] to-[#F6C2D4] text-3xl text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.6),0_10px_22px_-4px_rgba(226,146,182,0.7)] ring-[5px] ring-white"
      >
        💞
      </motion.button>
      <span className="-mt-0.5 text-[10px] font-extrabold text-[#E489AE]">{STRINGS.buttons.cruzar}</span>
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
  const rare = isRare(creature);

  // pedigree: procura os pais na coleção (podem ter sido soltos)
  const mother = creature.parents
    ? game.collection.find((c) => c.id === creature.parents!.motherId)
    : undefined;
  const father = creature.parents
    ? game.collection.find((c) => c.id === creature.parents!.fatherId)
    : undefined;

  const doScan = (gene: GeneKey) => {
    const res = game.scan(creature.id, gene);
    if (!res) {
      toast("Sem moedas para escanear. Complete missões!", { icon: "🪙" });
      return;
    }
    setRevealed((r) => ({ ...r, [gene]: res }));
    playSfx("snap");
    toast.success(STRINGS.messages.scanner(res));
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[30px] bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-[30px]"
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#4A4063]/15 sm:hidden" />
        <div className="flex items-start gap-4">
          <div className="relative shrink-0 rounded-[26px] p-2" style={{ backgroundColor: `${corHex}22` }}>
            {rare && <div className="m-rare-ring absolute inset-0 rounded-[26px] opacity-30 blur-md" />}
            <div className="relative">
              <Creature creature={creature} world={game.world} size={108} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => game.renameCreature(creature.id, name.trim())}
                placeholder="Dar um nome…"
                maxLength={16}
                className="m-clay-inset w-full rounded-2xl px-3 py-2 font-display font-semibold text-[#4A4063] outline-none"
              />
              <button
                onClick={() => {
                  game.toggleFavorite(creature.id);
                  playSfx("tap");
                  toast(fav ? STRINGS.messages.unfavorited : STRINGS.messages.favorited);
                }}
                aria-label="Favoritar"
                className="m-clay-inset flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl"
              >
                {fav ? "⭐" : "☆"}
              </button>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-[#BCA2E6]/15 px-2 py-0.5 text-xs font-bold text-[#7E64B0]">
                {creature.sex === "XX" ? "♀ fêmea (XX)" : "♂ macho (XY)"}
              </span>
              {rare && (
                <span className="rounded-full bg-[#F8D08A]/30 px-2 py-0.5 text-xs font-bold text-[#6B5A1A]">
                  ✨ raro
                </span>
              )}
            </div>
            {creature.parents && (
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-[#F3F1E4] px-2.5 py-1.5">
                <PedigreeMini c={mother} fallback="♀" world={game.world} />
                <span className="text-xs text-[#4A4063]/40">×</span>
                <PedigreeMini c={father} fallback="♂" world={game.world} />
                <span className="ml-0.5 text-[11px] font-semibold leading-tight text-[#4A4063]/70">
                  Filhote de {creature.parents.motherName} <br /> & {creature.parents.fatherName}
                </span>
              </div>
            )}
          </div>
        </div>

        <SectionLabel className="mt-4 mb-1.5 block">Genes</SectionLabel>
        <div className="space-y-1.5">
          {genes.map((g) => {
            const def = GENES[g];
            const phenoVal = (p as Record<string, string>)[g];
            const geno = revealed[g];
            return (
              <div key={g} className="m-clay-inset flex items-center justify-between rounded-2xl px-3 py-2">
                <div>
                  <span className="text-sm font-bold text-[#4A4063]">{def.label}: </span>
                  <span className="text-sm text-[#4A4063]/75">{phenoVal}</span>
                  {geno && (
                    <span className="ml-2 rounded-full bg-[#BCA2E6] px-2 py-0.5 font-display text-xs font-bold text-white">
                      {geno.split(" — ")[0]}
                    </span>
                  )}
                </div>
                {!geno && (
                  <button
                    onClick={() => doScan(g)}
                    className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#7E64B0] shadow-[0_2px_6px_rgba(120,100,150,0.18)]"
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

function PedigreeMini({
  c,
  fallback,
  world,
}: {
  c: CreatureT | undefined;
  fallback: string;
  world: 1 | 2 | 3;
}) {
  if (!c) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-xs text-[#4A4063]/40">
        {fallback}
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white">
      <Creature creature={c} world={world} size={40} interactive={false} />
    </div>
  );
}
