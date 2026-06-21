// Toasts — notificações transitórias (missão, mundo, dex, scanner, aviso).
// Tocam o som apropriado ao surgir e somem sozinhas.
import { useEffect, useRef } from 'react'
import { useGame } from '../state/GameContext.jsx'
import { Sfx } from '../audio/sfx.js'

const SOM = {
  missao: () => Sfx.ding(),
  dex: () => Sfx.ding(),
  mundo: () => Sfx.chime(),
  scanner: () => Sfx.snap(),
  raro: () => Sfx.raro(),
  aviso: () => Sfx.click(),
}

const ESTILO = {
  missao: 'bg-verde text-white',
  dex: 'bg-sol text-tinta',
  mundo: 'bg-roxo text-white',
  scanner: 'bg-white text-tinta',
  raro: 'bg-rosa text-white',
  aviso: 'bg-white text-tinta',
}

export default function Toasts() {
  const { state, dispatch } = useGame()
  const agendados = useRef(new Set())

  useEffect(() => {
    for (const t of state.toasts) {
      if (agendados.current.has(t.id)) continue
      agendados.current.add(t.id)
      if (SOM[t.tipo]) SOM[t.tipo]()
      setTimeout(() => {
        dispatch({ type: 'LIMPAR_TOASTS', ids: [t.id] })
        agendados.current.delete(t.id)
      }, 3400)
    }
  }, [state.toasts, dispatch])

  if (state.toasts.length === 0) return null
  return (
    <div className="pointer-none fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-3">
      {state.toasts.map((t) => (
        <div
          key={t.id}
          className={`selo-novo max-w-md rounded-fofo px-5 py-3 text-center font-semibold shadow-carta ${ESTILO[t.tipo] || ESTILO.aviso}`}
        >
          {t.texto}
        </div>
      ))}
    </div>
  )
}
