// App — navegação por estado (uma tela ativa por vez) + toasts + áudio.
import { useEffect } from 'react'
import { useGame } from './state/GameContext.jsx'
import TitleScreen from './screens/TitleScreen.jsx'
import Lab from './screens/Lab.jsx'
import BreedScreen from './screens/BreedScreen.jsx'
import Toasts from './components/Toasts.jsx'
import { Sfx } from './audio/sfx.js'

export default function App() {
  const { state } = useGame()

  // Mute persistente: o áudio reflete sempre state.som.
  useEffect(() => {
    Sfx.setMuted(!state.som)
    if (!state.som) Sfx.stopMusic()
    else if (state.tela !== 'titulo') Sfx.startMusic()
  }, [state.som, state.tela])

  return (
    <div className="min-h-[100dvh]">
      <Toasts />
      {state.tela === 'titulo' && <TitleScreen />}
      {state.tela === 'lab' && <Lab />}
      {state.tela === 'breed' && <BreedScreen />}
    </div>
  )
}
