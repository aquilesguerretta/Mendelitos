// ============================================================================
// cards.js — Cartas de descoberta (seção 7.2). Texto PT-BR LITERAL da spec.
// Cada carta sobe na 1ª vez que o jogador CAUSA o fenômeno. `desbloqueia`
// lista as entradas do Codex que abrem junto.
// ============================================================================

export const CARTAS = {
  portador: {
    id: 'portador',
    emoji: '🃏',
    titulo: 'PORTADOR',
    subtitulo: '1º recessivo a partir de dois dominantes',
    corpo: [
      'Você cruzou dois Mendelitos roxos e nasceu um verde. De onde veio?',
      'Cada pai roxo carregava um alelo verde **escondido** (Cc). Por fora ele parece igual a um roxo puro (CC), mas guarda o segredo. Isso é um **portador**.',
    ],
    desbloqueia: [1, 2, 3, 4, 5],
  },
  ratio31: {
    id: 'ratio31',
    emoji: '🃏',
    titulo: 'A PROPORÇÃO 3:1',
    subtitulo: 'cruzamento Cc × Cc com ninhada visível',
    corpo: [
      'Repare na ninhada: a cada 4 filhotes, mais ou menos **3 roxos para 1 verde**.',
      'Não é coincidência — é a marca registrada do cruzamento entre dois portadores.',
    ],
    desbloqueia: [7],
  },
  segregacao: {
    id: 'segregacao',
    emoji: '🃏',
    titulo: 'A LEI DA SEGREGAÇÃO',
    subtitulo: '2º cruzamento',
    corpo: [
      'Cada filhote recebeu **um** alelo de cada pai. Os dois alelos de um pai se *separam* ao formar os filhotes — cada um vai para um lado.',
      'Mendel descobriu isso sem nunca ver um gene. (É o que acontece na meiose, quando os cromossomos homólogos se separam.)',
    ],
    desbloqueia: [6],
  },
  doisGenes: {
    id: 'doisGenes',
    emoji: '🃏',
    titulo: 'DOIS GENES DE UMA VEZ',
    subtitulo: '1º cruzamento de Mundo 2',
    corpo: [
      'Agora cor E orelhas são herdadas ao mesmo tempo — e uma não interfere na outra.',
      'Genes independentes se combinam livremente. É por isso que aparece tanta variedade.',
    ],
    desbloqueia: [8],
  },
  rosa: {
    id: 'rosa',
    emoji: '🃏',
    titulo: 'ROSA?! — DOMINÂNCIA INCOMPLETA',
    subtitulo: '1º heterozigoto de crista',
    corpo: [
      'Crista vermelha + crista branca não deu nem uma nem outra: deu **rosa**.',
      'Aqui nenhum alelo "vence" — eles se misturam num meio-termo. Isso é **dominância incompleta**.',
    ],
    desbloqueia: [9],
  },
  duasCores: {
    id: 'duasCores',
    emoji: '🃏',
    titulo: 'AS DUAS CORES — CODOMINÂNCIA',
    subtitulo: '1º heterozigoto de escamas',
    corpo: [
      'As escamas saíram **azuis E vermelhas ao mesmo tempo**, inteiras. Não viraram roxo.',
      'Quando os dois alelos aparecem por completo juntos, isso é **codominância**.',
    ],
    desbloqueia: [10],
  },
  ligadoX: {
    id: 'ligadoX',
    emoji: '🃏',
    titulo: 'SÓ NOS MACHOS? — LIGADO AO X',
    subtitulo: '1º macho de olhos pequenos',
    corpo: [
      'Olhos pequenos apareceram mais nos machos. O gene dos olhos fica no cromossomo **X**.',
      'O macho tem só um X — então um único alelo recessivo já se mostra nele. A fêmea tem dois X e pode ser só **portadora**.',
    ],
    desbloqueia: [11],
  },
}

// Ordem de exibição quando várias cartas disparam no mesmo cruzamento.
export const ORDEM_CARTAS = [
  'segregacao',
  'doisGenes',
  'portador',
  'ratio31',
  'rosa',
  'duasCores',
  'ligadoX',
]
