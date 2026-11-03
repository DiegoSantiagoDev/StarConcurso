export const STATUS = {
  disponivel: { card: 'Resolução disponível', detail: 'Resolução disponível', cta: 'Quero essa resolução' },
  producao: { card: 'Em produção', detail: 'Resolução em produção', cta: 'Perguntar sobre a resolução' },
  indisponivel: { card: 'Peça pelo WhatsApp', detail: 'Resolução ainda não disponível', cta: 'Pedir esta resolução' },
};

export function whatsappMessage(prova) {
  const alvo = `do concurso de ${prova.municipio}, cargo de ${prova.cargo}, ano ${prova.ano}`;
  switch (prova.status) {
    case 'disponivel':
      return `Olá! Encontrei no StarConcurso a resolução ${alvo} e gostaria de saber como acessar.`;
    case 'producao':
      return `Olá! Vi no StarConcurso que a resolução ${alvo} está em produção. Quando ela estará disponível?`;
    default:
      return `Olá! Procuro a resolução ${alvo}. Ela ainda não está no StarConcurso e gostaria de pedi-la.`;
  }
}
