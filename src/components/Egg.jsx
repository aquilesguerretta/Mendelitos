// Egg — ovo que chacoalha, ganha tensão e choca com pop + confete.
// Estados: 'tremendo' (idle balançando) -> 'chocando' (pop) -> 'aberto'.
import Confetti from './Confetti.jsx'

export default function Egg({ estado = 'tremendo', cor = '#FFFFFF', onClick }) {
  if (estado === 'aberto') return null
  return (
    <div className="relative inline-flex items-center justify-center" onPointerDown={onClick}>
      {estado === 'chocando' && <Confetti count={22} />}
      <div className={estado === 'tremendo' ? 'animate-chacoalha' : 'animate-pulinho'}>
        <svg viewBox="0 0 100 120" width="84" height="100">
          <defs>
            <radialGradient id="ovoG" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor={cor === '#FFFFFF' ? '#EDE7F6' : cor} />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="66" rx="40" ry="50" fill="url(#ovoG)" stroke="#D6C9EC" strokeWidth="3" />
          {/* manchinhas fofas */}
          <circle cx="38" cy="60" r="6" fill="#C4B5FD" opacity="0.6" />
          <circle cx="62" cy="78" r="8" fill="#FBCFE8" opacity="0.7" />
          <circle cx="58" cy="48" r="4" fill="#A7F3D0" opacity="0.7" />
          {estado === 'chocando' && (
            <path
              d="M22 60 L40 70 L30 80 L48 88 L38 98"
              fill="none"
              stroke="#B9A7DA"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>
    </div>
  )
}
