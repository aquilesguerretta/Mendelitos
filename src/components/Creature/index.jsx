// ============================================================================
// <Creature> — o bichinho montado em camadas de SVG (seção 6).
// Cada peça é um componente isolado que recebe a peça/cor como prop, então
// trocar por sprites depois é trivial. Todas as peças no mesmo viewBox
// (0 0 200 200), centralizadas, fundo transparente.
// ============================================================================

import { useId, useState } from 'react'
import Body from './Body.jsx'
import Ears from './Ears.jsx'
import Pattern from './Pattern.jsx'
import Crest from './Crest.jsx'
import Scales from './Scales.jsx'
import Eyes from './Eyes.jsx'
import { phenotype } from '../../engine/phenotype.js'
import { genesAtivos } from '../../data/genes.js'
import { Sfx } from '../../audio/sfx.js'

export default function Creature({
  creature,
  world = 3,
  size = 120,
  interactive = false,
  shiny = false,
  idle = true,
  className = '',
}) {
  const clipId = useId().replace(/:/g, '')
  const [pulando, setPulando] = useState(false)
  const fen = phenotype(creature)
  const ativos = genesAtivos(world)

  // Genes inativos no mundo atual renderizam o padrão (aparência "simples").
  const corOrelhas = ativos.includes('orelhas') ? fen.orelhas : 'curtas'
  const corPadrao = ativos.includes('padrao') ? fen.padrao : 'liso'
  const corCrista = ativos.includes('crista') ? fen.crista : null
  const corEscamas = ativos.includes('escamas') ? fen.escamas : null
  const tamOlhos = ativos.includes('olhos') ? fen.olhos : 'grandes'

  function tocar() {
    if (!interactive) return
    setPulando(true)
    Sfx.squeak()
    setTimeout(() => setPulando(false), 450)
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      onPointerDown={tocar}
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? `Mendelito ${fen.cor}` : undefined}
    >
      {shiny && (
        <div className="pointer-none absolute inset-0 -z-10 animate-brilho rounded-full bg-sol/40 blur-xl" />
      )}
      <div className={`h-full w-full ${idle ? 'animate-respira' : ''} ${pulando ? 'animate-pulinho' : ''}`}>
        <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
          {shiny && (
            <ellipse cx="100" cy="116" rx="72" ry="68" fill="none" stroke="#FACC15" strokeWidth="3" strokeDasharray="6 8" className="animate-brilho" />
          )}
          <Crest color={corCrista} />
          <Ears type={corOrelhas} color={fen.cor} />
          <Body color={fen.cor} sex={fen.sexo} clipId={clipId} />
          <Pattern type={corPadrao} color={fen.cor} clipId={clipId} />
          <Scales color={corEscamas} clipId={clipId} />
          <Eyes size={tamOlhos} piscando={idle} />
        </svg>
      </div>
    </div>
  )
}
