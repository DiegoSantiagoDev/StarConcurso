// Fonte única da política de segurança do site (lista de erros: #295 cabeçalhos ausentes, #262 XSS, #516/#517 HTTPS).
//
// Usada de duas formas pelo build (vite.config.js):
//  1. <meta http-equiv="Content-Security-Policy"> injetado no index.html → funciona em QUALQUER hospedagem,
//     inclusive as que não permitem configurar cabeçalhos (ex.: GitHub Pages).
//  2. Arquivo `_headers` gerado em dist/ → aplicado como cabeçalhos HTTP reais por Netlify e Cloudflare Pages.
//     Cabeçalhos reais são mais fortes que o <meta>: só eles aceitam `frame-ancestors` (anti-clickjacking).
//
// Se mudar a política aqui, atualize também o vercel.json (que é estático).

// Diretivas válidas tanto no <meta> quanto no cabeçalho.
const BASE = {
  'default-src': ["'self'"],
  // Nenhum script inline e nenhum eval: é isto que realmente bloqueia XSS.
  'script-src': ["'self'"],
  // 'unsafe-inline' em estilo é necessário porque React/Framer Motion/GSAP definem `style` nos elementos.
  // O risco é muito menor que o de script inline. As fontes são locais (@fontsource): nenhuma origem externa.
  'style-src': ["'self'", "'unsafe-inline'"],
  // Sem data: de propósito. O vite.config.js impede que o Vite embute fontes como data: URI.
  'font-src': ["'self'"],
  // data: = ruído SVG embutido no CSS e assets pequenos que o Vite embute.
  'img-src': ["'self'", 'data:'],
  'connect-src': ["'self'"],
  'object-src': ["'none'"],
  'frame-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'manifest-src': ["'self'"],
  'worker-src': ["'self'"],
};

// Só funcionam como cabeçalho HTTP (o navegador ignora no <meta>).
// `upgrade-insecure-requests` fica fora do <meta> para não quebrar `vite preview` em http://localhost.
const HEADER_ONLY = {
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

const serialize = (directives) =>
  Object.entries(directives)
    .map(([name, values]) => [name, ...values].join(' '))
    .join('; ');

export const CSP_META = serialize(BASE);
export const CSP_HEADER = serialize({ ...BASE, ...HEADER_ONLY });

export const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP_HEADER,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  // Sem includeSubDomains/preload de propósito: só adicione depois de confirmar que TODOS os subdomínios têm HTTPS.
  'Strict-Transport-Security': 'max-age=31536000',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

/** Conteúdo do arquivo `_headers` (Netlify / Cloudflare Pages). */
export const headersFile = () =>
  '/*\n' + Object.entries(SECURITY_HEADERS).map(([k, v]) => `  ${k}: ${v}`).join('\n') + '\n';

/**
 * Plugin do Vite. `apply: 'build'` porque o servidor de desenvolvimento usa script inline (React Refresh)
 * e WebSocket (HMR), que uma CSP estrita bloquearia e quebraria o `npm run dev`.
 */
export function securityHeaders() {
  return {
    name: 'star-security-headers',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP_META },
          injectTo: 'head-prepend',
        },
      ];
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '_headers', source: headersFile() });
    },
  };
}
