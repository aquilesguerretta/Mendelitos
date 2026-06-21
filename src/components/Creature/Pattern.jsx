// Pattern — padrão do corpo. Lê apenas `type` ('liso' | 'manchado').
// Manchas ficam recortadas dentro do corpo via clip.
import { COR_CORPO } from './cores.js'

export default function Pattern({ type = 'liso', color = 'roxo', clipId }) {
  if (type !== 'manchado') return null
  const c = COR_CORPO[color] || COR_CORPO.roxo
  return (
    <g clipPath={clipId ? `url(#${clipId})` : undefined}>
      <ellipse cx="72" cy="98" rx="15" ry="13" fill={c.escuro} opacity="0.55" />
      <ellipse cx="120" cy="142" rx="18" ry="15" fill={c.escuro} opacity="0.55" />
      <ellipse cx="135" cy="100" rx="11" ry="10" fill={c.escuro} opacity="0.55" />
      <ellipse cx="70" cy="150" rx="12" ry="10" fill={c.escuro} opacity="0.55" />
    </g>
  )
}
