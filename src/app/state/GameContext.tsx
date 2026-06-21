// ===== Estado global do jogo (seção 5) + persistência =====

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { Creature, GeneKey, WorldId } from "../engine/types";
import {
  loadState,
  saveState,
  resetState,
  defaultState,
  type SaveState,
} from "../engine/save";
import { detectDiscoveries } from "../engine/discovery";
import { phenotype, phenotypeKey, formatGenotype } from "../engine/phenotype";
import { dexCatalog } from "../engine/dex";
import { MISSIONS } from "../data/missions";
import { WORLD_NAMES } from "../data/genes";
import { STRINGS } from "../data/strings";
import { setMuted as audioSetMuted, playSfx } from "../engine/audio";

interface BreedOutcome {
  newCardIds: string[];
  rareIds: string[];
}

interface GameApi extends SaveState {
  recordBreed: (mother: Creature, father: Creature, litter: Creature[]) => BreedOutcome;
  keepCreatures: (creatures: Creature[]) => void;
  releaseCreature: (id: string) => void;
  renameCreature: (id: string, name: string) => void;
  markLensUsed: () => void;
  scan: (creatureId: string, gene: GeneKey) => string | null;
  toggleMute: () => void;
  setSeenTitle: () => void;
  setSeenIntro: () => void;
  toggleFavorite: (id: string) => void;
  resetProgress: () => void;
  isConceptUnlocked: (id: string) => boolean;
}

const Ctx = createContext<GameApi | null>(null);

export function useGame(): GameApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useGame fora do provider");
  return v;
}

