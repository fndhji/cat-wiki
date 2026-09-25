# Cat Wiki Bio v1

This version adds an owner-only Cat Bio system to the existing Cat Wiki.

## Security model

- Only Discord ID `1086407479270850641` can receive an editor session.
- The access check happens on the server after Discord OAuth. Hiding buttons in the browser is not used as authorization.
- OAuth uses a one-time state stored in Redis and an HttpOnly state cookie.
- Admin sessions are random server-side sessions in Redis with HttpOnly + SameSite cookies.
- Every admin mutation also requires a per-session CSRF token.
- Bio text is plain text. The public page uses DOM `textContent` for bio-controlled text instead of injecting HTML.
- Discord-link URLs are random one-time tokens that expire after 30 minutes.
- A person using a `/loginaccept` link only links their Discord identity to the selected bio. They never receive an editor session.
- Discord OAuth access tokens are not stored after the identity lookup.
- View fingerprints use HMAC; raw IP addresses are not stored.

No application can honestly guarantee “zero vulnerabilities”, but the important authorization checks are server-side and default-deny.

## Required environment variables

Copy `.env.example` and configure:

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_REDIRECT_URI`
- `APP_ORIGIN`
- `SESSION_SECRET`
- `VIEW_SALT`
- `PRESENCE_INGEST_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

`OWNER_DISCORD_ID` defaults to `1086407479270850641` but is included in `.env.example` too.

Discord OAuth redirect URI must exactly match:

`https://YOUR-DOMAIN/api/auth-callback`

Only the `identify` scope is requested.

## Redis

The site uses an Upstash Redis compatible REST endpoint. Vercel KV aliases `KV_REST_API_URL` and `KV_REST_API_TOKEN` are also accepted.

Redis stores:

- owner sessions
- one-time Discord identity links
- bio JSON
- public view counters
- presence snapshots

Without Redis, local development uses in-memory storage. Production intentionally refuses to use ephemeral storage.

## Bio media

The editor accepts URLs and site-relative asset paths.

Examples:

- `/assets/bio-media/background.mp4`
- `/assets/bio-media/background.mov`
- `/assets/bio-media/song.mp3`
- `/assets/bio-media/avatar.png`

MOV support depends on the codec/browser. MP4 H.264 and WebM are the safer web formats.

For very large files, use Vercel Blob or your own CDN and paste the public URL into the editor. This avoids proxying giant video uploads through a serverless function.

## Spotify

Paste a Spotify URL in the editor and click `Fetch Spotify card`.
The server uses Spotify's official oEmbed endpoint to retrieve the display title and thumbnail. The public bio shows a visual card and does not autoplay Spotify.

## Discord live presence

Discord OAuth `identify` verifies identity, but it does not provide live online/offline presence.

The site therefore includes a secure ingestion endpoint:

`POST /api/presence-update`

Header:

`Authorization: Bearer YOUR_PRESENCE_INGEST_SECRET`

JSON example:

```json
{
  "userId": "1086407479270850641",
  "status": "online",
  "activities": [
    { "name": "Visual Studio Code", "type": "Playing", "details": "Cat Wiki" }
  ]
}
```

Your Cat Discord bot can call this endpoint when Discord sends presence updates. That keeps the website on supported Discord APIs rather than scraping private client endpoints.

## View counting

A public profile calls `/api/view` once when it loads.
The server HMAC-hashes `bio + IP + user-agent` and only increments once per 24 hours for that fingerprint.

This stops refresh-spam, but no public analytics system can make view manipulation mathematically impossible because users can change networks/devices. Owner-added views are kept as a separate manual offset.

## Routes

- `/` — Cat Wiki
- `/bio/<slug>` — public bio
- `/admin` — private owner editor
- `/loginaccept?token=...` — one-time Discord identity link
