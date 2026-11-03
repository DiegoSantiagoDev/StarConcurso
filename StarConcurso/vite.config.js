import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { securityHeaders } from './security-headers.js';

export default defineConfig({
  plugins: [react(), securityHeaders()],
  build: {
    // Fontes sempre viram arquivos separados: a CSP (font-src 'self') não aceita data: URI.
    assetsInlineLimit: (file) => (/\.(woff2?|ttf|otf)$/i.test(file) ? false : undefined),
  },
});
