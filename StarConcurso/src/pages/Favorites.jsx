import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { provas } from '../data/provas';
import { plural } from '../lib/catalog';
import ProvaCard from '../components/ProvaCard';
import Reveal from '../components/Reveal';
import { useFavorites } from '../hooks/useFavorites';

export default function Favorites() {
  const { favorites, toggle, isFavorite } = useFavorites();
  const list = provas.filter((p) => favorites.includes(p.id));

  return (
    <section className="page wrap">
      <header className="page-head">
        <div>
          <span className="eyebrow">Salvas neste navegador</span>
          <h1>Meus <em>favoritos.</em></h1>
          <p className="muted">
            {list.length ? `${plural(list.length, 'concurso salvo', 'concursos salvos')}. ` : ''}
            Ficam guardadas neste navegador, sem precisar de cadastro.
          </p>
        </div>
      </header>

      {list.length ? (
        <div className="tiles">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 60}>
              <ProvaCard prova={p} isFavorite={isFavorite(p.id)} toggle={toggle} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="empty">
          <Heart size={32} aria-hidden="true" />
          <h2>Você ainda não salvou nenhum concurso.</h2>
          <p>Use o coração nos concursos para guardá-los aqui.</p>
          <div className="empty-actions"><Link className="btn btn-primary" to="/provas">Ver concursos</Link></div>
        </div>
      )}
    </section>
  );
}
