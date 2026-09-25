const crypto = require('node:crypto');

function json(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  res.end(JSON.stringify(body));
}

function redirect(res, url, status = 302) {
  res.statusCode = status;
  res.setHeader('Location', url);
  res.setHeader('Cache-Control', 'no-store');
  res.end();
}

function parseCookies(req) {
  const raw = req.headers.cookie || '';
  const out = {};
  for (const chunk of raw.split(';')) {
    const index = chunk.indexOf('=');
    if (index <= 0) continue;
    const key = chunk.slice(0, index).trim();
    const value = chunk.slice(index + 1).trim();
    try { out[key] = decodeURIComponent(value); } catch { out[key] = value; }
  }
  return out;
}

function isHttps(req) {
  return String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim() === 'https'
    || process.env.NODE_ENV === 'production';
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge != null) parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  parts.push(`Path=${options.path || '/'}`);
  if (options.httpOnly !== false) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  parts.push(`SameSite=${options.sameSite || 'Lax'}`);
  return parts.join('; ');
}

function setCookie(res, name, value, options = {}) {
  const current = res.getHeader('Set-Cookie');
  const next = serializeCookie(name, value, options);
  if (!current) res.setHeader('Set-Cookie', next);
  else res.setHeader('Set-Cookie', Array.isArray(current) ? [...current, next] : [current, next]);
}

async function readBody(req, maxBytes = 64 * 1024) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body) > maxBytes) throw new Error('Request body too large.');
    return JSON.parse(req.body || '{}');
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error('Request body too large.');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function requestOrigin(req) {
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  return host ? `${proto}://${host}` : (process.env.APP_ORIGIN || '');
}

function assertSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return;
  const expected = requestOrigin(req);
  try {
    if (new URL(origin).origin !== new URL(expected).origin) throw new Error('Cross-origin request rejected.');
  } catch {
    throw new Error('Cross-origin request rejected.');
  }
}

function randomToken(bytes = 32) { return crypto.randomBytes(bytes).toString('base64url'); }

function clientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || String(req.socket?.remoteAddress || 'unknown');
}

module.exports = {
  json, redirect, parseCookies, setCookie, isHttps, readBody,
  requestOrigin, assertSameOrigin, randomToken, clientIp,
};
