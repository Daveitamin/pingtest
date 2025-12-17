document.querySelector('.button').addEventListener('click', async () => {
    document.querySelector('.container').classList.add('move-to-top');
});

async function Display() {
    const response = await fetch('https://ping-api-vdavid.azurewebsites.net/api/Ping');
    const pings = await response.json();
    document.querySelector('#results').innerHTML = '';

    pings.forEach(x => {
        const card = document.createElement('div');
        card.classList.add('card');

        const statusText = String(x.status ?? '');
        const statusCode = Number(statusText);
        const isHttpOk = Number.isFinite(statusCode) && statusCode >= 200 && statusCode < 400;
        const isError = statusText.startsWith('ERROR');

        const ok = isHttpOk && !isError;

        card.classList.add(ok ? 'success' : 'fail');

        const badge = ok ? '✅ OK' : '❌ FAIL';
        const subtitle = isError
            ? statusText
            : (Number.isFinite(statusCode) ? `HTTP ${statusCode}` : statusText);

        const rt = (x.roundtripTime ?? 0);
        const rtText = `${rt} ms`;

        card.innerHTML = `
            <h3>${badge}</h3>
            <p><strong>URL:</strong> ${x.url}</p>
            <p><strong>Státusz:</strong> ${subtitle}</p>
            <p><strong>Válaszidő:</strong> ${rtText}</p>
        `;

        document.querySelector('#results').appendChild(card);
    });
}
Display()

function pingWebsite() {
    let input = document.querySelector('#textinput').value;
    let urls = input.split(',').map(url => url.trim()).filter(url => url.length > 0);

    if (urls.length === 0) return;

    //Show spinner
    const loading = document.getElementById('loading');
    loading.style.display = 'flex';

    const requests = urls.map(url => {
        return fetch(`https://ping-api-vdavid.azurewebsites.net/api/Ping/${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: null
        });
    });

    Promise.allSettled(requests)
        .then(() => Display())
        .catch(error => console.error('Hiba a lekérések során:', error))
        .finally(() => {
            //Hide spinner
            loading.style.display = 'none';
        });
}



