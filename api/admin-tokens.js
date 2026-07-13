const store = require('../lib/store');
const { adminPage } = require('../lib/pages');

module.exports = async (req, res) => {
  const secret = process.env.ADMIN_SECRET || '';
  if (!secret || req.query.secret !== secret) {
    res.status(401).send('Não autorizado. Adicione ?secret=SEU_ADMIN_SECRET na URL.');
    return;
  }

  const tokens = await store.listTokens();
  const rows = tokens
    .map(
      (t) => `<tr>
        <td>${t.email || ''}</td>
        <td>${t.name || ''}</td>
        <td>${t.createdAt || ''}</td>
        <td>${t.expiresAt || ''}</td>
        <td>${t.accessCount || 0}</td>
        <td>${t.firstAccessIp || ''}</td>
        <td><a href="/aula?token=${t.token}" target="_blank">abrir</a></td>
      </tr>`
    )
    .join('');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(adminPage({ rows }));
};
