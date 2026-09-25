const { json } = require('../server/lib/http');
const { getJson } = require('../server/lib/redis');
const { getBio } = require('../server/lib/bios');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET' });
  const token = String(req.query?.token || '');
  if (!token || token.length > 100) return json(res, 400, { error: 'Invalid token.' });
  const link = await getJson(`link:${token}`);
  if (!link || Number(link.expiresAt || 0) < Date.now()) return json(res, 410, { valid: false, error: 'This link is invalid or expired.' });
  const bio = await getBio(link.slug);
  if (!bio) return json(res, 404, { valid: false, error: 'Bio not found.' });
  return json(res, 200, { valid: true, slug: bio.slug, displayName: bio.displayName, expiresAt: link.expiresAt });
};
