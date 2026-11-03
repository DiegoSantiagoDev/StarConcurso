import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { provas } from '../data/provas';
import { MUNICIPIOS, plural } from '../lib/catalog';
import { STEPS } from '../lib/content';
import ProvaCard from '../components/ProvaCard';
import RequestForm from '../components/RequestForm';
import Reveal from '../components/Reveal';
import mascot from '../assets/mascot-pixel.png';
import { useFavorites } from '../hooks/useFavorites';
import { LIMITS } from '../lib/sanitize';

// Destaques = provas que já têm resolução disponível (critério real, não "mais procuradas").
const HINTS = ['Concurso de Quixeramobim', 'Concurso de Quixadá', 'Agente Administrativo'];

const featured = provas.filter((p) => p.status === 'disponivel').slice(0, 4);

export default function Home() {
  const [q, setQ] = useState('');
  const { toggle, isFavorite } = useFavorites();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const submit = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/provas?q=${encodeURIComponent(term)}` : '/provas');
  };

  const enter = (delay = 0) =>
    reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } };

  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <motion.span className="eyebrow" {...enter()}>Concursos da sua região</motion.span>
            <motion.h1 {...enter(0.06)}>
              O concurso da sua região. <em>A resolução que você precisa.</em>
            </motion.h1>
            <motion.p className="hero-lead" {...enter(0.14)}>
              Encontre a resolução do concurso que você vai fazer. Se ela ainda não existir, peça pelo WhatsApp.
            </motion.p>

            <motion.form className="search" role="search" onSubmit={submit} {...enter(0.2)}>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                maxLength={LIMITS.busca}
                placeholder="Digite o município, cargo ou concurso..."
                aria-label="Buscar concursos"
              />
              <button type="submit" aria-label="Pesquisar"><ArrowRight size={20} aria-hidden="true" /></button>
            </motion.form>

            <motion.div className="hero-actions" {...enter(0.26)}>
              <Link className="btn btn-primary" to="/provas">Ver concursos <ArrowRight size={16} aria-hidden="true" /></Link>
              <a className="inline-link" href="#pedir">Não achou? Peça pelo WhatsApp</a>
            </motion.div>
            <motion.p className="search-hints" {...enter(0.3)}>
              Experimente:
              {HINTS.map((h) => (
                <Link key={h} to={`/provas?q=${encodeURIComponent(h)}`}>{h}</Link>
              ))}
            </motion.p>
          </div>
        </div>

        <motion.div className="hero-art" {...enter(0.1)}>
          <span className="orb" aria-hidden="true" />
          <span className="ring ring-a" aria-hidden="true" />
          <span className="ring ring-b" aria-hidden="true" />
          <img src={mascot} alt="Mascote do StarConcurso" />
        </motion.div>
      </section>

      <nav className="cats" aria-label="Concursos por município">
        <p className="wrap cats-title">Escolha o município do seu concurso</p>
        <div className="wrap cats-list">
          {MUNICIPIOS.map(({ name, label, count, accent }, i) => (
            <Link key={name} to={`/provas?municipio=${encodeURIComponent(name)}`} style={{ '--accent': accent }}>
              <span className="cat-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <strong>{label}</strong>
                <small>{plural(count, 'concurso', 'concursos')}</small>
              </span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </nav>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Prontas para acessar</span>
            <h2>Resoluções <em>disponíveis</em> agora</h2>
          </div>
          <Link className="inline-link" to="/provas">Ver todos os concursos <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>

        <div className="rows">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 70}>
              <ProvaCard variant={i === 0 ? 'lead' : 'row'} index={i} prova={p} isFavorite={isFavorite(p.id)} toggle={toggle} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="band" id="como-funciona">
        <div className="wrap howto">
          <div>
            <span className="eyebrow">Como funciona</span>
            <h2>Do concurso que você procura à <em>resolução.</em></h2>
            <Link className="inline-link" to="/sobre">Conheça o projeto <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <ol className="howto-steps">
            {STEPS.map(({ n, title, short }) => (
              <li key={n}>
                <b>{n}</b>
                <div><h3>{title}</h3><p>{short}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="request" id="pedir">
        <div className="wrap">
          <span className="eyebrow">Não encontrou?</span>
          <h2>Peça a resolução pelo <em>WhatsApp.</em></h2>
          <p>Diga qual concurso você procura. Abrimos a conversa com a mensagem já pronta.</p>
          <RequestForm />
        </div>
      </section>
    </>
  );
}
