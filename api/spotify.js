const { json } = require('../server/lib/http');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET' });
  const raw = String(req.query?.url || '');
  let url;
  try { url = new URL(raw); } catch { return json(res, 400, { error: 'Invalid Spotify URL.' }); }
  if (!['open.spotify.com', 'spotify.link'].includes(url.hostname)) return json(res, 400, { error: 'Only Spotify links are allowed.' });
  const endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(url.toString())}`;
  const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return json(res, 502, { error: 'Spotify metadata is unavailable.' });
  return json(res, 200, {
    title: String(data.title || '').slice(0, 160),
    thumbnail: String(data.thumbnail_url || ''),
    provider: 'Spotify',
  });
};
