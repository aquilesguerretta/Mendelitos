// Eyes — olhos. Lê apenas `size` ('grandes' | 'pequenos'). Inclui um sorriso.
export default function Eyes({ size = 'grandes', piscando = true }) {
  const r = size === 'pequenos' ? 8 : 14
  const pr = size === 'pequenos' ? 3.5 : 6.5
  const ex = [82, 118]
  const ey = 104
  return (
    <g>
      {ex.map((x) => (
        <g key={x} className={piscando ? 'origin-center animate-pisca' : ''} style={{ transformBox: 'fill-box' }}>
          <circle cx={x} cy={ey} r={r} fill="#FFFFFF" stroke="#3B2E4D" strokeWidth="2" />
          <circle cx={x + 1.5} cy={ey + 1.5} r={pr} fill="#3B2E4D" />
          <circle cx={x + 1.5 - pr / 2} cy={ey + 1.5 - pr / 2} r={pr / 3 + 1} fill="#FFFFFF" />
        </g>
      ))}
      {/* sorriso */}
      <path
        d="M88 130 Q100 142 112 130"
        fill="none"
        stroke="#3B2E4D"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* bochechas */}
      <circle cx="68" cy="124" r="6" fill="#F472B6" opacity="0.45" />
      <circle cx="132" cy="124" r="6" fill="#F472B6" opacity="0.45" />
    </g>
  )
}
