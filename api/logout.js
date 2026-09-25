const { json } = require('../server/lib/http');
const { destroySession, requireOwner } = require('../server/lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' });
  const session = await requireOwner(req, res, { csrf: true });
  if (!session) return;
  await destroySession(req, res);
  return json(res, 200, { ok: true });
};
