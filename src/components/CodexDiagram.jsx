// CodexDiagram — mini-diagramas (divs/SVG leves) para cada entrada do Codex.
// Cada um ilustra o conceito sem depender de imagens externas.

function Alelo({ children, cor = '#8B5CF6', texto = '#fff' }) {
  return (
    <span
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg font-titulo text-base font-bold"
      style={{ background: cor, color: texto }}
    >
      {children}
    </span>
  )
}

function Bolinha({ cor, label }) {
  return (
    <span className="inline-flex flex-col items-center gap-1">
      <span className="h-7 w-7 rounded-full border-2 border-black/10" style={{ background: cor }} />
      {label && <span className="text-xs text-tinta/70">{label}</span>}
    </span>
  )
}

const Seta = () => <span className="text-xl text-tinta/50">→</span>
const ROXO = '#8B5CF6'
const VERDE = '#5FC96B'
const CINZA = '#E9E3F2'

function Par({ a, b, ca = ROXO, cb = ROXO, ta = '#fff', tb = '#fff' }) {
  return (
    <span className="inline-flex gap-1">
      <Alelo cor={ca} texto={ta}>
        {a}
      </Alelo>
      <Alelo cor={cb} texto={tb}>
        {b}
      </Alelo>
    </span>
  )
}

function Punnett() {
  const cels = [
    { g: 'CC', cor: ROXO },
    { g: 'Cc', cor: ROXO },
    { g: 'Cc', cor: ROXO },
    { g: 'cc', cor: VERDE },
  ]
  return (
    <div className="inline-grid grid-cols-[auto_auto_auto] gap-1 text-center text-sm font-bold">
      <span />
      <span className="text-roxo">C</span>
      <span className="text-roxo">c</span>
      <span className="self-center text-roxo">C</span>
      <span className="rounded bg-roxo/20 px-2 py-1">CC</span>
      <span className="rounded bg-roxo/20 px-2 py-1">Cc</span>
      <span className="self-center text-roxo">c</span>
      <span className="rounded bg-roxo/20 px-2 py-1">Cc</span>
      <span className="rounded bg-verde/30 px-2 py-1">cc</span>
    </div>
  )
}

function Barras931() {
  const dados = [
    { n: 9, cor: ROXO },
    { n: 3, cor: '#A78BFA' },
    { n: 3, cor: '#34D399' },
    { n: 1, cor: VERDE },
  ]
  return (
    <div className="flex items-end gap-2">
      {dados.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-6 rounded-t" style={{ height: d.n * 8 + 8, background: d.cor }} />
          <span className="text-xs font-bold text-tinta/70">{d.n}</span>
        </div>
      ))}
    </div>
  )
}

