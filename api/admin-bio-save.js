const { json, readBody } = require('../server/lib/http');
const { requireOwner } = require('../server/lib/auth');
const { saveBio } = require('../server/lib/bios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' });
  const session = await requireOwner(req, res, { csrf: true });
  if (!session) return;
  try {
    const body = await readBody(req, 128 * 1024);
    const bio = await saveBio(body);
    return json(res, 200, { ok: true, bio });
  } catch (error) {
    return json(res, 400, { error: error.message });
  }
};
