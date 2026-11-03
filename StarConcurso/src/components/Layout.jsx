import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import scLogo from '../assets/sc-logo.png';
import WhatsAppButton from './WhatsAppButton';
import Mascot from './Mascot';
import { waLink, RESPONSAVEL } from '../lib/contact';

const NAV = [
  { to: '/home', label: 'Início' },
  { to: '/provas', label: 'Concursos' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/favoritos', label: 'Favoritos' },
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Fecha o menu mobile em qualquer navegação (inclusive voltar/avançar do navegador).
  useEffect(() => setOpen(false), [pathname]);

  // Menu aberto: Esc fecha e a página atrás não rola.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.classList.add('nav-locked');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('nav-locked');
    };
  }, [open]);

  return (
    <div className="site">
      <div className="ambient" aria-hidden="true" />
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <header className="header">
        <div className="wrap header-inner">
          <Link className="logo" to="/home" aria-label="StarConcurso, ir para o início">
            <span className="logo-star" aria-hidden="true">✦</span>
            <span>StarConcurso</span>
          </Link>

          <button
            className="menu-btn"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="menu-principal"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav id="menu-principal" className={open ? 'nav open' : 'nav'} aria-label="Principal">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to}>{label}</NavLink>
            ))}
            <WhatsAppButton>WhatsApp</WhatsAppButton>
          </nav>
        </div>
      </header>

      <main id="conteudo" key={pathname} className="page-enter">{children}</main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-inner">
            <div className="footer-brand">
              <img src={scLogo} alt="S.C - StarConcurso" />
              <p>Concursos da sua região, resolvidos.</p>
              <p className="footer-contact">
                Responsável: {RESPONSAVEL.nome}<br />
                <a href={`mailto:${RESPONSAVEL.email}`}>{RESPONSAVEL.email}</a><br />
                WhatsApp {RESPONSAVEL.whatsapp}
              </p>
            </div>
            <nav className="footer-nav" aria-label="Rodapé">
              <Link to="/provas">Concursos</Link>
              <Link to="/favoritos">Favoritos</Link>
              <Link to="/sobre">Sobre</Link>
              <Link to="/privacidade">Privacidade</Link>
              <a href={waLink()} target="_blank" rel="noreferrer">WhatsApp</a>
            </nav>
          </div>
          <p className="footer-copy">© 2026 StarConcurso. Todos os direitos reservados.</p>
        </div>
        <span className="footer-word" aria-hidden="true">StarConcurso</span>
      </footer>

      <Mascot />
    </div>
  );
}
