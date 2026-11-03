import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import mascot from '../assets/mascot-pensando.png';
import PixelArrow from './PixelArrow';

const frases = [
  'Olá! Procurando o concurso da sua região?',
  'Digite o município ou o cargo na busca.',
  'Não encontrou a prova? Peça a resolução pelo WhatsApp!',
  'Bora estudar para o concurso da sua região?',
  'Cada questão é um passo. Continue!',
];

export default function Mascot() {
  const [shown, setShown] = useState(false); // começa recolhido: só a seta aparece
  const [open, setOpen] = useState(false); // balão de fala
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  // Primeiro clique abre; os seguintes avançam a frase.
  const toggleOrNext = () => {
    if (open) setIndex((i) => (i + 1) % frases.length);
    setOpen(true);
  };

  const toggleShown = () => {
    setShown((v) => !v);
    setOpen(false);
  };

  const offset = reduce ? 0 : 10;
  const slide = reduce ? 0 : 90;

  return (
    <div className="mascot-wrap">
      <AnimatePresence>
        {shown && (
          <motion.div
            key="stage"
            id="mascote"
            className="mascot-stage"
            initial={{ opacity: 0, x: slide }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slide }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence>
              {open && (
                <motion.div
                  role="status"
                  initial={{ opacity: 0, y: offset }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: offset }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="mascot-chat"
                >
                  <button type="button" aria-label="Fechar mensagem" onClick={() => setOpen(false)}>
                    <X size={15} />
                  </button>
                  <strong>Professor Star</strong>
                  <p>{frases[index]}</p>
                  <div className="mascot-chat-actions">
                    <button type="button" className="next-message" onClick={() => setIndex((i) => (i + 1) % frases.length)}>
                      Outra frase →
                    </button>
                    <button type="button" className="next-message" onClick={toggleShown}>
                      Esconder
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              whileHover={reduce ? undefined : { y: -4 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className="mascot-btn"
              onClick={toggleOrNext}
              aria-label="Abrir ajuda do mascote"
              aria-expanded={open}
            >
              <img src={mascot} alt="" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={`mascot-tab ${shown ? '' : 'is-nudging'}`}
        onClick={toggleShown}
        aria-label={shown ? 'Esconder o Professor Star' : 'Mostrar o Professor Star'}
        aria-expanded={shown}
        aria-controls="mascote"
        title={shown ? 'Esconder' : 'Mostrar o Professor Star'}
      >
        <PixelArrow dir={shown ? 'right' : 'left'} />
      </button>
    </div>
  );
}
