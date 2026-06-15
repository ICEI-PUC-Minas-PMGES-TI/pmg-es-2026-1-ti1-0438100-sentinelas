/* ─────────────────────────────────────────
   excluir-conta.js – Vigilare
   ───────────────────────────────────────── */

(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ── TOAST ────────────────────────────── */
  function showToast(message, duration) {
    duration = duration || 3000;
    var toast = $('#vigilare-toast');
    if (!toast) return;
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

  function closeDropdown() {
    if (!locationDropdown) return;
    locationDropdown.classList.remove('is-open');
    locationBtn.setAttribute('aria-expanded', 'false');
  }

  if (locationBtn && locationDropdown) {
    locationBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = locationDropdown.classList.toggle('is-open');
      locationBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    $$('li', locationDropdown).forEach(function (item) {
      item.addEventListener('click', function () {
        $$('li', locationDropdown).forEach(function (i) { i.classList.remove('is-selected'); });
        item.classList.add('is-selected');
        locationLabel.textContent = item.dataset.value;
        closeDropdown();
        showToast('Localização: ' + item.dataset.value);
      });
    });

    var bh = $('li[data-value="Belo Horizonte, MG"]', locationDropdown);
    if (bh) bh.classList.add('is-selected');

    document.addEventListener('click', closeDropdown);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDropdown();
    });
  }

  /* ── NOTIFICATIONS ────────────────────── */
  var notifBtn   = $('#notifBtn');
  var notifBadge = $('#notifBadge');
  var notifCount = 3;

  if (notifBtn) {
    notifBtn.addEventListener('click', function () {
      if (notifCount > 0) {
        notifCount = 0;
        if (notifBadge) notifBadge.style.display = 'none';
        showToast('Notificações marcadas como lidas.');
      } else {
        showToast('Nenhuma notificação nova.');
      }
    });
  }

  /* ── SEARCH / FILTER (header) ─────────── */
  var searchBtn = $('#searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      showToast('Pesquisa disponível na página de Denúncias.');
    });
  }
  var filterToggleBtn = $('#filterToggleBtn');
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', function () {
      showToast('Filtros disponíveis na página de Denúncias.');
    });
  }

  /* ── DELETE FORM ──────────────────────── */
  var deleteForm = $('#deleteForm');
  var emailInput = $('#emailInput');
  var emailError = $('#emailError');
  var cancelBtn  = $('#cancelBtn');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function clearError() {
    emailInput.classList.remove('is-invalid');
    emailError.classList.remove('is-visible');
  }

  function showError(msg) {
    emailError.textContent = msg;
    emailInput.classList.add('is-invalid');
    emailError.classList.add('is-visible');
    emailInput.focus();
  }

  if (emailInput) emailInput.addEventListener('input', clearError);

  if (deleteForm) {
    deleteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = emailInput.value.trim();

      if (!value) {
        showError('Digite seu e-mail para continuar.');
        return;
      }
      if (!EMAIL_RE.test(value)) {
        showError('Informe um e-mail válido.');
        return;
      }

      clearError();
      showToast('Enviamos um link de confirmação para ' + value + '.', 4000);
      // Aqui entraria a chamada real à API de exclusão.
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        showToast('Ação cancelada.');
      }
    });
  }

})();