import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { GameProvider, useGame } from "./state/GameContext";
import { TitleScreen } from "./screens/TitleScreen";
import { Lab } from "./screens/Lab";
import { BreedScreen } from "./screens/BreedScreen";
import { startMusic } from "./engine/audio";

type Screen = "title" | "lab" | "breed";

function Game() {
  const game = useGame();
  const [screen, setScreen] = useState<Screen>(game.seenTitle ? "lab" : "title");

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
    <div className="m-app-bg flex min-h-[100dvh] w-full justify-center text-[#463A5E]">
      <div className="m-app-bg relative w-full max-w-md shadow-[0_0_60px_-20px_rgba(174,150,232,0.4)]">
        {screen === "title" && (
          <TitleScreen
            onStart={() => {
              game.setSeenTitle();
              if (!game.muted) startMusic();
              setScreen("lab");
            }}
          />
        )}
        {screen === "lab" && <Lab onBreed={() => setScreen("breed")} />}
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
