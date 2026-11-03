import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import { STEPS } from '../lib/content';

const AUDIENCE = [
  'Quem estuda para um concurso da sua cidade ou de um município vizinho.',
  'Candidatos que querem entender o raciocínio por trás de cada questão de provas anteriores.',
  'Quem não encontrou a resolução da prova que procura e precisa saber a quem pedir.',
];

export default function About() {
  return (
    <article className="page wrap about">
      <header className="about-hero">
        <span className="eyebrow">Sobre o projeto</span>
        <h1>O concurso da sua região, <em>resolvido.</em></h1>
        <p className="lead">
          O StarConcurso reúne resoluções de concursos da sua região. Se a prova que você
          procura ainda não tem resolução, você pede pelo WhatsApp.
        </p>
      </header>

      <section className="about-row">
        <h2>O que é</h2>
        <p>
          Um catálogo de concursos com resolução explicada. Cada prova mostra o município, o cargo, o ano, a
          disciplina e a situação da resolução: disponível, em produção ou ainda não existente.
        </p>
      </section>

      <section className="about-row">
        <h2>O problema que resolve</h2>
        <p>
          Quem estuda para um concurso da sua região raramente encontra a resolução da prova. O material
          costuma ser nacional, genérico e distante da realidade local. O StarConcurso coloca o município em primeiro
          lugar e, quando a resolução não existe, transforma a busca em um pedido simples pelo WhatsApp.
        </p>
      </section>

      <section className="about-row">
        <h2>Para quem foi criado</h2>
        <ul className="plain-list">
          {AUDIENCE.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="about-row">
        <h2>Como funciona</h2>
        <div>
          <ol className="timeline">
            {STEPS.map(({ n, title, long }) => (
              <li key={n}><b>{n}</b><div><h3>{title}</h3><p>{long}</p></div></li>
            ))}
          </ol>
          <p className="note">Dica: use o coração para guardar concursos nos favoritos. Eles ficam salvos neste navegador.</p>
        </div>
      </section>

      <section className="about-close">
        <blockquote>“Uma questão de cada vez. O importante é continuar evoluindo.”</blockquote>
        <div className="about-close-actions">
          <WhatsAppButton message="Olá! Procuro a resolução de um concurso da minha região. Vocês conseguem me ajudar?">Pedir uma resolução</WhatsAppButton>
          <Link className="inline-link" to="/provas">Ver concursos <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </article>
  );
}
