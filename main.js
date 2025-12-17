document.querySelector('.button').addEventListener('click', async () => {
    document.querySelector('.container').classList.add('move-to-top');
});

async function Display() {
    const response = await fetch('https://ping-api-vdavid.azurewebsites.net/')
    const pings = await response.json()
    document.querySelector('#results').innerHTML = ''

    pings.forEach(x => {
        const card = document.createElement('div')
        card.classList.add('card')
        card.classList.add(x.status === "Success" ? 'success' : 'fail')

        card.innerHTML = `
            <h3>${x.status === "Success" ? "✅ Success" : "❌ 404"}</h3>
            <p><strong>URL:</strong> ${x.url}</p>
            <p><strong>IP cím:</strong> ${x.address || 'null'}</p>
            <p><strong>Válaszidő:</strong> ${x.roundtripTime} ms</p>
            <p><strong>TTL:</strong> ${x.ttl}</p>
        `;
        
        document.querySelector('#results').appendChild(card)
    })
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
        return fetch(`http://localhost:5118/api/ping/${url}`, {
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

