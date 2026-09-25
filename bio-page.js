(() => {
  const root = document.querySelector('#bioRoot');
  const error = document.querySelector('#bioError');
  const bg = document.querySelector('#bg');
  const shade = document.querySelector('#shade');
  const audio = document.querySelector('#bgMusic');
  const musicButton = document.querySelector('#musicButton');
  const pathSlug = location.pathname.match(/^\/bio\/([^/?#]+)/i)?.[1];
  const slug = decodeURIComponent(pathSlug || new URLSearchParams(location.search).get('slug') || '');

  const setText = (selector, value) => { const el = document.querySelector(selector); if (el) el.textContent = value || ''; };
  const avatarUrl = (linked) => linked?.id && linked?.avatar ? `https://cdn.discordapp.com/avatars/${linked.id}/${linked.avatar}.png?size=128` : '';

  function render(bio) {
    document.title = `${bio.displayName} · Cat Bio`;
    shade.style.background = `rgba(0,0,0,${Number(bio.overlayOpacity ?? .38)})`;
    bg.style.filter = `blur(${Number(bio.backgroundBlur || 0)}px)`;
    if (bio.backgroundType === 'video' && bio.backgroundUrl) {
      const video = document.createElement('video'); video.src = bio.backgroundUrl; video.autoplay = true; video.loop = true; video.muted = true; video.playsInline = true; if (bio.backgroundPosterUrl) video.poster = bio.backgroundPosterUrl; bg.replaceChildren(video);
    } else if (bio.backgroundType === 'image' && bio.backgroundUrl) {
      bg.style.backgroundImage = `url(${JSON.stringify(bio.backgroundUrl).slice(1,-1)})`;
    }

    const av = document.querySelector('#avatar');
    const image = bio.avatarUrl || avatarUrl(bio.linkedDiscord);
    if (image) { const img = document.createElement('img'); img.src = image; img.alt = ''; av.replaceChildren(img); } else av.textContent = (bio.displayName || '?').slice(0,1).toUpperCase();
    setText('#displayName', bio.displayName);
    setText('#handle', bio.handle ? `@${String(bio.handle).replace(/^@/,'')}` : '');
    setText('#headline', bio.headline);
    setText('#bioText', bio.bio);
    setText('#views', `${Number(bio.views || 0).toLocaleString()} views`);
    setText('#location', bio.locationLabel || '');

    const badges = document.querySelector('#badges'); badges.replaceChildren();
    (bio.badges || []).forEach((badge) => { if (badge.iconUrl) { const img = document.createElement('img'); img.src = badge.iconUrl; img.alt = badge.label || 'badge'; img.title = badge.label || ''; badges.appendChild(img); } else if (badge.label) { const span = document.createElement('span'); span.textContent = badge.label; badges.appendChild(span); } });

    const discord = document.querySelector('#discordCard');
    if (bio.linkedDiscord) {
      discord.hidden = false; discord.replaceChildren();
      const wrap = document.createElement('div'); wrap.className='presence-avatar'; const linkedAvatar = avatarUrl(bio.linkedDiscord); if (linkedAvatar) { const img=document.createElement('img');img.src=linkedAvatar;img.alt='';wrap.appendChild(img); } else wrap.textContent='D';
      const copy = document.createElement('div'); copy.className='presence-copy'; const strong=document.createElement('strong');strong.textContent=bio.linkedDiscord.globalName || bio.linkedDiscord.username; const small=document.createElement('small');small.textContent=`@${bio.linkedDiscord.username} · ${bio.linkedDiscord.id}`; copy.append(strong,small);
      const status=document.createElement('div');status.className='status-pill';const dot=document.createElement('i');dot.className=`status-dot ${bio.presence?.status || 'unknown'}`;const label=document.createElement('span');label.textContent=bio.presence?.status || 'unknown';status.append(dot,label);discord.append(wrap,copy,status);
    }

    const spotify = document.querySelector('#spotifyCard');
    if (bio.spotifyUrl || bio.spotifyTitle) {
      spotify.hidden = false; spotify.replaceChildren();
      if (bio.spotifyUrl) { spotify.tagName; spotify.onclick=()=>window.open(bio.spotifyUrl,'_blank','noopener'); spotify.style.cursor='pointer'; }
      const art=document.createElement('div');art.className='spotify-art';if(bio.spotifyThumbnail){const img=document.createElement('img');img.src=bio.spotifyThumbnail;img.alt='';art.appendChild(img)}else art.textContent='♪';
      const copy=document.createElement('div');copy.className='spotify-copy';const strong=document.createElement('strong');strong.textContent=bio.spotifyTitle || 'Spotify';const small=document.createElement('small');small.textContent='Spotify · visual card';copy.append(strong,small);const mark=document.createElement('div');mark.className='status-pill';mark.textContent='Spotify';spotify.append(art,copy,mark);
    }

    const links = document.querySelector('#links'); links.replaceChildren(); (bio.links || []).forEach((link) => { const a=document.createElement('a');a.href=link.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=link.label;links.appendChild(a); });

    if (bio.musicUrl) {
      audio.src = bio.musicUrl; musicButton.hidden = false; musicButton.title = [bio.musicTitle,bio.musicArtist].filter(Boolean).join(' · ') || 'Background music';
      musicButton.onclick = async () => { if (audio.paused) { try { await audio.play(); musicButton.classList.add('playing'); musicButton.textContent='❚❚'; } catch {} } else { audio.pause();musicButton.classList.remove('playing');musicButton.textContent='♫'; } };
    }
    root.hidden = false;
  }

  if (!slug) { error.hidden=false; return; }
  fetch(`/api/bio?slug=${encodeURIComponent(slug)}`, { credentials:'same-origin' })
    .then(async (r)=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'Bio unavailable');return d.bio})
    .then((bio)=>{render(bio);return fetch(`/api/view?slug=${encodeURIComponent(slug)}`,{method:'POST',credentials:'same-origin'}).then(r=>r.json()).then(v=>{if(Number.isFinite(Number(v.views)))setText('#views',`${Number(v.views).toLocaleString()} views`)}).catch(()=>{})})
    .catch((e)=>{error.textContent=e.message;error.hidden=false});
})();
