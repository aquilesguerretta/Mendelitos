// Missions — painel de missões (seção 7.4). Cada uma força entender a
// genética por trás. Concluídas mostram ✓; a ativa fica destacada.
import Modal from './Modal.jsx'
import { MISSOES, ORDEM_MISSOES } from '../data/missions.js'
import { useGame } from '../state/GameContext.jsx'
import { S } from '../data/strings.js'

export default function Missions({ onClose }) {
  const { state } = useGame()
  const concluidas = state.missoes.concluidas
  const ativa = ORDEM_MISSOES.find((id) => !concluidas.includes(id))
  const feitas = concluidas.length

  return (
    <Modal
      titulo={S.botoes.missoes}
      emoji="🎯"
      onClose={onClose}
      footer={
        <div className="flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-verde/25">
            <div
              className="h-full rounded-full bg-verde transition-all"
              style={{ width: `${(feitas / MISSOES.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-verde">
            {feitas}/{MISSOES.length}
          </span>
        </div>
      }
    >
      <div className="space-y-3">
        {MISSOES.map((m) => {
          const concluida = concluidas.includes(m.id)
          const eAtiva = m.id === ativa
          const bloqueada = !concluida && m.world > state.mundo
          let cls = 'border-tinta/15 bg-fundo/60 opacity-70'
          if (concluida) cls = 'border-verde/40 bg-verde/10'
          else if (eAtiva) cls = 'border-roxo bg-white shadow-suave'
          return (
            <div key={m.id} className={`rounded-fofo border-2 p-4 ${cls}`}>
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${
                    concluida ? 'bg-verde text-white' : 'bg-roxo/15 text-roxo'
                  }`}
                >
                  {concluida ? '✓' : m.id.replace('M', '')}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-tinta">
                    {bloqueada && !concluida ? '🔒 ' : ''}
                    {m.texto} {m.bonus && <span className="chip ml-1">bônus</span>}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-tinta/60">
                    <span className="rounded-full bg-roxo/10 px-2 py-0.5 font-semibold text-roxo">
                      {m.conceito}
                    </span>
                    <span className="font-semibold text-amber-600">🪙 {m.recompensa.moeda}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
