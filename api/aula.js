const { Ratelimit } = require('@upstash/ratelimit');
const { Redis } = require('@upstash/redis');
const store = require('../lib/store');
const { aulaPage, invalidPage } = require('../lib/pages');

let ratelimit = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, '15 m'), // 60 tentativas / 15min por IP
    prefix: 'ratelimit:aula',
  });
}
// Se as variáveis do Upstash não estiverem configuradas, segue sem rate limit
// (a validação do token continua funcionando normalmente).

module.exports = async (req, res) => {
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (ratelimit) {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      res.status(429).send(invalidPage({ motivo: 'Muitas tentativas. Tente novamente mais tarde.' }));
      return;
    }
  }

  const { token } = req.query;

  if (!token) {
    res.status(403).send(invalidPage({ motivo: 'Nenhum token foi informado no link.' }));
    return;
  }

  const data = await store.getToken(token);
  if (!data) {
    res.status(403).send(invalidPage({ motivo: 'Este link não existe ou já foi revogado.' }));
    return;
  }

  if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
    res.status(403).send(invalidPage({ motivo: 'Este link expirou.' }));
    return;
  }

  await store.updateToken(token, {
    firstAccessAt: data.firstAccessAt || new Date().toISOString(),
    firstAccessIp: data.firstAccessIp || ip,
    accessCount: (data.accessCount || 0) + 1,
  });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(aulaPage({ nome: data.name }));
};
