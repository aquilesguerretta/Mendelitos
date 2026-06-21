import { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "sonner";
import { GameProvider, useGame } from "./state/GameContext";
import { TitleScreen } from "./screens/TitleScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { Lab } from "./screens/Lab";
import { BreedScreen } from "./screens/BreedScreen";
import { startMusic } from "./engine/audio";

// Evolução carrega recharts — sob demanda, pra não pesar a abertura.
const EvolutionScreen = lazy(() =>
  import("./screens/EvolutionScreen").then((m) => ({ default: m.EvolutionScreen })),
);

type Screen = "title" | "intro" | "lab" | "breed" | "evolution";

function Game() {
  const game = useGame();
  const [screen, setScreen] = useState<Screen>(
    !game.seenTitle ? "title" : !game.seenIntro ? "intro" : "lab",
  );

  // A trilha só pode começar após um gesto do usuário (política de áudio).
  useEffect(() => {
    const onFirst = () => {
      if (!game.muted) startMusic();
      window.removeEventListener("pointerdown", onFirst);
    };
    window.addEventListener("pointerdown", onFirst);
    return () => window.removeEventListener("pointerdown", onFirst);
  }, [game.muted]);

  return (
    <div className="m-app-bg flex min-h-[100dvh] w-full justify-center text-[#4A4063]">
      <div className="m-app-bg relative w-full max-w-md shadow-[0_0_60px_-20px_rgba(174,150,232,0.4)]">
        <div className="m-grain-overlay" />
        {screen === "title" && (
          <TitleScreen
            onStart={() => {
              game.setSeenTitle();
              if (!game.muted) startMusic();
              setScreen(game.seenIntro ? "lab" : "intro");
            }}
          />
        )}
        {screen === "intro" && (
          <IntroScreen
            onDone={() => {
              game.setSeenIntro();
              setScreen("lab");
            }}
          />
        )}
        {screen === "lab" && (
          <Lab onBreed={() => setScreen("breed")} onEvolution={() => setScreen("evolution")} />
        )}
        {screen === "breed" && <BreedScreen onBack={() => setScreen("lab")} />}
        {screen === "evolution" && (
          <Suspense
            fallback={
              <div className="flex h-[100dvh] items-center justify-center font-display text-[#7E64B0]">
                🌍 Carregando Pangênia…
              </div>
            }
          >
            <EvolutionScreen onBack={() => setScreen("lab")} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Game />
      <Toaster position="top-center" richColors />
    </GameProvider>
  );
}
