// Testes de segurança. Rodam com `npm test` (usa o node:test que já vem com o Node: nenhuma dependência nova).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { LIMITS, cleanText, cleanYear, sanitizeFavorites } from '../src/lib/sanitize.js';
import { requestMessage, requestLink } from '../src/lib/request.js';
import { WHATSAPP_NUMBER, waLink, RESPONSAVEL } from '../src/lib/contact.js';
import { CSP_META, CSP_HEADER, SECURITY_HEADERS, headersFile, securityHeaders } from '../security-headers.js';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// ---------- Saneamento de texto ----------
test('cleanText remove caracteres de controle, quebras de linha e inversão de direção (U+202E)', () => {
  assert.equal(cleanText('Agente\u0000\n\r\tAdm\u202Einistrativo', 80), 'Agente Adm inistrativo');
  assert.equal(cleanText('\u200B\u200E  Quixadá  \uFEFF', 80), 'Quixadá');
});

test('cleanText respeita o limite e não parte emoji ao meio', () => {
  assert.equal(cleanText('a'.repeat(1000), 10).length, 10);
  const out = cleanText('😀'.repeat(50), 5);
  assert.equal(Array.from(out).length, 5);
  assert.ok(!/[\uD800-\uDBFF]$/.test(out), 'não pode terminar com meio par substituto');
});

test('cleanText aceita null/undefined/números sem quebrar', () => {
  assert.equal(cleanText(undefined, 10), '');
  assert.equal(cleanText(null, 10), '');
  assert.equal(cleanText(2026, 10), '2026');
});

test('cleanYear deixa só dígitos, no máximo 4', () => {
  assert.equal(cleanYear('abc2026!!'), '2026');
  assert.equal(cleanYear('20269999'), '2026');
  assert.equal(cleanYear('<script>'), '');
  assert.equal(cleanYear(2025), '2025');
});

// ---------- Mensagem / link do WhatsApp ----------
test('um link com 1 MB de texto gera mensagem e URL de tamanho limitado', () => {
  const huge = 'x'.repeat(1_000_000);
  const msg = requestMessage({ municipio: huge, cargo: huge, ano: huge, busca: huge });
  assert.ok(msg.length < 600, `mensagem com ${msg.length} caracteres`);
  const link = requestLink({ municipio: huge, cargo: huge, ano: huge, busca: huge });
  assert.ok(link.length < 2000, `URL com ${link.length} caracteres`);
});

test('texto malicioso fica codificado e não injeta parâmetros no link wa.me', () => {
  const link = requestLink({ busca: 'a&text=EVIL&phone=999#frag\nlinha2' });
  const url = new URL(link);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, `/${WHATSAPP_NUMBER}`);
  assert.deepEqual([...url.searchParams.keys()], ['text'], 'só pode existir o parâmetro text');
  assert.equal(url.hash, '');
  assert.ok(!link.includes('\n'));
});

test('a mensagem não carrega caracteres de inversão de texto vindos da URL', () => {
  const msg = requestMessage({ municipio: 'Qui\u202Exadá', cargo: 'Pro\u0007fessor' });
  assert.ok(!/[\u202A-\u202E\u0000-\u001F]/.test(msg));
});

test('o ano na mensagem só aceita dígitos', () => {
  assert.equal(requestMessage({ municipio: 'Iguatu', ano: '<b>2026</b>' }).includes(', ano 2026.'), true);
  assert.equal(requestMessage({ municipio: 'Iguatu', ano: 'abc' }).includes('ano'), false);
});

test('comportamento original da mensagem foi preservado', () => {
  assert.equal(
    requestMessage({ municipio: 'Prefeitura de Quixadá', cargo: 'Guarda Municipal', ano: '2025' }),
    'Olá! Procuro a resolução do concurso de Quixadá para o cargo de Guarda Municipal, ano 2025.',
  );
  assert.equal(requestMessage(), 'Olá! Procuro a resolução de um concurso da minha região. Vocês conseguem me ajudar?');
  assert.equal(
    requestMessage({ busca: 'enfermagem' }),
    'Olá! Procuro a resolução do seguinte concurso: enfermagem. Vocês conseguem me ajudar?',
  );
});

test('o número do WhatsApp tem formato válido e o link base é wa.me', () => {
  assert.match(WHATSAPP_NUMBER, /^\d{12,13}$/);
  assert.equal(waLink(), `https://wa.me/${WHATSAPP_NUMBER}`);
});

test('os limites públicos não foram afrouxados', () => {
  assert.deepEqual(LIMITS, { municipio: 60, cargo: 80, busca: 80, ano: 4 });
});

// ---------- localStorage dos favoritos ----------
test('sanitizeFavorites descarta lixo, objetos, duplicatas e limita a quantidade', () => {
  assert.deepEqual(sanitizeFavorites(null), []);
  assert.deepEqual(sanitizeFavorites('texto'), []);
  assert.deepEqual(sanitizeFavorites({ a: 1 }), []);
  assert.deepEqual(sanitizeFavorites([1, 2, 2, { x: 1 }, [3], null, undefined, NaN, Infinity, 'ok', '']), [1, 2, 'ok']);
  assert.equal(sanitizeFavorites(['y'.repeat(65)]).length, 0);
  assert.equal(sanitizeFavorites(Array.from({ length: 5000 }, (_, i) => i)).length, 200);
});

// ---------- CSP e cabeçalhos ----------
const directive = (csp, name) => csp.split('; ').find((d) => d.startsWith(`${name} `) || d === name);

test('script-src é estrito: sem unsafe-inline, unsafe-eval ou curingas', () => {
  for (const csp of [CSP_META, CSP_HEADER]) {
    const script = directive(csp, 'script-src');
    assert.equal(script, "script-src 'self'");
    assert.ok(!/unsafe-eval|\*|https?:/.test(script));
  }
});

