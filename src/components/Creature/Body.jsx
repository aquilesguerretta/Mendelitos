// Body — corpo + cor. Lê apenas `color` (fenótipo: 'roxo' | 'verde') e `sex`.
import { COR_CORPO } from './cores.js'

export default function Body({ color = 'roxo', sex = 'XX', clipId }) {
  const c = COR_CORPO[color] || COR_CORPO.roxo
  return (
    <g>
      {/* pés */}
      <ellipse cx="76" cy="168" rx="16" ry="11" fill={c.escuro} />
      <ellipse cx="124" cy="168" rx="16" ry="11" fill={c.escuro} />
      {/* corpo */}
      <ellipse cx="100" cy="116" rx="64" ry="60" fill={c.base} />
      <ellipse cx="100" cy="116" rx="64" ry="60" fill="none" stroke={c.escuro} strokeWidth="3" />
      {/* barriga clara */}
      <ellipse cx="100" cy="130" rx="40" ry="36" fill={c.barriga} opacity="0.85" />
      {/* brilho sutil */}
      <ellipse cx="78" cy="92" rx="14" ry="10" fill="#FFFFFF" opacity="0.35" />
      {/* diferença sutil de silhueta por sexo */}
      {sex === 'XY' ? (
        <path d="M100 50 q4 -16 -2 -22 q10 4 8 22 Z" fill={c.escuro} />
      ) : (
        <>
          <circle cx="62" cy="128" r="6" fill="#F472B6" opacity="0.5" />
          <circle cx="138" cy="128" r="6" fill="#F472B6" opacity="0.5" />
        </>
      )}
      {/* clip do corpo para padrões/escamas */}
      {clipId && (
        <clipPath id={clipId}>
          <ellipse cx="100" cy="116" rx="64" ry="60" />
        </clipPath>
      )}
    </g>
  )
}
