// Codex — as 11 entradas (seção 7.3). Entradas bloqueadas aparecem como "???".
// A explicação longa fica guardada aqui (a dose pequena vem nas cartas).
import Modal from './Modal.jsx'
import CodexDiagram from './CodexDiagram.jsx'
import { CODEX } from '../data/codex.js'
import { useGame } from '../state/GameContext.jsx'
import { S } from '../data/strings.js'

export default function Codex({ onClose }) {
  const { state } = useGame()
  const abertos = state.codexAberto
  const total = CODEX.length
  const desbloqueados = abertos.length

  return (
    <Modal
      titulo={S.botoes.codex}
      emoji="📖"
      onClose={onClose}
      footer={
        <div className="flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-roxo/15">
            <div
              className="h-full rounded-full bg-roxo transition-all"
              style={{ width: `${(desbloqueados / total) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-roxo">
            {desbloqueados}/{total}
          </span>
        </div>
      }
    >
      <div className="space-y-3">
        {CODEX.map((e) => {
          const aberto = abertos.includes(e.n)
          if (!aberto) {
            return (
              <div
                key={e.n}
                className="flex items-center gap-3 rounded-fofo border-2 border-dashed border-roxo/20 bg-fundo/60 px-4 py-4 text-tinta/40"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-roxo/10 font-bold">
                  {e.n}
                </span>
                <span className="font-semibold">{S.dexBloqueado}</span>
              </div>
            )
          }
          return (
            <div key={e.n} className="rounded-fofo border-2 border-roxo/15 bg-white p-4 shadow-suave">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-roxo font-bold text-white">
                  {e.n}
                </span>
                <h3 className="font-titulo text-lg font-bold text-tinta">{e.titulo}</h3>
              </div>
              <p className="mb-2 text-sm italic text-rosa">Você encontrou: {e.encontrou}</p>
              <p className="mb-3 text-base leading-relaxed text-tinta">{e.texto}</p>
              <CodexDiagram tipo={e.diagrama} />
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
