// SettingsPanel — som (mute persistente) e reiniciar progresso (com confirmação).
import { useState } from 'react'
import Modal from './Modal.jsx'
import { useGame } from '../state/GameContext.jsx'
import { S } from '../data/strings.js'
import { Sfx } from '../audio/sfx.js'

export default function SettingsPanel({ onClose }) {
  const { state, dispatch } = useGame()
  const [confirmando, setConfirmando] = useState(false)

  function toggleSom() {
    Sfx.click()
    dispatch({ type: 'TOGGLE_SOM' })
  }

  return (
    <Modal titulo={S.config} emoji="⚙️" onClose={onClose} maxW="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-fofo bg-fundo p-4">
          <span className="font-semibold text-tinta">🔊 {S.som}</span>
          <button
            className={state.som ? 'btn-verde !py-2' : 'btn-claro !py-2'}
            onPointerUp={toggleSom}
            aria-pressed={state.som}
          >
            {state.som ? 'Ligado' : 'Mudo'}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-fofo bg-fundo p-4">
          <span className="font-semibold text-tinta">🪙 {S.moedas}</span>
          <span className="chip">{state.moeda}</span>
        </div>

        {!confirmando ? (
          <button className="btn-claro w-full !text-rosa" onPointerUp={() => setConfirmando(true)}>
            🗑️ {S.reiniciar}
          </button>
        ) : (
          <div className="space-y-3 rounded-fofo border-2 border-rosa/40 bg-rosa/5 p-4">
            <p className="text-sm font-semibold text-tinta">{S.reiniciarConfirma}</p>
            <div className="flex gap-2">
              <button
                className="btn-rosa flex-1"
                onPointerUp={() => {
                  dispatch({ type: 'REINICIAR' })
                  onClose()
                }}
              >
                {S.reiniciarSim}
              </button>
              <button className="btn-claro flex-1" onPointerUp={() => setConfirmando(false)}>
                {S.cancelar}
              </button>
            </div>
          </div>
        )}

        <p className="pt-2 text-center text-xs text-tinta/40">
          Mendelitos · progresso salvo automaticamente neste navegador.
        </p>
      </div>
    </Modal>
  )
}
