import { waLink } from './contact.js';
import { LIMITS, cleanText, cleanYear } from './sanitize.js';

// "Prefeitura de Quixadá", "Concurso de Quixadá" e "Quixadá" viram "Quixadá".
// O texto já chega saneado e limitado (cleanText), então a expressão regular nunca roda sobre entrada gigante.
const bare = (s) => s.replace(/^(prefeitura(\s+municipal)?|concurso)(\s+(de|do|da))?\s+/i, '');

/**
 * Mensagem de pedido para o WhatsApp, montada com o que a pessoa já informou ou pesquisou.
 * Partes que faltam são omitidas, nunca aparecem como "(não informado)".
 */
export function requestMessage({ municipio, cargo, ano, busca } = {}) {
  // Estes campos vêm de inputs e da URL (controlada por quem manda o link): sempre saneados e com tamanho máximo.
  const m = bare(cleanText(municipio, LIMITS.municipio));
  const c = cleanText(cargo, LIMITS.cargo);
  const a = cleanYear(ano);
  const b = cleanText(busca, LIMITS.busca);

  if (!m && !c && !a) {
    return b
      ? `Olá! Procuro a resolução do seguinte concurso: ${b}. Vocês conseguem me ajudar?`
      : 'Olá! Procuro a resolução de um concurso da minha região. Vocês conseguem me ajudar?';
  }
  const base =
    'Olá! Procuro a resolução do concurso' +
    (m ? ` de ${m}` : '') +
    (c ? ` para o cargo de ${c}` : '') +
    (a ? `, ano ${a}` : '') +
    '.';
  const same = (x) => x.toLowerCase() === b.toLowerCase();
  return b && !same(m) && !same(c) ? `${base} (Busca: ${b})` : base;
}

export const requestLink = (fields) => waLink(requestMessage(fields));
