// Scales — escamas (Mundo 3, CODOMINÂNCIA). Lê apenas `color`
// ('azul' | 'vermelha' | 'azul+vermelha' | null).
// Em 'azul+vermelha' as duas cores aparecem INTEIRAS (escamas azuis E
// vermelhas separadas) — NUNCA misturadas em roxo.
import { COR_ESCAMA } from './cores.js'

function corDaEscama(color, indice) {
  if (color === 'azul') return COR_ESCAMA.azul
  if (color === 'vermelha') return COR_ESCAMA.vermelha
  // codominância: alterna escamas inteiras azuis e vermelhas
  return indice % 2 === 0 ? COR_ESCAMA.azul : COR_ESCAMA.vermelha
}

export default function Scales({ color = null, clipId }) {
  if (!color) return null
  const linhas = [
    { y: 132, xs: [74, 92, 110, 128] },
    { y: 148, xs: [83, 101, 119] },
    { y: 164, xs: [92, 110] },
  ]
  let i = 0
  const escamas = []
  for (const linha of linhas) {
    for (const x of linha.xs) {
      const fill = corDaEscama(color, i)
      escamas.push(
        <path
          key={`${x}-${linha.y}`}
          d={`M${x - 10} ${linha.y} a10 10 0 0 1 20 0 Z`}
          fill={fill}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="1.5"
        />,
      )
      i += 1
    }
  }
  return <g clipPath={clipId ? `url(#${clipId})` : undefined}>{escamas}</g>
}
