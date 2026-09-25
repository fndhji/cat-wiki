const { json, readBody } = require('../server/lib/http');
const { requireOwner } = require('../server/lib/auth');
const { getBio, slugify, publicBio } = require('../server/lib/bios');
const { setJson } = require('../server/lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' });
  const session = await requireOwner(req, res, { csrf: true });
  if (!session) return;
  const body = await readBody(req);
  const slug = slugify(body.slug || '');
  const delta = Math.max(-100000, Math.min(100000, Math.trunc(Number(body.delta || 0))));
  const bio = await getBio(slug);
  if (!bio) return json(res, 404, { error: 'Bio not found.' });
  bio.manualViews = Math.max(-999999999, Math.min(999999999, Number(bio.manualViews || 0) + delta));
  bio.updatedAt = Date.now();
  await setJson(`bio:${bio.slug}`, bio);
  return json(res, 200, { ok: true, bio: await publicBio(bio) });
};
