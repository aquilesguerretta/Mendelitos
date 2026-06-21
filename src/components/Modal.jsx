// Modal — painel sobreposto fofo. Fecha no clique do fundo, no botão ✕ ou com
// Esc. Fecha no onClick (não no pointer-down) para não fechar por engano ao
// iniciar uma rolagem perto da borda. Sem dependência de hover.
import { useEffect } from 'react'
import { S } from '../data/strings.js'

export default function Modal({ titulo, emoji, onClose, children, maxW = 'max-w-2xl', footer }) {
  // Fechar com a tecla Esc (teclado).
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-tinta/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className={`card selo-novo flex max-h-[92vh] w-full ${maxW} flex-col overflow-hidden rounded-b-none sm:rounded-fofo`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-roxo/10 px-5 py-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-tinta">
            {emoji && <span className="text-2xl">{emoji}</span>}
            {titulo}
          </h2>
          <button className="btn-claro !px-3 !py-2" onClick={onClose} aria-label={S.botoes.voltar}>
            ✕
          </button>
        </div>
        <div className="scroll-fofo flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-roxo/10 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}
