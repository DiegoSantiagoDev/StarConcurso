import { MessageCircle } from 'lucide-react';
import { waLink } from '../lib/contact';

export default function WhatsAppButton({
  children = 'Falar no WhatsApp',
  message = 'Olá! Vim pelo StarConcurso e procuro a resolução de um concurso da minha região.',
}) {
  return (
    <a className="btn btn-whatsapp" target="_blank" rel="noreferrer" href={waLink(message)}>
      <MessageCircle size={18} aria-hidden="true" />
      {children}
    </a>
  );
}
