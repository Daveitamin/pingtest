const API_BASE = "https://ping-api-vdavid.azurewebsites.net/api/Ping";

let sessionResults = [];

document.querySelector('.button')?.addEventListener('click', async () => {
  document.querySelector('.container')?.classList.add('move-to-top');
});

function renderResults() {
  const resultsEl = document.querySelector('#results');
  resultsEl.innerHTML = '';

  sessionResults.forEach(x => {
    const card = document.createElement('div');
    card.classList.add('card');

    const statusText = String(x.status ?? '');
    const statusCode = Number(statusText);
    const isError = statusText.startsWith('ERROR');
    const ok = !isError && Number.isFinite(statusCode) && statusCode >= 200 && statusCode < 400;

    card.classList.add(ok ? 'success' : 'fail');

    const badge = ok ? '✅ OK' : '❌ FAIL';
    const subtitle = isError ? statusText : (Number.isFinite(statusCode) ? `HTTP ${statusCode}` : statusText);
    const rt = (x.roundtripTime ?? 0);

    card.innerHTML = `
      <h3>${badge}</h3>
      <p><strong>URL:</strong> ${x.url}</p>
      <p><strong>Státusz:</strong> ${subtitle}</p>
      <p><strong>Válaszidő:</strong> ${rt} ms</p>
    `;

    resultsEl.appendChild(card);
  });
}

async function pingOne(rawUrl) {
  const encoded = encodeURIComponent(rawUrl);
  const res = await fetch(`${API_BASE}/${encoded}`, { method: 'POST' });

  return await res.json();
}

async function pingWebsite() {
  const input = document.querySelector('#textinput').value;
  const urls = input.split(',').map(u => u.trim()).filter(u => u.length > 0);
  if (urls.length === 0) return;

  // Show spinner
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'flex';

  try {
    const promises = urls.map(async (u) => {
      try {
        const result = await pingOne(u);
        sessionResults.push(result);
      } catch (e) {
        sessionResults.push({
          url: u,
          status: "ERROR: FetchFailed",
          roundtripTime: 0,
          address: null,
          ttl: 0,
          bufferSize: 0
        });
      }
    });

    await Promise.allSettled(promises);
    renderResults();
  } finally {
    // Hide spinner
    if (loading) loading.style.display = 'none';
  }
}
