import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { GameProvider, useGame } from "./state/GameContext";
import { TitleScreen } from "./screens/TitleScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { Lab } from "./screens/Lab";
import { BreedScreen } from "./screens/BreedScreen";
import { startMusic } from "./engine/audio";

// Pangênia (Evolução) escondida para a apresentação — código preservado em
// ./screens/EvolutionScreen e ./engine/population; basta religar quando quiser.

type Screen = "title" | "intro" | "lab" | "breed";

function Game() {
  const game = useGame();
  // Sempre abre no menu inicial ao carregar/recarregar a página.
  const [screen, setScreen] = useState<Screen>("title");

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
              // Jogar sempre mostra o tutorial (tem botão "Pular" pra quem quiser).
              setScreen("intro");
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
          <Lab onBreed={() => setScreen("breed")} onHome={() => setScreen("title")} />
        )}
        {screen === "breed" && <BreedScreen onBack={() => setScreen("lab")} />}
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
