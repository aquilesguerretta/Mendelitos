// DiscoveryCard — carta colecionável de descoberta (seção 7.2 / 8 / 10).
// Surge com brilho na borda e animação de "selo novo". Toque em Continuar.
import { S } from '../data/strings.js'

// Negrito simples a partir de **texto**.
function comNegrito(texto, kbase) {
  return texto.split('**').map((parte, i) =>
    i % 2 === 1 ? (
      <strong key={`${kbase}-${i}`} className="text-roxo">
        {parte}
      </strong>
    ) : (
      <span key={`${kbase}-${i}`}>{parte}</span>
    ),
  )
}

export default function DiscoveryCard({ carta, indice = 1, total = 1, onNext }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/50 p-4 backdrop-blur-sm">
      <div className="carta-brilho selo-novo flex w-full max-w-md flex-col gap-3 rounded-fofo border-4 border-sol/70 bg-white p-6">
        <div className="flex items-center justify-between">
          <span className="text-4xl">{carta.emoji}</span>
          {total > 1 && (
            <span className="chip">
              {indice} / {total}
            </span>
          )}
        </div>
        <h2 className="font-titulo text-2xl font-bold text-tinta">{carta.titulo}</h2>
        <p className="text-sm font-semibold uppercase tracking-wide text-rosa">{carta.subtitulo}</p>
        <div className="space-y-3 text-base leading-relaxed text-tinta">
          {carta.corpo.map((par, i) => (
            <p key={i}>{comNegrito(par, i)}</p>
          ))}
        </div>
        <button className="btn-primario mt-2 self-end" onPointerUp={onNext}>
          {indice < total ? S.botoes.continuar : '🎉 ' + S.botoes.continuar}
        </button>
      </div>
    </div>
  )
}
