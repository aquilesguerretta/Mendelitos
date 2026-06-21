// ============================================================================
// codex.js — As 11 entradas do Codex (seção 7.3). Texto PT-BR LITERAL da spec.
// Cada entrada: nº, título, "encontrou" (gancho), explicação e ideia de
// mini-diagrama (renderizado em src/components/Codex.jsx).
// ============================================================================

export const CODEX = [
  {
    n: 1,
    titulo: 'Gene e Alelo',
    encontrou: 'Você viu que cor, orelhas e padrão vêm de "genes".',
    texto:
      'Um gene é o trecho de DNA com a instrução de uma característica. Cada gene tem versões diferentes, os alelos (ex.: alelo roxo e alelo verde). Todo Mendelito tem dois alelos de cada gene: um da mãe, um do pai.',
    diagrama: 'gene-alelo',
  },
  {
    n: 2,
    titulo: 'Dominante e Recessivo',
    encontrou: 'Roxo sempre "ganhava" do verde.',
    texto:
      'Com dois alelos diferentes, às vezes só um se manifesta: o dominante (MAIÚSCULA, C). O outro fica escondido: o recessivo (minúscula, c). O recessivo só aparece quando o bichinho tem dois deles (cc).',
    diagrama: 'dominante-recessivo',
  },
  {
    n: 3,
    titulo: 'Homozigoto e Heterozigoto',
    encontrou: 'Alguns roxos eram CC, outros Cc.',
    texto:
      'Homozigoto = dois alelos iguais (CC ou cc). Heterozigoto = dois diferentes (Cc). O heterozigoto mostra o dominante mas carrega o recessivo.',
    diagrama: 'homo-hetero',
  },
  {
    n: 4,
    titulo: 'Genótipo × Fenótipo',
    encontrou: 'Dois roxos podiam ter "fórmulas" diferentes.',
    texto:
      'Genótipo = os alelos que o bichinho tem (Cc). Fenótipo = o que aparece (corpo roxo). Genótipos diferentes podem dar o mesmo fenótipo — por isso você não sabe o genótipo só olhando.',
    diagrama: 'genotipo-fenotipo',
  },
  {
    n: 5,
    titulo: 'Portador',
    encontrou: 'Dois pais roxos geraram um filho verde.',
    texto:
      'Portador é o heterozigoto (Cc) que mostra o traço dominante mas guarda o recessivo. Cruzando dois portadores, o recessivo reaparece. Por isso traços recessivos "somem" e voltam gerações depois.',
    diagrama: 'portador',
  },
  {
    n: 6,
    titulo: 'Lei da Segregação (1ª Lei de Mendel)',
    encontrou: 'Cada filhote recebeu um alelo de cada pai.',
    texto:
      'Os dois alelos de um gene se separam na formação dos gametas — cada gameta leva só um. Na fecundação, o filhote junta um da mãe e um do pai. (É a meiose: os cromossomos homólogos se separam, e cada gameta leva uma versão de cada gene.)',
    diagrama: 'segregacao',
  },
  {
    n: 7,
    titulo: 'Quadro de Punnett',
    encontrou: 'A Lente mostrava as chances dos filhotes.',
    texto:
      'O quadro cruza os alelos possíveis de cada pai numa tabela e mostra todas as combinações e proporções. Cc × Cc dá 1 CC : 2 Cc : 1 cc (genótipo) e 3 roxos : 1 verde (fenótipo).',
    diagrama: 'punnett',
  },
  {
    n: 8,
    titulo: 'Distribuição Independente (2ª Lei de Mendel)',
    encontrou: 'Cor e orelhas não interferiam uma na outra.',
    texto:
      'Genes em pares de cromossomos diferentes são herdados de forma independente. Por isso CcOo × CcOo dá a proporção 9:3:3:1 no fenótipo.',
    diagrama: 'independente',
  },
  {
    n: 9,
    titulo: 'Dominância Incompleta',
    encontrou: 'Vermelha + branca deu rosa.',
    texto:
      'Nenhum alelo domina totalmente; o heterozigoto fica num meio-termo. A proporção fenotípica é igual à genotípica: 1:2:1.',
    diagrama: 'incompleta',
  },
  {
    n: 10,
    titulo: 'Codominância',
    encontrou: 'Azul + vermelha apareceram juntas.',
    texto:
      'Os dois alelos se manifestam por completo e ao mesmo tempo — não viram um meio-termo. O heterozigoto mostra as duas características inteiras.',
    diagrama: 'codominancia',
  },
  {
    n: 11,
    titulo: 'Herança Ligada ao X',
    encontrou: 'Olhos pequenos eram mais comuns nos machos.',
    texto:
      'O gene fica no cromossomo X. A fêmea tem dois X (pode ser portadora); o macho tem um X e um Y, então um único alelo recessivo já se manifesta. A mãe portadora passa para os filhos.',
    diagrama: 'ligado-x',
  },
]

export const CODEX_POR_N = Object.fromEntries(CODEX.map((e) => [e.n, e]))
