import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Provas from './pages/Provas';
import Detail from './pages/Detail';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Privacidade from './pages/Privacidade';
import NotFound from './pages/NotFound';
import { StarConcursoIntro } from './components/starconcurso/StarConcursoIntro';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<StarConcursoIntro />} />
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/home" element={<Home />} />
          <Route path="/provas" element={<Provas />} />
          <Route path="/provas/:id" element={<Detail />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/privacidade" element={<Privacidade />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/inicio" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
