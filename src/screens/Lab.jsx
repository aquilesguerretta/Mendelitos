// Lab — o hub. Coleção em grade + [Cruzar] [Missões] [Codex] [Dex] [⚙].
import { useState } from 'react'
import { useGame } from '../state/GameContext.jsx'
import CreatureCard from '../components/CreatureCard.jsx'
import Missions from '../components/Missions.jsx'
import Codex from '../components/Codex.jsx'
import Dex from '../components/Dex.jsx'
import SettingsPanel from '../components/SettingsPanel.jsx'
import { S } from '../data/strings.js'
import { MUNDOS } from '../data/genes.js'
import { MISSOES_POR_ID, ORDEM_MISSOES } from '../data/missions.js'
import { phenotype, genotipoStr, isHeterozigoto } from '../engine/phenotype.js'
import { Sfx } from '../audio/sfx.js'

export default function Lab() {
  const { state, dispatch } = useGame()
  const [painel, setPainel] = useState(null)

  const ativaId = ORDEM_MISSOES.find((id) => !state.missoes.concluidas.includes(id))
  const ativa = ativaId ? MISSOES_POR_ID[ativaId] : null

  function abrir(p) {
    Sfx.click()
    setPainel(p)
  }
  function cruzar() {
    Sfx.click()
    dispatch({ type: 'SET_TELA', tela: 'breed' })
  }
  function escanear(c) {
    const fen = phenotype(c)
    const genoCor = genotipoStr(c.genes.cor, 'cor')
    const portador = isHeterozigoto(c.genes.cor) ? ' portador' : ''
    const resumo = `${genoCor} — ${S.fenLabel.cor[fen.cor].toLowerCase()}${portador}`
    dispatch({ type: 'ESCANEAR', id: c.id, genotipo: resumo })
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-5xl flex-col px-4 pb-8 pt-4">
      {/* cabeçalho */}
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-titulo text-3xl font-bold text-roxo">{S.titulo}</h1>
          <p className="text-xs font-semibold text-tinta/60">
            🌍 {MUNDOS[state.mundo].nome} · {S.laboratorio}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip">🪙 {state.moeda}</span>
          <button className="btn-claro !px-3 !py-2" onPointerUp={() => abrir('config')} aria-label={S.config}>
            ⚙
          </button>
        </div>
      </header>

      {/* missão ativa */}
      {ativa && (
        <button
          className="mb-3 flex items-center gap-2 rounded-fofo border-2 border-roxo/20 bg-white px-4 py-3 text-left shadow-suave active:scale-[0.99]"
          onPointerUp={() => abrir('missoes')}
        >
          <span className="text-xl">🎯</span>
          <span className="flex-1 text-sm font-semibold text-tinta">{ativa.texto}</span>
          <span className="text-xs font-bold text-roxo">ver →</span>
        </button>
      )}

      {/* navegação principal */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button className="btn-primario col-span-2 text-lg sm:col-span-1" onPointerUp={cruzar}>
          💞 {S.botoes.cruzar}
        </button>
        <button className="btn-sol" onPointerUp={() => abrir('missoes')}>
          🎯 {S.botoes.missoes}
        </button>
        <button className="btn-rosa" onPointerUp={() => abrir('codex')}>
          📖 {S.botoes.codex}
        </button>
        <button className="btn-verde" onPointerUp={() => abrir('dex')}>
          🗂️ {S.botoes.dex}
        </button>
      </div>

      {/* coleção */}
      <section className="flex-1">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-tinta/50">
          {S.colecao} ({state.colecao.length})
        </h2>
        {state.colecao.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-fofo border-2 border-dashed border-roxo/20 bg-white/60 px-6 py-12 text-center">
            <span className="mb-2 text-4xl">🥚</span>
            <p className="max-w-xs font-semibold text-tinta/70">{S.labVazio}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {state.colecao.map((c) => (
              <CreatureCard
                key={c.id}
                creature={c}
                world={state.mundo}
                escaneado={state.escaneados.includes(c.id)}
                onScan={state.mundo >= 1 ? escanear : null}
              />
            ))}
          </div>
        )}
      </section>

      {painel === 'missoes' && <Missions onClose={() => setPainel(null)} />}
      {painel === 'codex' && <Codex onClose={() => setPainel(null)} />}
      {painel === 'dex' && <Dex onClose={() => setPainel(null)} />}
      {painel === 'config' && <SettingsPanel onClose={() => setPainel(null)} />}
    </div>
  )
}
