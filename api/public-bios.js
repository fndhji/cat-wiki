const { json } = require('../server/lib/http');
const { listBios, publicBio } = require('../server/lib/bios');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' }, { Allow: 'GET' });
  const bios = (await listBios()).filter((bio) => bio.published);
  const output = [];
  for (const bio of bios) {
    const full = await publicBio(bio);
    output.push({
      slug: full.slug,
      displayName: full.displayName,
      handle: full.handle,
      headline: full.headline,
      avatarUrl: full.avatarUrl,
      backgroundType: full.backgroundType,
      backgroundUrl: full.backgroundUrl,
      badges: full.badges,
      views: full.views,
      linkedDiscord: full.linkedDiscord ? { id: full.linkedDiscord.id, username: full.linkedDiscord.username, globalName: full.linkedDiscord.globalName } : null,
      presence: full.presence,
    });
  }
  return json(res, 200, { bios: output });
};
