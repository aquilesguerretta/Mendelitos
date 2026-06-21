// ===== Cartas de descoberta (seção 7.2) — textos literais =====
// Cada carta sobe na 1ª vez que o jogador causa o fenômeno.

export interface DiscoveryCardDef {
  id: string;
  emoji: string;
  title: string;
  body: string;
}

export const CARDS: Record<string, DiscoveryCardDef> = {
  portador: {
    id: "portador",
    emoji: "🃏",
    title: "PORTADOR",
    body:
      "Você cruzou dois Mendelitos roxos e nasceu um amarelo. De onde veio? Cada pai roxo carregava um alelo amarelo escondido (Cc). Por fora ele parece igual a um roxo puro (CC), mas guarda o segredo. Isso é um portador.",
  },
  proporcao31: {
    id: "proporcao31",
    emoji: "🃏",
    title: "A PROPORÇÃO 3:1",
    body:
      "Repare na ninhada: a cada 4 filhotes, mais ou menos 3 roxos para 1 amarelo. Não é coincidência — é a marca registrada do cruzamento entre dois portadores.",
  },
  segregacao: {
    id: "segregacao",
    emoji: "🃏",
    title: "A LEI DA SEGREGAÇÃO",
    body:
      "Cada filhote recebeu um alelo de cada pai. Os dois alelos de um pai se separam ao formar os filhotes — cada um vai para um lado. Mendel descobriu isso sem nunca ver um gene. (É o que acontece na meiose, quando os cromossomos homólogos se separam.)",
  },
  doisGenes: {
    id: "doisGenes",
    emoji: "🃏",
    title: "DOIS GENES DE UMA VEZ",
    body:
      "Agora cor E orelhas são herdadas ao mesmo tempo — e uma não interfere na outra. Genes independentes se combinam livremente. É por isso que aparece tanta variedade.",
  },
  dominanciaIncompleta: {
    id: "dominanciaIncompleta",
    emoji: "🃏",
    title: "ROSA?! — DOMINÂNCIA INCOMPLETA",
    body:
      "Asas vermelhas + asas brancas não deram nem uma nem outra: deram rosa. Aqui nenhum alelo \"vence\" — eles se misturam num meio-termo. Isso é dominância incompleta.",
  },
  codominancia: {
    id: "codominancia",
    emoji: "🃏",
    title: "AS DUAS CORES — CODOMINÂNCIA",
    body:
      "As escamas saíram azuis E vermelhas ao mesmo tempo, inteiras. Não viraram roxo. Quando os dois alelos aparecem por completo juntos, isso é codominância.",
  },
  ligadoX: {
    id: "ligadoX",
    emoji: "🃏",
    title: "SÓ NOS MACHOS? — LIGADO AO X",
    body:
      "Olhos pequenos apareceram mais nos machos. O gene dos olhos fica no cromossomo X. O macho tem só um X — então um único alelo recessivo já se mostra nele. A fêmea tem dois X e pode ser só portadora.",
  },
};
