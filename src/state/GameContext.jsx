// ============================================================================
// GameContext.jsx — Estado global do jogo (coleção, descobertas, codex,
// missões, mundo, moeda, Dex). Persistido em localStorage (seção 12).
//
// Fonte única de verdade. A UI despacha ações; o reducer recalcula progresso
// (missões -> moeda -> mundo) de forma determinística.
// ============================================================================

import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { makeStarterPair } from '../engine/starters.js'
import { semTrace } from '../engine/breeding.js'
import { dexKey, allDexSlots, totalDex } from '../engine/dex.js'
import { MISSOES, MISSOES_POR_ID, ORDEM_MISSOES } from '../data/missions.js'
import { MUNDOS } from '../data/genes.js'
import { S } from '../data/strings.js'
import { carregar, salvar, apagar } from '../engine/save.js'

const GameContext = createContext(null)

// --- Estado inicial ---------------------------------------------------------

function estadoInicial() {
  const [mae, pai] = makeStarterPair()
  const colecao = [mae, pai]
  const dex = colecao.map((c) => dexKey(c, 1))
  return {
    iniciado: true,
    tela: 'titulo',
    colecao,
    cardsVistos: [], // ids de cartas de descoberta já vistas
    codexAberto: [], // nºs de entradas do Codex desbloqueadas
    missoes: { concluidas: [] }, // ids concluídos
    mundo: 1,
    moeda: 0,
    breedCount: 0,
    dex: [...new Set(dex)], // assinaturas de aparência catalogadas
    dexMundosCompletos: [], // mundos cuja Dex já foi 100%
    escaneados: [], // ids de criaturas com genótipo revelado
    som: true,
    toasts: [], // notificações transitórias [{tipo, texto, id}]
    ultimasCartas: [], // cartas novas do último cruzamento (para a UI)
  }
}

// --- Progressão (missões -> moeda -> mundo) ---------------------------------

function derivaMundo(concluidas) {
  let m = 1
  if (concluidas.includes('M2')) m = Math.max(m, 2)
  if (concluidas.includes('M5')) m = Math.max(m, 3)
  return m
}

let _toastId = 0
function toast(tipo, texto) {
  _toastId += 1
  return { id: `t${_toastId}`, tipo, texto }
}

// Recalcula missões/mundo/moeda após qualquer mudança na coleção.
function recomputaProgresso(state) {
  const concluidas = [...state.missoes.concluidas]
  let moeda = state.moeda
  let mundo = state.mundo
  const toasts = []

  let mudou = true
  while (mudou) {
    mudou = false

    // Avança de mundo se as missões-marco foram concluídas.
    const mundoAlvo = derivaMundo(concluidas)
    if (mundoAlvo > mundo) {
      mundo = mundoAlvo
      toasts.push(toast('mundo', S.novoMundo(MUNDOS[mundo].nome)))
    }

    // Próxima missão pendente (desbloqueio sequencial).
    const proxima = ORDEM_MISSOES.find((id) => !concluidas.includes(id))
    if (proxima) {
      const m = MISSOES_POR_ID[proxima]
      if (m.world <= mundo && m.check(state.colecao)) {
        concluidas.push(proxima)
        moeda += m.recompensa.moeda || 0
        toasts.push(toast('missao', `${S.missaoCompleta} (${m.id})`))
        mudou = true
      }
    }
  }

  return { concluidas, moeda, mundo, toasts }
}

// Cataloga aparências vistas na Dex e verifica conclusão de mundo.
function catalogaDex(state, criaturasVistas, mundo) {
  const dex = new Set(state.dex)
  for (const c of criaturasVistas) dex.add(dexKey(c, mundo))
  const dexArr = [...dex]

  const completos = [...state.dexMundosCompletos]
  const toasts = []
  if (!completos.includes(mundo)) {
    const slots = allDexSlots(mundo).map((s) => s.key)
    const todos = slots.every((k) => dexArr.includes(k))
    if (todos && slots.length > 0) {
      completos.push(mundo)
      toasts.push(toast('dex', S.dexMundoCompleta))
    }
  }
  return { dex: dexArr, dexMundosCompletos: completos, toasts }
}

