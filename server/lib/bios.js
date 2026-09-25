const { getJson, setJson, redis } = require('./redis');

function text(value, max = 500) {
  return String(value ?? '').replace(/\u0000/g, '').trim().slice(0, max);
}

function slugify(value) {
  return text(value, 40).toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32);
}

function safeUrl(value, { relative = true } = {}) {
  const raw = text(value, 1200);
  if (!raw) return '';
  if (relative && /^\/(?!\/)[A-Za-z0-9._~%+@/\-]*$/.test(raw)) return raw;
  try {
    const u = new URL(raw);
    if (u.protocol === 'https:' || u.protocol === 'http:') return u.toString();
  } catch {}
  return '';
}

function normalizeBadges(input) {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 20).map((item) => ({
    label: text(item?.label, 40),
    iconUrl: safeUrl(item?.iconUrl),
  })).filter((x) => x.label || x.iconUrl);
}

function normalizeLinks(input) {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 12).map((item) => ({
    label: text(item?.label, 32),
    url: safeUrl(item?.url, { relative: false }),
  })).filter((x) => x.label && x.url);
}

function sanitizeBio(input, existing = null) {
  const requestedSlug = slugify(input.slug || existing?.slug || '');
  if (!requestedSlug || requestedSlug.length < 2) throw new Error('Slug must contain at least 2 valid characters.');

  const bgType = ['none', 'image', 'video'].includes(input.backgroundType) ? input.backgroundType : 'none';
  const overlay = Math.max(0, Math.min(0.9, Number(input.overlayOpacity ?? 0.38) || 0));
  const blur = Math.max(0, Math.min(20, Number(input.backgroundBlur ?? 0) || 0));
  const manualViews = Math.max(-999999999, Math.min(999999999, Math.trunc(Number(input.manualViews ?? existing?.manualViews ?? 0) || 0)));

  return {
    slug: requestedSlug,
    published: Boolean(input.published),
    displayName: text(input.displayName, 60) || 'Untitled',
    handle: text(input.handle, 60),
    headline: text(input.headline, 120),
    bio: text(input.bio, 1200),
    avatarUrl: safeUrl(input.avatarUrl),
    backgroundType: bgType,
    backgroundUrl: bgType === 'none' ? '' : safeUrl(input.backgroundUrl),
    backgroundPosterUrl: safeUrl(input.backgroundPosterUrl),
    overlayOpacity: overlay,
    backgroundBlur: blur,
    musicUrl: safeUrl(input.musicUrl),
    musicTitle: text(input.musicTitle, 80),
    musicArtist: text(input.musicArtist, 80),
    musicCoverUrl: safeUrl(input.musicCoverUrl),
    spotifyUrl: safeUrl(input.spotifyUrl, { relative: false }),
    spotifyTitle: text(input.spotifyTitle, 140),
    spotifyThumbnail: safeUrl(input.spotifyThumbnail),
    locationLabel: text(input.locationLabel, 80),
    badges: normalizeBadges(input.badges),
    links: normalizeLinks(input.links),
    showDiscordPresence: input.showDiscordPresence !== false,
    manualViews,
    linkedDiscord: existing?.linkedDiscord || null,
    createdAt: existing?.createdAt || Date.now(),
    updatedAt: Date.now(),
  };
}

async function getBio(slug) { return getJson(`bio:${slugify(slug)}`); }

async function saveBio(input) {
  const slug = slugify(input.slug);
  const existing = slug ? await getBio(slug) : null;
  const bio = sanitizeBio(input, existing);
  await setJson(`bio:${bio.slug}`, bio);
  await redis('SADD', 'bios:index', bio.slug);
  return bio;
}

async function listBios() {
  const slugs = await redis('SMEMBERS', 'bios:index') || [];
  const bios = [];
  for (const slug of slugs) {
    const bio = await getBio(slug);
    if (bio) bios.push(bio);
  }
  bios.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
  return bios;
}

async function deleteBio(slug) {
  const clean = slugify(slug);
  if (!clean) return;
  await redis('DEL', `bio:${clean}`);
  await redis('SREM', 'bios:index', clean);
}

async function organicViews(slug) { return Number(await redis('GET', `bio:views:${slugify(slug)}`) || 0); }

async function publicBio(bio) {
  const views = await organicViews(bio.slug);
  let presence = null;
  if (bio.showDiscordPresence && bio.linkedDiscord?.id) {
    presence = await getJson(`presence:${bio.linkedDiscord.id}`);
    if (presence && Date.now() - Number(presence.updatedAt || 0) > 10 * 60 * 1000) {
      presence = { status: 'unknown', activities: [], updatedAt: presence.updatedAt || null };
    }
  }
  return {
    ...bio,
    views: Math.max(0, views + Number(bio.manualViews || 0)),
    organicViews: views,
    presence,
  };
}

module.exports = {
  text, slugify, safeUrl, sanitizeBio, getBio, saveBio, listBios, deleteBio, organicViews, publicBio,
};
