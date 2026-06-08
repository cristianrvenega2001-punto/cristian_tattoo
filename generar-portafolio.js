/**
 * ============================================================
 * GENERADOR AUTOMÁTICO DE PORTAFOLIO — Cristian Tattoo
 * ============================================================
 * USO: node generar-portafolio.js
 *
 * Ejecutar desde la carpeta raíz del proyecto:
 * cd usuarios/usuario/.gemini/antigravity/scratch/cristian_tattoo
 * node generar-portafolio.js
 * ============================================================
 */

const fs   = require('fs');
const path = require('path');

// ── Configuración ──────────────────────────────────────────
const PORTAFOLIO_DIR  = path.join(__dirname, 'assets', 'portafolio');
const OUTPUT_DATA     = path.join(__dirname, 'portafolio-data.js');
const OUTPUT_HTML_SEC = path.join(__dirname, 'portafolio-section.html');

// Extensiones de imagen aceptadas
const IMG_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

// Estilos para etiquetar las imágenes automáticamente
// Edita este mapa si quieres cambiar los nombres según el nombre del archivo
// Ejemplo: si el archivo se llama "blackwork-001.jpg" detecta "Blackwork"
const STYLE_KEYWORDS = {
  blackwork:       'Blackwork',
  realismo:        'Realismo',
  fineline:        'Fine Line',
  'fine-line':     'Fine Line',
  'fine_line':     'Fine Line',
  color:           'Full Color',
  watercolor:      'Watercolor',
  geometrico:      'Geométrico',
  tribal:          'Tribal',
  lettering:       'Lettering',
  tradicional:     'Tradicional',
  neotradicional:  'Neo Tradicional',
  negrogris:       'Negro y Gris',
  'negro-gris':    'Negro y Gris',
  retratos:        'Realismo',
};

// ── Utilidades ─────────────────────────────────────────────
function detectStyle(filename) {
  const lower = filename.toLowerCase();
  for (const [key, label] of Object.entries(STYLE_KEYWORDS)) {
    if (lower.includes(key)) return label;
  }
  return null;
}

function formatName(filename) {
  return path.basename(filename, path.extname(filename))
    .replace(/[-_]/g, ' ')
    .replace(/\d+/g, '')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase()) || 'Tatuaje';
}

// ── Escanear carpeta ────────────────────────────────────────
console.log('\n🔍  Escaneando carpeta:', PORTAFOLIO_DIR);

if (!fs.existsSync(PORTAFOLIO_DIR)) {
  console.error('❌  La carpeta assets/portafolio no existe.');
  console.error('    Crea la carpeta y coloca tus imágenes ahí.');
  process.exit(1);
}

const allFiles = fs.readdirSync(PORTAFOLIO_DIR);
const images   = allFiles
  .filter(f => IMG_EXTS.includes(path.extname(f).toLowerCase()))
  .sort(); // orden alfabético

if (images.length === 0) {
  console.error('❌  No se encontraron imágenes en assets/portafolio/');
  console.error('    Formatos aceptados:', IMG_EXTS.join(', '));
  process.exit(1);
}

console.log(`✅  ${images.length} imágenes encontradas.\n`);

// ── Construir datos ─────────────────────────────────────────
const portfolioData = images.map((file, i) => {
  const style = detectStyle(file);
  const name  = formatName(file);
  const src   = `assets/portafolio/${file}`;

  console.log(`   [${String(i+1).padStart(2,'0')}] ${file}${style ? ' → ' + style : ''}`);

  return { src, name, style, index: i + 1 };
});

// ── Generar portafolio-data.js ──────────────────────────────
const dataJs = `// GENERADO AUTOMÁTICAMENTE por generar-portafolio.js
// No editar manualmente — volver a ejecutar el script si cambias imágenes.
// Total: ${portfolioData.length} imágenes · Generado: ${new Date().toLocaleString('es-CL')}

const PORTAFOLIO_DATA = ${JSON.stringify(portfolioData, null, 2)};
`;

fs.writeFileSync(OUTPUT_DATA, dataJs, 'utf8');
console.log(`\n📄  portafolio-data.js generado con ${portfolioData.length} imágenes.`);

