// CreatureCard — tile de um Mendelito na coleção. Usado no Laboratório e na
// seleção de pais. Suporta seleção (toque), Scanner de genótipo e shiny (raro).
import Creature from './Creature/index.jsx'
import { phenotype, genotipoStr } from '../engine/phenotype.js'
import { genesAtivos, GENES } from '../data/genes.js'
import { isRare } from '../engine/rarity.js'
import { S } from '../data/strings.js'

export default function CreatureCard({
  creature,
  world = 3,
  selecionavel = false,
  selecionado = false,
  papel = null, // 'mae' | 'pai' | null
  onSelect,
  escaneado = false,
  onScan,
}) {
  const fen = phenotype(creature)
  const ativos = genesAtivos(world)
  const raro = isRare(creature, world)

  const borda = selecionado
    ? papel === 'pai'
      ? 'border-roxo ring-2 ring-roxo'
      : 'border-rosa ring-2 ring-rosa'
    : 'border-roxo/10'

  return (
    <div
      className={`card relative flex flex-col items-center gap-1 border-2 p-2 ${borda} ${
        selecionavel ? 'cursor-pointer active:scale-95 transition-transform' : ''
      }`}
      onPointerUp={selecionavel ? () => onSelect?.(creature) : undefined}
      role={selecionavel ? 'button' : undefined}
      aria-pressed={selecionavel ? selecionado : undefined}
    >
      {raro && (
        <span className="absolute -right-1 -top-1 z-10 rounded-full bg-sol px-2 py-0.5 text-[10px] font-bold text-tinta shadow-suave">
          ✨ raro
        </span>
      )}
      {selecionado && papel && (
        <span
          className={`absolute -left-1 -top-1 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-suave ${
            papel === 'pai' ? 'bg-roxo' : 'bg-rosa'
          }`}
        >
          {papel === 'pai' ? '♂ Pai' : '♀ Mãe'}
        </span>
      )}

      <Creature creature={creature} world={world} size={84} interactive shiny={raro} />

      <div className="w-full text-center">
        <p className="truncate text-sm font-bold text-tinta">
          {creature.nickname || S.sexoLabel[creature.sex]}
        </p>
        <p className="text-[10px] text-tinta/50">{S.sexoLabel[creature.sex]}</p>
      </div>

      {escaneado ? (
        <div className="flex flex-wrap justify-center gap-1">
          {ativos.map((g) => (
            <span
              key={g}
              className="rounded bg-roxo/10 px-1.5 py-0.5 text-[10px] font-bold text-roxo"
              title={GENES[g].label}
            >
              {g === 'olhos' && creature.sex === 'XY'
                ? creature.genes.olhos[0]
                : genotipoStr(creature.genes[g], g)}
            </span>
          ))}
        </div>
      ) : (
        onScan && (
          <button
            className="btn-fantasma !px-2 !py-1 !text-xs"
            onPointerUp={(e) => {
              e.stopPropagation()
              onScan(creature)
            }}
          >
            🔍 {S.botoes.escanear}
          </button>
        )
      )}
    </div>
  )
}
