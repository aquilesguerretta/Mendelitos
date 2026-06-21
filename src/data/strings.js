// ============================================================================
// strings.js — Todas as strings de interface (seções 7.1 e 7.5). PT-BR LITERAL.
// ============================================================================

export const S = {
  titulo: 'Mendelitos',
  subtitulo: 'Crie. Descubra. Colecione.',

  botoes: {
    jogar: 'Jogar',
    cruzar: 'Cruzar',
    cruzarConfirmar: 'Cruzar!',
    lente: 'Lente de Previsão',
    escanear: 'Escanear',
    guardar: 'Guardar',
    soltar: 'Soltar',
    missoes: 'Missões',
    codex: 'Codex',
    dex: 'Dex',
    voltar: 'Voltar',
    continuar: 'Continuar',
  },

  labVazio: 'Seu laboratório está esperando. Cruze dois Mendelitos para começar a descobrir!',
  selecionarPais: 'Escolha dois Mendelitos para cruzar.',
  selecionarPaisDica: 'Você precisa de uma fêmea (XX) e um macho (XY).',
  lenteTitulo: 'O que pode nascer?',
  guardarSoltar: 'Quais filhotes ficam na sua coleção?',
  dexBloqueado: '???  — ainda não descoberto',

  // 7.5 Mensagens diversas
  raro: '✨ Raro! Você conseguiu um Mendelito incomum.',
  dexMundoCompleta: 'Você catalogou todos os Mendelitos deste mundo! 🎉',
  novoMundo: (nome) => `Novo mundo desbloqueado: ${nome}. Novos genes para descobrir!`,
  scanner: (genotipo) => `Genótipo revelado: ${genotipo}.`,
  missaoCompleta: '✓ Missão completa!',

  // Rótulos de fenótipo (para Dex/Lente/Scanner) em PT-BR
  fenLabel: {
    cor: { roxo: 'Roxo', verde: 'Verde' },
    orelhas: { curtas: 'Orelhas curtas', longas: 'Orelhas longas' },
    padrao: { liso: 'Liso', manchado: 'Manchado' },
    crista: { vermelha: 'Crista vermelha', rosa: 'Crista rosa', branca: 'Crista branca' },
    escamas: {
      azul: 'Escamas azuis',
      vermelha: 'Escamas vermelhas',
      'azul+vermelha': 'Escamas azuis e vermelhas',
    },
    olhos: { grandes: 'Olhos grandes', pequenos: 'Olhos pequenos' },
  },

  sexoLabel: { XX: '♀ Fêmea (XX)', XY: '♂ Macho (XY)' },

  // Telas / navegação
  laboratorio: 'Laboratório',
  colecao: 'Coleção',
  mae: 'Mãe (XX)',
  pai: 'Pai (XY)',
  ninhada: 'Ninhada',
  segregando: 'Segregando alelos...',
  chocando: 'Chocando...',
  config: 'Configurações',
  som: 'Som',
  reiniciar: 'Reiniciar progresso',
  reiniciarConfirma: 'Tem certeza? Isso apaga toda a sua coleção e descobertas.',
  reiniciarSim: 'Sim, apagar tudo',
  cancelar: 'Cancelar',
  moedas: 'Moedas',
  scannerSemMoeda: 'Sem moedas suficientes. Complete missões para ganhar mais!',
  scannerUsar: 'Escanear genótipo (1 moeda)',
  parInvalido: 'Escolha uma fêmea (XX) E um macho (XY) para cruzar.',
  apelidoPlaceholder: 'Dar um apelido...',
  nenhumaDescoberta: 'Nenhuma descoberta ainda. Continue cruzando!',
  progresso: 'Progresso',
}
