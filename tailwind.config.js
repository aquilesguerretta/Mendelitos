/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta TRAVADA — seção 8 da spec
        fundo: '#F5F0FA', // lavanda-creme suave
        roxo: '#8B5CF6', // corpo dominante
        verde: '#5FC96B', // corpo recessivo
        sol: '#FACC15', // acento sol
        rosa: '#F472B6', // acento rosa
        tinta: '#3B2E4D', // texto roxo-escuro acinzentado
        // Cores extras — Mundo 3
        crista: {
          vermelha: '#EF4444',
          rosa: '#F9A8D4',
          branca: '#FAFAFA',
        },
        escama: {
          azul: '#3B82F6',
          vermelha: '#EF4444',
        },
      },
      fontFamily: {
        titulo: ['Fredoka', 'system-ui', 'sans-serif'],
        corpo: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        fofo: '1.5rem',
      },
      boxShadow: {
        suave: '0 8px 24px -8px rgba(59, 46, 77, 0.25)',
        carta: '0 12px 40px -8px rgba(139, 92, 246, 0.45)',
      },
      keyframes: {
        respira: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        pisca: {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '96%': { transform: 'scaleY(0.1)' },
        },
        chacoalha: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(8deg)' },
        },
        pulinho: {
          '0%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-18%)' },
        },
        brilho: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        flutua: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        respira: 'respira 3.5s ease-in-out infinite',
        pisca: 'pisca 4.5s ease-in-out infinite',
        chacoalha: 'chacoalha 0.4s ease-in-out infinite',
        pulinho: 'pulinho 0.45s ease-out',
        brilho: 'brilho 1.8s ease-in-out infinite',
        flutua: 'flutua 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
