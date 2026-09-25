const crypto = require('node:crypto');
const { json, clientIp } = require('../server/lib/http');
const { getBio, slugify, organicViews } = require('../server/lib/bios');
const { redis } = require('../server/lib/redis');
const { getSession } = require('../server/lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'POST' });
  const slug = slugify(req.query?.slug || '');
  const bio = await getBio(slug);
  if (!bio || !bio.published) return json(res, 404, { error: 'Bio not found.' });

  const ua = String(req.headers['user-agent'] || '');
  const isCrawler = !ua || /(bot|crawler|spider|discordbot|facebookexternalhit|twitterbot|slackbot|whatsapp)/i.test(ua);
  const ownerSession = await getSession(req).catch(() => null);
  let counted = false;

  if (!isCrawler && !ownerSession) {
    const ip = clientIp(req);
    const salt = process.env.VIEW_SALT || process.env.SESSION_SECRET || 'cat-wiki-dev-view-salt';
    const fingerprint = crypto.createHmac('sha256', salt).update(`${slug}|${ip}|${ua}`).digest('hex').slice(0, 32);
    const accepted = await redis('SET', `bio:viewdedupe:${slug}:${fingerprint}`, '1', 'EX', 86400, 'NX');
    if (accepted === 'OK') {
      await redis('INCR', `bio:views:${slug}`);
      counted = true;
    }
  }

  const organic = await organicViews(slug);
  return json(res, 200, { counted, views: Math.max(0, organic + Number(bio.manualViews || 0)) });
};
