/* ─────────────────────────────────────────
   filtro-denuncias.js  –  Vigilare
   ───────────────────────────────────────── */

(function () {
  'use strict';

  /* ── HELPERS ──────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ── TOAST ────────────────────────────── */
  function showToast(message, duration) {
    duration = duration || 3000;
    var toast = $('#vigilare-toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, duration);
  }

  /* ── LOCATION DROPDOWN ────────────────── */
  var locationBtn      = $('#locationBtn');
  var locationLabel    = $('#locationLabel');
  var locationDropdown = $('#locationDropdown');

  function openDropdown() {
    locationDropdown.classList.add('is-open');
    locationBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown() {
    locationDropdown.classList.remove('is-open');
    locationBtn.setAttribute('aria-expanded', 'false');
  }

  locationBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    locationDropdown.classList.contains('is-open') ? closeDropdown() : openDropdown();
  });

  $$('li', locationDropdown).forEach(function (item) {
    item.addEventListener('click', function () {
      $$('li', locationDropdown).forEach(function (i) {
        i.classList.remove('is-selected');
      });
      item.classList.add('is-selected');
      locationLabel.textContent = item.dataset.value;
      closeDropdown();
      showToast('Localização: ' + item.dataset.value);
    });
  });

  document.addEventListener('click', closeDropdown);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDropdown();
  });

  /* Seleciona BH por padrão */
  (function initLocation() {
    var first = $('li[data-value="Belo Horizonte, MG"]', locationDropdown);
    if (first) first.classList.add('is-selected');
  })();

  /* ── FILTER PANEL TOGGLE (mobile) ─────── */
  var filterToggleBtn = $('#filterToggleBtn');
  var filterCloseBtn  = $('#filterCloseBtn');
  var filterPanel     = $('#filterPanel');

  function openFilterPanel() {
    filterPanel.classList.add('is-open');
    filterToggleBtn.classList.add('is-active');
    filterToggleBtn.setAttribute('aria-expanded', 'true');
    filterPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeFilterPanel() {
    filterPanel.classList.remove('is-open');
    filterToggleBtn.classList.remove('is-active');
    filterToggleBtn.setAttribute('aria-expanded', 'false');
  }

  filterToggleBtn.addEventListener('click', function () {
    filterPanel.classList.contains('is-open') ? closeFilterPanel() : openFilterPanel();
  });

  if (filterCloseBtn) {
    filterCloseBtn.addEventListener('click', closeFilterPanel);
  }

  /* ── DATE RANGE ───────────────────────── */
  var dataInicio      = $('#dataInicio');
  var dataFim         = $('#dataFim');
  var datePlaceholder = $('#datePlaceholder');

  function updateDatePlaceholder() {
    var start = dataInicio.value;
    var end   = dataFim.value;

    if (start || end) {
      datePlaceholder.classList.add('is-hidden');
      if (start) dataFim.min    = start;
      if (end)   dataInicio.max = end;
    } else {
      datePlaceholder.classList.remove('is-hidden');
    }
  }

  dataInicio.addEventListener('change', updateDatePlaceholder);
  dataFim.addEventListener('change',   updateDatePlaceholder);

  /* ── SEARCH ───────────────────────────── */
  var searchBtn   = $('#searchBtn');
  var searchInput = $('#searchInput');

  searchBtn.addEventListener('click', function () {
    var query = searchInput.value.trim();
    if (!query) {
      searchInput.focus();
      showToast('Digite algo para pesquisar.');
      return;
    }
    performSearch(query);
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') searchBtn.click();
  });

  /* Busca sobre os cards existentes (client-side) */
  function performSearch(query) {
    var cards  = $$('.report-card', $('#resultsList'));
    var lower  = query.toLowerCase();
    var visible = 0;

    cards.forEach(function (card) {
      var text = card.textContent.toLowerCase();
      var match = text.includes(lower);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    updateCount(visible);
    toggleEmpty(visible === 0);
    showToast('Pesquisando: "' + query + '" — ' + visible + ' resultado(s)');
  }

  /* ── FILTER FORM ──────────────────────── */
  var filterForm   = $('#filterForm');
  var resetBtn     = $('#resetBtn');
  var resultsList  = $('#resultsList');
  var emptyState   = $('#emptyState');
  var resultsCount = $('#resultsCount');
  var allCards     = $$('.report-card', resultsList);

  filterForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var filters = {
      tipo:        $('#tipoDenuncia').value.trim().toLowerCase(),
      origem:      $('#origem').value.trim().toLowerCase(),
      relevancia:  $('#relevancia').value.trim().toLowerCase(),
      dataInicio:  dataInicio.value,
      dataFim:     dataFim.value,
      testemunhas: parseInt($('#testemunhas').value, 10)
    };

    var active = Object.values(filters).filter(function (v) {
      return v !== '' && v !== '' && !isNaN(v) ? true : typeof v === 'string' && v !== '';
    }).length;

    /* Verifica se ao menos um campo preenchido */
    var hasFilter = filters.tipo || filters.origem || filters.relevancia ||
                    filters.dataInicio || filters.dataFim || !isNaN(filters.testemunhas);

    if (!hasFilter) {
      showToast('Preencha ao menos um campo para filtrar.');
      return;
    }

    var visible = 0;

    allCards.forEach(function (card) {
      var show = true;

      /* Tipo */
      if (filters.tipo) {
        var cardType = (card.dataset.type || '').toLowerCase();
        if (!cardType.includes(filters.tipo)) show = false;
      }

      /* Origem */
      if (show && filters.origem) {
        var cardLoc = (card.dataset.location || '').toLowerCase();
        if (!cardLoc.includes(filters.origem)) show = false;
      }

      /* Relevância */
      if (show && filters.relevancia) {
        var cardPrio = (card.dataset.priority || '').toLowerCase();
        if (!cardPrio.includes(filters.relevancia)) show = false;
      }

      /* Data */
      if (show && filters.dataInicio) {
        if (card.dataset.date < filters.dataInicio) show = false;
      }
      if (show && filters.dataFim) {
        if (card.dataset.date > filters.dataFim) show = false;
      }

      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    updateCount(visible);
    toggleEmpty(visible === 0);

    var count = Object.values(filters).filter(Boolean).length;
    showToast(visible + ' denúncia(s) encontrada(s).', 3500);
  });

  /* ── RESET ────────────────────────────── */
  resetBtn.addEventListener('click', function () {
    dataInicio.value = '';
    dataFim.value    = '';
    dataInicio.max   = '';
    dataFim.min      = '';
    datePlaceholder.classList.remove('is-hidden');
    searchInput.value = '';

    allCards.forEach(function (card) { card.style.display = ''; });
    updateCount(allCards.length);
    toggleEmpty(false);
    showToast('Filtros limpos.');
  });

  /* ── SORT ─────────────────────────────── */
  var sortSelect = $('#sortSelect');

  sortSelect.addEventListener('change', function () {
    var value  = sortSelect.value;
    var list   = resultsList;
    var cards  = $$('.report-card', list);

    cards.sort(function (a, b) {
      if (value === 'recente') {
        return (b.dataset.date || '').localeCompare(a.dataset.date || '');
      }
      if (value === 'urgente') {
        var order = { urgente: 0, moderado: 1, leve: 2 };
        return (order[a.dataset.priority] || 9) - (order[b.dataset.priority] || 9);
      }
      if (value === 'az') {
        var ta = ($('.report-card__title', a) || {}).textContent || '';
        var tb = ($('.report-card__title', b) || {}).textContent || '';
        return ta.localeCompare(tb, 'pt-BR');
      }
      return 0;
    });

    cards.forEach(function (c) { list.appendChild(c); });
  });

  /* ── NOTIFICATIONS ────────────────────── */
  var notifBtn   = $('#notifBtn');
  var notifBadge = $('#notifBadge');
  var notifCount = 3;

  notifBtn.addEventListener('click', function () {
    if (notifCount > 0) {
      notifCount = 0;
      notifBadge.style.display = 'none';
      showToast('Notificações marcadas como lidas.');
    } else {
      showToast('Nenhuma notificação nova.');
    }
  });

  /* ── CARD CLICK (expansão simples) ────── */
  $$('.report-card', resultsList).forEach(function (card) {
    card.addEventListener('click', function () {
      var title = ($('.report-card__title', card) || {}).textContent || 'Denúncia';
      showToast('Abrindo: ' + title);
    });
  });

  /* ── HELPERS INTERNOS ─────────────────── */
  function updateCount(n) {
    if (resultsCount) {
      resultsCount.textContent = n + ' denúncia' + (n !== 1 ? 's' : '') + ' encontrada' + (n !== 1 ? 's' : '');
    }
  }

  function toggleEmpty(show) {
    if (emptyState) {
      emptyState.style.display = show ? 'flex' : 'none';
    }
  }

  /* ── STAGGERED CARD ANIMATION ─────────── */
  $$('.report-card', resultsList).forEach(function (card, i) {
    card.style.animationDelay = (i * 0.07) + 's';
  });

})();