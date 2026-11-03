import { Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STATUS } from '../lib/status';
import { accentOf } from '../lib/catalog';

/**
 * variant:
 *  - "default": ficha do catálogo (sem caixa, só linha e tipografia)
 *  - "row":     linha editorial (Home)
 *  - "lead":    linha editorial em destaque (Home)
 * O título é um link "esticado": a ficha inteira é clicável, e o coração fica acima dele.
 * `index` (opcional) mostra o número da linha.
 */
export default function ProvaCard({ prova, isFavorite, toggle, variant = 'default', index }) {
  const { id, titulo, municipio, cargo, ano, disciplina, questoes, status } = prova;
  const accent = { '--accent': accentOf(municipio) };

  const heart = (
    <button
      type="button"
      className={`icon-btn ${isFavorite ? 'active' : ''}`}
      onClick={() => toggle(id)}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remover ${titulo} dos favoritos` : `Adicionar ${titulo} aos favoritos`}
    >
      <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  );

  const statusLine = (extra = '') => (
    <span className={`status ${status} ${extra}`.trim()}>
      <i aria-hidden="true" />
      {STATUS[status].card}
    </span>
  );

  if (variant === 'row' || variant === 'lead') {
    const n = typeof index === 'number' ? String(index + 1).padStart(2, '0') : '';
    return (
      <article className={`row is-${status} ${variant === 'lead' ? 'is-lead' : ''}`.trim()} style={accent}>
        <span className="row-n" aria-hidden="true">{n}</span>
        <div className="row-main">
          <span className="tag">{cargo}</span>
          <h3><Link className="card-title-link" to={`/provas/${id}`}>{titulo}</Link></h3>
          <p className="muted">Concurso {ano}</p>
        </div>
        <div className="row-disc">{disciplina}<small>{questoes} questões</small></div>
        {statusLine('row-status')}
        <div className="row-side">{heart}<ArrowUpRight className="card-arrow" size={20} aria-hidden="true" /></div>
      </article>
    );
  }

  return (
    <article className={`tile is-${status}`} style={accent}>
      <div className="tile-top">
        <span className="tag">{cargo}</span>
        {heart}
      </div>
      <h3><Link className="card-title-link" to={`/provas/${id}`}>{titulo}</Link></h3>
      <p className="muted">Concurso {ano}</p>
      <dl className="tile-meta">
        <div><dt>Disciplina</dt><dd>{disciplina}</dd></div>
        <div><dt>Questões</dt><dd>{questoes}</dd></div>
      </dl>
      <div className="tile-foot">
        {statusLine()}
        <ArrowUpRight className="card-arrow" size={20} aria-hidden="true" />
      </div>
    </article>
  );
}
