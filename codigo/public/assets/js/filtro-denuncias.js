/* ─────────────────────────────────────────
   filtro-denuncias.js  -  Vigilare
   ───────────────────────────────────────── */

(function () {
  'use strict';

  /* HELPERS */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* LOCATION DROPDOWN
     O <ul> agora e filho do .searchbar__location-wrap, nao do <button> */
  const locationBtn      = $('#locationBtn');
  const locationLabel    = $('#locationLabel');
  const locationDropdown = $('#locationDropdown');

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
      $$('li', locationDropdown).forEach(function (i) { i.classList.remove('is-selected'); });
      item.classList.add('is-selected');
      locationLabel.textContent = item.dataset.value;
      closeDropdown();
    });
  });

  /* Fecha ao clicar fora */
  document.addEventListener('click', closeDropdown);

  /* Fecha com Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDropdown();
  });

  /* FILTER TOGGLE */
  var filterToggleBtn = $('#filterToggleBtn');
  var filterPanel     = $('#filterPanel');

  filterToggleBtn.addEventListener('click', function () {
    var isActive = filterToggleBtn.classList.toggle('is-active');
    filterToggleBtn.setAttribute('aria-expanded', String(isActive));
    if (isActive) {
      filterPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* DATE RANGE PLACEHOLDER */
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

  /* TOAST */
  function showToast(message, duration) {
    duration = duration || 3000;
    var toast = $('#vigilare-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'vigilare-toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, duration);
  }

  /* SEARCH BUTTON */
  var searchBtn   = $('#searchBtn');
  var searchInput = $('#searchInput');

  searchBtn.addEventListener('click', function () {
    var query = searchInput.value.trim();
    if (!query) {
      searchInput.focus();
      showToast('Digite algo para pesquisar.');
      return;
    }
    showToast('Pesquisando: "' + query + '" ...');
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') searchBtn.click();
  });

  /* FILTER FORM SUBMIT */
  var filterForm = $('#filterForm');

  filterForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var filters = {
      tipo:        $('#tipoDenuncia').value.trim(),
      origem:      $('#origem').value.trim(),
      relevancia:  $('#relevancia').value.trim(),
      dataInicio:  dataInicio.value,
      dataFim:     dataFim.value,
      testemunhas: $('#testemunhas').value.trim(),
      location:    locationLabel.textContent
    };

    var active = Object.values(filters).filter(Boolean).length;

    if (active === 0) {
      showToast('Preencha ao menos um campo para filtrar.');
      return;
    }

    console.log('Filtros aplicados:', filters);
    showToast(active + ' filtro(s) aplicado(s) com sucesso!', 3500);
  });

  /* RESET */
  var resetBtn = $('#resetBtn');

  resetBtn.addEventListener('click', function () {
    dataInicio.value = '';
    dataFim.value    = '';
    dataInicio.max   = '';
    dataFim.min      = '';
    datePlaceholder.classList.remove('is-hidden');
    showToast('Filtros limpos.');
  });

  /* NOTIFICATION */
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

  /* Seleciona Belo Horizonte no dropdown ao iniciar */
  (function initLocation() {
    var first = $('li[data-value="Belo Horizonte, MG"]', locationDropdown);
    if (first) first.classList.add('is-selected');
  })();

})();