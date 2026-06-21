// ===== Evolução — Pangênia (v2): genética de populações ao vivo =====
// Roda o motor de Mendel da v1 numa população, geração após geração. As forças
// evolutivas (seleção, deriva, efeito fundador) emergem de verdade.

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGame } from "../state/GameContext";
import { Blobs, SectionLabel } from "../components/CuteUI";
import { REGIONS } from "../data/regions";
import { step, alleleFreq, seedPopulation, sample } from "../engine/population";
import { playSfx } from "../engine/audio";
import type { Creature } from "../engine/types";

// Berço é população GRANDE (fica em Hardy-Weinberg); regiões/colônias são
// pequenas (seleção age rápido e a deriva aparece).
const K_BERCO = 800;
const K_REGION = 72;
const popK = (id: string) => (id === "berco" ? K_BERCO : K_REGION);
const SPEEDS = [
  { label: "1×", ms: 750 },
  { label: "2×", ms: 360 },
  { label: "4×", ms: 170 },
];

interface RegionSim {
  pop: Creature[];
  founded: boolean;
  p: number; // frequência do alelo observado (0..1)
}

function freqOf(r: (typeof REGIONS)[number], pop: Creature[]): number {
  return alleleFreq(pop, r.trackGene, r.trackAllele);
}

export function EvolutionScreen({ onBack }: { onBack: () => void }) {
  const game = useGame();
  const [sims, setSims] = useState<Record<string, RegionSim>>(() => {
    const init: Record<string, RegionSim> = {};
    // Berço + Selva + Dunas começam fundados (A Grande Divisão); resto vazio.
    for (const r of REGIONS) {
      if (r.id === "berco" || r.id === "selva" || r.id === "dunas") {
        const pop = seedPopulation(popK(r.id), r.trackGene, dom(r), rec(r), 0.5);
        init[r.id] = { pop, founded: true, p: freqOf(r, pop) };
      } else {
        init[r.id] = { pop: [], founded: false, p: 0 };
      }
    }
    return init;
  });
  const [gen, setGen] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [history, setHistory] = useState<Record<string, number>[]>([
    { gen: 0, berco: 50, selva: 50, dunas: 50 },
  ]);
  const seen = useRef<Set<string>>(new Set());
  const simsRef = useRef(sims);
  simsRef.current = sims;
  const genRef = useRef(0);

  // marca um conceito do Codex + carta/toast uma única vez
  const fire = (id: string, emoji: string, title: string, desc: string) => {
    if (seen.current.has(id)) return;
    seen.current.add(id);
    game.unlockConcept(id);
    playSfx("chime");
    toast(`${emoji} ${title}`, { description: desc });
  };

  // laço de gerações (lê/escreve via refs, sem estado obsoleto)
  useEffect(() => {
    if (!playing) return;
    const ms = SPEEDS[speed].ms;
    const t = setInterval(() => {
      const cur = simsRef.current;
      const next: Record<string, RegionSim> = {};
      for (const r of REGIONS) {
        const s = cur[r.id];
        if (!s.founded) {
          next[r.id] = s;
          continue;
        }
        const pop = step(s.pop, r.selection, popK(r.id));
        next[r.id] = { pop, founded: true, p: freqOf(r, pop) };
      }
      simsRef.current = next;
      setSims(next);
      genRef.current += 1;
      const g = genRef.current;
      setGen(g);
      setHistory((h) => {
        const point: Record<string, number> = {
          gen: g,
          berco: Math.round(next.berco.p * 100),
          selva: Math.round(next.selva.p * 100),
          dunas: Math.round(next.dunas.p * 100),
        };
        const out = [...h, point];
        return out.length > 90 ? out.slice(out.length - 90) : out;
      });

      // eventos
      if (g >= 14) {
        fire(
          "equilibrio",
          "⚖️",
          "EQUILÍBRIO",
          "Sem nenhuma força agindo, as frequências do Berço ficaram paradas. Isso é Hardy-Weinberg.",
        );
      }
      if (next.selva.p > 0.72 && next.dunas.p < 0.28) {
        fire(
          "adaptacao-local",
          "🗺️",
          "DUAS POPULAÇÕES",
          "Mesma origem, ambientes opostos: a Selva ficou roxa e as Dunas amarelas. Isso é adaptação local.",
        );
        fire(
          "selecao-natural",
          "🌗",
          "Seleção natural",
          "O ambiente favoreceu quem se camufla — e os alelos desse fenótipo subiram.",
        );
      }
      for (const r of REGIONS) {
        const f = next[r.id];
        if (f.founded && (f.p >= 0.99 || f.p <= 0.01)) {
          fire(
            "fixacao",
            "✨",
            "FIXAÇÃO",
            `Um alelo tomou conta em ${r.name}: a variação naquele gene se perdeu por aqui.`,
          );
        }
      }
    }, ms);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed]);

  const colonize = (id: string) => {
    const berco = simsRef.current.berco;
    if (!berco.founded || berco.pop.length < 6) return;
    const founders = sample(berco.pop, 8); // poucos fundadores -> efeito fundador
    const r = REGIONS.find((x) => x.id === id)!;
    const pop = regrow(founders, popK(id));
    const sim = { pop, founded: true, p: freqOf(r, pop) };
    simsRef.current = { ...simsRef.current, [id]: sim };
    setSims((prev) => ({ ...prev, [id]: sim }));
    playSfx("pop");
    game.unlockConcept("deriva");
    fire(
      "efeito-fundador",
      "🏝️",
      "NOVO COMEÇO",
      `Sua colônia em ${r.name} partiu de poucos indivíduos e já nasceu com frequências diferentes do Berço — só pelo acaso de quem foi. Efeito fundador.`,
    );
  };

  const reset = () => {
    setPlaying(false);
    seen.current = new Set();
    genRef.current = 0;
    setGen(0);
    setHistory([{ gen: 0, berco: 50, selva: 50, dunas: 50 }]);
    setSims(() => {
      const init: Record<string, RegionSim> = {};
      for (const r of REGIONS) {
        if (r.id === "berco" || r.id === "selva" || r.id === "dunas") {
          const pop = seedPopulation(popK(r.id), r.trackGene, dom(r), rec(r), 0.5);
          init[r.id] = { pop, founded: true, p: freqOf(r, pop) };
        } else {
          init[r.id] = { pop: [], founded: false, p: 0 };
        }
      }
      return init;
    });
  };

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden">
      <Blobs />

      {/* header */}
      <header className="relative z-10 shrink-0 px-3.5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
        <div className="m-glass flex items-center justify-between rounded-[26px] px-3 py-2.5">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-[#4A4063] shadow-[0_3px_8px_rgba(120,100,150,0.18)]"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} strokeWidth={2.4} />
          </button>
          <div className="text-center leading-none">
            <h1 className="font-display text-[#7E64B0]" style={{ fontSize: "1.3rem" }}>
              🌍 Pangênia
            </h1>
            <span className="text-[11px] font-bold text-[#4A4063]/60">Geração {gen}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={reset}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-[#4A4063] shadow-[0_3px_8px_rgba(120,100,150,0.18)]"
              aria-label="Reiniciar"
            >
              <RotateCcw size={18} strokeWidth={2.4} />
            </button>
            <button
              onClick={() => {
                playSfx("tap");
                if (!playing) {
                  game.unlockConcept("frequencia-alelica");
                  game.unlockConcept("aptidao");
                }
                setPlaying((p) => !p);
              }}
              className="flex h-10 items-center gap-1.5 rounded-2xl bg-gradient-to-b from-[#CBB4EE] to-[#BCA2E6] px-4 font-display font-bold text-white shadow-[0_4px_0_#9B83D8]"
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
              {playing ? "Pausar" : "Play"}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto px-4 pb-6">
        {/* velocidade */}
        <div className="mb-3 flex items-center justify-between">
          <SectionLabel>A Grande Divisão</SectionLabel>
          <div className="flex gap-1 rounded-full bg-white/55 p-1 backdrop-blur">
            {SPEEDS.map((sp, i) => (
              <button
                key={sp.label}
                onClick={() => setSpeed(i)}
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  speed === i ? "bg-[#BCA2E6] text-white" : "text-[#4A4063]/60"
                }`}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* gráfico de frequência (núcleo: gene da cor) */}
        <div className="m-clay rounded-[24px] p-3">
          <p className="mb-1 px-1 text-xs font-bold text-[#4A4063]/70">% do alelo roxo (C) por geração</p>
          <div style={{ width: "100%", height: 190 }}>
            <ResponsiveContainer>
              <LineChart data={history} margin={{ top: 6, right: 10, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,100,150,0.12)" />
                <XAxis dataKey="gen" tick={{ fontSize: 10, fill: "#9a90ad" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#9a90ad" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 14, border: "none", boxShadow: "0 8px 24px rgba(120,100,150,0.25)", fontSize: 12 }}
                  labelFormatter={(l) => `Geração ${l}`}
                />
                <Line type="monotone" dataKey="berco" name="Berço" stroke="#BCA2E6" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="selva" name="Selva" stroke="#7E64B0" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="dunas" name="Dunas" stroke="#E0A23A" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex justify-center gap-4 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-[#7E64B0]"><Dot c="#BCA2E6" /> Berço</span>
            <span className="flex items-center gap-1 text-[#7E64B0]"><Dot c="#7E64B0" /> Selva</span>
            <span className="flex items-center gap-1 text-[#E0A23A]"><Dot c="#E0A23A" /> Dunas</span>
          </div>
        </div>

        <p className="mt-2 px-1 text-center text-xs text-[#4A4063]/60 font-body">
          Aperte <b>Play</b> e veja a mesma espécie virar roxa na Selva e amarela nas Dunas — enquanto o Berço (sem pressão) fica parado.
        </p>

        {/* regiões */}
        <SectionLabel className="mb-2 mt-4 block">Regiões de Pangênia</SectionLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {REGIONS.map((r) => {
            const s = sims[r.id];
            return (
              <div key={r.id} className="m-clay flex flex-col gap-1.5 rounded-[20px] p-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-2xl text-lg"
                    style={{ background: `${r.color}33` }}
                  >
                    {r.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-[#4A4063]">{r.name}</p>
                    <p className="truncate text-[10px] text-[#4A4063]/55">{r.favorece}</p>
                  </div>
                </div>
                {s.founded ? (
                  <>
                    <div className="m-track h-2">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.round(s.p * 100)}%`, background: r.color }}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-[#4A4063]/60">
                      {r.trackLabel}: {Math.round(s.p * 100)}%
                    </p>
                  </>
                ) : (
                  <button
                    onClick={() => colonize(r.id)}
                    className="rounded-xl bg-[#BCA2E6]/15 py-1.5 text-xs font-bold text-[#7E64B0]"
                  >
                    🚩 Colonizar
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-4 px-1 text-center text-[11px] text-[#4A4063]/45 font-body">
          Os Mendelitos saíram de um berço só e se adaptaram a cada canto — como a vida na Terra.
          Conceitos novos aparecem no <b>Codex</b> conforme você os causa.
        </p>
      </main>
    </div>
  );
}

function Dot({ c }: { c: string }) {
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c }} />;
}

// helpers de alelo dominante/recessivo por região (para semear)
function dom(r: (typeof REGIONS)[number]): string {
  return r.trackAllele;
}
function rec(r: (typeof REGIONS)[number]): string {
  const map: Record<string, string> = { C: "c", O: "o", M: "m", V: "B", A: "R", G: "g" };
  return map[r.trackAllele] || "c";
}

// "Regrow": de poucos fundadores, cresce até K cruzando entre eles (1 geração).
function regrow(founders: Creature[], k: number): Creature[] {
  return step(founders, null, k);
}
