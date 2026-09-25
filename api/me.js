const { json } = require('../server/lib/http');
const { getSession } = require('../server/lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET' });
  const session = await getSession(req);
  if (!session) return json(res, 200, { authenticated: false });
  return json(res, 200, {
    authenticated: true,
    user: { id: session.ownerId, username: session.username, globalName: session.globalName, avatar: session.avatar },
    csrf: session.csrf,
  });
};
