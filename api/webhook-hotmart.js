const crypto = require('crypto');
const store = require('../lib/store');
const hotmart = require('../lib/hotmart');
const { sendAccessEmail } = require('../lib/mailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  try {
    if (!hotmart.isValidHottok(req)) {
      console.warn('Webhook recebido com hottok inválido.');
      return res.status(401).json({ error: 'hottok inválido' });
    }

    if (!hotmart.isPurchaseApproved(req.body)) {
      return res.status(200).json({ ok: true, ignored: true });
    }

    const info = hotmart.extractPurchaseInfo(req.body);

    if (!info.email) {
      console.error('Webhook aprovado sem e-mail no payload:', JSON.stringify(req.body));
      return res.status(400).json({ error: 'e-mail do comprador não encontrado no payload' });
    }

    if (info.transactionId) {
      const existing = await store.findByTransaction(info.transactionId);
      if (existing) {
        return res.status(200).json({ ok: true, duplicated: true });
      }
    }

    const token = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const ttlDays = Number(process.env.TOKEN_TTL_DAYS || 30);
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();

    await store.saveToken(token, {
      email: info.email,
      name: info.name,
      transactionId: info.transactionId,
      productName: info.productName,
      createdAt,
      expiresAt,
      firstAccessAt: null,
      firstAccessIp: null,
      accessCount: 0,
    });

    const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;
    const link = `${siteUrl}/aula?token=${token}`;
    await sendAccessEmail(info.email, info.name, link);

    console.log(`Token gerado para ${info.email}: ${link}`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro processando webhook:', err);
    return res.status(500).json({ error: 'erro interno' });
  }
};
