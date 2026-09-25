const { json } = require('../server/lib/http');
const { requireOwner } = require('../server/lib/auth');
const { listBios, publicBio } = require('../server/lib/bios');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET' });
  const session = await requireOwner(req, res);
  if (!session) return;
  const bios = [];
  for (const bio of await listBios()) bios.push(await publicBio(bio));
  return json(res, 200, { bios });
};
