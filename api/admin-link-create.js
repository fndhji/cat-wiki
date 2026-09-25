const { json, readBody, randomToken, requestOrigin } = require('../server/lib/http');
const { requireOwner } = require('../server/lib/auth');
const { getBio, slugify } = require('../server/lib/bios');
const { setJson } = require('../server/lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' });
  const session = await requireOwner(req, res, { csrf: true });
  if (!session) return;
  const body = await readBody(req);
  const slug = slugify(body.slug || '');
  const bio = await getBio(slug);
  if (!bio) return json(res, 404, { error: 'Save the bio before creating a Discord link.' });
  const token = randomToken(32);
  const expiresAt = Date.now() + 30 * 60 * 1000;
  await setJson(`link:${token}`, { slug, used: false, createdAt: Date.now(), expiresAt }, 1800, true);
  const origin = process.env.APP_ORIGIN || requestOrigin(req);
  return json(res, 200, { ok: true, token, expiresAt, url: `${origin}/loginaccept?token=${encodeURIComponent(token)}` });
};
