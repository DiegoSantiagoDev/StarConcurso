// Saneamento de tudo que o visitante (ou a URL) controla e que acaba na tela, no link do WhatsApp ou no localStorage.
// Lista de erros: #171 sem limites mín./máx., #168-169 espaços como conteúdo, #194 entradas extremas/maliciosas,
// #209 sem limite de tamanho, #160 localStorage como fonte confiável.
//
// Importante: a URL é controlada por quem envia o link. Sem estes limites, um link como
// /provas?q=<500 KB de texto> geraria um link do WhatsApp gigante com texto escolhido por um terceiro.

export const LIMITS = { municipio: 60, cargo: 80, busca: 80, ano: 4 };

// Controles C0/C1, separadores de linha/parágrafo, caracteres invisíveis e de direção de texto (U+202E "troca" a ordem
// visual e permite esconder/inverter palavras numa mensagem), além do BOM.
// eslint-disable-next-line no-control-regex
const INVISIBLE = /[\u0000-\u001F\u007F-\u009F\u00AD\u200B-\u200F\u2028-\u202E\u2060-\u206F\uFEFF]/g;

/** Texto livre: remove invisíveis, normaliza espaços e corta no limite (sem partir emojis ao meio). */
export function cleanText(value, max) {
  const text = String(value ?? '').replace(INVISIBLE, ' ').replace(/\s+/g, ' ').trim();
  return Array.from(text).slice(0, max).join('').trim();
}

/** Ano: só dígitos, no máximo 4. */
export function cleanYear(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, LIMITS.ano);
}

const MAX_FAVORITES = 200;
const MAX_ID_LENGTH = 64;

/**
 * Favoritos vêm do localStorage, que o usuário (ou uma extensão, ou outro script) pode alterar.
 * Aceita só ids simples, sem duplicatas e em quantidade limitada. Qualquer outra coisa é descartada.
 */
export function sanitizeFavorites(parsed) {
  if (!Array.isArray(parsed)) return [];
  const ok = parsed.filter(
    (id) => (typeof id === 'number' && Number.isFinite(id)) || (typeof id === 'string' && id.length > 0 && id.length <= MAX_ID_LENGTH),
  );
  return [...new Set(ok)].slice(0, MAX_FAVORITES);
}
