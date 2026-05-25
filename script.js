const endpoints = [
    { label: 'Choculaterie Website', url: 'https://backend.choculaterie.com/' },
    { label: 'Choculaterie API', url: 'https://api.choculaterie.com/' },
    { label: 'Minemev API', url: 'https://minemev.com/api/' }
];

const list = document.getElementById('status-list');
const timeoutMs = 7000;

function createItem(label) {
    const li = document.createElement('li');
    li.className = 'status-item checking';
    li.innerHTML = `<span>${label}</span><span>checking…</span>`;
    list.appendChild(li);
    return li;
}

async function ping(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        await fetch(url, { method: 'GET', mode: 'no-cors', cache: 'no-store', signal: controller.signal });
        return true;
    } catch (error) {
        return false;
    } finally {
        clearTimeout(timeout);
    }
}

endpoints.forEach(async ({ label, url }) => {
    const item = createItem(label);
    const ok = await ping(url);
    item.className = `status-item ${ok ? 'up' : 'down'}`;
    item.querySelector('span:last-child').textContent = ok ? 'up' : 'down';
});