/* ============================================================
    1. Escolher Cidade
   ============================================================ */

const escolherCidade = document.getElementById('escolherCidade')

// Busca municípios de MG
fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/MG/municipios')
    .then(resultado => resultado.json())
    .then(municipios => {
    municipios.sort((a, b) => a.nome.localeCompare(b.nome))

    escolherCidade.innerHTML = ''
    municipios.forEach(municipio => {
        const option = document.createElement('option')
        option.value = municipio.nome.toLowerCase().replace(/\s+/g, '')
        option.textContent = municipio.nome
        escolherCidade.appendChild(option)
    })
    escolherCidade.value = 'belohorizonte'
    })

escolherCidade.addEventListener('change', function() {
    const cidadeSelecionada = this.value
})

/* ============================================================
    2. MAPA DE CALOR
   ============================================================ */

const mapaContainer = document.getElementById('mapa-interativo');

async function carregarMapaDeCalor() {
    if (!mapaContainer || typeof L === 'undefined') {
        return;
    }

    let pontos = [];

    const resposta = await fetch('http://localhost:3000/heatmap');
    if (resposta.ok) {
        const dados = await resposta.json();
        if (Array.isArray(dados?.points) && dados.points.length > 0) {
            pontos = dados.points;
        }
    }

    const coordenadas = pontos
        .filter(ponto => Number.isFinite(ponto.lat) && Number.isFinite(ponto.lng))
        .map(ponto => [ponto.lat, ponto.lng, 1]);

    const mapa = L.map('mapa-interativo', {
        scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const camadaCalor = L.heatLayer(coordenadas, {
        radius: 32,
        blur: 22,
        maxZoom: 17,
        minOpacity: 0.45,
        gradient: {
            0.2: '#2a9d8f',
            0.45: '#a8dadc',
            0.65: '#f4a261',
            0.85: '#e76f51',
            1.0: '#c1121f'
        }
    }).addTo(mapa);

    let bounds = null;
    if (coordenadas.length > 0) {
        bounds = L.latLngBounds(coordenadas.map(([lat, lng]) => [lat, lng]));
    }

    let userLocation = null;
    if (navigator.geolocation) {
        const pos = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 5000 })
        );
        userLocation = [pos.coords.latitude, pos.coords.longitude];
        L.circle(userLocation, { radius: 40, color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.18 }).addTo(mapa).bindPopup('Você está aqui');
    }

    if (bounds && userLocation) {
        bounds.extend(userLocation);
        mapa.fitBounds(bounds.pad(0.35));
    } else if (bounds) {
        if (coordenadas.length === 1) {
            mapa.setView(bounds.getCenter(), 15);
        } else {
            mapa.fitBounds(bounds.pad(0.35));
        }
    } else if (userLocation) {
        mapa.setView(userLocation, 13);
    } else {
        mapa.setView([-19.919393, -43.926384], 13);
    }

    requestAnimationFrame(() => {
        mapa.invalidateSize();
        camadaCalor.redraw();
    });
}

/* ============================================================
    3. CARREGAR LISTA DE DENÚNCIAS
   ============================================================ */

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
    switch(type?.toString().toLowerCase()) {
        case 'theft':
            return 'Furto';
        case 'vandalism':
            return 'Vandalismo';
            break;
        case 'assault':
            return 'Assalto';
            break;
        case 'robbery':
            return 'Roubo';
            break;
        case 'harassment':
            return 'Assédio';
            break;
        default:
            return capitalizeWords(type) || (denuncia.title ?? 'Denúncia');
    }
}

function translateRelevancy(relevancy) {
    if (!relevancy) return 'Moderado';
    switch (relevancy.toString().toLowerCase()) {
        case 'urgent':
            return 'Urgente';
        case 'high':
            return 'Alta';
        case 'moderate':
            return 'Moderada';
        case 'low':
            return 'Baixa';
        case 'informative':
            return 'Informativa';
        default:
            return 'Moderado';
    }
}

