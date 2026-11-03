import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Heart, CheckCircle2, Clock3, SearchX } from 'lucide-react';
import { provas } from '../data/provas';
import WhatsAppButton from '../components/WhatsAppButton';
import { useFavorites } from '../hooks/useFavorites';
import { STATUS, whatsappMessage } from '../lib/status';
import { accentOf } from '../lib/catalog';
import { requestLink } from '../lib/request';

const STATUS_ICON = { disponivel: CheckCircle2, producao: Clock3, indisponivel: SearchX };

export default function Detail() {
  const { id } = useParams();
  const { toggle, isFavorite } = useFavorites();
  const prova = provas.find((x) => String(x.id) === id);

  if (!prova) {
    return (
      <section className="page wrap">
        <meta name="robots" content="noindex" />
        <div className="empty">
          <h1>Concurso não encontrado</h1>
          <p>Esse concurso não está cadastrado. Você pode buscar outro ou pedir a resolução pelo WhatsApp.</p>
          <div className="empty-actions"><Link className="btn btn-primary" to="/provas">Ver concursos</Link><a className="btn btn-whatsapp" target="_blank" rel="noreferrer" href={requestLink()}>Pedir uma resolução</a></div>
        </div>
      </section>
    );
  }

  const saved = isFavorite(prova.id);
  const StatusIcon = STATUS_ICON[prova.status];
  const info = [
    ['Município', prova.municipio],
    ['Cargo', prova.cargo],
    ['Ano', prova.ano],
    ['Disciplina', prova.disciplina],
    ['Questões', prova.questoes],
  ];

  return (
    <section className="page wrap detail" style={{ '--accent': accentOf(prova.municipio) }}>
      <nav className="crumbs" aria-label="Você está em">
        <Link to="/provas">Concursos</Link>
        <ChevronRight size={15} aria-hidden="true" />
        <Link to={`/provas?municipio=${encodeURIComponent(prova.municipio)}`}>{prova.municipio}</Link>
        <ChevronRight size={15} aria-hidden="true" />
        <span aria-current="page">{prova.cargo}</span>
      </nav>

      <div className="detail-grid">
        <div>
          <span className="tag">{prova.cargo}</span>
          <h1>{prova.titulo}</h1>
          <p className="lead">{prova.descricao}</p>
          <dl className="detail-meta">
            {info.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>

        <aside className="purchase" aria-label="Resolução">
          <div className={`status big ${prova.status}`}>
            <StatusIcon size={22} aria-hidden="true" />
            {STATUS[prova.status].detail}
          </div>
          <p>{prova.status === 'indisponivel' ? 'Esta resolução ainda não está no catálogo. Peça pelo WhatsApp com a mensagem já pronta.' : 'O atendimento é feito diretamente pelo WhatsApp, sem cadastro.'}</p>
          <WhatsAppButton message={whatsappMessage(prova)}>{STATUS[prova.status].cta}</WhatsAppButton>
          <button type="button" className={`btn btn-ghost save ${saved ? 'active' : ''}`} onClick={() => toggle(prova.id)} aria-pressed={saved}>
            <Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
            {saved ? 'Salva nos favoritos' : 'Salvar nos favoritos'}
          </button>
        </aside>
      </div>
    </section>
  );
}
