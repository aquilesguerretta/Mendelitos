// Ears — orelhas. Lê apenas `type` ('curtas' | 'longas') e a cor do corpo.
import { COR_CORPO } from './cores.js'

export default function Ears({ type = 'curtas', color = 'roxo' }) {
  const c = COR_CORPO[color] || COR_CORPO.roxo
  if (type === 'longas') {
    return (
      <g>
        <path d="M70 70 Q56 8 78 30 Q86 50 84 72 Z" fill={c.base} stroke={c.escuro} strokeWidth="3" />
        <path d="M130 70 Q144 8 122 30 Q114 50 116 72 Z" fill={c.base} stroke={c.escuro} strokeWidth="3" />
        <path d="M72 64 Q64 30 78 38" fill={c.barriga} opacity="0.7" />
        <path d="M128 64 Q136 30 122 38" fill={c.barriga} opacity="0.7" />
      </g>
    )
  }
  // curtas
  return (
    <g>
      <ellipse cx="72" cy="66" rx="16" ry="20" fill={c.base} stroke={c.escuro} strokeWidth="3" />
      <ellipse cx="128" cy="66" rx="16" ry="20" fill={c.base} stroke={c.escuro} strokeWidth="3" />
      <ellipse cx="72" cy="66" rx="7" ry="10" fill={c.barriga} opacity="0.7" />
      <ellipse cx="128" cy="66" rx="7" ry="10" fill={c.barriga} opacity="0.7" />
    </g>
  )
}
