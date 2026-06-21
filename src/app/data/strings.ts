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
    comecar: "Começar a jogar",
    pular: "Pular",
    comoJogar: "Como jogar",
    proximo: "Próximo",
    surpreenda: "Surpreenda-me",
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
    favorited: "⭐ Favoritado!",
    unfavorited: "Removido dos favoritos",
  },
  // Abertura (mostrada uma vez, antes do laboratório)
  intro: {
    title: "Bem-vindo ao laboratório!",
    slides: [
      {
        emoji: "🧬",
        title: "Genética de verdade",
        body: "Mendelitos são criaturinhas fofas que seguem as Leis de Mendel — genética de verdade. A aparência de cada filhote vem direto dos genes dele… mas nem todo gene se mostra na superfície.",
      },
      {
        emoji: "💞",
        title: "Cruze e descubra",
        body: "Junte uma fêmea (♀) e um macho (♂). Cada filhote recebe um alelo de cada pai. Cores, orelhas, asas e escamas surgem das combinações.",
      },
      {
        emoji: "🗂️",
        title: "Colecione tudo",
        body: "Catalogue fenótipos na Dex, complete missões, desbloqueie o Codex e novos mundos com heranças cada vez mais curiosas.",
      },
    ],
  },
  // Passos de "Como jogar" (acessível a qualquer momento)
  howTo: [
    {
      emoji: "👆",
      title: "1. Escolha dois pais",
      body: "Toque em 💞 Cruzar e selecione uma fêmea (♀) e um macho (♂) da sua coleção.",
    },
    {
      emoji: "🔮",
      title: "2. Espie o futuro (opcional)",
      body: "A Lente de Previsão mostra o Quadro de Punnett: as chances de cada característica nos filhotes.",
    },
    {
      emoji: "✨",
      title: "3. Veja a segregação",
      body: "Os alelos voam de cada pai até os ovos. É a 1ª Lei de Mendel acontecendo: cada filhote leva um alelo de cada lado.",
    },
    {
      emoji: "🥚",
      title: "4. Choque e guarde",
      body: "Os ovos chocam! Guarde os filhotes que quiser na sua coleção (e solte o resto com carinho).",
    },
    {
      emoji: "🔍",
      title: "5. Investigue",
      body: "Abra um Mendelito para ver seus genes, dar um nome, favoritar ⭐ ou usar o Scanner para revelar o genótipo escondido.",
    },
    {
      emoji: "🏆",
      title: "6. Evolua",
      body: "Complete missões para ganhar moedas e desbloquear novos mundos — com dominância incompleta, codominância e herança ligada ao X.",
    },
  ],
};
