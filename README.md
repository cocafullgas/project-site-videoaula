# Site de Aula com Liberação por Token — Vercel + Upstash + VTurb

Versão pronta para rodar **de graça** na Vercel (ou Netlify, com pequenos
ajustes — veja o final do README). Como funções serverless não têm disco
persistente, os tokens ficam salvos no **Upstash Redis** (banco gratuito,
sem cartão de crédito).

## Estrutura

- `index.html` — página de vendas (estática, link pro checkout da Hotmart)
- `api/webhook-hotmart.js` — recebe a notificação da Hotmart e gera o token
- `api/aula.js` — valida o token e libera a página da aula
- `api/admin-tokens.js` — painel simples pra ver quem já acessou
- `lib/store.js` — persistência no Upstash Redis
- `lib/hotmart.js` — interpreta/valida o payload da Hotmart
- `lib/mailer.js` — envio opcional de e-mail com o link de acesso
- `lib/pages.js` — templates HTML (aula, link inválido, admin)
- `vercel.json` — mantém as URLs limpas (`/aula`, `/webhook/hotmart`, `/admin/tokens`)

## Passo 1 — Criar o banco no Upstash (grátis)

1. Crie uma conta em https://upstash.com (dá pra logar com GitHub/Google).
2. Crie um banco **Redis** (região mais próxima do Brasil: `us-east-1` ou `sa-east-1` se disponível).
3. No dashboard do banco, copie **UPSTASH_REDIS_REST_URL** e **UPSTASH_REDIS_REST_TOKEN**.

O plano free do Upstash aguenta tranquilamente um volume baixo/médio de alunos
(milhares de operações por dia de graça).

## Passo 2 — Subir na Vercel

1. Crie um repositório no GitHub com esses arquivos (ou use a Vercel CLI: `npx vercel` direto na pasta).
2. Importe o repositório em https://vercel.com/new.
3. Em **Environment Variables**, adicione tudo que está no `.env.example`:
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - `HOTMART_HOTTOK` (você pega isso no Passo 3)
   - `SITE_URL` (a URL que a Vercel vai te dar, ex: `https://seu-projeto.vercel.app`, ou seu domínio próprio depois de configurar)
   - `TOKEN_TTL_DAYS`, `ADMIN_SECRET`
   - `SMTP_*` se quiser enviar e-mail automático
4. Deploy. Pronto, o site já está no ar.
5. Edite `index.html` e troque `SUBSTITUA_PELO_LINK_DE_CHECKOUT_DA_HOTMART` pelo link real do seu checkout (esse arquivo é estático, então é edição direta mesmo, não variável de ambiente).

## Passo 3 — Configurar o Webhook na Hotmart

1. No painel da Hotmart: **Ferramentas → Webhook (API e notificações) → + Criar configuração**.
2. Selecione o produto.
3. URL de entrega: `https://SEU-PROJETO.vercel.app/webhook/hotmart`
4. Marque o evento **Compra Aprovada** (e "Compra Completa" se vender no boleto).
5. A Hotmart mostra um **Hottok** — copie e cole na variável `HOTMART_HOTTOK` da Vercel (Project Settings → Environment Variables) e faça um novo deploy pra aplicar.
6. Use o botão de **testar/reenviar** da própria Hotmart pra validar antes de ativar de vez.

## Passo 4 — Configurar o VTurb

1. Suba o vídeo no painel do VTurb normalmente.
2. Copie o código de embed (`<div>` + `<script>`).
3. Abra `lib/pages.js`, função `aulaPage`, e cole o código exatamente onde
   está o comentário `COLE AQUI O CÓDIGO DE EMBED GERADO PELO PAINEL DO VTURB`.
4. Faça commit/push (ou `vercel --prod`) pra atualizar.

O VTurb continua cuidando 100% da entrega e das métricas do vídeo — o
token só controla quem chega até essa página.

## Painel de acompanhamento

`https://SEU-PROJETO.vercel.app/admin/tokens?secret=SEU_ADMIN_SECRET`

Mostra e-mail, quando o token foi criado, quando expira, quantas vezes
foi acessado e o IP do primeiro acesso.

## E se eu quiser usar Netlify em vez de Vercel?

A lógica (`lib/*.js`) é 100% reaproveitável. Só muda a "casca":
- Em vez de `api/*.js` no formato Vercel, as funções vão para `netlify/functions/*.js`
  e usam o formato `exports.handler = async (event) => {...}` (assinatura
  diferente de request/response).
- Em vez de `vercel.json`, as reescritas de URL vão num `netlify.toml`.
- O Upstash Redis funciona igual nos dois.

Se preferir Netlify, é só pedir que eu adapto os 3 arquivos de função pro
formato dela — a arquitetura (Redis + Hotmart + VTurb) é a mesma.

## Limitações a saber

- O rate limit em `/aula` só funciona se as variáveis do Upstash estiverem
  configuradas (usa o mesmo Redis). Sem elas, o site funciona normalmente,
  só sem essa proteção extra.
- Token único é uma trava razoável para o seu volume; não impede 100% o
  compartilhamento de link entre pessoas, mas cobre o caso comum. Se
  precisar de algo mais rígido (ex: travar por dispositivo), dá pra evoluir depois.
