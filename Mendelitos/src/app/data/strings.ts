// ===== Todas as strings de interface (seção 7.1 e 7.5) — PT-BR =====

export const STRINGS = {
  title: "Mendelitos",
  subtitle: "Crie. Descubra. Colecione.",
  buttons: {
    jogar: "Jogar",
    cruzar: "Cruzar",
    cruzarConfirm: "Cruzar!",
    lente: "Lente de Previsão",
    escanear: "Escanear",
    guardar: "Guardar",
    soltar: "Soltar",
    missoes: "Missões",
    codex: "Codex",
    dex: "Dex",
    voltar: "Voltar",
    continuar: "Continuar",
  },
  labEmpty:
    "Seu laboratório está esperando. Cruze dois Mendelitos para começar a descobrir!",
  selectParents: "Escolha dois Mendelitos para cruzar.",
  lensTitle: "O que pode nascer?",
  keepRelease: "Quais filhotes ficam na sua coleção?",
  dexLocked: "???  — ainda não descoberto",
  messages: {
    rare: "✨ Raro! Você conseguiu um Mendelito incomum.",
    dexWorldComplete: "Você catalogou todos os Mendelitos deste mundo! 🎉",
    newWorld: (name: string) =>
      `Novo mundo desbloqueado: ${name}. Novos genes para descobrir!`,
    scanner: (g: string) => `Genótipo revelado: ${g}.`,
    missionComplete: "✓ Missão completa!",
  },
};