test('a CSP bloqueia plugins, iframes e <base> externo', () => {
  assert.equal(directive(CSP_META, 'object-src'), "object-src 'none'");
  assert.equal(directive(CSP_META, 'frame-src'), "frame-src 'none'");
  assert.equal(directive(CSP_META, 'base-uri'), "base-uri 'self'");
  assert.equal(directive(CSP_META, 'form-action'), "form-action 'self'");
});

test('frame-ancestors e upgrade-insecure-requests só no cabeçalho HTTP (o <meta> ignora/quebra o preview local)', () => {
  assert.equal(directive(CSP_HEADER, 'frame-ancestors'), "frame-ancestors 'none'");
  assert.ok(CSP_HEADER.includes('upgrade-insecure-requests'));
  assert.ok(!CSP_META.includes('frame-ancestors'));
  assert.ok(!CSP_META.includes('upgrade-insecure-requests'));
});

test('a CSP não permite nenhuma origem externa (fontes são locais, sem Google)', () => {
  for (const csp of [CSP_META, CSP_HEADER]) {
    assert.equal(csp.match(/https?:\/\/[^\s;]+/g), null);
  }
  assert.equal(directive(CSP_HEADER, 'font-src'), "font-src 'self'");
});

test('nenhum arquivo do site chama o Google Fonts', () => {
  for (const f of ['index.html', 'src/styles.css', 'src/intro.css', 'src/main.jsx', 'vercel.json']) {
    assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(read(f)), `referência ao Google em ${f}`);
  }
});

test('as fontes locais usadas pelo CSS estão importadas no main.jsx', () => {
  const main = read('src/main.jsx');
  for (const pkg of ['dm-sans', 'space-grotesk', 'inter-tight', 'instrument-serif', 'jetbrains-mono']) {
    assert.ok(main.includes(`@fontsource/${pkg}/`), `faltou importar @fontsource/${pkg}`);
    assert.ok(JSON.parse(read('package.json')).dependencies[`@fontsource/${pkg}`], `faltou ${pkg} no package.json`);
  }
});

// ---------- LGPD: identificação do responsável e página de privacidade ----------
test('o responsável está identificado e o contato é consistente com o link do WhatsApp', () => {
  assert.ok(RESPONSAVEL.nome.trim().length > 3);
  assert.match(RESPONSAVEL.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.equal(RESPONSAVEL.whatsapp.replace(/\D/g, ''), WHATSAPP_NUMBER.slice(2), 'o número exibido tem de ser o mesmo do botão');
});

test('a rota /privacidade existe e o rodapé mostra o responsável e o link', () => {
  assert.ok(read('src/App.jsx').includes('path="/privacidade"'));
  const layout = read('src/components/Layout.jsx');
  assert.ok(layout.includes('to="/privacidade"'));
  assert.ok(layout.includes('RESPONSAVEL.nome'));
});

test('a página de privacidade cobre o essencial da LGPD e o prazo de retenção combinado', () => {
  const page = read('src/pages/Privacidade.jsx');
  for (const trecho of ['controladora', 'não usa cookies', '90 dias', 'exclusão', 'ANPD', 'art. 7º']) {
    assert.ok(page.includes(trecho), `faltou "${trecho}" na página de privacidade`);
  }
});

test('cabeçalhos essenciais estão presentes', () => {
  for (const name of ['Content-Security-Policy', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'Strict-Transport-Security']) {
    assert.ok(SECURITY_HEADERS[name], `faltou ${name}`);
  }
  assert.equal(SECURITY_HEADERS['X-Content-Type-Options'], 'nosniff');
  assert.ok(!SECURITY_HEADERS['Strict-Transport-Security'].includes('includeSubDomains'));
});

test('plugin do Vite: só no build, injeta o <meta> da CSP e gera o _headers', () => {
  const plugin = securityHeaders();
  assert.equal(plugin.apply, 'build', 'no dev a CSP quebraria o HMR e o React Refresh');
  const [tag] = plugin.transformIndexHtml();
  assert.equal(tag.tag, 'meta');
  assert.equal(tag.attrs['http-equiv'], 'Content-Security-Policy');
  assert.equal(tag.attrs.content, CSP_META);
  const emitted = [];
  plugin.generateBundle.call({ emitFile: (f) => emitted.push(f) });
  assert.equal(emitted[0].fileName, '_headers');
  assert.equal(emitted[0].source, headersFile());
});

test('vercel.json não divergiu da política em security-headers.js', () => {
  const vercel = JSON.parse(read('vercel.json'));
  const sent = Object.fromEntries(vercel.headers[0].headers.map(({ key, value }) => [key, value]));
  assert.deepEqual(sent, SECURITY_HEADERS);
});

// ---------- Higiene do repositório ----------
test('.gitignore impede commitar node_modules, dist e .env', () => {
  const lines = read('.gitignore').split('\n').map((l) => l.trim());
  for (const entry of ['node_modules/', 'dist/', '.env', '.env.*']) assert.ok(lines.includes(entry), `faltou ${entry}`);
});

test('nenhum segredo óbvio no código-fonte', () => {
  const files = ['index.html', 'vite.config.js', 'security-headers.js', 'src/lib/contact.js', 'src/lib/request.js', 'src/lib/sanitize.js'];
  const pattern = /(api[_-]?key|secret|passw(or)?d|bearer\s|BEGIN (RSA|PRIVATE)|sk-[a-z0-9]{20,}|AKIA[0-9A-Z]{12,})/i;
  for (const f of files) assert.ok(!pattern.test(read(f)), `padrão suspeito em ${f}`);
});
