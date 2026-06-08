# 🚀 Instrucciones — Portafolio + Seguridad + Email

## Archivos incluidos en este paquete

| Archivo | Qué hace |
|---|---|
| `generar-portafolio.js` | Script que lee tu carpeta de fotos y genera el portafolio |
| `netlify.toml` | Seguridad completa + caché + configuración del sitio |

---

## PASO 1 — Copiar archivos al proyecto

Copia estos 2 archivos a la raíz de tu proyecto:
```
cristian_tattoo/
├── generar-portafolio.js   ← aquí
├── netlify.toml             ← aquí
├── index.html
├── style.css
├── script.js
└── assets/
    └── portafolio/          ← tus imágenes van aquí
        ├── blackwork-001.jpg
        ├── fineline-002.jpg
        └── ...
```

---

## PASO 2 — Ejecutar el generador de portafolio

Abre una terminal en la carpeta `cristian_tattoo` y ejecuta:

```bash
node generar-portafolio.js
```

El script te dirá cuántas imágenes encontró y genera:
- `portafolio-data.js` → datos de todas las imágenes
- `portafolio-section.html` → HTML listo para copiar en tu index.html

---

## PASO 3 — Integrar en index.html

1. Abre `portafolio-section.html`
2. Copia TODO su contenido
3. En tu `index.html`, busca la sección `<section id="portafolio">`
4. Reemplázala completamente por el contenido copiado

---

## PASO 4 — Deploy en Netlify

Sube el proyecto normalmente a Netlify (drag-and-drop o git push).

**Los archivos que Netlify necesita en la raíz:**
- `index.html`
- `netlify.toml`  ← NUEVO — activa la seguridad
- `portafolio-data.js`  ← NUEVO — generado por el script
- `agenda.html`
- `sitemap.xml`
- `robots.txt`
- `assets/portafolio/*.jpg` (todas tus fotos)

---

## PASO 5 — Activar notificaciones de email

Después del deploy, en **Netlify Dashboard**:

1. Ve a tu sitio → **Forms** (menú lateral)
2. Verás el formulario `agenda-cita`
3. Clic en él → **Form notifications** → **Add notification**
4. Tipo: **Email notification**
5. Email: `cristianrvenega2001@gmail.com`
6. Guardar
7. **Repetir para el formulario `formulario-resena`**

Desde ese momento recibes un email a tu Gmail cada vez que alguien reserve o deje una reseña. Funciona desde cualquier dispositivo.

---

## Nombrar las imágenes (recomendado)

El script detecta el estilo automáticamente por el nombre del archivo:

| Nombre del archivo | Estilo detectado |
|---|---|
| `blackwork-001.jpg` | Blackwork |
| `fineline-rosa.jpg` | Fine Line |
| `realismo-retrato.jpg` | Realismo |
| `watercolor-mariposa.jpg` | Watercolor |
| `geometrico-02.jpg` | Geométrico |
| `lettering-nombre.jpg` | Lettering |
| `tribal-brazo.jpg` | Tribal |
| `fullcolor-dragon.jpg` | Full Color |

Si el nombre no tiene keyword reconocida, igual se agrega al portafolio sin etiqueta de estilo.

---

## Agregar imágenes nuevas en el futuro

1. Coloca la nueva foto en `assets/portafolio/`
2. Ejecuta `node generar-portafolio.js` de nuevo
3. Copia el nuevo `portafolio-section.html` al `index.html`
4. Sube a Netlify

¡Listo!
