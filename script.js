/* =========================================
   CRISTIAN TATTOO — LOS ANDES INK
   Script v2.0 — Professional Redesign
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. CUSTOM CURSOR ───────────────────────────────
    const dot   = document.getElementById('cursorDot');
    const ring  = document.getElementById('cursorRing');
    const chibi = document.getElementById('chibiCursor');
    let mx = 0, my = 0, rx = 0, ry = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        if (dot) {
            dot.style.left  = mx + 'px';
            dot.style.top   = my + 'px';
        }
    });

    const lerpCursor = () => {
        // Ring follow
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        if (ring) {
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
        }

        requestAnimationFrame(lerpCursor);
    };
    lerpCursor();

    document.querySelectorAll('a, button, .care-tab, .star, .gallery-item').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });


    // ─── 2. NAVBAR SCROLL ───────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });


    // ─── 3. HAMBURGER MENU ──────────────────────────────
    const hamburger   = document.getElementById('hamburger');
    const mobileMenu  = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.mob-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    // ─── 4. HERO CANVAS — PARTICLE INK ──────────────────
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        const resize = () => {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x  = Math.random() * W;
                this.y  = Math.random() * H;
                this.r  = Math.random() * 1.5 + 0.3;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.a  = Math.random() * 0.4 + 0.05;
                this.c  = Math.random() > 0.5
                    ? `rgba(112,0,255,${this.a})`
                    : `rgba(200,0,176,${this.a})`;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = this.c;
                ctx.fill();
            }
        }

        const COUNT = window.innerWidth < 768 ? 50 : 120;
        for (let i = 0; i < COUNT; i++) particles.push(new Particle());

        // Draw connecting lines between nearby particles
        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(112,0,255,${0.07 * (1 - dist/80)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            requestAnimationFrame(animate);
        };
        animate();
    }


    // ─── 5. SCROLL REVEAL ───────────────────────────────
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const observer  = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));


    // ─── 6. STATS COUNTER ───────────────────────────────
    const statNums   = document.querySelectorAll('.stat-num');
    let   counted    = false;
    const countStats = () => {
        if (counted) return;
        statNums.forEach(el => {
            const target = parseInt(el.dataset.target);
            const step   = target / 60;
            let   cur    = 0;
            const timer  = setInterval(() => {
                cur += step;
                if (cur >= target) { cur = target; clearInterval(timer); }
                el.textContent = Math.floor(cur);
            }, 16);
        });
        counted = true;
    };

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { countStats(); statsObs.disconnect(); }
        }, { threshold: 0.5 });
        statsObs.observe(statsSection);
    }


    // ─── 7. CARE SECTION TABS ───────────────────────────
    const tabs   = document.querySelectorAll('.care-tab');
    const panels = document.querySelectorAll('.care-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector(`[data-panel="${tab.dataset.tab}"]`)?.classList.add('active');
        });
    });


    // ─── 8. STAR RATING MODAL ───────────────────────────
    const stars     = document.querySelectorAll('.star');
    const puntInput = document.getElementById('puntuacion');

    stars.forEach((star, i) => {
        star.addEventListener('click', () => {
            if (puntInput) puntInput.value = i + 1;
            stars.forEach((s, j) => s.classList.toggle('active', j <= i));
        });
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, j) => s.classList.toggle('active', j <= i));
        });
    });
    document.querySelector('.star-rating')?.addEventListener('mouseleave', () => {
        const val = parseInt(puntInput?.value || 5);
        stars.forEach((s, j) => s.classList.toggle('active', j < val));
    });


    // ─── 9. REVIEW MODAL ────────────────────────────────
    const modal       = document.getElementById('reviewModal');
    const btnOpen     = document.getElementById('btnOpenReview');
    const btnClose    = document.getElementById('closeModal');
    const revSuccess  = document.getElementById('revSuccess');
    const reviewForm  = document.getElementById('reviewForm');

    const openModal  = () => { modal.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        revSuccess?.classList.add('hidden');
        reviewForm?.reset();
        stars.forEach(s => s.classList.add('active'));
        if (puntInput) puntInput.value = 5;
    };

    btnOpen?.addEventListener('click', openModal);
    btnClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal(); });

    reviewForm?.addEventListener('submit', e => {
        e.preventDefault();
        revSuccess?.classList.remove('hidden');
        console.log('Reseña enviada:', {
            nombre: document.getElementById('revNombre')?.value,
            experiencia: document.getElementById('revExperiencia')?.value,
            puntuacion: puntInput?.value
        });
        setTimeout(closeModal, 4000);
    });


    // ─── 10. BOOKING FORM (Netlify AJAX) ─────────────────
    const bookingForm    = document.getElementById('bookingForm');
    const bookingSuccess = document.getElementById('bookingSuccess');

    bookingForm?.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(bookingForm);
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(() => {
            bookingSuccess?.classList.remove('hidden');
            bookingForm.reset();
            setTimeout(() => bookingSuccess?.classList.add('hidden'), 6000);
        })
        .catch(() => alert('Hubo un error al enviar. Por favor, intenta de nuevo o escríbeme por WhatsApp.'));
    });

    // ─── 11. PROMO MODAL ────────────────────────────────
    const promoModal = document.getElementById('promoModal');
    const closePromo = document.getElementById('closePromo');

    if (promoModal) {
        // Show after 2.5 seconds if not already closed in this session
        if (!sessionStorage.getItem('promoClosed')) {
            setTimeout(() => {
                promoModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }, 2500);
        }

        const closePromoModal = () => {
            promoModal.classList.remove('open');
            document.body.style.overflow = '';
            sessionStorage.setItem('promoClosed', 'true');
        };

        closePromo?.addEventListener('click', closePromoModal);
        promoModal.addEventListener('click', e => { if (e.target === promoModal) closePromoModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && promoModal.classList.contains('open')) closePromoModal(); });
    }

});
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('portafolio');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (!grid || typeof portafolioData === 'undefined') return;

    // 1. Pintar todas las fotos del portafolio automáticamente
    portafolioData.forEach(item => {
        const card = document.createElement('div');
        card.className = `portafolio-item ${item.category.toLowerCase().replace(' ', '-')}`;
        card.innerHTML = `
            <div class="portafolio-wrapper">
                <img src="${item.src}" alt="Tatuaje ${item.category}" loading="lazy">
                <div class="portafolio-overlay">
                    <span>${item.category}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // 2. Hacer funcionar los botones de filtros (Realismo, Blackwork, etc)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            const items = document.querySelectorAll('.portafolio-item');

            items.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});


