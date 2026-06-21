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
import { step, alleleFreq, seedPopulation, sample, mutate } from "../engine/population";
import { playSfx } from "../engine/audio";
import type { Creature } from "../engine/types";

// Berço é população GRANDE (fica em Hardy-Weinberg); regiões/colônias usam o
// tamanho escolhido no Modo Livre (pequena = mais deriva).
const K_BERCO = 800;
const popK = (id: string, kRegion: number) => (id === "berco" ? K_BERCO : kRegion);
const PRESSURES = [
  { label: "Fraca", m: 0.45 },
  { label: "Média", m: 1 },
  { label: "Forte", m: 1.7 },
];
const POPS = [
  { label: "Pequena", k: 40 },
  { label: "Média", k: 72 },
  { label: "Grande", k: 130 },
];
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

// Estado inicial das regiões: Berço + Selva + Dunas fundados; resto vazio.
function seedRegions(kRegion: number): Record<string, RegionSim> {
  const init: Record<string, RegionSim> = {};
  for (const r of REGIONS) {
    if (r.id === "berco" || r.id === "selva" || r.id === "dunas") {
      const pop = seedPopulation(popK(r.id, kRegion), r.trackGene, dom(r), rec(r), 0.5);
      init[r.id] = { pop, founded: true, p: freqOf(r, pop) };
    } else {
      init[r.id] = { pop: [], founded: false, p: 0 };
    }
  }
  return init;
}

