// Optional Cat bot -> Cat Wiki presence sync.
// Merge this idea into Cat normal only if you want live Discord status on linked bios.
// Requires GuildPresences intent in the bot code AND enabled in the Discord Developer Portal.

const CAT_WIKI_ORIGIN = process.env.CAT_WIKI_ORIGIN; // e.g. https://cat-wiki.example
const PRESENCE_INGEST_SECRET = process.env.PRESENCE_INGEST_SECRET;

async function pushPresenceToCatWiki(presence) {
  if (!CAT_WIKI_ORIGIN || !PRESENCE_INGEST_SECRET || !presence?.userId) return;

  const activities = (presence.activities || []).slice(0, 6).map((activity) => ({
    name: activity.name || '',
    type: String(activity.type ?? ''),
    details: activity.details || '',
    state: activity.state || '',
  }));

  await fetch(`${CAT_WIKI_ORIGIN}/api/presence-update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${PRESENCE_INGEST_SECRET}`,
    },
    body: JSON.stringify({
      userId: presence.userId,
      status: presence.status || 'offline',
      activities,
    }),
  }).catch(() => {});
}

// Example with discord.js:
// client.on(Events.PresenceUpdate, async (_oldPresence, newPresence) => {
//   await pushPresenceToCatWiki(newPresence);
// });

module.exports = { pushPresenceToCatWiki };
