// Dex — catálogo de aparências por mundo. Slots descobertos mostram o
// Mendelito; bloqueados mostram "???". (seção 5 / 7.1)
import { useState } from 'react'
import Modal from './Modal.jsx'
import Creature from './Creature/index.jsx'
import { allDexSlots } from '../engine/dex.js'
import { useGame } from '../state/GameContext.jsx'
import { S } from '../data/strings.js'
import { MUNDOS, genesAtivos } from '../data/genes.js'

function rotuloFen(fen, world) {
  const ativos = genesAtivos(world)
  const partes = []
  if (ativos.includes('cor')) partes.push(S.fenLabel.cor[fen.cor])
  if (ativos.includes('orelhas')) partes.push(S.fenLabel.orelhas[fen.orelhas])
  if (ativos.includes('padrao')) partes.push(S.fenLabel.padrao[fen.padrao])
  if (ativos.includes('crista')) partes.push(S.fenLabel.crista[fen.crista])
  if (ativos.includes('escamas')) partes.push(S.fenLabel.escamas[fen.escamas])
  if (ativos.includes('olhos')) partes.push(S.fenLabel.olhos[fen.olhos])
  return partes.join(' · ')
}

export default function Dex({ onClose }) {
  const { state } = useGame()
  const [mundo, setMundo] = useState(state.mundo)
  const slots = allDexSlots(mundo)
  const descobertos = slots.filter((s) => state.dex.includes(s.key)).length

  return (
    <Modal
      titulo={S.botoes.dex}
      emoji="🗂️"
      onClose={onClose}
      footer={
        <div className="flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-sol/30">
            <div
              className="h-full rounded-full bg-sol transition-all"
              style={{ width: `${(descobertos / slots.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-tinta/70">
            {descobertos}/{slots.length}
          </span>
        </div>
      }
    >
      {/* abas de mundo (só mundos já alcançados) */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[1, 2, 3]
          .filter((m) => m <= state.mundo)
          .map((m) => (
            <button
              key={m}
              className={m === mundo ? 'btn-primario !py-2' : 'btn-fantasma !py-2'}
              onPointerUp={() => setMundo(m)}
            >
              {MUNDOS[m].nome}
            </button>
          ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {slots.map((s) => {
          const achou = state.dex.includes(s.key)
          return (
            <div
              key={s.key}
              className={`flex flex-col items-center gap-1 rounded-fofo border-2 p-2 text-center ${
                achou ? 'border-roxo/20 bg-white' : 'border-dashed border-tinta/15 bg-fundo/60'
              }`}
            >
              {achou ? (
                <>
                  <Creature creature={s.creature} world={mundo} size={72} interactive idle={false} />
                  <span className="text-[11px] font-semibold leading-tight text-tinta/80">
                    {rotuloFen(s.fen, mundo)}
                  </span>
                </>
              ) : (
                <>
                  <div className="flex h-[72px] w-[72px] items-center justify-center text-3xl text-tinta/30">
                    ❔
                  </div>
                  <span className="text-[11px] font-semibold text-tinta/40">{S.dexBloqueado}</span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
