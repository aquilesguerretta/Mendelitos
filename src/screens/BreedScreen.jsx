// ============================================================================
// BreedScreen — selecionar pais -> Lente (opcional) -> Cruzar! -> segregação
// -> ovos chocam -> revelar filhotes -> cartas de descoberta -> guardar/soltar.
// (seções 5 / 10)
// ============================================================================

import { useEffect, useMemo, useState } from 'react'
import { useGame } from '../state/GameContext.jsx'
import { breed, normalizePair } from '../engine/breeding.js'
import { evaluateDiscoveries } from '../engine/discoveries.js'
import { isRare } from '../engine/rarity.js'
import { CARTAS } from '../data/cards.js'
import { S } from '../data/strings.js'
import CreatureCard from '../components/CreatureCard.jsx'
import Creature from '../components/Creature/index.jsx'
import Segregation from '../components/Segregation.jsx'
import Egg from '../components/Egg.jsx'
import DiscoveryCard from '../components/DiscoveryCard.jsx'
import PredictionLens from '../components/PredictionLens.jsx'
import Confetti from '../components/Confetti.jsx'
import { Sfx } from '../audio/sfx.js'

export default function BreedScreen() {
  const { state, dispatch } = useGame()
  const [fase, setFase] = useState('select') // select | animando | revelando | guardar
  const [maeId, setMaeId] = useState(null)
  const [paiId, setPaiId] = useState(null)
  const [litter, setLitter] = useState([])
  const [filaCartas, setFilaCartas] = useState([])
  const [cartaIdx, setCartaIdx] = useState(0)
  const [revelados, setRevelados] = useState(0)
  const [lente, setLente] = useState(false)
  const [manter, setManter] = useState({}) // id -> bool

  const mae = useMemo(() => state.colecao.find((c) => c.id === maeId) || null, [state.colecao, maeId])
  const pai = useMemo(() => state.colecao.find((c) => c.id === paiId) || null, [state.colecao, paiId])
  const parValido = mae && pai

  function selecionar(c) {
    Sfx.click()
    if (c.sex === 'XX') setMaeId((id) => (id === c.id ? null : c.id))
    else setPaiId((id) => (id === c.id ? null : c.id))
  }

  function iniciarCruzamento() {
    if (!parValido) return
    const par = normalizePair(mae, pai)
    if (!par) return
    Sfx.heart()
    const ninhada = breed(par.mother, par.father)
    const thisBreed = state.breedCount + 1
    const disc = evaluateDiscoveries({
      parents: par,
      litter: ninhada,
      breedCount: thisBreed,
      world: state.mundo,
      discovered: new Set(state.cardsVistos),
    })
    setLitter(ninhada)
    setFilaCartas(disc.cards.map((id) => CARTAS[id]))
    setCartaIdx(0)
    setRevelados(0)
    setManter(Object.fromEntries(ninhada.map((f) => [f.id, true])))
    setLente(false)
    dispatch({ type: 'APLICAR_CRUZAMENTO', cards: disc.cards, codex: disc.codex, litterSeen: ninhada })
    setFase('animando')
  }

  // Revela os ovos um a um.
  useEffect(() => {
    if (fase !== 'revelando') return
    if (revelados >= litter.length) return
    const t = setTimeout(() => {
      const filho = litter[revelados]
      Sfx.pop()
      if (isRare(filho, state.mundo)) Sfx.raro()
      setRevelados((r) => r + 1)
    }, 650)
    return () => clearTimeout(t)
  }, [fase, revelados, litter, state.mundo])

  // Quando todos revelados: toast de raro + abre cartas (ou vai pra guardar).
  useEffect(() => {
    if (fase !== 'revelando' || revelados < litter.length || litter.length === 0) return
    const temRaro = litter.some((f) => isRare(f, state.mundo))
    if (temRaro) dispatch({ type: 'PUSH_TOAST', tipo: 'raro', texto: S.raro })
    if (filaCartas.length === 0) {
      const t = setTimeout(() => setFase('guardar'), 600)
      return () => clearTimeout(t)
    }
  }, [fase, revelados, litter, filaCartas.length, state.mundo, dispatch])

  function proximaCarta() {
    Sfx.click()
    if (cartaIdx + 1 < filaCartas.length) {
      setCartaIdx((i) => i + 1)
    } else {
      setFilaCartas([])
      setFase('guardar')
    }
  }

  function confirmarGuardar() {
    const mantidos = litter.filter((f) => manter[f.id])
    Sfx.ding()
    dispatch({ type: 'GUARDAR_FILHOTES', mantidos })
    voltarLab()
  }

  function voltarLab() {
    dispatch({ type: 'LIMPAR_ULTIMAS_CARTAS' })
    dispatch({ type: 'SET_TELA', tela: 'lab' })
  }

  // mostra a carta atual (sobreposta) durante a revelação
  const mostrarCarta =
    fase === 'revelando' && revelados >= litter.length && filaCartas.length > 0
  useEffect(() => {
    if (mostrarCarta) Sfx.chime()
  }, [mostrarCarta, cartaIdx])

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-4 pb-8 pt-4">
      <header className="mb-3 flex items-center justify-between">
        <button className="btn-claro !px-3 !py-2" onClick={voltarLab}>
          ← {S.botoes.voltar}
        </button>
        <h1 className="font-titulo text-2xl font-bold text-roxo">💞 {S.botoes.cruzar}</h1>
        <span className="w-16" />
      </header>

      {/* ----------------------------- SELECIONAR ----------------------------- */}
      {fase === 'select' && (
        <>
          <p className="mb-1 text-center font-semibold text-tinta">{S.selecionarPais}</p>
          <p className="mb-4 text-center text-sm text-tinta/60">{S.selecionarPaisDica}</p>

          {/* slots dos pais escolhidos */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <SlotPai titulo={S.mae} creature={mae} cor="rosa" />
            <SlotPai titulo={S.pai} creature={pai} cor="roxo" />
          </div>

          <div className="mb-24 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {state.colecao.map((c) => (
              <CreatureCard
                key={c.id}
                creature={c}
                world={state.mundo}
                selecionavel
                selecionado={c.id === maeId || c.id === paiId}
                papel={c.id === paiId ? 'pai' : c.id === maeId ? 'mae' : null}
                onSelect={selecionar}
              />
            ))}
          </div>

          {/* barra de ação fixa */}
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-roxo/10 bg-fundo/95 px-4 py-3 backdrop-blur">
            <div className="mx-auto flex max-w-3xl gap-2">
              <button
                className="btn-fantasma flex-1"
                disabled={!parValido}
                style={{ opacity: parValido ? 1 : 0.5 }}
                onClick={() => parValido && setLente(true)}
              >
                🔮 {S.botoes.lente}
              </button>
              <button
                className="btn-primario flex-1"
                disabled={!parValido}
                style={{ opacity: parValido ? 1 : 0.5 }}
                onClick={iniciarCruzamento}
              >
                💞 {S.botoes.cruzarConfirmar}
              </button>
            </div>
            {!parValido && (
              <p className="mt-1 text-center text-xs text-rosa">{S.parInvalido}</p>
            )}
          </div>
        </>
      )}

      {/* ----------------------------- ANIMANDO ------------------------------ */}
      {fase === 'animando' && (
        <div className="flex flex-1 flex-col justify-center">
          <p className="mb-2 text-center text-sm font-bold uppercase tracking-wide text-tinta/50">
            {S.segregando}
          </p>
          <Segregation
            mother={normalizePair(mae, pai).mother}
            father={normalizePair(mae, pai).father}
            litter={litter}
            onComplete={() => setFase('revelando')}
          />
        </div>
      )}

      {/* ---------------------------- REVELANDO ------------------------------ */}
      {fase === 'revelando' && (
        <div className="flex flex-1 flex-col justify-center">
          <p className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-tinta/50">
            {revelados < litter.length ? S.chocando : S.ninhada}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {litter.map((f, i) => (
              <div key={f.id} className="flex flex-col items-center">
                {i < revelados ? (
                  <div className="relative selo-novo">
                    {isRare(f, state.mundo) && <Confetti count={16} />}
                    <Creature creature={f} world={state.mundo} size={96} interactive shiny={isRare(f, state.mundo)} />
                    <p className="text-center text-[11px] font-bold text-tinta/60">
                      {S.sexoLabel[f.sex]}
                    </p>
                  </div>
                ) : (
                  <Egg estado={i === revelados ? 'chocando' : 'tremendo'} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------- GUARDAR ------------------------------- */}
      {fase === 'guardar' && (
        <div className="flex flex-1 flex-col">
          <p className="mb-4 text-center font-semibold text-tinta">{S.guardarSoltar}</p>
          <div className="mb-24 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {litter.map((f) => {
              const fica = manter[f.id]
              return (
                <div
                  key={f.id}
                  className={`card flex flex-col items-center gap-2 border-2 p-3 transition ${
                    fica ? 'border-verde/50' : 'border-tinta/10 opacity-60'
                  }`}
                >
                  <Creature creature={f} world={state.mundo} size={88} interactive shiny={isRare(f, state.mundo)} />
                  <p className="text-[11px] font-bold text-tinta/60">{S.sexoLabel[f.sex]}</p>
                  <button
                    className={fica ? 'btn-verde !py-2 w-full' : 'btn-claro !py-2 w-full'}
                    onClick={() => {
                      Sfx.click()
                      setManter((m) => ({ ...m, [f.id]: !m[f.id] }))
                    }}
                  >
                    {fica ? '✓ ' + S.botoes.guardar : S.botoes.soltar}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-roxo/10 bg-fundo/95 px-4 py-3 backdrop-blur">
            <div className="mx-auto flex max-w-3xl">
              <button className="btn-primario w-full" onClick={confirmarGuardar}>
                {S.botoes.continuar} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* sobreposições */}
      {lente && parValido && (
        <PredictionLens
          mother={normalizePair(mae, pai).mother}
          father={normalizePair(mae, pai).father}
          onClose={() => setLente(false)}
          onCruzar={() => {
            setLente(false)
            iniciarCruzamento()
          }}
        />
      )}

      {mostrarCarta && (
        <DiscoveryCard
          carta={filaCartas[cartaIdx]}
          indice={cartaIdx + 1}
          total={filaCartas.length}
          onNext={proximaCarta}
        />
      )}
    </div>
  )
}

function SlotPai({ titulo, creature, cor }) {
  const borda = cor === 'rosa' ? 'border-rosa/40' : 'border-roxo/40'
  return (
    <div className={`card flex flex-col items-center gap-1 border-2 border-dashed ${borda} p-3`}>
      <span className={`text-xs font-bold ${cor === 'rosa' ? 'text-rosa' : 'text-roxo'}`}>{titulo}</span>
      {creature ? (
        <Creature creature={creature} world={3} size={72} idle />
      ) : (
        <div className="flex h-[72px] w-[72px] items-center justify-center text-3xl text-tinta/25">?</div>
      )}
    </div>
  )
}
