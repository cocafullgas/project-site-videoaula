const { Redis } = require('@upstash/redis');

// Lê UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN das variáveis de ambiente
const redis = Redis.fromEnv();

const TOKEN_PREFIX = 'token:';
const TX_PREFIX = 'tx:';
const INDEX_KEY = 'tokens:index'; // sorted set: score = timestamp, member = token

async function saveToken(token, data) {
  await redis.set(TOKEN_PREFIX + token, JSON.stringify(data));
  await redis.zadd(INDEX_KEY, { score: Date.now(), member: token });
  if (data.transactionId) {
    await redis.set(TX_PREFIX + data.transactionId, token);
  }
  return data;
}

async function getToken(token) {
  const raw = await redis.get(TOKEN_PREFIX + token);
  if (!raw) return null;
  // o cliente do Upstash às vezes já retorna objeto parseado, às vezes string
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

async function updateToken(token, patch) {
  const current = await getToken(token);
  if (!current) return null;
  const updated = { ...current, ...patch };
  await redis.set(TOKEN_PREFIX + token, JSON.stringify(updated));
  return updated;
}

async function findByTransaction(transactionId) {
  const token = await redis.get(TX_PREFIX + transactionId);
  if (!token) return null;
  const data = await getToken(token);
  return data ? { token, ...data } : null;
}

async function listTokens(limit = 200) {
  // pega os tokens mais recentes primeiro
  const tokens = await redis.zrange(INDEX_KEY, 0, limit - 1, { rev: true });
  const results = [];
  for (const token of tokens) {
    const data = await getToken(token);
    if (data) results.push({ token, ...data });
  }
  return results;
}

module.exports = { saveToken, getToken, updateToken, listTokens, findByTransaction };
