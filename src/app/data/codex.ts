// ===== Codex — as 11 entradas (seção 7.3) — textos literais =====

export interface CodexEntry {
  id: string;
  n: number;
  title: string;
  found: string; // "Você encontrou / viu..."
  body: string;
  diagram: string; // dica de mini-diagrama
  realWorld?: string; // linha "No mundo real" (exemplo seguro que cai na prova)
  note?: string; // linha-ponte de notação (ex.: I^A / I^B na prova)
  // condição de desbloqueio: ids de conceitos (cartas) ou genes
  unlockHint: string;
}

export const CODEX: CodexEntry[] = [
  {
    id: "gene-alelo",
    n: 1,
    title: "Gene e Alelo",
    found: "Você viu que cor, orelhas e padrão vêm de \"genes\".",
    body:
      "Um gene é o trecho de DNA com a instrução de uma característica. Cada gene tem versões diferentes, os alelos (ex.: alelo roxo e alelo amarelo). Todo Mendelito tem dois alelos de cada gene: um da mãe, um do pai.",
    diagram: "Gene = caixa; alelos = C e c.",
    unlockHint: "primeiro-cruzamento",
  },
  {
    id: "dominante-recessivo",
    n: 2,
    title: "Dominante e Recessivo",
    found: "Roxo sempre \"ganhava\" do amarelo.",
    body:
      "Com dois alelos diferentes, às vezes só um se manifesta: o dominante (MAIÚSCULA, C). O outro fica escondido: o recessivo (minúscula, c). O recessivo só aparece quando o bichinho tem dois deles (cc).",
    diagram: "Cc → roxo;  cc → amarelo.",
    realWorld: "No mundo real: a doença de Huntington é dominante — basta um alelo para se manifestar.",
    unlockHint: "primeiro-cruzamento",
  },
  {
    id: "homo-hetero",
    n: 3,
    title: "Homozigoto e Heterozigoto",
    found: "Alguns roxos eram CC, outros Cc.",
    body:
      "Homozigoto = dois alelos iguais (CC ou cc). Heterozigoto = dois diferentes (Cc). O heterozigoto mostra o dominante mas carrega o recessivo.",
    diagram: "CC / cc  vs  Cc.",
    unlockHint: "portador",
  },
  {
    id: "genotipo-fenotipo",
    n: 4,
    title: "Genótipo × Fenótipo",
    found: "Dois roxos podiam ter \"fórmulas\" diferentes.",
    body:
      "Genótipo = os alelos que o bichinho tem (Cc). Fenótipo = o que aparece (corpo roxo). Genótipos diferentes podem dar o mesmo fenótipo — por isso você não sabe o genótipo só olhando.",
    diagram: "CC e Cc → mesmo roxo.",
    unlockHint: "portador",
  },
  {
    id: "portador",
    n: 5,
    title: "Portador",
    found: "Dois pais roxos geraram um filho amarelo.",
    body:
      "Portador é o heterozigoto (Cc) que mostra o traço dominante mas guarda o recessivo. Cruzando dois portadores, o recessivo reaparece. Por isso traços recessivos \"somem\" e voltam gerações depois.",
    diagram: "Cc × Cc → pode nascer cc.",
    realWorld:
      "No mundo real: é assim que funcionam a fibrose cística e a anemia falciforme — só manifesta com as duas cópias do alelo recessivo; com uma só, a pessoa é portadora saudável.",
    unlockHint: "portador",
  },
  {
    id: "segregacao",
    n: 6,
    title: "Lei da Segregação (1ª Lei de Mendel)",
    found: "Cada filhote recebeu um alelo de cada pai.",
    body:
      "Os dois alelos de um gene se separam na formação dos gametas — cada gameta leva só um. Na fecundação, o filhote junta um da mãe e um do pai. (É a meiose: os cromossomos homólogos se separam, e cada gameta leva uma versão de cada gene.)",
    diagram: "Cc → gametas C e c.",
    unlockHint: "segregacao",
  },
  {
    id: "punnett",
    n: 7,
    title: "Quadro de Punnett",
    found: "A Lente mostrava as chances dos filhotes.",
    body:
      "O quadro cruza os alelos possíveis de cada pai numa tabela e mostra todas as combinações e proporções. Cc × Cc dá 1 CC : 2 Cc : 1 cc (genótipo) e 3 roxos : 1 amarelo (fenótipo).",
    diagram: "Grade 2×2.",
    unlockHint: "lente-usada",
  },
  {
    id: "independente",
    n: 8,
    title: "Distribuição Independente (2ª Lei de Mendel)",
    found: "Cor e orelhas não interferiam uma na outra.",
    body:
      "Genes em pares de cromossomos diferentes são herdados de forma independente. Por isso CcOo × CcOo dá a proporção 9:3:3:1 no fenótipo.",
    diagram: "9:3:3:1.",
    unlockHint: "doisGenes",
  },
  {
    id: "dom-incompleta",
    n: 9,
    title: "Dominância Incompleta",
    found: "Asas vermelhas + brancas deram rosa.",
    body:
      "Nenhum alelo domina totalmente; o heterozigoto fica num meio-termo. A proporção fenotípica é igual à genotípica: 1:2:1.",
    diagram: "VV vermelha, VB rosa, BB branca.",
    realWorld:
      "No mundo real: a flor boca-de-leão — vermelha × branca dá rosa, exatamente o meio-termo.",
    note:
      "Na prova, esses alelos costumam vir com letra-base e expoente — tipo F^V e F^B (de boca-de-leão). No jogo usamos V e B; é a mesma ideia.",
    unlockHint: "dominanciaIncompleta",
  },
  {
    id: "codominancia",
    n: 10,
    title: "Codominância",
    found: "Azul + vermelha apareceram juntas.",
    body:
      "Os dois alelos se manifestam por completo e ao mesmo tempo — não viram um meio-termo. O heterozigoto mostra as duas características inteiras.",
    diagram: "AA azul, AR azul+vermelha, RR vermelha.",
    realWorld:
      "No mundo real: o tipo sanguíneo AB — os alelos A e B aparecem os dois ao mesmo tempo.",
    note:
      "Na prova, o sistema ABO aparece como I^A e I^B (letra-base I com expoente). No jogo usamos A e R nas escamas; é a mesma lógica de dois alelos que se expressam juntos.",
    unlockHint: "codominancia",
  },
  {
    id: "ligado-x",
    n: 11,
    title: "Herança Ligada ao X",
    found: "Olhos pequenos eram mais comuns nos machos.",
    body:
      "O gene fica no cromossomo X. A fêmea tem dois X (pode ser portadora); o macho tem um X e um Y — ele é hemizigoto (tem um alelo só do gene), então um único alelo recessivo já se manifesta nele. A mãe portadora passa o alelo para metade da prole; os afetados costumam ser os machos, e as filhas se tornam portadoras.",
    diagram: "X^G X^g fêmea portadora; X^g Y macho afetado.",
    realWorld:
      "No mundo real: o daltonismo e a hemofilia são ligados ao X recessivos — por isso aparecem mais em homens.",
    unlockHint: "ligadoX",
  },
  {
    id: "cruzamento-teste",
    n: 12,
    title: "Cruzamento-teste",
    found: "Você usou o Scanner para revelar o genótipo escondido de um Mendelito.",
    body:
      "Antes do Scanner, o jeito de descobrir se um Mendelito dominante era homozigoto (CC) ou portador (Cc) era cruzá-lo com um recessivo puro (cc). Se aparecer qualquer filhote recessivo, ele era portador (a prole sai por volta de 1:1). Se a prole for grande e todos saírem dominantes, ele era homozigoto. Isso é o cruzamento-teste — o Scanner é a versão instantânea dele.",
    diagram: "Dominante × cc → algum recessivo? então era portador.",
    realWorld:
      "No mundo real: criadores de plantas e animais usam o cruzamento-teste até hoje para saber se um exemplar carrega um alelo escondido.",
    unlockHint: "cruzamento-teste",
  },
];
