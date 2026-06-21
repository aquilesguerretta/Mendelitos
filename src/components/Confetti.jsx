// Confetti — explosão de confete (pop do ovo, raro). CSS puro, não captura toque.
const CORES = ['#8B5CF6', '#5FC96B', '#FACC15', '#F472B6', '#3B82F6', '#EF4444']

export default function Confetti({ count = 28, origin = 'center' }) {
  const pecas = Array.from({ length: count }, (_, i) => {
    const ang = (Math.PI * 2 * i) / count + Math.random()
    const dist = 60 + Math.random() * 90
    const dx = Math.cos(ang) * dist
    const dy = Math.sin(ang) * dist + 40 + Math.random() * 60
    const rot = `${Math.floor(Math.random() * 720 - 360)}deg`
    const delay = Math.random() * 0.15
    return (
      <span
        key={i}
        className="confete-peca"
        style={{
          left: origin === 'center' ? '50%' : '50%',
          top: '45%',
          background: CORES[i % CORES.length],
          '--dx': `${dx}px`,
          '--dy': `${dy}px`,
          '--rot': rot,
          animationDelay: `${delay}s`,
        }}
      />
    )
  })
  return <div className="pointer-none absolute inset-0 overflow-visible">{pecas}</div>
}
