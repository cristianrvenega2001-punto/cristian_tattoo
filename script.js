/* =========================================
   CRISTIAN TATTOO — LOS ANDES INK
   script.js v3 — Rediseño octubre 2026
   ========================================= */
(function () {
    'use strict';

    const $ = id => document.getElementById(id);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── 1. FONDO DE ESTRELLAS NEÓN ─────────────────────
    const sky = $('sky');
    if (sky) {
        const x = sky.getContext('2d');
        const cols = ['#b44dff', '#ff3fb4', '#ffd21f', '#3fe8ff', '#efe7d6'];
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let W, H, stars = [], shots = [];
        const size = () => {
            W = sky.width = innerWidth * dpr;
            H = sky.height = innerHeight * dpr;
            stars = Array.from({ length: Math.round(innerWidth * innerHeight / 5000) }, () => ({
                x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.4 + .4) * dpr,
                c: cols[Math.random() * cols.length | 0], p: Math.random() * 6.28, s: .6 + Math.random() * 1.6
            }));
        };
        const shot = () => {
            const a = Math.PI * (.15 + Math.random() * .15);
            shots.push({ x: Math.random() * W * .8, y: Math.random() * H * .4, vx: Math.cos(a) * 14 * dpr, vy: Math.sin(a) * 14 * dpr, life: 1, c: cols[Math.random() * 4 | 0] });
        };
        const draw = t => {
            x.clearRect(0, 0, W, H);
            for (const s of stars) {
                x.globalAlpha = reduce ? .8 : .35 + .65 * Math.abs(Math.sin(t / 1000 * s.s + s.p));
                x.fillStyle = s.c; x.shadowColor = s.c; x.shadowBlur = 8 * dpr;
                x.beginPath(); x.arc(s.x, s.y, s.r, 0, 6.28); x.fill();
            }
            if (!reduce) {
                if (Math.random() < .012) shot();
                shots = shots.filter(s => s.life > 0);
                for (const s of shots) {
                    const g = x.createLinearGradient(s.x, s.y, s.x - s.vx * 9, s.y - s.vy * 9);
                    g.addColorStop(0, s.c); g.addColorStop(1, 'transparent');
                    x.globalAlpha = s.life; x.strokeStyle = g; x.shadowColor = s.c; x.shadowBlur = 14 * dpr; x.lineWidth = 2.2 * dpr;
                    x.beginPath(); x.moveTo(s.x, s.y); x.lineTo(s.x - s.vx * 9, s.y - s.vy * 9); x.stroke();
                    s.x += s.vx; s.y += s.vy; s.life -= .012;
                }
            }
            x.globalAlpha = 1; x.shadowBlur = 0;
            if (!reduce) requestAnimationFrame(draw);
        };
        addEventListener('resize', size);
        size();
        requestAnimationFrame(draw);
    }

    // ─── 2. MENÚ DEL CELULAR ────────────────────────────
    const menuBtn = $('menuBtn'), menu = $('menu');
    if (menuBtn && menu) {
        const setMenu = open => { menu.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); };
        menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
        menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    }

    // ─── 3. PROMO DE HALLOWEEN (se oculta sola después del 31-oct) ─
    if (new Date() > new Date('2026-11-01T00:00:00-03:00')) {
        $('halloween')?.remove();
        document.querySelectorAll('.hw-link').forEach(a => a.remove());
    }

    // ─── 4. PORTAFOLIO POR ESTILO + GALERÍA ─────────────
    const data = JSON.parse($('portafolio')?.textContent || '{"img":[],"groups":[]}');
    const gal = $('gal'), gi = $('galImg'), th = $('galThumbs');
    let cur = null, pos = 0, lastBtn = null;

    const show = p => {
        pos = (p + cur.i.length) % cur.i.length;
        const im = data.img[cur.i[pos]];
        gi.src = im.s;
        gi.alt = im.a;
        $('galCount').textContent = (pos + 1) + ' / ' + cur.i.length;
        th.querySelectorAll('button').forEach((t, j) => {
            t.setAttribute('aria-current', j === pos);
            if (j === pos) t.scrollIntoView({ block: 'nearest', inline: 'center' });
        });
    };
    const openGal = k => {
        cur = data.groups[k];
        $('galTitle').textContent = cur.n;
        th.innerHTML = '';
        cur.i.forEach((ix, j) => {
            const t = document.createElement('button');
            t.type = 'button';
            t.setAttribute('aria-label', 'Foto ' + (j + 1));
            const img = document.createElement('img');
            img.src = data.img[ix].s; img.alt = ''; img.loading = 'lazy';
            t.appendChild(img);
            t.addEventListener('click', () => show(j));
            th.appendChild(t);
        });
        gal.hidden = false;
        document.body.style.overflow = 'hidden';
        show(0);
        $('galClose').focus();
    };
    const closeGal = () => { gal.hidden = true; document.body.style.overflow = ''; lastBtn?.focus(); };

    document.querySelectorAll('.scard').forEach(b => b.addEventListener('click', () => { lastBtn = b; openGal(+b.dataset.style); }));
    if (gal) {
        $('galClose').addEventListener('click', closeGal);
        $('galPrev').addEventListener('click', () => show(pos - 1));
        $('galNext').addEventListener('click', () => show(pos + 1));
        gi.addEventListener('click', () => show(pos + 1));
        let sx = null;
        gi.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
        gi.addEventListener('touchend', e => {
            if (sx === null) return;
            const dx = e.changedTouches[0].clientX - sx;
            if (Math.abs(dx) > 40) show(pos + (dx < 0 ? 1 : -1));
            sx = null;
        });
    }

    // ─── 5. GUÍA DE CUIDADOS (pestañas) ─────────────────
    const tabs = document.querySelectorAll('.tabs .chip');
    tabs.forEach(b => b.addEventListener('click', () => {
        tabs.forEach(o => o.setAttribute('aria-selected', o === b));
        ['antes', 'despues', 'infeccion'].forEach(p => { $('p-' + p).hidden = p !== b.dataset.p; });
    }));

    // ─── 6. ENVÍO A NETLIFY FORMS ───────────────────────
    const send = form => fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
    });

    // Reserva rápida: llega a Netlify y además abre WhatsApp con el resumen
    const booking = $('bookingForm');
    booking?.addEventListener('submit', async e => {
        e.preventDefault();
        const v = id => $(id).value.trim();
        try { await send(booking); } catch (err) { console.warn('Netlify form error:', err); }
        const fecha = v('resFecha');
        const fechaFmt = fecha ? new Date(fecha).toLocaleString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : '';
        const msg = encodeURIComponent(`Hola Cristian! Acabo de reservar desde tu página web 🎨\n\n👤 Nombre: ${v('resNombre')}\n📱 WhatsApp: ${v('resWhatsApp')}\n📅 Fecha deseada: ${fechaFmt}\n✏️ Idea: ${v('resDetalles')}\n\nQuedo atento/a a tu confirmación!`);
        window.open(`https://wa.me/56987383781?text=${msg}`, '_blank', 'noopener,noreferrer');
        booking.hidden = true;
        $('bookingSuccess').hidden = false;
    });

    // Reseñas
    const modal = $('reviewModal'), review = $('reviewForm');
    const closeReview = () => { modal.hidden = true; document.body.style.overflow = ''; };
    $('btnOpenReview')?.addEventListener('click', () => { modal.hidden = false; document.body.style.overflow = 'hidden'; $('revNombre').focus(); });
    $('closeReview')?.addEventListener('click', closeReview);
    modal?.addEventListener('click', e => { if (e.target === modal) closeReview(); });
    review?.addEventListener('submit', e => {
        e.preventDefault();
        send(review)
            .then(() => { review.hidden = true; $('revSuccess').hidden = false; setTimeout(closeReview, 4000); })
            .catch(() => alert('Hubo un error al enviar. Por favor, intenta de nuevo o escríbeme por WhatsApp.'));
    });

    // ─── 7. TECLADO: ESC cierra, flechas en la galería ──
    addEventListener('keydown', e => {
        if (gal && !gal.hidden) {
            if (e.key === 'Escape') closeGal();
            if (e.key === 'ArrowRight') show(pos + 1);
            if (e.key === 'ArrowLeft') show(pos - 1);
        } else if (modal && !modal.hidden && e.key === 'Escape') {
            closeReview();
        }
    });

    // ─── 8. CORREO (se arma al cargar, no queda escrito en el HTML) ─
    document.querySelectorAll('.js-mail').forEach(a => {
        const mail = `${a.dataset.u}@${a.dataset.d}`;
        a.href = `mailto:${mail}`;
        a.textContent = mail;
    });
})();
