/* ─────────────────────────────────────────
   filtro-denuncias.js – Vigilare
   Integrated with JSON-Server logic
   ───────────────────────────────────────── */

(function () {
  'use strict';

  /* ── HELPERS ──────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ── ESTADO DA APLICAÇÃO ───────────────── */
  let allDenuncias = [];
  let filteredDenuncias = [];

  const resultsList  = $('#resultsList');
  const resultsCount = $('#resultsCount');
  const emptyState   = $('#emptyState');
  const filterForm   = $('#filterForm');
  const searchInput  = $('#searchInput');
  const searchBtn    = $('#searchBtn');
  const sortSelect   = $('#sortSelect');
  const escolherCidade = $('#escolherCidade');
  const filterPanel  = $('#filterPanel');
  const filterToggleBtn = $('#filterToggleBtn');
  const filterCloseBtn = $('#filterCloseBtn');

  /* ── UTILITÁRIOS ──────────────────────── */
  function translateType(type) {
    if (!type) return 'Denúncia';
    switch(type.toString().toLowerCase()) {
        case 'theft': return 'Furto';
        case 'vandalism': return 'Vandalismo';
        case 'assault': return 'Assalto';
        case 'robbery': return 'Roubo';
        case 'harassment': return 'Assédio';
        default: return type;
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

  /* ── CIDADE (API IBGE) ─────────────────── */
  if (escolherCidade) {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/MG/municipios')
        .then(res => res.json())
        .then(municipios => {
            municipios.sort((a, b) => a.nome.localeCompare(b.nome));
            escolherCidade.innerHTML = '<option value="">Todas as Cidades</option>';
            municipios.forEach(municipio => {
                const option = document.createElement('option');
                option.value = municipio.nome.toLowerCase();
                option.textContent = municipio.nome;
                escolherCidade.appendChild(option);
            });
        })
        .catch(() => {
            escolherCidade.innerHTML = '<option value="">Todas as Cidades</option><option value="belo horizonte">Belo Horizonte</option>';
        });

    escolherCidade.addEventListener('change', () => applyFilters(true));
  }

  /* ── RENDERIZAÇÃO ─────────────────────── */
  function renderResults(denuncias) {
    if (!resultsList) return;
    resultsList.innerHTML = '';
    
    if (resultsCount) {
        resultsCount.textContent = `${denuncias.length} denúncia${denuncias.length !== 1 ? 's' : ''} encontrada${denuncias.length !== 1 ? 's' : ''}`;
    }

    if (denuncias.length === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    denuncias.forEach((d, i) => {
        const card = document.createElement('article');
        card.className = 'report-card';
        card.style.animationDelay = (i * 0.05) + 's';

        const relevancia = translateRelevancy(d.relevancy);
        const prioClass = `report-card__priority--${d.relevancy || 'moderado'}`;
        const titulo = translateType(d.type);
        const dataTexto = new Date(d.date).toLocaleDateString('pt-BR');
        
        const hasCoords = d.location && typeof d.location.lat === 'number' && typeof d.location.lng === 'number';
        const displayLoc = hasCoords ? `${d.location.lat.toFixed(4)}, ${d.location.lng.toFixed(4)}` : 'Local não informado';

        card.innerHTML = `
          <div class="report-card__top">
            <span class="report-card__tag">${titulo}</span>
            <span class="report-card__priority ${prioClass}">${relevancia}</span>
          </div>
          <h3 class="report-card__title">${titulo}</h3>
          <p class="report-card__description">${d.description || ''}</p>
          <div class="report-card__meta">
            <span class="report-card__location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#6a97a3"/><circle cx="12" cy="9" r="2.5" fill="#eef4f6"/></svg>
              <span class="loc-text">${displayLoc}</span>
            </span>
            <span>${dataTexto}</span>
          </div>
        `;

        resultsList.appendChild(card);

        if (hasCoords) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${d.location.lat}&lon=${d.location.lng}`)
                .then(r => r.json())
                .then(data => {
                    if (data && data.address) {
                        const a = data.address;
                        const city = a.city || a.town || a.village || '';
                        const neighborhood = a.neighbourhood || a.suburb || '';
                        if (city) {
                            card.querySelector('.loc-text').textContent = neighborhood ? `${neighborhood}, ${city}` : city;
                        }
                    }
                })
                .catch(() => {});
        }
    });
  }

  /* ── FILTRAGEM ────────────────────────── */
  function applyFilters(updateUrl = true) {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Filtros do Painel Lateral
    const typeField = $('#tipoDenuncia');
    const typeFilter = typeField ? typeField.value.trim().toLowerCase() : '';
    
    const relevancyField = $('#relevancia');
    const relevancyFilter = relevancyField ? relevancyField.value : '';
    
    const dataInicioField = $('#dataInicio');
    const dataFimField = $('#dataFim');
    const dataInicio = dataInicioField ? dataInicioField.value : '';
    const dataFim = dataFimField ? dataFimField.value : '';
    
    const witnessesField = $('#testemunhas');
    const witnessesFilter = witnessesField ? parseInt(witnessesField.value, 10) : NaN;

    if (updateUrl) {
        const url = new URL(window.location);
        if (searchTerm) url.searchParams.set('search', searchTerm);
        else url.searchParams.delete('search');
        window.history.pushState({}, '', url);
    }

    filteredDenuncias = allDenuncias.filter(d => {
        const translatedType = translateType(d.type).toLowerCase();
        const matchesSearch = !searchTerm || 
                             (d.description && d.description.toLowerCase().includes(searchTerm)) || 
                             translatedType.includes(searchTerm);
        
        const matchesType = !typeFilter || translatedType.includes(typeFilter) || d.type.toLowerCase().includes(typeFilter);
        const matchesRelevancy = !relevancyFilter || d.relevancy === relevancyFilter;
        
        let matchesDate = true;
        if (dataInicio && d.date < dataInicio) matchesDate = false;
        if (dataFim && d.date > dataFim) matchesDate = false;
        
        const matchesWitnesses = isNaN(witnessesFilter) || (d.witness_count || 0) >= witnessesFilter;

        return matchesSearch && matchesType && matchesRelevancy && matchesDate && matchesWitnesses;
    });

    if (sortSelect) {
        sortResults(sortSelect.value);
    } else {
        renderResults(filteredDenuncias);
    }
  }

  function sortResults(sortType) {
    const sorted = [...filteredDenuncias];
    switch(sortType) {
        case 'recente':
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'urgente':
            const prio = { urgent: 0, high: 1, moderate: 2, low: 3, informative: 4 };
            sorted.sort((a, b) => (prio[a.relevancy] ?? 9) - (prio[b.relevancy] ?? 9));
            break;
        case 'az':
            sorted.sort((a, b) => translateType(a.type).localeCompare(translateType(b.type)));
            break;
    }
    renderResults(sorted);
  }

  /* ── EVENT LISTENERS ──────────────────── */
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('is-open');
    });
  }

  if (filterCloseBtn) {
    filterCloseBtn.addEventListener('click', () => {
        filterPanel.classList.remove('is-open');
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => applyFilters(true));
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyFilters(true);
    });
  }

  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters(true);
        if (window.innerWidth <= 860) filterPanel.classList.remove('is-open');
    });

    filterForm.addEventListener('reset', () => {
        setTimeout(() => applyFilters(true), 10);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        sortResults(e.target.value);
    });
  }

  /* ── INICIALIZAÇÃO ────────────────────── */
  async function init() {
    try {
        const resp = await fetch('http://localhost:3000/denuncias');
        if (!resp.ok) throw new Error('Falha ao carregar dados');
        
        allDenuncias = await resp.json();
        
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        
        if (searchParam && searchInput) {
            searchInput.value = searchParam;
        }

        applyFilters(false);
        
    } catch (err) {
        console.error(err);
        if (resultsList) {
            resultsList.innerHTML = `<div class="alert alert-danger w-100">Erro ao carregar denúncias. Verifique se o servidor está rodando (json-server --watch db.json).</div>`;
        }
    }
  }

  init();

})();
