# Auditoria de segurança — StarConcurso

Base: a lista de 760 erros enviada (numeração `#NNN`). O site é um **frontend estático** (Vite + React, sem backend, banco, login, pagamento ou upload). Por isso as seções J (parte servidor), K, W, H, I e L da lista **não se aplicam**; o foco ficou em XSS, entradas, cabeçalhos, dependências, repositório e privacidade.

## Corrigido

| # | Problema encontrado | Itens da lista | O que foi feito |
|---|---|---|---|
| 1 | `node_modules` (149 MB, binários de Windows) e `dist` commitados; **sem `.gitignore`** | #460, #461, #462 | `.gitignore` criado (inclui `.env`, `*.pem`, `*.key`). Comandos de limpeza no README |
| 2 | **Nenhum cabeçalho de segurança nem CSP** | #295, #262 | CSP estrita (`script-src 'self'`, sem inline/eval, `object-src 'none'`, `form-action 'self'`), `nosniff`, Referrer-Policy, Permissions-Policy, HSTS, COOP. Gerados a partir de `security-headers.js` (fonte única): `<meta>` no build, `dist/_headers` e `vercel.json` |
| 3 | URL controlada por terceiros ia direto para o link do WhatsApp **sem limite**: um link malicioso gerava URL de **3 MB** | #171, #194, #209 | Tamanho máximo em tudo (`src/lib/sanitize.js`), aplicado no ponto único `request.js`, em `Provas.jsx`, `Home.jsx` e `RequestForm.jsx` |
| 4 | Campo "Ano" aceitava qualquer texto | #168, #169, #180 | Só dígitos (máx. 4) |
| 5 | Texto da URL com caracteres de controle/inversão (U+202E) ia para a mensagem do WhatsApp | *(não está na lista)* | Removidos antes de montar a mensagem |
| 6 | `localStorage` dos favoritos lido sem validar | #160, #127 | `sanitizeFavorites`: só ids simples, sem duplicatas, máx. 200 |
| 7 | Clickjacking (o site podia ser embutido em iframe de terceiros) | *(não está na lista)* | `frame-ancestors 'none'` (só funciona como cabeçalho HTTP real) |
| 8 | Rotas inexistentes respondem 200 e seriam indexáveis | #393, #388 | `noindex` em `NotFound` e no "concurso não encontrado" |
| 9 | Sem monitoramento de dependências | #296, #664, #676, #477 | `.github/dependabot.yml` + `npm run audit:prod` |
| 10 | Nenhum teste | #431–#435 | 21 testes em `tests/security.test.js` (`npm test`), sem dependências novas |

## Verificado e sem problema

- **Segredos** (#269, #270, #293): nenhum no código, no `dist` nem no histórico do git. O `.git/config` não tem token.
- **XSS** (#262): nenhum `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `javascript:`, `window.open` ou `postMessage` em `src/`. O React escapa a saída.
- **Links externos**: todos `rel="noreferrer"` e sempre `https://wa.me/<número fixo>?text=<codificado>`.
- **Cadeia de suprimentos** (#296, #297, #663): 55 pacotes, todos do registry oficial do npm, todos com hash de integridade, `node_modules` idêntico ao lockfile, nenhum pacote fora dele.
- **Versões** (#664): `react-router` 7.18.4, `vite` 8.3.2 e `picomatch` 4.0.7 estão acima das versões corrigidas das falhas publicadas em 2026 (as do react-router ainda só afetam o Framework Mode, que não é usado aqui). Não foi possível rodar `npm audit` (sem rede): rode `npm run audit:prod` no seu computador.
- **Número do WhatsApp** no código: é contato público de propósito, não é segredo.

## Precisa de você (não dá para resolver sem seus dados)

| Problema | Itens | Por quê |
|---|---|---|
| Fontes carregadas do Google (expõe o IP do visitante a terceiro) | #576, #577, #359 | Precisa de `npm install` para hospedar localmente. Passo a passo no README |
| Sem aviso de privacidade nem identificação de quem opera o site | #561–#585, #581, #597 | O dono recebe telefone e mensagem pelo WhatsApp (dado pessoal). Exige seus dados reais; um texto genérico seria um erro #592 |
| Dados de demonstração publicados como reais ("Resolução disponível") | #019, #062, #592, #598 | Substituir `src/data/provas.js` |
| HTTPS, redirecionamento HTTP→HTTPS e HSTS no domínio | #516, #517 | Depende da hospedagem; checklist no README |
| E-mail pessoal nos commits do git | *(não está na lista)* | Opcional: usar o e-mail `noreply` do GitHub nos próximos commits |
| `security.txt` / canal para reportar falhas | *(não está na lista)* | Precisa de um contato que você queira divulgar |

## Limites desta auditoria

- O `vite build` do código **atual** não pôde ser executado (sem rede, e o `node_modules` enviado tem binários só de Windows). Rode `npm install && npm test && npm run build`.
- A CSP foi validada em Chromium contra o `dist` que veio no ZIP (mesmas bibliotecas), em duas configurações (cabeçalhos HTTP e só `<meta>`): 8 rotas + a introdução animada completa, sem nenhuma violação, e com um teste de controle provando que o detector bloqueia script inline.
- Este é um catálogo de riscos, não uma certificação de que o site está livre de falhas.
