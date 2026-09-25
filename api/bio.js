const { json } = require('../server/lib/http');
const { getBio, publicBio } = require('../server/lib/bios');
const { getSession } = require('../server/lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET' });
  const slug = String(req.query?.slug || '');
  const bio = await getBio(slug);
  if (!bio) return json(res, 404, { error: 'Bio not found.' });
  if (!bio.published) {
    const session = await getSession(req);
    if (!session) return json(res, 404, { error: 'Bio not found.' });
  }
  return json(res, 200, { bio: await publicBio(bio) });
};
