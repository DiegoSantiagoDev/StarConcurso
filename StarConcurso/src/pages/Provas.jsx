import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { provas } from '../data/provas';
import { MUNICIPIOS } from '../lib/catalog';
import ProvaCard from '../components/ProvaCard';
import WhatsAppButton from '../components/WhatsAppButton';
import Reveal from '../components/Reveal';
import { requestLink, requestMessage } from '../lib/request';
import { LIMITS } from '../lib/sanitize';
import { useFavorites } from '../hooks/useFavorites';

const uniq = (key) => [...new Set(provas.map((p) => p[key]))];
const OPTIONS = {
  cargo: uniq('cargo').sort((a, b) => a.localeCompare(b, 'pt-BR')),
  disciplina: uniq('disciplina').sort((a, b) => a.localeCompare(b, 'pt-BR')),
  ano: uniq('ano').sort((a, b) => b - a),
};

const SELECTS = [
  { key: 'cargo', label: 'Cargo', all: 'Todos' },
  { key: 'ano', label: 'Ano', all: 'Todos' },
  { key: 'disciplina', label: 'Disciplina', all: 'Todas' },
];
const FILTER_KEYS = ['municipio', ...SELECTS.map((s) => s.key)];

const normalize = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function Provas() {
  // A URL é a fonte da verdade: links do cabeçalho/Home, voltar/avançar e recarregar refletem os filtros.
  const [params, setParams] = useSearchParams();
  const { toggle, isFavorite } = useFavorites();

  // Tudo que vem da URL é controlado por quem enviou o link: limita o tamanho antes de usar (busca, filtros e pedido).
  const fromUrl = (key) => (params.get(key) || '').slice(0, LIMITS.busca);
  const q = fromUrl('q');
  const values = Object.fromEntries(FILTER_KEYS.map((key) => [key, fromUrl(key)]));
  const hasFilters = Boolean(q) || Object.values(values).some(Boolean);

  const setParam = (key, value) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        value ? next.set(key, value) : next.delete(key);
        return next;
      },
      { replace: true },
    );
  const clear = () => setParams({}, { replace: true });

  const filtered = useMemo(() => {
    const term = normalize(q);
    return provas.filter((p) => {
      const haystack = normalize([p.titulo, 'prefeitura', p.municipio, p.cargo, p.disciplina, p.ano].join(' '));
      return (!term || haystack.includes(term)) && FILTER_KEYS.every((key) => !values[key] || String(p[key]) === values[key]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Aproveita o que a pessoa já pesquisou ou filtrou para montar o pedido.
  const request = { municipio: values.municipio, cargo: values.cargo, ano: values.ano, busca: q };

  return (
    <section className="page wrap">
      <header className="page-head">
        <div>
          <span className="eyebrow">Concursos da sua região</span>
          <h1>Encontre o seu <em>concurso.</em></h1>
          <p className="muted">Pesquise por município, cargo ou ano. Não achou? Peça a resolução pelo WhatsApp.</p>
        </div>
        <WhatsAppButton message={requestMessage(request)}>Pedir uma resolução</WhatsAppButton>
      </header>

      <div className="filterbar">
        <div className="search compact" role="search">
          <Search aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setParam('q', e.target.value)}
            maxLength={LIMITS.busca}
            placeholder="Digite o município, cargo ou concurso..."
            aria-label="Buscar concursos"
          />
        </div>

        <div className="chips" role="group" aria-label="Município">
          <button type="button" className={`chip ${values.municipio ? '' : 'on'}`} aria-pressed={!values.municipio} onClick={() => setParam('municipio', '')}>
            Todos os municípios <span>{provas.length}</span>
          </button>
          {MUNICIPIOS.map(({ name, label, count }) => (
            <button key={name} type="button" className={`chip ${values.municipio === name ? 'on' : ''}`} aria-pressed={values.municipio === name} onClick={() => setParam('municipio', name)}>
              {label} <span>{count}</span>
            </button>
          ))}
        </div>

        <div className="filter-row">
          {SELECTS.map(({ key, label, all }) => (
            <label key={key} className={values[key] ? 'is-set' : ''}>
              {label}
              <select value={values[key]} onChange={(e) => setParam(key, e.target.value)}>
                <option value="">{all}</option>
                {OPTIONS[key].map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </label>
          ))}
          {hasFilters && (
            <button type="button" className="reset" onClick={clear}>
              <X size={15} aria-hidden="true" /> Limpar filtros
            </button>
          )}
        </div>
      </div>

      <p className="result-count" role="status">
        <strong>{filtered.length}</strong>&nbsp;{filtered.length === 1 ? 'concurso encontrado' : 'concursos encontrados'}
      </p>

      {filtered.length ? (
        <>
          <div className="tiles">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 60}>
                <ProvaCard prova={p} isFavorite={isFavorite(p.id)} toggle={toggle} />
              </Reveal>
            ))}
          </div>
          <p className="catalog-note">
            Não encontrou o seu concurso?{' '}
            <a href={requestLink(request)} target="_blank" rel="noreferrer">Peça a resolução pelo WhatsApp.</a>
          </p>
        </>
      ) : (
        <div className="empty">
          <h2>Não encontrou a prova que procura?</h2>
          <p>Peça a resolução pelo WhatsApp. A mensagem já vai pronta com o que você pesquisou.</p>
          <div className="empty-actions">
            <a className="btn btn-whatsapp" target="_blank" rel="noreferrer" href={requestLink(request)}>Pedir esta resolução</a>
            {hasFilters && <button type="button" className="text-link" onClick={clear}>Ver todos os concursos</button>}
          </div>
        </div>
      )}
    </section>
  );
}
