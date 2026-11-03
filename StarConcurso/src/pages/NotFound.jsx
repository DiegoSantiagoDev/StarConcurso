import { Link } from 'react-router-dom';
import mascot from '../assets/mascot-chorando.png';

// Constelação incompleta: cinco estrelas acesas e uma vaga vazia — foi de lá que o mascote caiu.
const ESTRELAS = [
  [154, 177],
  [212, 86],
  [274, 153],
  [341, 52],
  [404, 114],
];
// Poeira de estrelas (quadradinhos de pixel) para dar profundidade ao céu.
const POEIRA = [[70, 40], [250, 20], [470, 40], [120, 300], [60, 430], [330, 250], [210, 520], [90, 600], [520, 330], [300, 640]];

export default function NotFound() {
  return (
    <section className="wrap notfound">
      {/* React 19 move esta tag para o <head>. A hospedagem SPA responde 200 em rotas inexistentes (soft 404). */}
      <meta name="robots" content="noindex" />
      <div className="nf-copy">
        <span className="code404">404</span>
        <h1>Ops... essa página caiu fora da prova!</h1>
        <p>Não encontramos o que você procurou. O concurso da sua região está a uma busca de distância.</p>
        <p className="funny">“Essa questão ainda não entrou no edital.”</p>
        <Link className="btn btn-primary" to="/provas">Buscar concursos</Link>
      </div>

      <div className="sad-mascot">
        <div className="nf-glow" aria-hidden="true" />
        <div className="nf-planet" aria-hidden="true" />

        <svg className="nf-sky" viewBox="0 0 600 700" preserveAspectRatio="xMinYMin meet" aria-hidden="true" focusable="false">
          {POEIRA.map(([x, y], i) => (
            <rect key={i} className="nf-dust" x={x} y={y} width="3" height="3" style={{ '--i': i }} />
          ))}
          <polyline className="nf-line" points={ESTRELAS.map((p) => p.join(',')).join(' ')} />
          <line className="nf-line nf-line-gap" x1="125" y1="206" x2="154" y2="177" />
          {ESTRELAS.map(([x, y], i) => (
            <g key={i} className="nf-dot" transform={`translate(${x} ${y})`} style={{ '--i': i }}>
              <path d="M0 -9 L2.2 -2.2 L9 0 L2.2 2.2 L0 9 L-2.2 2.2 L-9 0 L-2.2 -2.2 Z" />
            </g>
          ))}
          {/* a vaga vazia e o rastro da queda até onde o mascote está sentado */}
          <circle className="nf-slot" cx="125" cy="206" r="13" />
          <path className="nf-fall" d="M127 221 C 140 420, 250 560, 430 604" />
        </svg>

        <span className="nf-shoot" aria-hidden="true" />

        <div className="nf-figure">
          <img src={mascot} alt="Mascote do StarConcurso, uma estrela de bigode, sentada e chorando" />
          <span className="tear t1" aria-hidden="true" />
          <span className="tear t2" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
