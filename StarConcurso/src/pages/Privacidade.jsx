import { RESPONSAVEL, waLink } from '../lib/contact';

const DIREITOS = [
  'confirmar se tratamos dados seus e ter acesso a eles;',
  'corrigir dados incompletos ou errados;',
  'pedir a exclusão dos dados, quando quiser;',
  'saber com quem os dados foram compartilhados;',
  'pedir a portabilidade dos dados;',
  'retirar um consentimento que tenha dado.',
];

export default function Privacidade() {
  const { nome, email, whatsapp } = RESPONSAVEL;
  const contato = (
    <>
      <a className="inline-link" href={`mailto:${email}`}>{email}</a>
      {' '}ou pelo WhatsApp{' '}
      <a className="inline-link" href={waLink()} target="_blank" rel="noreferrer">{whatsapp}</a>
    </>
  );

  return (
    <article className="page wrap about">
      <header className="about-hero">
        <span className="eyebrow">Privacidade</span>
        <h1>Seus dados, <em>em poucas palavras.</em></h1>
        <p className="lead">
          Esta página explica quais dados o StarConcurso recebe, para que servem e como você pode pedir
          acesso ou exclusão. Atualizada em 12 de outubro de 2026.
        </p>
      </header>

      <section className="about-row">
        <h2>Quem é a responsável</h2>
        <p>
          O StarConcurso é operado por {nome}, pessoa física, que decide como os dados recebidos são usados
          (a controladora, nos termos da Lei Geral de Proteção de Dados, a LGPD). Para qualquer assunto de
          privacidade, fale comigo por {contato}.
        </p>
      </section>

      <section className="about-row">
        <h2>O que este site não faz</h2>
        <p>
          O site não usa cookies, não tem cadastro nem login, não usa ferramentas de análise de visitas e não tem
          banco de dados. As fontes de texto são servidas pelo próprio site, sem contato com o Google. Os concursos
          que você marca como favoritos ficam salvos só neste navegador, no seu aparelho, e não são enviados a ninguém.
          Para apagá-los, limpe os dados do site no navegador.
        </p>
      </section>

      <section className="about-row">
        <h2>Quais dados chegam até mim</h2>
        <p>
          Só os que você envia quando escolhe falar pelo WhatsApp: o número do seu telefone, o nome do seu perfil
          e o texto da mensagem, que pode trazer município, cargo e ano do concurso. O site monta um texto
          pronto com o que você digitou nos campos do pedido, mas nada sai do seu aparelho antes de você abrir o
          WhatsApp e enviar a mensagem.
        </p>
      </section>

      <section className="about-row">
        <h2>Para que uso esses dados</h2>
        <div>
          <p>
            Somente para responder ao seu pedido e entrar em contato para entender qual concurso você procura.
            Não envio promoções, não envio avisos de provas novas, não uso lista de transmissão e não uso o seu
            número para nenhum outro fim. Respondo em até 48 horas.
          </p>
          <p className="note">
            Base legal: atender a um pedido feito por você (LGPD, art. 7º, inciso V).
          </p>
        </div>
      </section>

      <section className="about-row">
        <h2>Por quanto tempo guardo</h2>
        <p>
          Por no máximo 90 dias. Depois disso, a conversa e o número são apagados. Você pode pedir a exclusão
          antes, a qualquer momento.
        </p>
      </section>

      <section className="about-row">
        <h2>Com quem os dados passam</h2>
        <p>
          Não vendo nem repasso seus dados. A conversa acontece no WhatsApp (Meta), que segue as próprias regras
          de privacidade. O serviço que hospeda o site pode registrar dados técnicos de acesso, como o endereço
          IP, por segurança e funcionamento. O site não recebe dados de pagamento: se houver pagamento, ele
          acontece fora do site, e os dados da transação ficam com a instituição financeira ou a plataforma usada.
        </p>
      </section>

      <section className="about-row">
        <h2>Seus direitos</h2>
        <div>
          <p>Você pode, quando quiser:</p>
          <ul className="plain-list">
            {DIREITOS.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="note">
            Para pedir qualquer um deles, escreva para {contato}. Posso pedir um dado simples para confirmar que
            o pedido é seu. Respondo o quanto antes e dentro do prazo previsto em lei. Se achar que seus dados
            não foram tratados corretamente, você também pode reclamar à Autoridade Nacional de Proteção de
            Dados (ANPD), em{' '}
            <a className="inline-link" href="https://www.gov.br/anpd" target="_blank" rel="noreferrer">gov.br/anpd</a>.
          </p>
        </div>
      </section>

      <section className="about-row">
        <h2>Mudanças nesta página</h2>
        <p>
          Se alguma coisa mudar na forma como os dados são usados, esta página é atualizada e a data no topo muda.
        </p>
      </section>
    </article>
  );
}
