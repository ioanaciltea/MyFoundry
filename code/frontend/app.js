const API_URL = 'http://localhost:7799';

// General API Handler
async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = { 
            method, 
            headers: { 'Content-Type': 'application/json' } 
        };
        if (body) options.body = JSON.stringify(body);
        
        const res = await fetch(`${API_URL}${endpoint}`, options);
        const data = await res.json();
        
        if (!res.ok) return `[Error ${res.status}]: ${JSON.stringify(data, null, 2)}`;
        return JSON.stringify(data, null, 2);
    } catch (err) {
        return `[Connection Error]: Failed to connect to ${API_URL}. Is the backend container running?`;
    }
}

// 1. Check Health Status
async function checkHealth() {
    const rawResponse = await apiCall('/health');
    document.getElementById('healthResult').innerText = rawResponse;
    const badge = document.getElementById('healthBadge');
    
    if (rawResponse.includes('"status": "ok"') || rawResponse.includes('"status":"ok"')) {
        badge.innerText = 'Online';
        badge.classList.add('online');
    } else {
        badge.innerText = 'Offline / Error';
        badge.classList.remove('online');
    }
}

// 2. Chunking
async function runChunk() {
    const text = document.getElementById('chunkText').value;
    const strategy = document.getElementById('chunkStrategy').value;
    document.getElementById('chunkResult').innerText = await apiCall('/chunk', 'POST', { text, strategy });
}

// 3. Ingestion
async function runIngest() {
    const text = document.getElementById('ingestText').value;
    document.getElementById('ingestResult').innerText = await apiCall('/ingest', 'POST', { text });
}

// 4. Collection Management
async function getCollection() {
    document.getElementById('collectionResult').innerText = await apiCall('/collection');
}

async function deleteCollection() {
    if (confirm('Are you sure you want to reset the vector collection? This action cannot be undone.')) {
        document.getElementById('collectionResult').innerText = await apiCall('/collection', 'DELETE');
    }
}

// 5. Similarity Search
async function runSearch() {
    const query = document.getElementById('searchQuery').value;
    document.getElementById('searchResult').innerText = await apiCall('/search', 'POST', { query });
}

// 6. Ask Model (RAG)
async function runAsk() {
    const question = document.getElementById('askQuery').value;
    const use_rag = document.getElementById('useRag').checked;
    document.getElementById('askResult').innerText = await apiCall('/ask', 'POST', { question, use_rag });
}

// Event Listeners (Connect buttons to JavaScript functions)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnHealth').addEventListener('click', checkHealth);
    document.getElementById('btnChunk').addEventListener('click', runChunk);
    document.getElementById('btnIngest').addEventListener('click', runIngest);
    document.getElementById('btnInspect').addEventListener('click', getCollection);
    document.getElementById('btnReset').addEventListener('click', deleteCollection);
    document.getElementById('btnSearch').addEventListener('click', runSearch);
    document.getElementById('btnAsk').addEventListener('click', runAsk);
});