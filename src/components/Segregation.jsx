// ============================================================================
// Segregation — A ANIMAÇÃO CENTRAL (seções 10 / 4.3).
// Os aleliozinhos voam visivelmente de cada pai (um de cada) e dão um `snap`
// ao encaixar no slot do filhote. Mostra um gene de cada vez. No gene `olhos`
// (ligado ao X), o filho macho recebe só o alelo da mãe (o pai manda "Y") —
// reforçando a herança ligada ao X na própria animação.
// ============================================================================

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Creature from './Creature/index.jsx'
import { genesAtivos, GENES } from '../data/genes.js'
import { genotipoStr } from '../engine/phenotype.js'
import { Sfx } from '../audio/sfx.js'
import { useGame } from '../state/GameContext.jsx'

const COR_ALELO = {
  C: '#8B5CF6', c: '#5FC96B',
  O: '#8B5CF6', o: '#5FC96B',
  M: '#8B5CF6', m: '#5FC96B',
  V: '#EF4444', B: '#FAFAFA',
  A: '#3B82F6', R: '#EF4444',
  G: '#8B5CF6', g: '#5FC96B',
  Y: '#94A3B8',
}
const TEXTO_CLARO = new Set(['B', 'Y'])

const SLOT_X = [15, 38, 62, 85] // % horizontais dos 4 ovos
const SLOT_Y = 74
const MAE = { x: 16, y: 20 }
const PAI = { x: 84, y: 20 }

function Token({ letra, from, to, delay, claro }) {
  return (
    <motion.div
      className="absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-titulo text-base font-bold shadow-suave"
      style={{ background: COR_ALELO[letra] || '#ccc', color: claro ? '#3B2E4D' : '#fff', border: '2px solid rgba(0,0,0,0.08)' }}
      initial={{ left: `${from.x}%`, top: `${from.y}%`, scale: 0.4, opacity: 0 }}
      animate={{ left: `${to.x}%`, top: `${to.y}%`, scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay, ease: 'easeInOut' }}
    >
      {letra}
    </motion.div>
  )
}

export default function Segregation({ mother, father, litter, onComplete }) {
  const { state } = useGame()
  const ativos = genesAtivos(state.mundo)
  const [fase, setFase] = useState(0)
  const geneAtual = ativos[fase]

  useEffect(() => {
    if (fase >= ativos.length) {
      const t = setTimeout(onComplete, 500)
      return () => clearTimeout(t)
    }
    // snap quando os tokens encaixam
    const tSnap = setTimeout(() => Sfx.snap(), 650)
    const tProx = setTimeout(() => setFase((f) => f + 1), 1300)
    return () => {
      clearTimeout(tSnap)
      clearTimeout(tProx)
    }
  }, [fase, ativos.length, onComplete])

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto w-full max-w-xl" style={{ aspectRatio: '4 / 3' }}>
        {/* corações entre os pais */}
        <div className="coracao pointer-none absolute left-1/2 top-[14%] -translate-x-1/2 text-2xl">💜</div>

        {/* pais */}
        <ParentAvatar pos={MAE} creature={mother} world={state.mundo} label="Mãe (XX)" />
        <ParentAvatar pos={PAI} creature={father} world={state.mundo} label="Pai (XY)" />

        {/* ovos */}
        {SLOT_X.map((x, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl"
            style={{ left: `${x}%`, top: `${SLOT_Y + 6}%` }}
          >
            🥚
          </div>
        ))}

        {/* tokens da fase atual */}
        {geneAtual &&
          litter.map((filho, i) => {
            const tr = filho.trace[geneAtual]
            const slot = { x: SLOT_X[i], y: SLOT_Y }
            const tokens = []
            // alelo da mãe
            tokens.push(
              <Token
                key={`m-${fase}-${i}`}
                letra={tr.fromMother}
                from={MAE}
                to={{ x: slot.x - 5, y: slot.y }}
                delay={i * 0.08}
                claro={TEXTO_CLARO.has(tr.fromMother)}
              />,
            )
            // alelo do pai (ou "Y" para filho macho no gene olhos)
            const letraPai = tr.fromFather !== null ? tr.fromFather : 'Y'
            tokens.push(
              <Token
                key={`p-${fase}-${i}`}
                letra={letraPai}
                from={PAI}
                to={{ x: slot.x + 5, y: slot.y }}
                delay={i * 0.08}
                claro={TEXTO_CLARO.has(letraPai)}
              />,
            )
            return tokens
          })}
      </div>

      {/* legenda do gene atual */}
      <div className="mt-2 text-center">
        {geneAtual ? (
          <p className="font-titulo text-lg font-bold text-roxo">
            Gene: {GENES[geneAtual].label}{' '}
            <span className="text-sm font-semibold text-tinta/60">
              {genotipoStr(mother.genes[geneAtual], geneAtual)} ×{' '}
              {geneAtual === 'olhos'
                ? `${father.genes.olhos[0]}/Y`
                : genotipoStr(father.genes[geneAtual], geneAtual)}
            </span>
          </p>
        ) : (
          <p className="font-titulo text-lg font-bold text-verde">Pronto para chocar!</p>
        )}
      </div>
    </div>
  )
}

function ParentAvatar({ pos, creature, world, label }) {
  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <Creature creature={creature} world={world} size={72} idle />
      <span className="mt-0.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-tinta/70 shadow-suave">
        {label}
      </span>
    </div>
  )
}
