const { json } = require('../server/lib/http');
const { requireOwner } = require('../server/lib/auth');
const { getJson } = require('../server/lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET' });
  const session = await requireOwner(req, res);
  if (!session) return;
  const token = String(req.query?.token || '');
  if (!token || token.length > 100) return json(res, 400, { error: 'Invalid token.' });
  const done = await getJson(`linkdone:${token}`);
  return json(res, 200, { linked: Boolean(done), result: done || null });
};