function carregarDenuncias() {
    const listaDenuncias = document.getElementById('lista-principal');
    const denunciasRegiao = document.getElementById('denuncias-regiao');
    fetch('http://localhost:3000/denuncias')
        .then(response => response.json())
        .then(denuncias => {
            listaDenuncias.innerHTML = '';
            const ultimasDenuncias = [...denuncias].reverse().slice(0, 3);
            ultimasDenuncias.forEach(denuncia => {
                const item = document.createElement('article');
                item.classList.add('cartao-denuncia', 'd-flex', 'justify-content-between');
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    window.location.href = `detalhe-denuncias.html?id=${denuncia.id}`;
                });
                const rawRelevancy = denuncia.relevancy ?? denuncia.relevancy ?? denuncia.relevancia;
                let relevancia = translateRelevancy(rawRelevancy);
                const titulo = translateType(denuncia.type) || (denuncia.title ?? 'Denúncia');
                const descricao = denuncia.description ?? denuncia.descricao ?? '';
                const testemunhas = denuncia.witness_count ?? denuncia.testemunhas ?? 0;
                const dataTexto = timeAgo(denuncia.date ?? denuncia.data);
                const hasCoords = denuncia.location && typeof denuncia.location.lat === 'number' && typeof denuncia.location.lng === 'number';
                const localText = hasCoords
                    ? `${denuncia.location.lat.toFixed(5)}, ${denuncia.location.lng.toFixed(5)}`
                    : (denuncia.localizacao ?? 'Local não informado');

                item.innerHTML = `
                    <div class="conteudo-cartao">
                        <div class="cabecalho-cartao">
                            <span class="etiqueta-alerta">${relevancia}</span>
                            <span class="tempo-e-testemunhas">${dataTexto} • ${testemunhas} testemunhas</span>
                        </div>

                        <h3 class="titulo-denuncia">${titulo}</h3>
                        <p class="localizacao">
                            <i class="icone-alfinete"></i> ${localText}
                        </p>
                        <p class="descricao-denuncia">
                            ${descricao}
                        </p>
                    </div>

                    <div class="espaco-foto"></div>
                `;
                listaDenuncias.appendChild(item);
                if (hasCoords) {
                    (async () => {
                        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${denuncia.location.lat}&lon=${denuncia.location.lng}`);
                        if (!resp.ok) return;
                        const data = await resp.json();
                        let display = '';
                        if (data && data.address) {
                            const a = data.address;
                            const road = a.road || a.pedestrian || a.footway || a.residential || a.street || a.path || a.building;
                            const house = a.house_number || a.housenumber || a.house_no || a.house;
                            const neighbourhood = a.neighbourhood || a.suburb || a.district || a.city_district || a.village || a.locality;
                            if (road) {
                                display = road;
                                if (house) display += `, ${house}`;
                                if (neighbourhood) display += `, ${neighbourhood}`;
                            } else if (neighbourhood) {
                                display = neighbourhood;
                            }
                        }
                        const p = item.querySelector('.localizacao');
                        if (p && display) p.innerHTML = `<i class="icone-alfinete"></i> ${display}`;
                    })();
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar denúncias:', error);
            listaDenuncias.innerHTML = '<article class="text-danger">Não foi possível carregar as denúncias.</article>';
        });
}

/* ============================================================
    4. REGIAO DO USUÁRIO (GPS)
   ============================================================ */

function atualizarRegiaoGPS() {
    const regiaoElement = document.getElementById('regiao-gps');
    if (!regiaoElement) return;
    if (!navigator.geolocation) {
        regiaoElement.textContent = 'Geolocalização não é suportada pelo seu navegador.';
        return;
    }
    
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
                const cidade = data.address.city || data.address.town || data.address.village || 'sua região';
                const bairro = data.address.neighbourhood + ',' || '';
                regiaoElement.textContent = `Denúncias próximas a ${bairro} ${cidade}`;
            })
            .catch(() => {
                regiaoElement.textContent = 'Não foi possível determinar sua região.';
            });
    }, () => {
        regiaoElement.textContent = 'Permissão de localização negada. Mostrando denúncias gerais.';
    });
};

atualizarRegiaoGPS();

carregarDenuncias();

carregarMapaDeCalor();

/* ============================================================
    5. CARREGAR DENÚNCIAS DA REGIÃO DO USUÁRIO
   ============================================================ */

async function carregarDenunciasRegiao() {
    const container = document.getElementById('denuncias-regiao');
    if (!container) return;
    container.innerHTML = '';

    if (!navigator.geolocation) {
        container.innerHTML = '<div class="text-muted">Geolocalização não suportada.</div>';
        return;
    }
    let pos;
    try {
        pos = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 5000 })
        );
    } catch (err) {
        container.innerHTML = '<div class="text-muted">Permissão de localização negada.</div>';
        return;
    }

    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    let resp;
    try {
        resp = await fetch('http://localhost:3000/denuncias');
        if (!resp.ok) throw new Error('Erro ao buscar denúncias');
    } catch (err) {
        container.innerHTML = '<div class="text-danger">Não foi possível carregar denúncias.</div>';
        console.error(err);
        return;
    }

    const denuncias = await resp.json();

    const proximas = denuncias.filter(d => d.location && typeof d.location.lat === 'number' && typeof d.location.lng === 'number'
        && Math.abs(d.location.lat - userLat) <= 0.5 && Math.abs(d.location.lng - userLng) <= 0.5);

    if (proximas.length === 0) {
        container.innerHTML = '<div class="text-muted">Não há denúncias na sua região.</div>';
        return;
    }

    proximas.forEach(d => {
        const card = document.createElement('div');
        card.className = 'card-denuncia d-flex';
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = `detalhe-denuncias.html?id=${d.id}`;
        });

        const rawRelevancy = d.relevancy ?? d.relevancia ?? '';
        const relevancia = translateRelevancy(rawRelevancy);
        const titulo = translateType(d.type) || (d.title ?? 'Denúncia');
        const descricao = d.description ?? d.descricao ?? '';
        const testemunhas = d.witness_count ?? d.testemunhas ?? 0;
        const dataTexto = timeAgo(d.date ?? d.data);

        const hasCoords = d.location && typeof d.location.lat === 'number' && typeof d.location.lng === 'number';
        const display = hasCoords ? `${d.location.lat.toFixed(5)}, ${d.location.lng.toFixed(5)}` : (d.localizacao ?? 'Local não informado');

        card.innerHTML = `
            <div class="conteudo-card">
                <div class="cabecalho-card d-flex align-items-center">
                    <span class="etiqueta-moderado">${relevancia}</span>
                    <span class="info-tempo">${dataTexto} • ${testemunhas} testemunhas</span>
                </div>
                <h2 class="titulo-denuncia">${titulo}</h2>
                <p class="localizacao">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                    </svg>
                    ${display}
                </p>
                <p class="descricao">${descricao}</p>
            </div>
            <div class="imagem-placeholder"></div>
        `;

        container.appendChild(card);

        if (hasCoords) {
            (async () => {
                try {
                    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${d.location.lat}&lon=${d.location.lng}`);
                    if (!r.ok) return;
                    const data = await r.json();
                    let displayText = '';
                    if (data && data.address) {
                        const a = data.address;
                        const road = a.road || a.pedestrian || a.footway || a.residential || a.street || a.path || a.building;
                        const house = a.house_number || a.housenumber || a.house_no || a.house;
                        const neighbourhood = a.neighbourhood || a.suburb || a.district || a.city_district || a.village || a.locality;
                        if (road) {
                            displayText = road;
                            if (house) displayText += `, ${house}`;
                            if (neighbourhood) displayText += `, ${neighbourhood}`;
                        } else if (neighbourhood) {
                            displayText = neighbourhood;
                        }
                    }
                    const p = card.querySelector('.localizacao');
                    if (p && displayText) p.innerHTML = `<i class="icone-alfinete"></i> ${displayText}`;
                } catch (err) {
                    console.error('Reverse geocode error', err);
                }
            })();
        }
    });
}

carregarDenunciasRegiao();