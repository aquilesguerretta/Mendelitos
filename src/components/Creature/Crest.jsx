// Crest — crista (Mundo 3, dominância incompleta). Lê apenas `color`
// ('vermelha' | 'rosa' | 'branca' | null). Só aparece quando ativa.
import { COR_CRISTA } from './cores.js'

export default function Crest({ color = null }) {
  if (!color) return null
  const fill = COR_CRISTA[color] || COR_CRISTA.vermelha
  const stroke = color === 'branca' ? '#D9D9E3' : 'rgba(0,0,0,0.12)'
  return (
    <g>
      <path d="M84 60 L90 22 L97 58 Z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <path d="M96 58 L103 16 L110 56 Z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <path d="M108 58 L116 26 L122 62 Z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
    </g>
  )
}
