// Interpreta o payload do Webhook da Hotmart.
// Suporta o formato atual (Webhook 2.0, JSON com "event" e "data")
// e o formato antigo (Postback 1.0, campos soltos no corpo).

function isValidHottok(req) {
  const expected = process.env.HOTMART_HOTTOK;
  if (!expected) return true; // sem validação configurada (não recomendado em produção)

  const headerHottok =
    req.headers['x-hotmart-hottok'] || req.headers['X-HOTMART-HOTTOK'];
  const bodyHottok = req.body && req.body.hottok;

  return headerHottok === expected || bodyHottok === expected;
}

function isPurchaseApproved(body) {
  if (!body) return false;

  if (body.event) {
    const approvedEvents = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE'];
    if (approvedEvents.includes(body.event)) return true;
    if (body.data && body.data.purchase && body.data.purchase.status === 'APPROVED') {
      return true;
    }
    return false;
  }

  if (body.status) {
    return String(body.status).toLowerCase() === 'approved';
  }

  return false;
}

function extractPurchaseInfo(body) {
  if (body.data) {
    const buyer = body.data.buyer || {};
    const purchase = body.data.purchase || {};
    const product = body.data.product || {};
    return {
      email: buyer.email || null,
      name: buyer.name || null,
      transactionId: purchase.transaction || null,
      productName: product.name || null,
    };
  }

  return {
    email: body.email || (body.buyer && body.buyer.email) || null,
    name: body.name || (body.buyer && body.buyer.name) || null,
    transactionId: (body.transaction && body.transaction.code) || body.transaction || null,
    productName: (body.product && body.product.name) || null,
  };
}

module.exports = { isValidHottok, isPurchaseApproved, extractPurchaseInfo };
