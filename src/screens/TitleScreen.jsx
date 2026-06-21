// TitleScreen — a capa. "Mendelitos · Crie. Descubra. Colecione."
import Creature from '../components/Creature/index.jsx'
import { useGame } from '../state/GameContext.jsx'
import { S } from '../data/strings.js'
import { Sfx } from '../audio/sfx.js'

const DEMO = [
  { id: 'd1', sex: 'XX', genes: { cor: ['C', 'C'], orelhas: ['O', 'o'], padrao: ['M', 'M'], crista: ['V', 'V'], escamas: ['A', 'A'], olhos: ['G', 'G'] } },
  { id: 'd2', sex: 'XY', genes: { cor: ['c', 'c'], orelhas: ['o', 'o'], padrao: ['m', 'm'], crista: ['B', 'B'], escamas: ['R', 'R'], olhos: ['g'] } },
  { id: 'd3', sex: 'XX', genes: { cor: ['C', 'c'], orelhas: ['O', 'O'], padrao: ['m', 'm'], crista: ['V', 'B'], escamas: ['A', 'R'], olhos: ['G', 'g'] } },
]

export default function TitleScreen() {
  const { state, dispatch } = useGame()

  function jogar() {
    Sfx.unlock()
    Sfx.click()
    if (state.som) Sfx.startMusic()
    dispatch({ type: 'SET_TELA', tela: 'lab' })
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex items-end justify-center gap-2">
        {DEMO.map((c, i) => (
          <div key={c.id} className="animate-flutua" style={{ animationDelay: `${i * 0.3}s` }}>
            <Creature creature={c} world={3} size={i === 1 ? 110 : 88} interactive />
          </div>
        ))}
      </div>

      <div>
        <h1 className="font-titulo text-6xl font-bold text-roxo drop-shadow-sm sm:text-7xl">
          {S.titulo}
        </h1>
        <p className="mt-2 text-lg font-semibold text-tinta/70">{S.subtitulo}</p>
      </div>

      <button className="btn-primario px-10 py-4 text-xl" onClick={jogar}>
        ▶ {S.botoes.jogar}
      </button>

      <p className="max-w-sm text-sm text-tinta/50">
        Cruze bichinhos e descubra as Leis de Mendel de verdade — a aparência de cada filhote é o
        genótipo dele.
      </p>
    </div>
  )
}
