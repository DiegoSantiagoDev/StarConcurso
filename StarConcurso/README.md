# StarConcurso

## Executar

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # produção (dist/)
npm run preview
```

> Hospedagem estática: configure fallback para `index.html` (SPA), senão abrir `/home` direto retorna 404.

## Proposta do produto

O StarConcurso é o lugar onde se **encontra e se pede a resolução de concursos da região**.
Fluxo: procurar o município/cargo/concurso → conferir a prova (cargo, ano, disciplina, questões, situação) →
se a resolução existe, acessar pelo WhatsApp; se não existe, **pedir pelo WhatsApp** com a mensagem já montada
a partir do que a pessoa pesquisou (`src/lib/request.js`).

- Catálogo, filtros, detalhe e favoritos continuam; a hierarquia agora é **município → cargo → ano → disciplina**.
- Os dados em `src/data/provas.js` são demonstrativos (Quixeramobim, Quixadá, Iguatu, Senador Pompeu). Para acrescentar um município, basta incluir provas com o novo `municipio`: Home, chips e filtros se atualizam sozinhos.
- Sem geolocalização, pagamento ou banco de dados: o pedido é um link `wa.me` montado no navegador.

## Rotas

`/` introdução animada · `/home` Home · `/provas` concursos (filtros na URL: `q`, `municipio`, `cargo`, `ano`, `disciplina`) · `/provas/:id` detalhe · `/favoritos` · `/sobre`

O botão **Começar sua jornada** navega para `/home` (rota real da Home em `App.jsx`).

## A animação (introdução) — regra de preservação

Lógica, timeline, tempos, sequência, scroll e bibliotecas (GSAP, ScrollTrigger, Lenis) **não foram alterados**:
`StarConcursoIntro.jsx`, `StarField.jsx`, `StudyOrbit.jsx`, `MascotGuide.jsx`, `BrandReveal.jsx`, `App.jsx`, `ScrollToTop.jsx`
estão byte a byte iguais à versão anterior. Só `src/intro.css` recebeu ajustes **de CSS por breakpoint** (bloco
"RESPONSIVIDADE DA ANIMAÇÃO" + 7 linhas do bloco de celular):

- Notebooks/janelas baixas (altura ≤ 740px): a órbita passa a respeitar também a altura (antes os nós do topo/base eram cortados em 1366×657 e 1280×600).
- Telas baixas (altura ≤ 560px, ex.: celular deitado): remove o `min-height` de 560–600px que cortava o botão final e escala a cena pela altura.
- Tablet em pé: a cena cresce para ocupar a tela.
- Celular: a órbita ocupa a largura do viewport sem `transform` no elemento animado pelo GSAP; nós reposicionados dentro da tela.
- Telas ≤ 360px e toque (botão ≥ 48px).
- Desktop com altura ≥ 741px permanece idêntico.

## Design "Observatório" (minimalismo editorial + tecnologia + cinema)

- **Base:** preto `#07080B`, off-white `#F2EFE8`; uma faixa clara (papel `#EFECE4`) em "Como funciona" para dar contraste de cena.
- **Cor com intenção:** amarelo `#F4C430` só em ✦, ênfases em itálico serifado, CTA principal e estados ativos; ciano/violeta/laranja apenas como cor por tipo de prova e atmosfera sutil.
- **Tipografia:** Inter Tight (títulos grandes, tracking negativo) · Instrument Serif itálico (ênfase) · DM Sans (texto) · JetBrains Mono (rótulos e índices).
- **Sem "cards":** listas editoriais com linhas finas (Home), fichas sem caixa (catálogo), índice tipográfico de categorias, numerais gigantes em contorno, rodapé com marca fantasma.
- **Responsivo por dispositivo:** hero em duas colunas com mascote parcialmente cortado (desktop) → empilhado (≤ 1100px); menu em tela cheia (≤ 900px); linhas viram blocos (≤ 900px).
- **Movimento fora da animação:** entrada de página, revelação ao rolar e linhas que crescem no hover; tudo respeita `prefers-reduced-motion`.
- `--font-display`, `--font-sans` e `--intro-*` em `styles.css` alimentam a introdução e não devem mudar.

## Segurança

O site é 100% estático (sem backend, banco, login ou pagamento), então boa parte dos riscos clássicos (SQL Injection, CSRF, JWT, IDOR...) simplesmente não existe aqui. O que sobra é: injeção de script (XSS), entradas controladas pela URL, cabeçalhos HTTP, dependências e higiene do repositório.

**O que está configurado**

