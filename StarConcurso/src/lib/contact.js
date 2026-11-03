export const WHATSAPP_NUMBER = '5588992620513';

// Responsável pelo site (controladora dos dados, nos termos da LGPD). Aparece no rodapé e em /privacidade.
export const RESPONSAVEL = {
  nome: 'Mikaely Santiago da Silva',
  email: 'mikaely.santiago412@gmail.com',
  whatsapp: '(88) 99262-0513',
};

export function waLink(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