// --- Reducer ----------------------------------------------------------------

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...estadoInicial(), ...action.payload, tela: 'titulo', toasts: [], ultimasCartas: [] }

    case 'SET_TELA':
      return { ...state, tela: action.tela }

    case 'APLICAR_CRUZAMENTO': {
      // cards/codex já avaliados (puro) na UI; aqui só persistimos + Dex.
      const cardsVistos = [...new Set([...state.cardsVistos, ...action.cards])]
      const codexAberto = [...new Set([...state.codexAberto, ...action.codex])].sort((a, b) => a - b)
      const cat = catalogaDex(state, action.litterSeen, state.mundo)
      return {
        ...state,
        breedCount: state.breedCount + 1,
        cardsVistos,
        codexAberto,
        dex: cat.dex,
        dexMundosCompletos: cat.dexMundosCompletos,
        ultimasCartas: action.cards,
        toasts: [...state.toasts, ...cat.toasts],
      }
    }

    case 'GUARDAR_FILHOTES': {
      const novos = action.mantidos.map(semTrace)
      const colecao = [...state.colecao, ...novos]
      const base = { ...state, colecao }
      const prog = recomputaProgresso(base)
      // Recataloga (caso o mundo tenha avançado e os recém-guardados contem).
      const cat = catalogaDex(
        { ...base, dex: state.dex, dexMundosCompletos: state.dexMundosCompletos },
        novos,
        prog.mundo,
      )
      return {
        ...base,
        missoes: { concluidas: prog.concluidas },
        moeda: prog.moeda,
        mundo: prog.mundo,
        dex: cat.dex,
        dexMundosCompletos: cat.dexMundosCompletos,
        toasts: [...state.toasts, ...prog.toasts, ...cat.toasts],
      }
    }

    case 'APELIDAR': {
      const colecao = state.colecao.map((c) =>
        c.id === action.id ? { ...c, nickname: action.nickname } : c,
      )
      return { ...state, colecao }
    }

    case 'ESCANEAR': {
      if (state.escaneados.includes(action.id)) return state
      if (state.moeda < 1) {
        return { ...state, toasts: [...state.toasts, toast('aviso', S.scannerSemMoeda)] }
      }
      return {
        ...state,
        moeda: state.moeda - 1,
        escaneados: [...state.escaneados, action.id],
        toasts: [...state.toasts, toast('scanner', S.scanner(action.genotipo))],
      }
    }

    case 'PUSH_TOAST':
      return { ...state, toasts: [...state.toasts, toast(action.tipo, action.texto)] }

    case 'TOGGLE_SOM':
      return { ...state, som: !state.som }

    case 'LIMPAR_TOASTS':
      return { ...state, toasts: state.toasts.filter((t) => !action.ids.includes(t.id)) }

    case 'LIMPAR_ULTIMAS_CARTAS':
      return { ...state, ultimasCartas: [] }

    case 'REINICIAR':
      apagar()
      return { ...estadoInicial(), tela: 'lab' }

    default:
      return state
  }
}

// --- Persistência (campos serializáveis) ------------------------------------

const CAMPOS_PERSIST = [
  'iniciado',
  'colecao',
  'cardsVistos',
  'codexAberto',
  'missoes',
  'mundo',
  'moeda',
  'breedCount',
  'dex',
  'dexMundosCompletos',
  'escaneados',
  'som',
]

function paraSalvar(state) {
  const out = {}
  for (const k of CAMPOS_PERSIST) out[k] = state[k]
  return out
}

// --- Provider ---------------------------------------------------------------

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const salvo = carregar()
    if (salvo && salvo.iniciado) {
      return { ...estadoInicial(), ...salvo, tela: 'titulo', toasts: [], ultimasCartas: [] }
    }
    return estadoInicial()
  })

  // Salva sempre que um campo persistível muda.
  const primeiraVez = useRef(true)
  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false
    }
    salvar(paraSalvar(state))
  }, [
    state.colecao,
    state.cardsVistos,
    state.codexAberto,
    state.missoes,
    state.mundo,
    state.moeda,
    state.breedCount,
    state.dex,
    state.dexMundosCompletos,
    state.escaneados,
    state.som,
  ])

  const value = useMemo(() => ({ state, dispatch, totalDex }), [state])
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame deve ser usado dentro de <GameProvider>')
  return ctx
}
