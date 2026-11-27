/* Cristian Tattoo Los Andes Ink, v5: columnas en movimiento, salas a pantalla completa, filtro y visor de trabajos */
(function () {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Portada: las columnas se mueven solo cuando se ven; botón para pausar
  document.querySelectorAll('[data-loop]').forEach((el) => {
    const btn = el.querySelector('[data-loop-toggle]');
    const s = { seen: true, held: reduce };
    const sync = () => {
      el.classList.toggle('is-running', s.seen && !s.held);
      if (btn) btn.textContent = s.held ? 'Reproducir' : 'Pausar';
    };
    btn?.addEventListener('click', () => { s.held = !s.held; sync(); });
    new IntersectionObserver(([e]) => { s.seen = e.isIntersecting; sync(); }).observe(el);
    sync();
  });

  // Portada: al tocar la tarjeta en el celular cambia de color y muestra las localidades
  const card = document.querySelector('.hero-card');
  card?.addEventListener('click', (e) => { if (!e.target.closest('a, button')) card.classList.toggle('is-lit'); });

  // Salas: al abrir una, el foco va a su título; Escape vuelve al índice
  let opener = null;
  const focusRoom = () => {
    const id = location.hash.slice(1);
    const room = id && document.getElementById(id);
    if (room && room.classList.contains('sheet')) {
      const h = room.querySelector('h2');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      room.scrollTop = 0;
    } else if (opener) {
      opener.focus({ preventScroll: true });
      opener = null;
    }
  };
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', () => {
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if (t && t.classList.contains('sheet') && !a.closest('.sheet')) opener = a;
  }));
  addEventListener('hashchange', focusRoom);
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const lb = document.getElementById('lb');
    if (lb && !lb.hidden) return;
    const id = location.hash.slice(1), room = id && document.getElementById(id);
    if (room && room.classList.contains('sheet')) location.hash = 'indice';
  });
  if (location.hash) focusRoom();

  // Trabajos: filtro por estilo
  const items = [...document.querySelectorAll('.m-item')];
  const works = [...document.querySelectorAll('#masonry .m-item')];
  document.querySelectorAll('.f-chip').forEach((chip, _, all) => chip.addEventListener('click', () => {
    const f = chip.dataset.f;
    all.forEach((c) => c.setAttribute('aria-pressed', c === chip));
    works.forEach((it) => it.classList.toggle('is-out', f !== 'all' && !it.dataset.g.split(' ').includes(f)));
  }));

  // Visor: abre la foto tocada y recorre las visibles
  const lb = document.getElementById('lb'), li = document.getElementById('lbImg');
  if (lb && li) {
    let list = [], pos = 0, last = null;
    const show = (p) => {
      pos = (p + list.length) % list.length;
      const img = list[pos].querySelector('img');
      li.src = img.currentSrc || img.src; li.alt = img.alt;
    };
    const close = () => { lb.hidden = true; last?.focus(); };
    items.forEach((it) => it.addEventListener('click', () => {
      list = [...(it.closest('[data-lb]') || document).querySelectorAll('.m-item')].filter((x) => !x.classList.contains('is-out'));
      last = it; show(list.indexOf(it)); lb.hidden = false;
      document.getElementById('lbClose').focus();
    }));
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', () => show(pos - 1));
    document.getElementById('lbNext').addEventListener('click', () => show(pos + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(pos - 1);
      if (e.key === 'ArrowRight') show(pos + 1);
    });
  }
})();
