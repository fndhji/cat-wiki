const crypto = require('node:crypto');
const { getJson, setJson, redis } = require('./redis');
const { parseCookies, setCookie, isHttps, randomToken, json, assertSameOrigin } = require('./http');

const OWNER_ID = process.env.OWNER_DISCORD_ID || '1086407479270850641';
const SESSION_TTL = 7 * 24 * 60 * 60;

async function createOwnerSession(req, res, user) {
  const id = randomToken(32);
  const csrf = randomToken(24);
  await setJson(`session:${id}`, {
    ownerId: user.id,
    username: user.username,
    globalName: user.global_name || null,
    avatar: user.avatar || null,
    csrf,
    createdAt: Date.now(),
  }, SESSION_TTL);
  setCookie(res, 'cat_session', id, {
    httpOnly: true,
    secure: isHttps(req),
    sameSite: 'Strict',
    maxAge: SESSION_TTL,
  });
  return { id, csrf };
}

async function getSession(req) {
  const sid = parseCookies(req).cat_session;
  if (!sid) return null;
  const session = await getJson(`session:${sid}`);
  if (!session || String(session.ownerId) !== String(OWNER_ID)) return null;
  return { ...session, sid };
}

async function destroySession(req, res) {
  const sid = parseCookies(req).cat_session;
  if (sid) await redis('DEL', `session:${sid}`).catch(() => {});
  setCookie(res, 'cat_session', '', {
    httpOnly: true,
    secure: isHttps(req),
    sameSite: 'Strict',
    maxAge: 0,
  });
}

async function requireOwner(req, res, { csrf = false } = {}) {
  const session = await getSession(req);
  if (!session) {
    json(res, 401, { error: 'Owner authentication required.' });
    return null;
  }
  if (csrf) {
    try { assertSameOrigin(req); } catch (error) {
      json(res, 403, { error: error.message });
      return null;
    }
    const provided = String(req.headers['x-csrf-token'] || '');
    const expected = String(session.csrf || '');
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (!provided || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      json(res, 403, { error: 'Invalid CSRF token.' });
      return null;
    }
  }
  return session;
}

module.exports = { OWNER_ID, createOwnerSession, getSession, destroySession, requireOwner };