function computeWorld(completed: string[]): WorldId {
  if (completed.includes("M5")) return 3;
  if (completed.includes("M1")) return 2;
  return 1;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SaveState>(() => loadState());
  const stateRef = useRef(state);
  stateRef.current = state;

  // persiste a cada mudança
  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    audioSetMuted(state.muted);
  }, [state.muted]);

  const recordBreed = useCallback<GameApi["recordBreed"]>(
    (mother, father, litter) => {
      const prev = stateRef.current;
      const breedCountAfter = prev.breedCount + 1;
      const result = detectDiscoveries(mother, father, litter, {
        breedCountAfter,
        world: prev.world,
        alreadyUnlocked: new Set(prev.unlockedConcepts),
      });
      setState((s) => ({
        ...s,
        breedCount: s.breedCount + 1,
        unlockedConcepts: Array.from(
          new Set([...s.unlockedConcepts, ...result.newConcepts]),
        ),
      }));
      return { newCardIds: result.newCardIds, rareIds: result.rareIds };
    },
    [],
  );

  const evaluateMissionsAndWorld = useCallback(
    (collection: Creature[], prevCompleted: string[]) => {
      const newlyCompleted: string[] = [];
      let coinGain = 0;
      for (const m of MISSIONS) {
        if (!prevCompleted.includes(m.id) && m.check(collection)) {
          newlyCompleted.push(m.id);
          coinGain += m.reward;
        }
      }
      const completed = [...prevCompleted, ...newlyCompleted];
      const newWorld = computeWorld(completed);
      return { newlyCompleted, coinGain, completed, newWorld };
    },
    [],
  );

  const keepCreatures = useCallback<GameApi["keepCreatures"]>(
    (creatures) => {
      setState((s) => {
        const collection = [...s.collection, ...creatures];
        const { newlyCompleted, coinGain, completed, newWorld } =
          evaluateMissionsAndWorld(collection, s.completedMissions);

        // Dex: registra fenótipos descobertos no mundo atual
        const dex = new Set(s.discoveredPhenotypes);
        for (const c of collection) dex.add(phenotypeKey(c, s.world));

        // Dex do mundo completou agora?
        const cat = dexCatalog(s.world);
        const wasComplete = cat.every((e) => s.discoveredPhenotypes.includes(e.key));
        const nowComplete = cat.every((e) => dex.has(e.key));
        if (nowComplete && !wasComplete) {
          setTimeout(() => {
            toast(STRINGS.messages.dexWorldComplete, { icon: "🗂️" });
            playSfx("ding");
          }, 1000);
        }

        // feedback
        if (newlyCompleted.length) {
          setTimeout(() => {
            for (const id of newlyCompleted) {
              const m = MISSIONS.find((x) => x.id === id);
              toast.success(`${STRINGS.messages.missionComplete}`, {
                description: m ? `${m.label}: ${m.text}` : undefined,
              });
            }
            playSfx("ding");
          }, 400);
        }
        if (newWorld > s.world) {
          setTimeout(() => {
            toast(STRINGS.messages.newWorld(WORLD_NAMES[newWorld]), {
              icon: "🌍",
            });
            playSfx("chime");
          }, 700);
        }

        return {
          ...s,
          collection,
          completedMissions: completed,
          coins: s.coins + coinGain,
          world: newWorld,
          discoveredPhenotypes: Array.from(dex),
        };
      });
    },
    [evaluateMissionsAndWorld],
  );

  const releaseCreature = useCallback<GameApi["releaseCreature"]>((id) => {
    setState((s) => ({
      ...s,
      collection: s.collection.filter((c) => c.id !== id),
    }));
  }, []);

  const renameCreature = useCallback<GameApi["renameCreature"]>((id, name) => {
    setState((s) => ({
      ...s,
      collection: s.collection.map((c) =>
        c.id === id ? { ...c, nickname: name } : c,
      ),
    }));
  }, []);

  const markLensUsed = useCallback<GameApi["markLensUsed"]>(() => {
    setState((s) =>
      s.unlockedConcepts.includes("lente-usada")
        ? s
        : {
            ...s,
            unlockedConcepts: [...s.unlockedConcepts, "lente-usada", "punnett"],
          },
    );
  }, []);

  const scan = useCallback<GameApi["scan"]>((creatureId, gene) => {
    const s = stateRef.current;
    if (s.coins <= 0) return null;
    const creature = s.collection.find((c) => c.id === creatureId);
    if (!creature) return null;
    const geno = formatGenotype(creature, gene);
    const p = phenotype(creature);
    const firstScan = !s.unlockedConcepts.includes("cruzamento-teste");
    // Escanear = cruzamento-teste instantâneo: desbloqueia o conceito no Codex.
    setState((st) => ({
      ...st,
      coins: st.coins - 1,
      unlockedConcepts: st.unlockedConcepts.includes("cruzamento-teste")
        ? st.unlockedConcepts
        : [...st.unlockedConcepts, "cruzamento-teste"],
    }));
    if (firstScan) {
      setTimeout(() => {
        toast("🔬 Isto é um cruzamento-teste instantâneo!", {
          description: "Veja no Codex como descobrir alelos escondidos.",
        });
      }, 700);
    }
    return `${geno} — ${(p as Record<string, string>)[gene]}`;
  }, []);

  const toggleMute = useCallback<GameApi["toggleMute"]>(() => {
    setState((s) => ({ ...s, muted: !s.muted }));
  }, []);

  const setSeenTitle = useCallback<GameApi["setSeenTitle"]>(() => {
    setState((s) => ({ ...s, seenTitle: true }));
  }, []);

  const setSeenIntro = useCallback<GameApi["setSeenIntro"]>(() => {
    setState((s) => ({ ...s, seenIntro: true }));
  }, []);

  const toggleFavorite = useCallback<GameApi["toggleFavorite"]>((id) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(id)
        ? s.favorites.filter((x) => x !== id)
        : [...s.favorites, id],
    }));
  }, []);

  const resetProgress = useCallback<GameApi["resetProgress"]>(() => {
    resetState();
    setState(defaultState());
  }, []);

  const isConceptUnlocked = useCallback<GameApi["isConceptUnlocked"]>(
    (id) => stateRef.current.unlockedConcepts.includes(id),
    [],
  );

  const api = useMemo<GameApi>(
    () => ({
      ...state,
      recordBreed,
      keepCreatures,
      releaseCreature,
      renameCreature,
      markLensUsed,
      scan,
      toggleMute,
      setSeenTitle,
      setSeenIntro,
      toggleFavorite,
      resetProgress,
      isConceptUnlocked,
    }),
    [
      state,
      recordBreed,
      keepCreatures,
      releaseCreature,
      renameCreature,
      markLensUsed,
      scan,
      toggleMute,
      setSeenTitle,
      setSeenIntro,
      toggleFavorite,
      resetProgress,
      isConceptUnlocked,
    ],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
