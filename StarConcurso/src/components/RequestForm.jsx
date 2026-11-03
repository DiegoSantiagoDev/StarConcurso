import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { requestMessage, requestLink } from '../lib/request';
import { LIMITS, cleanYear } from '../lib/sanitize';

/**
 * Pedido de resolução: a pessoa diz qual concurso procura e abre o WhatsApp com a mensagem pronta.
 * Sem envio de dados para servidor: o link do WhatsApp é montado no próprio navegador.
 */
export default function RequestForm({ initial = {} }) {
  const [f, setF] = useState({ municipio: '', cargo: '', ano: '', ...initial });
  const set = (key) => (e) => setF((v) => ({ ...v, [key]: e.target.value }));
  // Ano: só dígitos (quem cola "abc2026!" fica com "2026").
  const setYear = (e) => setF((v) => ({ ...v, ano: cleanYear(e.target.value) }));

  return (
    <div className="req-form" role="group" aria-label="Pedir resolução pelo WhatsApp">
      <div className="req-fields">
        <label>
          Município
          <input type="text" value={f.municipio} onChange={set('municipio')} maxLength={LIMITS.municipio} placeholder="Ex.: Quixeramobim" autoComplete="off" />
        </label>
        <label>
          Cargo
          <input type="text" value={f.cargo} onChange={set('cargo')} maxLength={LIMITS.cargo} placeholder="Ex.: Agente Administrativo" autoComplete="off" />
        </label>
        <label className="req-year">
          Ano
          <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={LIMITS.ano} value={f.ano} onChange={setYear} placeholder="2026" autoComplete="off" />
        </label>
      </div>
      <p className="req-preview" aria-live="polite">{requestMessage(f)}</p>
      <a className="btn btn-whatsapp" target="_blank" rel="noreferrer" href={requestLink(f)}>
        <MessageCircle size={18} aria-hidden="true" />
        Pedir pelo WhatsApp
      </a>
    </div>
  );
}
