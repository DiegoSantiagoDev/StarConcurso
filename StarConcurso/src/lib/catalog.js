import { provas } from '../data/provas';

// Cada município tem uma cor de destaque (amarelo = identidade; as demais criam profundidade).
const PALETTE = ['var(--c-yellow)', 'var(--c-cyan)', 'var(--c-violet)', 'var(--c-orange)'];

// Municípios e contagens derivados dos dados reais: nada é digitado à mão.
export const MUNICIPIOS = [...new Set(provas.map((p) => p.municipio))].map((name, i) => ({
  name,
  label: name,
  count: provas.filter((p) => p.municipio === name).length,
  accent: PALETTE[i % PALETTE.length],
}));

export const accentOf = (municipio) => MUNICIPIOS.find((m) => m.name === municipio)?.accent ?? 'var(--c-blue)';

export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
