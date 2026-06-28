// ============================================================
// 1. UTILITÁRIOS
// ============================================================

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hour = Math.floor(min / 60);
    const day = Math.floor(hour / 24);
    if (sec < 60) return `${sec}s atrás`;
    if (min < 60) return `${min}m atrás`;
    if (hour < 24) return `${hour}h atrás`;
    if (day < 7) return `${day}d atrás`;
    return d.toLocaleDateString();
}

function capitalizeWords(str) {
    if (!str) return '';
    return String(str).replace(/[_-]/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
}

function translateType(type) {
    if (!type) return 'Denúncia';
    switch (type.toString().toLowerCase()) {
        case 'theft': return 'Furto';
        case 'vandalism': return 'Vandalismo';
        case 'assault': return 'Assalto';
        case 'robbery': return 'Roubo';
        case 'harassment': return 'Assédio';
        default: return capitalizeWords(type);
    }
}

function translateRelevancy(relevancy) {
    if (!relevancy) return 'Moderada';
    switch (relevancy.toString().toLowerCase()) {
        case 'urgent': return 'Urgente';
        case 'high': return 'Alta';
        case 'moderate': return 'Moderada';
        case 'low': return 'Baixa';
        case 'informative': return 'Informativa';
        default: return 'Moderada';
    }
}

// ============================================================
// 2. ESTADO DA APLICAÇÃO
// ============================================================

let allDenuncias = [];
let filteredDenuncias = [];

const resultsList = document.getElementById('resultsList');
const resultsCount = document.getElementById('resultsCount');
const filterSection = document.getElementById('filterSection');
const btnFilter = document.getElementById('btnFilter');
const btnSearch = document.getElementById('btnSearch');
const searchInput = document.getElementById('searchInput');
const filterForm = document.getElementById('filterForm');

// ============================================================
// 3. FUNÇÕES DE RENDERIZAÇÃO
// ============================================================

function renderResults(denuncias) {
    resultsList.innerHTML = '';
    resultsCount.textContent = `Encontradas ${denuncias.length} denúncias`;

    if (denuncias.length === 0) {
        resultsList.innerHTML = `
            <div class="text-center py-5 w-100" style="grid-column: 1 / -1;">
                <i class="bi bi-search-heart display-1 text-muted"></i>
                <p class="mt-3 fs-5">Nenhuma denúncia encontrada com os filtros aplicados.</p>
            </div>
        `;
        return;
    }

    denuncias.forEach(d => {
        const card = document.createElement('div');
        card.className = 'card-denuncia d-flex';

        const relevancia = translateRelevancy(d.relevancy);
        const titulo = translateType(d.type);
        const descricao = d.description || '';
        const testemunhas = d.witness_count || 0;
        const dataTexto = timeAgo(d.date);

        const hasCoords = d.location && typeof d.location.lat === 'number' && typeof d.location.lng === 'number';
        const displayLoc = hasCoords ? `${d.location.lat.toFixed(5)}, ${d.location.lng.toFixed(5)}` : 'Local não informado';

        card.innerHTML = `
            <div class="conteudo-card">
                <div class="cabecalho-card d-flex align-items-center">
                    <span class="etiqueta-moderado">${relevancia}</span>
                    <span class="info-tempo">${dataTexto} • ${testemunhas} testemunhas</span>
                </div>
                <h2 class="titulo-denuncia">${titulo}</h2>
                <p class="localizacao">
                    <i class="bi bi-geo-alt-fill"></i>
                    <span class="loc-text">${displayLoc}</span>
                </p>
                <p class="descricao">${descricao}</p>
            </div>
            <div class="imagem-placeholder" style="background-color: #f8f9fa; display: flex; align-items: center; justify-content: center;">
                <i class="bi bi-image text-muted" style="font-size: 2rem;"></i>
            </div>
        `;

        resultsList.appendChild(card);

        // Reverse Geocoding
        if (hasCoords) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${d.location.lat}&lon=${d.location.lng}`)
                .then(r => r.json())
                .then(data => {
                    if (data && data.address) {
                        const a = data.address;
                        const road = a.road || a.pedestrian || a.suburb;
                        const city = a.city || a.town || a.village;
                        if (road && city) {
                            card.querySelector('.loc-text').textContent = `${road}, ${city}`;
                        } else if (city) {
                            card.querySelector('.loc-text').textContent = city;
                        }
                    }
                })
                .catch(err => console.error('Geocoding error:', err));
        }
    });
}

// ============================================================
// 4. LÓGICA DE FILTRAGEM E BUSCA
// ============================================================

function applyFilters(updateUrl = true) {
    const searchTerm = searchInput.value.toLowerCase();
    const typeFilter = document.getElementById('filterType').value;
    const relevancyFilter = document.getElementById('filterRelevancy').value;
    const statusFilter = document.getElementById('filterStatus').value;

    if (updateUrl) {
        const url = new URL(window.location);
        if (searchTerm) {
            url.searchParams.set('search', searchTerm);
        } else {
            url.searchParams.delete('search');
        }
        window.history.pushState({}, '', url);
    }

    filteredDenuncias = allDenuncias.filter(d => {
        const matchesSearch = !searchTerm ||
            d.description?.toLowerCase().includes(searchTerm) ||
            d.type?.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || d.type === typeFilter;
        const matchesRelevancy = !relevancyFilter || d.relevancy === relevancyFilter;
        const matchesStatus = !statusFilter || d.status === statusFilter;

        return matchesSearch && matchesType && matchesRelevancy && matchesStatus;
    });

    renderResults(filteredDenuncias);
}

// ============================================================
// 5. EVENT LISTENERS
// ============================================================

btnFilter.addEventListener('click', () => {
    filterSection.classList.toggle('active');
});

btnSearch.addEventListener('click', () => applyFilters(true));

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyFilters(true);
});

filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters(true);
    filterSection.classList.remove('active');
});

filterForm.addEventListener('reset', () => {
    setTimeout(() => applyFilters(true), 10);
});

document.querySelectorAll('[data-sort]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sortType = e.target.getAttribute('data-sort');

        switch (sortType) {
            case 'newest':
                filteredDenuncias.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filteredDenuncias.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'witness':
                filteredDenuncias.sort((a, b) => (b.witness_count || 0) - (a.witness_count || 0));
                break;
        }
        renderResults(filteredDenuncias);
    });
});

// ============================================================
// 6. INICIALIZAÇÃO
// ============================================================

async function init() {
    try {
        const resp = await fetch('http://localhost:3000/denuncias?verificado=true');
        if (!resp.ok) throw new Error('Falha ao carregar dados');

        allDenuncias = await resp.json();

        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');

        if (searchParam) {
            searchInput.value = searchParam;
        }

        applyFilters(false);

    } catch (err) {
        console.error(err);
        resultsList.innerHTML = `<div class="alert alert-danger w-100">Erro ao carregar denúncias. Verifique se o servidor está rodando.</div>`;
    }
}

init();
