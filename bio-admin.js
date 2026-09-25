(() => {
  const loginGate = document.querySelector('#loginGate');
  const editorApp = document.querySelector('#editorApp');
  const authArea = document.querySelector('#authArea');
  const form = document.querySelector('#bioForm');
  const bioList = document.querySelector('#bioList');
  const notice = document.querySelector('#notice');
  let csrf = '';
  let bios = [];
  let current = null;
  let linkPollTimer = null;

  const q = (name) => form.elements.namedItem(name);
  const esc = (value = '') => String(value).replace(/[&<>\"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const api = async (url, options = {}) => {
    const response = await fetch(url, { credentials: 'same-origin', ...options, headers: { ...(options.headers || {}), ...(options.method && options.method !== 'GET' ? { 'X-CSRF-Token': csrf } : {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    return data;
  };
  const show = (text, error = false) => { notice.textContent = text; notice.hidden = false; notice.classList.toggle('error', error); };
  const hideNotice = () => { notice.hidden = true; };
  const parseRows = (raw, kind) => String(raw || '').split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const [first, ...rest] = line.split('|');
    return kind === 'badges' ? { label: first.trim(), iconUrl: rest.join('|').trim() } : { label: first.trim(), url: rest.join('|').trim() };
  });
  const formatRows = (rows, valueKey) => Array.isArray(rows) ? rows.map((item) => `${item.label || ''} | ${item[valueKey] || ''}`).join('\n') : '';

  const emptyBio = () => ({
    slug:'',published:false,displayName:'',handle:'',headline:'',bio:'',avatarUrl:'',backgroundType:'none',backgroundUrl:'',backgroundPosterUrl:'',overlayOpacity:.38,backgroundBlur:0,musicUrl:'',musicTitle:'',musicArtist:'',musicCoverUrl:'',spotifyUrl:'',spotifyTitle:'',spotifyThumbnail:'',locationLabel:'',badges:[],links:[],showDiscordPresence:true,manualViews:0,organicViews:0,views:0,linkedDiscord:null,presence:null
  });

  function setForm(bio) {
    current = bio;
    document.querySelector('#editorTitle').textContent = bio.slug ? bio.displayName || bio.slug : 'New bio';
    ['slug','displayName','handle','headline','bio','avatarUrl','backgroundType','backgroundUrl','backgroundPosterUrl','overlayOpacity','backgroundBlur','musicUrl','musicTitle','musicArtist','musicCoverUrl','spotifyUrl','spotifyTitle','spotifyThumbnail','locationLabel','manualViews'].forEach((name) => { if (q(name)) q(name).value = bio[name] ?? ''; });
    q('published').checked = Boolean(bio.published);
    q('showDiscordPresence').checked = bio.showDiscordPresence !== false;
    q('badges').value = formatRows(bio.badges, 'iconUrl');
    q('links').value = formatRows(bio.links, 'url');
    document.querySelector('#organicViews').textContent = Number(bio.organicViews || 0).toLocaleString();
    document.querySelector('#manualViewsPreview').textContent = Number(bio.manualViews || 0).toLocaleString();
    document.querySelector('#totalViews').textContent = Number(bio.views || 0).toLocaleString();
    const discord = document.querySelector('#discordLinkState');
    if (bio.linkedDiscord?.id) {
      const status = bio.presence?.status || 'unknown';
      discord.textContent = `Linked: @${bio.linkedDiscord.username || 'unknown'} · ${bio.linkedDiscord.id} · presence ${status}`;
    } else discord.textContent = 'Not linked.';
    const open = document.querySelector('#openBio');
    open.hidden = !bio.slug;
    if (bio.slug) open.href = `/bio/${encodeURIComponent(bio.slug)}`;
    document.querySelector('#generatedLink').value = '';
    renderList();
    hideNotice();
  }

  function renderList() {
    bioList.innerHTML = bios.length ? bios.map((bio) => `<button type="button" data-slug="${esc(bio.slug)}" class="${current?.slug === bio.slug ? 'active' : ''}"><strong>${esc(bio.displayName || bio.slug)}</strong><small>/${esc(bio.slug)} · ${bio.published ? 'public' : 'draft'}</small></button>`).join('') : '<div style="padding:10px;color:#555;font-size:10px">No bio yet.</div>';
    bioList.querySelectorAll('button[data-slug]').forEach((button) => button.onclick = () => {
      const bio = bios.find((item) => item.slug === button.dataset.slug);
      if (bio) setForm(bio);
    });
  }

  async function loadBios(selectSlug = null) {
    const data = await api('/api/admin-bios');
    bios = Array.isArray(data.bios) ? data.bios : [];
    if (selectSlug) current = bios.find((b) => b.slug === selectSlug) || current;
    renderList();
    if (current?.slug) {
      const refreshed = bios.find((b) => b.slug === current.slug);
      if (refreshed) setForm(refreshed);
    }
  }

  function payload() {
    return {
      slug:q('slug').value,published:q('published').checked,displayName:q('displayName').value,handle:q('handle').value,headline:q('headline').value,bio:q('bio').value,avatarUrl:q('avatarUrl').value,backgroundType:q('backgroundType').value,backgroundUrl:q('backgroundUrl').value,backgroundPosterUrl:q('backgroundPosterUrl').value,overlayOpacity:Number(q('overlayOpacity').value),backgroundBlur:Number(q('backgroundBlur').value),musicUrl:q('musicUrl').value,musicTitle:q('musicTitle').value,musicArtist:q('musicArtist').value,musicCoverUrl:q('musicCoverUrl').value,spotifyUrl:q('spotifyUrl').value,spotifyTitle:q('spotifyTitle').value,spotifyThumbnail:q('spotifyThumbnail').value,locationLabel:q('locationLabel').value,badges:parseRows(q('badges').value,'badges'),links:parseRows(q('links').value,'links'),showDiscordPresence:q('showDiscordPresence').checked,manualViews:Number(q('manualViews').value || 0)
    };
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); hideNotice();
    try {
      const data = await api('/api/admin-bio-save', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload()) });
      show('Saved.');
      current = data.bio;
      await loadBios(data.bio.slug);
    } catch (error) { show(error.message, true); }
  });

  document.querySelector('#newBio').onclick = () => setForm(emptyBio());
  document.querySelector('#deleteBio').onclick = async () => {
    if (!current?.slug || !confirm(`Delete /${current.slug}?`)) return;
    try { await api('/api/admin-bio-delete', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({slug:current.slug}) }); current = null; await loadBios(); setForm(emptyBio()); show('Deleted.'); } catch (error) { show(error.message,true); }
  };

  document.querySelector('#createDiscordLink').onclick = async () => {
    if (!current?.slug) return show('Save the bio first.', true);
    try {
      const data = await api('/api/admin-link-create', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({slug:current.slug}) });
      document.querySelector('#generatedLink').value = data.url;
      show('One-time Discord link created. Waiting for Discord confirmation…');
      if (linkPollTimer) clearInterval(linkPollTimer);
      linkPollTimer = setInterval(async () => {
        try {
          const status = await api(`/api/admin-link-status?token=${encodeURIComponent(data.token)}`);
          if (!status.linked) return;
          clearInterval(linkPollTimer); linkPollTimer = null;
          show(`Discord linked: @${status.result.username} · ${status.result.userId}`);
          await loadBios(current?.slug || status.result.slug);
        } catch {}
      }, 3000);
    } catch (error) { show(error.message, true); }
  };
  document.querySelector('#copyGeneratedLink').onclick = async () => {
    const input = document.querySelector('#generatedLink'); if (!input.value) return;
    await navigator.clipboard.writeText(input.value).catch(() => {}); show('Link copied.');
  };

  document.querySelector('#spotifyFetch').onclick = async () => {
    const url = q('spotifyUrl').value.trim(); if (!url) return show('Paste a Spotify URL first.', true);
    try { const data = await api(`/api/spotify?url=${encodeURIComponent(url)}`); q('spotifyTitle').value = data.title || ''; q('spotifyThumbnail').value = data.thumbnail || ''; show('Spotify card updated.'); } catch (error) { show(error.message, true); }
  };

  document.querySelectorAll('[data-view-delta]').forEach((button) => button.onclick = async () => {
    if (!current?.slug) return show('Save the bio first.', true);
    try {
      const data = await api('/api/admin-view-adjust', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({slug:current.slug,delta:Number(button.dataset.viewDelta)}) });
      current = data.bio; q('manualViews').value = current.manualViews || 0; document.querySelector('#organicViews').textContent = Number(current.organicViews || 0).toLocaleString(); document.querySelector('#manualViewsPreview').textContent = Number(current.manualViews || 0).toLocaleString(); document.querySelector('#totalViews').textContent = Number(current.views || 0).toLocaleString(); show('Views adjusted.');
      await loadBios(current.slug);
    } catch (error) { show(error.message,true); }
  });

  async function boot() {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'forbidden') {
      loginGate.querySelector('p').textContent = 'This Discord account is not allowed to access the editor.';
    }
    try {
      const me = await api('/api/me');
      if (!me.authenticated) return;
      csrf = me.csrf;
      loginGate.hidden = true; editorApp.hidden = false;
      authArea.replaceChildren();
      const pill = document.createElement('div'); pill.className = 'auth-pill';
      const identity = document.createElement('span'); identity.textContent = `${me.user.globalName || me.user.username} · ${me.user.id}`;
      const logout = document.createElement('button'); logout.type = 'button'; logout.textContent = 'Logout';
      logout.onclick = async () => { await api('/api/logout',{method:'POST'}).catch(()=>{}); location.reload(); };
      pill.append(identity, logout); authArea.appendChild(pill);
      await loadBios();
      setForm(bios[0] || emptyBio());
    } catch (error) { console.error(error); }
  }
  boot();
})();
