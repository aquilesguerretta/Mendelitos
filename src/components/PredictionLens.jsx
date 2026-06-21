// PredictionLens — "O que pode nascer?" (seção 7.1 / bônus 12).
// Quadro de Punnett por gene ativo, com genótipos e proporções fenotípicas.
import Modal from './Modal.jsx'
import { useGame } from '../state/GameContext.jsx'
import { genesAtivos, GENES } from '../data/genes.js'
import { S } from '../data/strings.js'
import {
  fenotipoCor,
  fenotipoOrelhas,
  fenotipoPadrao,
  fenotipoCrista,
  fenotipoEscamas,
  fenotipoOlhos,
  genotipoStr,
} from '../engine/phenotype.js'

const FEN_FN = {
  cor: (par) => fenotipoCor(par),
  orelhas: (par) => fenotipoOrelhas(par),
  padrao: (par) => fenotipoPadrao(par),
  crista: (par) => fenotipoCrista(par),
  escamas: (par) => fenotipoEscamas(par),
}

const COR_FEN = {
  roxo: '#8B5CF6',
  verde: '#5FC96B',
  curtas: '#8B5CF6',
  longas: '#5FC96B',
  liso: '#8B5CF6',
  manchado: '#5FC96B',
  vermelha: '#EF4444',
  rosa: '#F9A8D4',
  branca: '#FAFAFA',
  azul: '#3B82F6',
  'azul+vermelha': 'linear-gradient(90deg,#3B82F6 50%,#EF4444 50%)',
  grandes: '#8B5CF6',
  pequenos: '#5FC96B',
}

function Celula({ geno, fen, sexo }) {
  const bg = COR_FEN[fen] || '#ccc'
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-roxo/10 bg-white p-1">
      <span className="font-titulo text-sm font-bold text-tinta">{geno}</span>
      <span
        className="my-0.5 h-3 w-6 rounded-full border border-black/10"
        style={{ background: bg }}
      />
      {sexo && <span className="text-[9px] text-tinta/50">{sexo === 'XX' ? '♀' : '♂'}</span>}
    </div>
  )
}

function Proporcoes({ contagem, total, gene }) {
  return (
    <>
      {Object.entries(contagem).map(([fen, n]) => (
        <div key={fen} className="flex items-center gap-2 text-sm">
          <span
            className="h-3 w-5 rounded-full border border-black/10"
            style={{ background: COR_FEN[fen] }}
          />
          <span className="font-semibold text-tinta">
            {n}/{total}
          </span>
          <span className="text-tinta/70">{(S.fenLabel[gene] && S.fenLabel[gene][fen]) || fen}</span>
        </div>
      ))}
    </>
  )
}

function ProporcaoGrupo({ titulo, contagem, total, gene }) {
  return (
    <div>
      <p className="text-xs font-bold text-tinta/60">{titulo}</p>
      <Proporcoes contagem={contagem} total={total} gene={gene} />
    </div>
  )
}

// Constrói o quadro de Punnett de um gene.
function punnett(geneKey, mother, father) {
  const linhas = mother.genes[geneKey] // 2 gametas da mãe
  let colunas
  let xlinked = false
  if (geneKey === 'olhos') {
    xlinked = true
    colunas = [father.genes.olhos[0], 'Y'] // pai: X^alelo ou Y
  } else {
    colunas = father.genes[geneKey] // 2 gametas do pai
  }

  const cells = []
  const contagem = {}
  const porSexo = { XX: {}, XY: {} } // usado só no gene ligado ao X
  for (const r of linhas) {
    for (const c of colunas) {
      let geno
      let fen
      let sexo = null
      if (xlinked) {
        if (c === 'Y') {
          geno = r // filho XY: um alelo
          fen = fenotipoOlhos([r], 'XY')
          sexo = 'XY'
        } else {
          geno = genotipoStr([r, c], 'olhos')
          fen = fenotipoOlhos([r, c], 'XX')
          sexo = 'XX'
        }
      } else {
        geno = genotipoStr([r, c], geneKey)
        fen = FEN_FN[geneKey]([r, c])
      }
      cells.push({ geno, fen, sexo })
      contagem[fen] = (contagem[fen] || 0) + 1
      if (sexo) porSexo[sexo][fen] = (porSexo[sexo][fen] || 0) + 1
    }
  }
  return { linhas, colunas, cells, contagem, porSexo, xlinked }
}

function crossLabel(geneKey, mother, father) {
  if (geneKey === 'olhos') {
    return `${genotipoStr(mother.genes.olhos, 'olhos')} × ${father.genes.olhos[0]}/Y`
  }
  return `${genotipoStr(mother.genes[geneKey], geneKey)} × ${genotipoStr(father.genes[geneKey], geneKey)}`
}

export default function PredictionLens({ mother, father, onClose, onCruzar }) {
  const { state } = useGame()
  const ativos = genesAtivos(state.mundo)

  return (
    <Modal
      titulo={S.lenteTitulo}
      emoji="🔮"
      onClose={onClose}
      footer={
        <button className="btn-primario w-full" onClick={onCruzar}>
          {S.botoes.cruzarConfirmar}
        </button>
      }
    >
      <p className="mb-4 text-sm text-tinta/70">
        O quadro cruza os alelos possíveis de cada pai e mostra as combinações e proporções dos
        filhotes.
      </p>
      <div className="space-y-5">
        {ativos.map((g) => {
          const { linhas, colunas, cells, contagem, porSexo, xlinked } = punnett(g, mother, father)
          return (
            <div key={g} className="rounded-fofo border-2 border-roxo/15 bg-fundo/50 p-4">
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="font-titulo font-bold text-tinta">{GENES[g].label}</h3>
                <span className="text-sm font-semibold text-roxo">{crossLabel(g, mother, father)}</span>
              </div>
              <div className="flex flex-wrap items-start gap-4">
                {/* grade 3x3: canto + cabeçalhos */}
                <div
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `auto repeat(${colunas.length}, 3rem)` }}
                >
                  <span />
                  {colunas.map((c, i) => (
                    <span key={i} className="text-center font-titulo text-sm font-bold text-rosa">
                      {c}
                    </span>
                  ))}
                  {linhas.map((r, ri) => (
                    <div key={ri} className="contents">
                      <span className="self-center pr-1 text-right font-titulo text-sm font-bold text-roxo">
                        {r}
                      </span>
                      {colunas.map((_, ci) => (
                        <Celula key={ci} {...cells[ri * colunas.length + ci]} />
                      ))}
                    </div>
                  ))}
                </div>
                {/* proporções — para o gene ligado ao X, separadas por sexo
                    (a frequência é diferente em fêmeas e machos: é a lição). */}
                <div className="flex flex-1 flex-col gap-2">
                  {xlinked ? (
                    <>
                      <ProporcaoGrupo titulo="♀ Fêmeas (XX)" contagem={porSexo.XX} total={2} gene={g} />
                      <ProporcaoGrupo titulo="♂ Machos (XY)" contagem={porSexo.XY} total={2} gene={g} />
                    </>
                  ) : (
                    <Proporcoes contagem={contagem} total={cells.length} gene={g} />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
