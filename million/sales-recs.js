(function () {
  'use strict';
  if (window.__bwSalesRecs) return;
  window.__bwSalesRecs = true;

  var TARGET = 1000000;
  var DEFAULT_DAYS = 100;

  function arNum(n) {
    try {
      return new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 }).format(Math.round(n));
    } catch (e) {
      return String(Math.round(n));
    }
  }

  function readDays() {
    var el = document.getElementById('days');
    if (!el) return DEFAULT_DAYS;
    var v = Number(el.value);
    if (!isFinite(v) || v < 1) return DEFAULT_DAYS;
    return v;
  }

  function dailyNeeded(days) {
    return TARGET / days;
  }

  function txPerDay(ticket, days) {
    if (!ticket || ticket <= 0) return 0;
    return Math.ceil(dailyNeeded(days) / ticket);
  }

  function updateCard(card, days) {
    var input = card.querySelector('[data-sr-ticket]');
    var out = card.querySelector('[data-sr-tx]');
    var dailyOut = card.querySelector('[data-sr-daily]');
    if (!input || !out) return;
    var ticket = Number(input.value);
    if (!isFinite(ticket) || ticket <= 0) {
      out.textContent = '—';
      if (dailyOut) dailyOut.textContent = '—';
      return;
    }
    var daily = dailyNeeded(days);
    var tx = txPerDay(ticket, days);
    out.innerHTML = '<strong>' + arNum(tx) + '</strong> عملية / يوم';
    if (dailyOut) {
      dailyOut.innerHTML = 'المطلوب يومياً: <strong>' + arNum(daily) + '</strong> ر.س';
    }
    var ticketLabel = card.querySelector('[data-sr-ticket-label]');
    if (ticketLabel) ticketLabel.textContent = arNum(ticket) + ' ر.س';
  }

  function refreshAll() {
    var days = readDays();
    var root = document.getElementById('bw-sales-recs');
    if (!root) return;
    var cards = root.querySelectorAll('[data-sr-card]');
    for (var i = 0; i < cards.length; i++) updateCard(cards[i], days);
    var daysHint = root.querySelector('[data-sr-days-hint]');
    if (daysHint) {
      daysHint.textContent = arNum(days) + ' يوماً · ' + arNum(dailyNeeded(days)) + ' ر.س / يوم';
    }
  }

  function bind() {
    var root = document.getElementById('bw-sales-recs');
    if (!root) return;
    root.addEventListener('input', function (e) {
      var t = e.target;
      if (t && t.hasAttribute && t.hasAttribute('data-sr-ticket')) {
        var card = t.closest('[data-sr-card]');
        if (card) updateCard(card, readDays());
      }
    });
    var days = document.getElementById('days');
    if (days) {
      days.addEventListener('input', refreshAll);
      days.addEventListener('change', refreshAll);
    }
    refreshAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
  // Re-bind after SPA nav / late hydration
  setTimeout(bind, 800);
  setTimeout(refreshAll, 1500);
})();
