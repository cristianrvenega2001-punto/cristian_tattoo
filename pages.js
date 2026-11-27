/* Cristian Tattoo Los Andes Ink: páginas de agenda, privacidad y 404 */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);

  // Correo: se arma al cargar, no queda escrito en el HTML
  document.querySelectorAll('.js-mail').forEach((a) => {
    const mail = `${a.dataset.u}@${a.dataset.d}`;
    a.href = `mailto:${mail}`;
    a.textContent = mail;
  });

  const form = $('agendaForm');
  if (!form) return;

  const panels = [...form.querySelectorAll('.ag-panel')];
  const inds = [...document.querySelectorAll('.ag-steps li')];
  const msg = $('formMsg');
  const MAX = 5 * 1024 * 1024;
  const say = (text) => { msg.textContent = text; msg.hidden = !text; };

  const show = (n) => {
    panels.forEach((p) => p.classList.toggle('is-active', +p.dataset.step === n));
    inds.forEach((li) => {
      const i = +li.dataset.ind;
      li.classList.toggle('is-done', i < n);
      if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    say('');
    const t = panels[n - 1].querySelector('legend');
    form.scrollIntoView({ block: 'start' });
    t?.focus?.();
  };

  // Revisa los campos obligatorios del paso antes de avanzar
  const check = (panel) => {
    for (const el of panel.querySelectorAll('input, select, textarea')) {
      if (el.type === 'radio') {
        if (el.required && !form.querySelector(`input[name="${el.name}"]:checked`)) {
          say(el.name === 'Estilo' ? 'Elige un estilo para seguir.' : 'Elige un tamaño para seguir.');
          return false;
        }
        continue;
      }
      el.removeAttribute('aria-invalid');
      if (!el.checkValidity()) {
        el.setAttribute('aria-invalid', 'true');
        say(el.type === 'checkbox' ? 'Para seguir, acepta la política de privacidad.' : 'Revisa el campo marcado para seguir.');
        el.focus();
        return false;
      }
    }
    return true;
  };

  const fillSummary = () => {
    const e = form.querySelector('input[name="Estilo"]:checked');
    const t = form.querySelector('input[name="Tamano"]:checked');
    const set = (id, v, empty) => { $(id).textContent = v || empty; };
    set('sumEstilo', e?.value, 'Sin elegir');
    set('sumTamano', t?.dataset.sum, 'Sin elegir');
    set('sumDesc', t?.dataset.disc, 'Sin elegir');
    set('sumZona', $('agZona').value, 'Sin elegir');
    const f = $('agFecha').value;
    set('sumFecha', f ? new Date(f).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' }) : '', 'Sin elegir');
    set('sumNombre', $('agNombre').value.trim(), 'Sin escribir');
    set('sumWA', $('agWA').value.trim(), 'Sin escribir');
  };

  form.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
    const to = +b.dataset.go;
    const cur = +b.closest('.ag-panel').dataset.step;
    if (to > cur && !check(panels[cur - 1])) return;
    if (to === 4) fillSummary();
    show(to);
  }));
  panels.forEach((p) => p.querySelector('legend')?.setAttribute('tabindex', '-1'));
  form.addEventListener('change', (e) => { if (e.target !== file) say(''); e.target.removeAttribute?.('aria-invalid'); });

  // Vista previa de la imagen, con límite de tamaño y tipo
  const file = $('fileInput');
  file.addEventListener('change', () => {
    const f = file.files[0];
    $('previewWrap').hidden = true;
    say('');
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { say('La imagen debe ser JPG, PNG o WEBP.'); file.value = ''; return; }
    if (f.size > MAX) { say('La imagen pesa más de 5 MB. Prueba con una más liviana o mándala por WhatsApp.'); file.value = ''; return; }
    const url = URL.createObjectURL(f);
    let img = $('previewImg');
    if (!img) { img = new Image(); img.id = 'previewImg'; img.alt = 'Tu imagen de referencia'; $('previewWrap').prepend(img); }
    img.onload = () => URL.revokeObjectURL(url);
    img.src = url;
    $('previewName').textContent = f.name;
    $('previewWrap').hidden = false;
  });

  // Envío a Netlify Forms: solo muestra "enviada" si Netlify la recibió
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    for (const p of panels) { if (!check(p)) { show(+p.dataset.step); check(p); return; } }
    const btn = $('btnSubmit');
    btn.setAttribute('aria-busy', 'true'); btn.disabled = true; btn.textContent = 'Enviando…';
    try {
      const res = await fetch('/', { method: 'POST', body: new FormData(form) });
      if (!res.ok) throw new Error(res.status);
      form.hidden = true;
      document.querySelector('.ag-steps').hidden = true;
      $('successBox').hidden = false;
      $('successBox').focus();
    } catch (err) {
      say('No se pudo enviar. Revisa tu conexión e inténtalo de nuevo, o escríbeme por WhatsApp al +56 9 8738 3781.');
    } finally {
      btn.removeAttribute('aria-busy'); btn.disabled = false; btn.textContent = 'Enviar reserva';
    }
  });
})();
