/* ─────────────────────────────────────────
   suporte.js – Vigilare
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

  /* ── SUPPORT FORM ─────────────────────── */
  var form      = $('#supportForm');
  var name      = $('#supName');
  var email     = $('#supEmail');
  var category  = $('#supCategory');
  var subject   = $('#supSubject');
  var message   = $('#supMessage');
  var counter   = $('#msgCounter');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, on) {
    if (!field) return;
    field.classList.toggle('is-invalid', on);
    var err = $('[data-error-for="' + field.id + '"]');
    if (err) err.classList.toggle('is-visible', on);
  }

  /* limpa erro ao editar */
  [name, email, category, subject, message].forEach(function (f) {
    if (!f) return;
    var ev = (f.tagName === 'SELECT') ? 'change' : 'input';
    f.addEventListener(ev, function () { setError(f, false); });
  });

  /* contador de caracteres */
  if (message && counter) {
    var updateCounter = function () {
      counter.textContent = message.value.length + ' / 600';
    };
    message.addEventListener('input', updateCounter);
    updateCounter();
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      if (!name.value.trim())                 { setError(name, true);     ok = false; }
      if (!EMAIL_RE.test(email.value.trim()))  { setError(email, true);    ok = false; }
      if (!category.value)                     { setError(category, true); ok = false; }
      if (!subject.value.trim())               { setError(subject, true);  ok = false; }
      if (message.value.trim().length < 10)    { setError(message, true);  ok = false; }

      if (!ok) {
        showToast('Revise os campos destacados.');
        return;
      }

      var protocolo = 'VG-' + Math.floor(100000 + Math.random() * 900000);
      form.reset();
      if (counter) counter.textContent = '0 / 600';
      showToast('Mensagem enviada! Protocolo #' + protocolo + '.', 4500);
      // Aqui entraria a chamada real à API de suporte.
    });
  }

  /* reset limpa erros + contador */
  if (form) {
    form.addEventListener('reset', function () {
      [name, email, category, subject, message].forEach(function (f) { setError(f, false); });
      if (counter) counter.textContent = '0 / 600';
    });
  }

})();