- **CSP estrita** (`security-headers.js`, fonte única): `script-src 'self'` (sem script inline e sem `eval`), `object-src 'none'`, `frame-src 'none'`, `form-action 'self'`. É injetada como `<meta>` no `index.html` **somente no build** (no `npm run dev` ela não existe, senão quebraria o HMR) e também gerada como `dist/_headers`.
- **Cabeçalhos HTTP** (`_headers` para Netlify/Cloudflare Pages, `vercel.json` para Vercel): `frame-ancestors 'none'` (anti-clickjacking), `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS, COOP. Em hospedagem que não permite cabeçalhos (ex.: GitHub Pages) vale só a CSP do `<meta>`; `frame-ancestors` e HSTS dependem de cabeçalho real.
- **Entradas limitadas e saneadas** (`src/lib/sanitize.js`): busca, filtros da URL e formulário de pedido têm tamanho máximo; removem caracteres de controle e de inversão de texto (U+202E); o ano aceita só dígitos. Antes, um link com texto gigante na URL gerava um link do WhatsApp de MB.
- **Favoritos** lidos do `localStorage` passam por validação (só ids simples, sem duplicatas, no máximo 200).
- Páginas "não encontrado" têm `noindex` (a hospedagem SPA responde 200 em rotas inexistentes).
- `.gitignore` (`node_modules`, `dist`, `.env`), `.github/dependabot.yml` e os scripts `npm test` e `npm run audit:prod`.

**Se mudar a CSP:** edite `security-headers.js` e regenere o `vercel.json` (o teste `npm test` avisa se os dois divergirem).

**Checklist antes de publicar**

1. `npm install && npm test && npm run audit:prod && npm run build`
2. `npm run preview` e navegue por todas as rotas com o console aberto: não pode haver erro de "Content Security Policy".
3. Publicado: confirme HTTPS ativo e redirecionamento de HTTP para HTTPS, e confira os cabeçalhos em https://securityheaders.com.
4. Quando passar a usar uma API, formulário com servidor ou analytics, atualize `connect-src`/`form-action` na CSP.

## Pendências que dependem do dono do projeto

- **Fontes locais (privacidade/LGPD):** as fontes vêm do pacote `@fontsource/*` (importadas em `src/main.jsx`), então o navegador do visitante não contacta o Google e a CSP não tem nenhuma origem externa. Se trocar de fonte, instale o pacote, importe os pesos no `main.jsx` e mantenha o `font-src 'self'`.
- **Página de privacidade (`/privacidade`):** escrita para o que o site realmente faz (sem cookies, sem cadastro; só o WhatsApp recebe número e mensagem, guardados por até 90 dias). Os dados da responsável ficam em `src/lib/contact.js` (`RESPONSAVEL` e `WHATSAPP_NUMBER`) e alimentam o rodapé e a página. Se a forma de usar os dados mudar (lista de transmissão, plataforma de pagamento, análise de visitas), atualize a página antes.
- **Aviso de privacidade e identificação do responsável:** o pedido pelo WhatsApp faz o dono receber número de telefone e mensagem do visitante (dado pessoal). Faltam uma página de privacidade (finalidade, base legal, retenção, contato do responsável) e a identificação de quem opera o site. Isso exige dados reais seus; não foi inventado.
- **Dados demonstrativos:** `src/data/provas.js` mostra "Resolução disponível" para provas de teste. Troque pelos dados reais antes de divulgar.
- **Repositório:** veja os comandos de limpeza do git abaixo.

```bash
git rm -r --cached node_modules dist
git add -A
git commit -m "chore: remove node_modules e dist do git; adiciona CSP, cabecalhos e saneamento de entradas"
```

O histórico antigo ainda guarda os 149 MB (não há segredos nele). Como só existe um commit, se quiser limpar de vez, recrie o repositório ou reescreva o histórico e faça `push --force`.

## Status da verificação

Revisado estaticamente. (Auditoria de segurança: a CSP foi validada em Chromium contra um build existente, em todas as rotas e na introdução animada, sem violações. As alterações em `src/` tiveram a sintaxe checada e as funções novas têm testes; o `vite build` do código atual ainda precisa ser rodado por você.) **O `npm install`, o `vite build` e a execução real com GSAP/Lenis não puderam ser testados** (sem acesso ao npm no ambiente de criação). Foi feita uma checagem parcial: o código foi empacotado com esbuild usando stubs das bibliotecas (imports, JSX e caminhos resolvem) e as páginas e as cenas finais da introdução foram renderizadas no Chromium em 13 tamanhos de tela, sem overflow nem elementos cortados. Rode `npm install && npm run build` e confira a animação rolando no navegador.
