(() => {
  const params = new URLSearchParams(location.search);
  const title = document.querySelector('#title');
  const copy = document.querySelector('#copy');
  const button = document.querySelector('#connect');
  if (params.get('linked') === '1') {
    title.textContent = 'Discord linked';
    copy.textContent = `Done. Your Discord identity is now linked to the Cat Bio ${params.get('slug') ? '/' + params.get('slug') : ''}. You did not receive editor access.`;
    return;
  }
  if (params.get('error')) {
    title.textContent = 'Link unavailable'; copy.textContent = 'This link is invalid, expired, or the bio no longer exists.'; return;
  }
  const token = params.get('token');
  if (!token) { title.textContent = 'Invalid link'; copy.textContent = 'No verification token was provided.'; return; }
  fetch(`/api/link-status?token=${encodeURIComponent(token)}`)
    .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Invalid link'); return d; })
    .then((data) => { title.textContent = `Link Discord to ${data.displayName}`; copy.textContent = 'This only verifies your Discord identity for this public bio. It does not give you access to the Cat Bio editor.'; button.href = `/api/auth-start?purpose=link&token=${encodeURIComponent(token)}`; button.hidden = false; })
    .catch((error) => { title.textContent = 'Link unavailable'; copy.textContent = error.message; });
})();
