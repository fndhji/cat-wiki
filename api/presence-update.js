const crypto = require('node:crypto');
const { json, readBody } = require('../server/lib/http');
const { setJson } = require('../server/lib/redis');

function safeEqual(a, b) {
  const A = Buffer.from(String(a || ''));
  const B = Buffer.from(String(b || ''));
  return A.length === B.length && A.length > 0 && crypto.timingSafeEqual(A, B);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' });
  const expected = process.env.PRESENCE_INGEST_SECRET || '';
  const supplied = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!safeEqual(supplied, expected)) return json(res, 401, { error: 'Unauthorized.' });
  const body = await readBody(req, 32 * 1024);
  const userId = String(body.userId || '');
  if (!/^\d{17,20}$/.test(userId)) return json(res, 400, { error: 'Invalid user ID.' });
  const status = ['online', 'idle', 'dnd', 'offline'].includes(body.status) ? body.status : 'unknown';
  const activities = Array.isArray(body.activities) ? body.activities.slice(0, 6).map((a) => ({
    name: String(a?.name || '').slice(0, 80),
    type: String(a?.type || '').slice(0, 32),
    details: String(a?.details || '').slice(0, 120),
    state: String(a?.state || '').slice(0, 120),
  })) : [];
  await setJson(`presence:${userId}`, { status, activities, updatedAt: Date.now() }, 24 * 60 * 60);
  return json(res, 200, { ok: true });
};
