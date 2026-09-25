const { json, readBody } = require('../server/lib/http');
const { requireOwner } = require('../server/lib/auth');
const { deleteBio, slugify } = require('../server/lib/bios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' });
  const session = await requireOwner(req, res, { csrf: true });
  if (!session) return;
  const body = await readBody(req);
  const slug = slugify(body.slug || '');
  if (!slug) return json(res, 400, { error: 'Invalid slug.' });
  await deleteBio(slug);
  return json(res, 200, { ok: true });
};