export default function CodexDiagram({ tipo }) {
  const wrap = 'flex flex-wrap items-center gap-3 rounded-xl bg-fundo p-3'
  switch (tipo) {
    case 'gene-alelo':
      return (
        <div className={wrap}>
          <span className="rounded-lg border-2 border-dashed border-roxo/40 px-3 py-2 text-sm font-bold text-roxo">
            gene "cor"
          </span>
          <Seta />
          <Par a="C" b="c" cb={VERDE} />
        </div>
      )
    case 'dominante-recessivo':
      return (
        <div className={wrap}>
          <Par a="C" b="c" cb={VERDE} />
          <Seta />
          <Bolinha cor={ROXO} label="roxo" />
          <span className="mx-1 text-tinta/30">|</span>
          <Par a="c" b="c" ca={VERDE} cb={VERDE} />
          <Seta />
          <Bolinha cor={VERDE} label="verde" />
        </div>
      )
    case 'homo-hetero':
      return (
        <div className={wrap}>
          <span className="flex flex-col items-center gap-1">
            <Par a="C" b="C" />
            <span className="text-xs text-tinta/60">homozigoto</span>
          </span>
          <span className="flex flex-col items-center gap-1">
            <Par a="c" b="c" ca={VERDE} cb={VERDE} />
            <span className="text-xs text-tinta/60">homozigoto</span>
          </span>
          <span className="flex flex-col items-center gap-1">
            <Par a="C" b="c" cb={VERDE} />
            <span className="text-xs text-tinta/60">heterozigoto</span>
          </span>
        </div>
      )
    case 'genotipo-fenotipo':
      return (
        <div className={wrap}>
          <Par a="C" b="C" />
          <Seta />
          <Bolinha cor={ROXO} />
          <span className="mx-1 text-tinta/30">e</span>
          <Par a="C" b="c" cb={VERDE} />
          <Seta />
          <Bolinha cor={ROXO} label="mesmo roxo" />
        </div>
      )
    case 'portador':
      return (
        <div className={wrap}>
          <Par a="C" b="c" cb={VERDE} />
          <span className="text-tinta/50">×</span>
          <Par a="C" b="c" cb={VERDE} />
          <Seta />
          <Par a="c" b="c" ca={VERDE} cb={VERDE} />
          <span className="text-xs text-tinta/60">pode nascer</span>
        </div>
      )
    case 'segregacao':
      return (
        <div className={wrap}>
          <Par a="C" b="c" cb={VERDE} />
          <Seta />
          <span className="text-xs text-tinta/60">gametas</span>
          <Alelo>C</Alelo>
          <Alelo cor={VERDE}>c</Alelo>
        </div>
      )
    case 'punnett':
      return (
        <div className={wrap}>
          <Punnett />
          <span className="text-sm font-semibold text-tinta/70">3 roxos : 1 verde</span>
        </div>
      )
    case 'independente':
      return (
        <div className={wrap}>
          <Barras931 />
          <span className="text-sm font-semibold text-tinta/70">9 : 3 : 3 : 1</span>
        </div>
      )
    case 'incompleta':
      return (
        <div className={wrap}>
          <span className="flex flex-col items-center gap-1">
            <Par a="V" b="V" ca="#EF4444" cb="#EF4444" />
            <Bolinha cor="#EF4444" label="vermelha" />
          </span>
          <span className="flex flex-col items-center gap-1">
            <Par a="V" b="B" ca="#EF4444" cb="#FAFAFA" tb="#3B2E4D" />
            <Bolinha cor="#F9A8D4" label="rosa" />
          </span>
          <span className="flex flex-col items-center gap-1">
            <Par a="B" b="B" ca="#FAFAFA" cb="#FAFAFA" ta="#3B2E4D" tb="#3B2E4D" />
            <Bolinha cor="#FAFAFA" label="branca" />
          </span>
        </div>
      )
    case 'codominancia':
      return (
        <div className={wrap}>
          <span className="flex flex-col items-center gap-1">
            <Par a="A" b="A" ca="#3B82F6" cb="#3B82F6" />
            <Bolinha cor="#3B82F6" label="azul" />
          </span>
          <span className="flex flex-col items-center gap-1">
            <Par a="A" b="R" ca="#3B82F6" cb="#EF4444" />
            <span className="flex gap-1">
              <Bolinha cor="#3B82F6" />
              <Bolinha cor="#EF4444" />
            </span>
            <span className="text-xs text-tinta/60">as duas</span>
          </span>
          <span className="flex flex-col items-center gap-1">
            <Par a="R" b="R" ca="#EF4444" cb="#EF4444" />
            <Bolinha cor="#EF4444" label="vermelha" />
          </span>
        </div>
      )
    case 'ligado-x':
      return (
        <div className={wrap}>
          <span className="flex flex-col items-center gap-1">
            <span className="font-titulo font-bold text-tinta">
              X<sup>G</sup>X<sup>g</sup>
            </span>
            <span className="text-xs text-tinta/60">♀ portadora</span>
          </span>
          <span className="text-tinta/50">×</span>
          <span className="flex flex-col items-center gap-1">
            <span className="font-titulo font-bold text-tinta">
              X<sup>g</sup>Y
            </span>
            <span className="text-xs text-tinta/60">♂ afetado</span>
          </span>
        </div>
      )
    default:
      return null
  }
}