export function EvolutionScreen({ onBack }: { onBack: () => void }) {
  const game = useGame();
  const [sims, setSims] = useState<Record<string, RegionSim>>(() => seedRegions(POPS[1].k));
  const [gen, setGen] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [history, setHistory] = useState<Record<string, number>[]>([
    { gen: 0, berco: 50, selva: 50, dunas: 50 },
  ]);
  const [mutationOn, setMutationOn] = useState(false);
  const [migrateFrom, setMigrateFrom] = useState<string | null>(null);
  const [pressure, setPressure] = useState(1); // índice em PRESSURES
  const [popIdx, setPopIdx] = useState(1); // índice em POPS (tamanho das regiões)
  const seen = useRef<Set<string>>(new Set());
  const simsRef = useRef(sims);
  simsRef.current = sims;
  const genRef = useRef(0);
  const mutOnRef = useRef(mutationOn);
  mutOnRef.current = mutationOn;
  const pressureRef = useRef(pressure);
  pressureRef.current = pressure;
  const popIdxRef = useRef(popIdx);
  popIdxRef.current = popIdx;
  const foundedAt = useRef<Record<string, number>>({ berco: 0, selva: 0, dunas: 0 });

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
        const sel = r.selection
          ? { ...r.selection, s: Math.min(0.95, r.selection.s * PRESSURES[pressureRef.current].m) }
          : null;
        let pop = step(s.pop, sel, popK(r.id, POPS[popIdxRef.current].k));
        if (mutOnRef.current) pop = mutate(pop, r.trackGene, 0.01);
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
      // Mutação: um alelo que tinha sumido (fixado) reaparece
      if (mutOnRef.current) {
        for (const r of REGIONS) {
          const a = cur[r.id];
          const b = next[r.id];
          if (a.founded && b.founded && ((a.p === 1 && b.p < 1) || (a.p === 0 && b.p > 0))) {
            fire(
              "mutacao",
              "🧬",
              "NOVIDADE",
              `Em ${r.name} surgiu um alelo que tinha sumido — a mutação cria a variação que a seleção depois ordena.`,
            );
          }
        }
      }
      // Arquipélago: vantagem do heterozigoto mantém os dois alelos juntos
      const arq = next["arquipelago"];
      if (
        arq &&
        arq.founded &&
        g - (foundedAt.current["arquipelago"] ?? 0) > 12 &&
        arq.p > 0.32 &&
        arq.p < 0.68
      ) {
        fire(
          "meio-termo",
          "🌗",
          "O MEIO-TERMO VENCE",
          "No terreno misto, quem mistura as duas características (asas rosa) se camufla melhor que os puros — então os dois alelos sobrevivem juntos.",
        );
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
    const pop = regrow(founders, popK(id, POPS[popIdxRef.current].k));
    const sim = { pop, founded: true, p: freqOf(r, pop) };
    foundedAt.current[id] = genRef.current;
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

  // Fluxo gênico: migrantes de uma região levam alelos para outra.
  const doMigrate = (from: string, to: string) => {
    setMigrateFrom(null);
    if (from === to) return;
    const src = simsRef.current[from];
    const dst = simsRef.current[to];
    if (!src?.founded || !dst?.founded || src.pop.length < 6 || dst.pop.length < 6) return;
    const migrants = sample(src.pop, 8);
    const dstPop = [...dst.pop];
    for (let i = 0; i < migrants.length; i++) {
      dstPop[Math.floor(Math.random() * dstPop.length)] = { ...migrants[i], id: `${migrants[i].id}_mig${i}` };
    }
    const rTo = REGIONS.find((x) => x.id === to)!;
    const sim = { pop: dstPop, founded: true, p: freqOf(rTo, dstPop) };
    simsRef.current = { ...simsRef.current, [to]: sim };
    setSims((prev) => ({ ...prev, [to]: sim }));
    playSfx("snap");
    fire(
      "fluxo-genico",
      "🌊",
      "FLUXO GÊNICO",
      `Migrantes de ${REGIONS.find((x) => x.id === from)!.name} levaram seus alelos para ${rTo.name} — as frequências das duas se misturaram.`,
    );
  };

  const reset = () => {
    setPlaying(false);
    seen.current = new Set();
    genRef.current = 0;
    setMutationOn(false);
    setMigrateFrom(null);
    foundedAt.current = { berco: 0, selva: 0, dunas: 0 };
    setGen(0);
    setHistory([{ gen: 0, berco: 50, selva: 50, dunas: 50 }]);
    setSims(seedRegions(POPS[popIdxRef.current].k));
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

        {/* Modo Livre: pressão da seleção + tamanho das regiões */}
        <div className="m-clay mt-3 rounded-[20px] p-3">
          <SectionLabel className="mb-2 block">🎚️ Modo Livre</SectionLabel>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#4A4063]/70">Pressão da seleção</span>
            <div className="flex gap-1 rounded-full bg-white/60 p-1">
              {PRESSURES.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => {
                    playSfx("tap");
                    setPressure(i);
                  }}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    pressure === i ? "bg-[#BCA2E6] text-white" : "text-[#4A4063]/55"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#4A4063]/70">População das regiões</span>
            <div className="flex gap-1 rounded-full bg-white/60 p-1">
              {POPS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => {
                    playSfx("tap");
                    setPopIdx(i);
                  }}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    popIdx === i ? "bg-[#9CC8F0] text-white" : "text-[#4A4063]/55"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[10px] leading-snug text-[#4A4063]/50 font-body">
            Pressão fraca → evolui devagar (perto de Hardy-Weinberg). População pequena → mais deriva.
            Vale para os <b>próximos</b> nascimentos.
          </p>
        </div>

        {/* forças: mutação + regiões */}
        <div className="mb-2 mt-4 flex items-center justify-between">
          <SectionLabel>Regiões de Pangênia</SectionLabel>
          <button
            onClick={() => {
              playSfx("tap");
              setMutationOn((o) => !o);
            }}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              mutationOn ? "bg-[#BFD3A2] text-white" : "bg-white/60 text-[#4A4063]/70"
            }`}
          >
            🧬 Mutação {mutationOn ? "ligada" : "desligada"}
          </button>
        </div>

        {migrateFrom && (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-2xl bg-[#9CC8F0]/25 px-3 py-2 text-xs font-bold text-[#3E6890]">
            <span className="truncate">
              🌊 Migrar de {REGIONS.find((x) => x.id === migrateFrom)?.name} → toque no destino
            </span>
            <button
              onClick={() => setMigrateFrom(null)}
              className="shrink-0 rounded-full bg-white/80 px-2.5 py-0.5"
            >
              cancelar
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          {REGIONS.map((r) => {
            const s = sims[r.id];
            const isTarget = !!migrateFrom && s.founded && r.id !== migrateFrom;
            return (
              <div
                key={r.id}
                onClick={isTarget ? () => doMigrate(migrateFrom!, r.id) : undefined}
                className={`m-clay flex flex-col gap-1.5 rounded-[20px] p-3 ${
                  isTarget ? "cursor-pointer ring-2 ring-[#9CC8F0]" : ""
                }`}
              >
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
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate text-[10px] font-bold text-[#4A4063]/60">
                        {r.trackLabel}: {Math.round(s.p * 100)}%
                      </p>
                      {!migrateFrom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playSfx("tap");
                            setMigrateFrom(r.id);
                          }}
                          className="shrink-0 rounded-full bg-[#9CC8F0]/25 px-2 py-0.5 text-[10px] font-bold text-[#3E6890]"
                          aria-label={`Migrar de ${r.name}`}
                        >
                          ➡️ migrar
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      colonize(r.id);
                    }}
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
