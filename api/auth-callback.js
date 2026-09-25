const { json, redirect, parseCookies, setCookie, isHttps, requestOrigin } = require('../server/lib/http');
const { getJson, setJson, redis } = require('../server/lib/redis');
const { OWNER_ID, createOwnerSession } = require('../server/lib/auth');
const { getBio } = require('../server/lib/bios');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET' });
  const code = String(req.query?.code || '');
  const state = String(req.query?.state || '');
  const cookies = parseCookies(req);
  if (!code || !state || !cookies.cat_oauth_state || cookies.cat_oauth_state !== state) return json(res, 400, { error: 'Invalid OAuth state.' });

  const stateRaw = await redis('GETDEL', `oauth:${state}`).catch(async () => {
    const value = await redis('GET', `oauth:${state}`);
    if (value) await redis('DEL', `oauth:${state}`);
    return value;
  });
  setCookie(res, 'cat_oauth_state', '', { httpOnly: true, secure: isHttps(req), sameSite: 'Lax', maxAge: 0 });
  if (!stateRaw) return json(res, 410, { error: 'OAuth state expired.' });
  const oauthState = JSON.parse(stateRaw);

  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${requestOrigin(req)}/api/auth-callback`;
  const form = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID || '',
    client_secret: process.env.DISCORD_CLIENT_SECRET || '',
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });
  const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const token = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !token.access_token) return json(res, 502, { error: 'Discord OAuth token exchange failed.' });

  const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  const user = await userResponse.json().catch(() => ({}));
  if (!userResponse.ok || !user.id) return json(res, 502, { error: 'Discord identity lookup failed.' });

  if (oauthState.purpose === 'owner') {
    if (String(user.id) !== String(OWNER_ID)) return redirect(res, '/admin?error=forbidden');
    await createOwnerSession(req, res, user);
    return redirect(res, '/admin');
  }

  if (oauthState.purpose === 'link') {
    const tokenKey = String(oauthState.linkToken || '');
    const linkRaw = await redis('GETDEL', `link:${tokenKey}`).catch(async () => {
      const value = await redis('GET', `link:${tokenKey}`);
      if (value) await redis('DEL', `link:${tokenKey}`);
      return value;
    });
    const link = linkRaw ? JSON.parse(linkRaw) : null;
    if (!link || link.used || Number(link.expiresAt || 0) < Date.now()) return redirect(res, '/loginaccept?error=expired');
    const bio = await getBio(link.slug);
    if (!bio) return redirect(res, '/loginaccept?error=bio');

    bio.linkedDiscord = {
      id: String(user.id),
      username: String(user.username || ''),
      globalName: user.global_name || null,
      avatar: user.avatar || null,
      linkedAt: Date.now(),
    };
    bio.updatedAt = Date.now();
    await setJson(`bio:${bio.slug}`, bio);
    await setJson(`linkdone:${tokenKey}`, { slug: bio.slug, userId: user.id, username: user.username, linkedAt: Date.now() }, 1800);
    return redirect(res, `/loginaccept?linked=1&slug=${encodeURIComponent(bio.slug)}`);
  }

  return json(res, 400, { error: 'Unknown OAuth purpose.' });
};