// ── Generar HTML de la sección portafolio ───────────────────
const htmlSection = `<!-- ============================================================
     SECCIÓN PORTAFOLIO — Cristian Tattoo Los Andes Ink
     Generado automáticamente por generar-portafolio.js
     ${new Date().toLocaleString('es-CL')} · ${portfolioData.length} imágenes
     ============================================================ -->

<!-- Estilos de la sección -->
<style>
#portafolio {
  padding: 90px 24px;
}
.portfolio-wrap {
  max-width: 980px;
  margin: 0 auto;
  text-align: center;
}
.portfolio-ig-row {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 420px;
  margin: 36px auto;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 16px;
  padding: 14px 18px;
  text-align: left;
}
.ig-av {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.14);
  flex-shrink: 0;
}
.ig-av img { width: 100%; height: 100%; object-fit: cover; }
.ig-info strong { display: block; font-size: 14px; font-weight: 700; color: #fff; }
.ig-info span   { font-size: 12px; color: rgba(255,255,255,0.45); }
.ig-follow {
  margin-left: auto;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background .2s;
}
.ig-follow:hover { background: rgba(255,255,255,0.14); }

/* Filtros de estilo */
.portfolio-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 28px;
}
.pf-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.10);
  color: rgba(255,255,255,0.55);
  font-size: 12px;
  font-weight: 600;
  padding: 7px 16px;
  border-radius: 100px;
  cursor: pointer;
  transition: all .2s;
  font-family: inherit;
}
.pf-btn:hover { background: rgba(255,255,255,0.09); color: #fff; }
.pf-btn.active {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.3);
  color: #fff;
}

/* Grid de fotos */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 36px;
}
@media (max-width: 600px) {
  .portfolio-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 360px) {
  .portfolio-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
}
.portfolio-item {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  cursor: pointer;
}
.portfolio-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .4s cubic-bezier(.25,.46,.45,.94);
}
.portfolio-item:hover img { transform: scale(1.07); }
.portfolio-item-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0);
  display: flex;
  align-items: flex-end;
  padding: 12px;
  transition: background .25s;
}
.portfolio-item:hover .portfolio-item-overlay {
  background: rgba(0,0,0,0.5);
}
.portfolio-item-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #fff;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  padding: 4px 10px;
  opacity: 0;
  transform: translateY(4px);
  transition: all .25s;
}
.portfolio-item:hover .portfolio-item-label {
  opacity: 1;
  transform: translateY(0);
}
.portfolio-item.hidden { display: none; }

/* Lightbox */
.portfolio-lightbox {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.portfolio-lightbox.open { display: flex; }
.lb-inner {
  max-width: 860px;
  width: 100%;
  position: relative;
}
.lb-img {
  width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  display: block;
}
.lb-caption {
  text-align: center;
  margin-top: 14px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.65);
}
.lb-close {
  position: absolute;
  top: -16px;
  right: -16px;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background .2s;
}
.lb-close:hover { background: rgba(255,255,255,0.2); }
.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 50%;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .2s;
}
.lb-nav:hover { background: rgba(255,255,255,0.16); }
.lb-prev { left: -60px; }
.lb-next { right: -60px; }
@media (max-width: 680px) {
  .lb-prev { left: 8px; }
  .lb-next { right: 8px; }
}

/* Botones ver más */
.portfolio-cta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
.portfolio-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.13);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 13px 24px;
  border-radius: 10px;
  text-decoration: none;
  transition: background .2s, transform .2s;
  font-family: inherit;
  cursor: pointer;
}
.portfolio-cta-btn:hover { background: rgba(255,255,255,0.13); transform: translateY(-2px); }
</style>

<!-- ── HTML de la sección ─────────────────────────────────── -->
<section id="portafolio">
  <div class="portfolio-wrap">

    <p class="section-label">Mis trabajos reales</p>
    <h2 class="section-title">Portafolio</h2>
    <p class="section-desc">${portfolioData.length} diseños reales, realizados a domicilio en Los Andes.</p>

    <!-- Perfil Instagram -->
    <div class="portfolio-ig-row">
      <div class="ig-av">
        <img src="cristiantattoolosandesink.jpg"
             alt="Cristian Tattoo Los Andes Ink"
             loading="lazy">
      </div>
      <div class="ig-info">
        <strong>@cristiantattoolosandesink</strong>
        <span>Tatuador profesional · Los Andes, Chile</span>
      </div>
      <a href="https://www.instagram.com/cristiantattoolosandesink/"
         class="ig-follow"
         target="_blank" rel="noopener noreferrer">Seguir</a>
    </div>

    <!-- Filtros -->
    <div class="portfolio-filters" id="portfolioFilters">
      <button class="pf-btn active" data-filter="all">Todos (${portfolioData.length})</button>
      ${[...new Set(portfolioData.map(i => i.style).filter(Boolean))].sort()
        .map(s => {
          const count = portfolioData.filter(i => i.style === s).length;
          return `<button class="pf-btn" data-filter="${s}">${s} (${count})</button>`;
        }).join('\n      ')}
    </div>

    <!-- Grid de fotos -->
    <div class="portfolio-grid" id="portfolioGrid">
      ${portfolioData.map(img => `
      <div class="portfolio-item" data-style="${img.style || ''}" data-index="${img.index}" onclick="openLightbox(${img.index})">
        <img src="${img.src}"
             alt="Tatuaje ${img.style ? img.style + ' ' : ''}a domicilio Los Andes por Cristian Venega"
             loading="lazy"
             width="400" height="400">
        <div class="portfolio-item-overlay">
          <span class="portfolio-item-label">${img.style || img.name}</span>
        </div>
      </div>`).join('')}
    </div>

    <!-- CTAs -->
    <div class="portfolio-cta">
      <a href="https://www.instagram.com/cristiantattoolosandesink/"
         class="portfolio-cta-btn"
         target="_blank" rel="noopener noreferrer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
        Ver más en Instagram
      </a>
      <a href="https://www.tiktok.com/@cristiantattoo12"
         class="portfolio-cta-btn"
         style="color:#ff6b8a;border-color:rgba(255,107,138,0.2);background:rgba(255,0,80,0.06)"
         target="_blank" rel="noopener noreferrer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.18 8.18 0 004.78 1.52V6.84a4.85 4.85 0 01-1.01-.15z"/>
        </svg>
        TikTok
      </a>
    </div>

  </div>
</section>

<!-- Lightbox -->
<div class="portfolio-lightbox" id="portfolioLightbox" role="dialog" aria-label="Ver imagen">
  <div class="lb-inner">
    <button class="lb-close" onclick="closeLightbox()" aria-label="Cerrar">×</button>
    <button class="lb-nav lb-prev" onclick="navLightbox(-1)" aria-label="Anterior">&#8249;</button>
    <button class="lb-nav lb-next" onclick="navLightbox(1)"  aria-label="Siguiente">&#8250;</button>
    <img class="lb-img" id="lbImg" src="" alt="">
    <div class="lb-caption" id="lbCaption"></div>
  </div>
</div>

<!-- Script del portafolio -->
<script src="portafolio-data.js"></script>
<script>
(function() {
  const VISIBLE_INIT = 9;
  let lbIndex = 1;
  let visibleItems = [];

  // Filtros
  const filters = document.getElementById('portfolioFilters');
  if (filters) {
    filters.addEventListener('click', function(e) {
      const btn = e.target.closest('.pf-btn');
      if (!btn) return;

      filters.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const items  = document.querySelectorAll('#portfolioGrid .portfolio-item');

      visibleItems = [];
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.style === filter;
        item.classList.toggle('hidden', !show);
        if (show) visibleItems.push(parseInt(item.dataset.index));
      });
    });
  }

  // Inicializar visibleItems
  visibleItems = Array.from(document.querySelectorAll('#portfolioGrid .portfolio-item'))
    .map(el => parseInt(el.dataset.index));

  // Lightbox
  window.openLightbox = function(idx) {
    const item = PORTAFOLIO_DATA.find(i => i.index === idx);
    if (!item) return;
    lbIndex = idx;
    document.getElementById('lbImg').src       = item.src;
    document.getElementById('lbImg').alt       = 'Tatuaje ' + (item.style||item.name) + ' — Cristian Venega Los Andes';
    document.getElementById('lbCaption').textContent = (item.style || item.name) + ' — Cristian Venega · Los Andes Ink';
    document.getElementById('portfolioLightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    document.getElementById('portfolioLightbox').classList.remove('open');
    document.body.style.overflow = '';
  };

  window.navLightbox = function(dir) {
    const pos  = visibleItems.indexOf(lbIndex);
    const next = visibleItems[(pos + dir + visibleItems.length) % visibleItems.length];
    openLightbox(next);
  };

  // Cerrar con Escape / clic fuera
  document.getElementById('portfolioLightbox').addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
  });
  document.addEventListener('keydown', function(e) {
    const lb = document.getElementById('portfolioLightbox');
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navLightbox(-1);
    if (e.key === 'ArrowRight')  navLightbox(1);
  });
})();
</script>
`;

fs.writeFileSync(OUTPUT_HTML_SEC, htmlSection, 'utf8');
console.log(`📄  portafolio-section.html generado.`);
console.log(`\n✅  LISTO. Sigue estos pasos:\n`);
console.log(`   1. Copia el contenido de portafolio-section.html`);
console.log(`      y reemplaza la sección #portafolio en tu index.html`);
console.log(`\n   2. Asegúrate que portafolio-data.js está en la raíz del proyecto`);
console.log(`      (al mismo nivel que index.html)`);
console.log(`\n   3. Haz deploy en Netlify normalmente\n`);
console.log(`   📁 Imágenes procesadas:`);
portfolioData.forEach(img => {
  console.log(`      ${img.index}. ${img.src}${img.style ? ' [' + img.style + ']' : ''}`);
});
console.log(`\n   Total: ${portfolioData.length} imágenes\n`);
