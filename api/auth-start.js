const { json, redirect, requestOrigin, setCookie, isHttps, randomToken } = require('../server/lib/http');
const { getJson, setJson } = require('../server/lib/redis');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET' });
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId || !process.env.DISCORD_CLIENT_SECRET) return json(res, 500, { error: 'Discord OAuth is not configured.' });

  const purpose = req.query?.purpose === 'link' ? 'link' : 'owner';
  const linkToken = String(req.query?.token || '');
  if (purpose === 'link') {
    if (!linkToken) return json(res, 400, { error: 'Missing link token.' });
    const link = await getJson(`link:${linkToken}`);
    if (!link || link.used || Number(link.expiresAt || 0) < Date.now()) return json(res, 410, { error: 'This link is invalid or expired.' });
  }

  const nonce = randomToken(32);
  await setJson(`oauth:${nonce}`, { purpose, linkToken: purpose === 'link' ? linkToken : null, createdAt: Date.now() }, 600, true);
  setCookie(res, 'cat_oauth_state', nonce, { httpOnly: true, secure: isHttps(req), sameSite: 'Lax', maxAge: 600 });

  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${requestOrigin(req)}/api/auth-callback`;
  const url = new URL('https://discord.com/oauth2/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'identify');
  url.searchParams.set('state', nonce);
  return redirect(res, url.toString());
};
