(() => {
  const list = document.querySelector('#bioHubList');
  const manage = document.querySelector('#bioManageLink');
  if (!list) return;

  const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  const render = (bios) => {
    if (!bios.length) {
      list.innerHTML = '<div class="bio-hub-empty">No public bio yet.</div>';
      return;
    }
    list.innerHTML = bios.map((bio) => {
      const bg = bio.backgroundType === 'image' && bio.backgroundUrl
        ? `style="background-image:linear-gradient(rgba(0,0,0,.58),rgba(0,0,0,.58)),url('${esc(bio.backgroundUrl)}')"`
        : '';
      const status = bio.presence?.status || 'unknown';
      const avatar = bio.avatarUrl
        ? `<img src="${esc(bio.avatarUrl)}" alt="" loading="lazy">`
        : `<span>${esc((bio.displayName || '?').slice(0, 1).toUpperCase())}</span>`;
      return `<a class="bio-hub-card" href="/bio/${encodeURIComponent(bio.slug)}" ${bg}>
        <div class="bio-hub-avatar">${avatar}</div>
        <div class="bio-hub-copy">
          <strong>${esc(bio.displayName)}</strong>
          <small>${bio.handle ? '@' + esc(bio.handle.replace(/^@/, '')) : esc(bio.headline || '')}</small>
        </div>
        <div class="bio-hub-meta"><span class="presence-dot ${esc(status)}"></span>${Number(bio.views || 0).toLocaleString()} views</div>
      </a>`;
    }).join('');
  };

  fetch('/api/public-bios', { credentials: 'same-origin' })
    .then((r) => r.ok ? r.json() : Promise.reject())
    .then((data) => render(Array.isArray(data.bios) ? data.bios : []))
    .catch(() => { list.innerHTML = '<div class="bio-hub-empty">Bio service unavailable.</div>'; });

  fetch('/api/me', { credentials: 'same-origin' })
    .then((r) => r.json())
    .then((data) => { if (data.authenticated && manage) manage.textContent = 'Manage bios'; })
    .catch(() => {});
})();
