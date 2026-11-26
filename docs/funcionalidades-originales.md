# Funcionalidades de la versión original (v0.1.0)

Inventario de todo lo que se construyó en la versión original en HTML, CSS y JavaScript plano (etiqueta `v0.1.0`), revisando las 19 entregas del historial de `main` (única rama; diciembre de 2024 a septiembre de 2026), incluidas las funciones que luego se quitaron. Sirve de referencia para la reescritura en React (v1.0.0), que conserva la identidad visual y retoma cada una de estas ideas.

## Línea de tiempo

| Fecha | Entrega | Qué cambió |
|---|---|---|
| 2024-12-12 | `6d96f32` Codigo | Primera versión: portada difuminada y animada de fondo, cuadrícula de dos columnas (álbum y lista), lista de 10 canciones, botones en la esquina inferior, casilla de «bucle», barra de progreso fina con `input range` invisible encima. |
| 2024-12-12 | `74d4a9b` | README de una línea. |
| 2025-05-13 | `bf82919` | Primeros estilos para móvil (`max-width: 768px`). |
| 2025-05-13 | `6e93bef` | Se quita la capa de desenfoque con `backdrop-filter` y las animaciones `shake`/`pulse`; los controles se agrupan en `#Controls`. |
| 2025-05-13 | `a33ca3d` | Aparece la barra lateral (`Sidebar`) con botón ☰ que la abre y cierra con deslizamiento. |
| 2025-05-13 | `fdc82d6` | Se eliminan las funciones `song01()`…`song10()`; se introduce `currentIndex` y `Cargar()` asigna la ruta desde el arreglo. Se quita la casilla de bucle. |
| 2025-05-13 | `818d8b4` | Selección genérica `selectSong(i)` desde la lista. |
| 2025-05-13 | `8b00675` | Estilos del `input range` (pista translúcida, sin «thumb»). |
| 2025-05-13 | `7c7137e` | Nueva barra de progreso propia (`#progressBarContainer`/`#progressBar`) con clic para saltar; los botones se agrupan en una fila; `preload="metadata"`. |
| 2025-05-14 | `354f924` | Fondo nuevo: portada a 250 %, `blur`, brillo bajo, saturación alta y animación `zoomAndMove` de 30 s; controles dentro del bloque del álbum. |
| 2025-05-14 | `0bff92a` | `toggleSidebar()` como función con nombre (queda enlazada tres veces, ver defectos). |
| 2025-05-14 | `7c20398` | Título «Now Playing» con el nombre de la pista actual. |
| 2025-05-14 | `ac416ca`, `4443279`, `d8a37db`, `c1154de` | Ajustes de tamaño de portada y botones por tamaño de pantalla (móvil, tableta, escritorio); fusión desde el nombre anterior del repositorio. |
| 2025-05-14 | `dadf113` | Ajuste final de efectos: `blur(30px) brightness(0.2) saturate(5)`, movimiento diagonal en la animación, sombra blanca tenue y saturación 1,5 en la portada. |
| 2025-05-14 / 2026-09-30 | `a8531bd`, `6d8a469` | Enlace a la página publicada en el README. |

## Inventario de funcionalidades

### Reproducción

- Reproducir y pausar con un solo botón (`PlayPause`).
- Pista anterior y siguiente, con paso circular de la última a la primera y viceversa.
- Retroceder y adelantar 15 segundos (`Atrasar`/`Adelantar`). En la primera versión había márgenes: si quedaban menos de 20 s al final, saltaba a 5 s antes del final.
- Paso automático a la siguiente pista al terminar (`onended`).
- Selección directa de una pista desde la lista, que empieza a sonar al instante.
- **Quitada:** casilla de «bucle» (`#checkbox`). Si estaba desmarcada, al pasar de la última pista (o retroceder desde la primera) mostraba `alert("Active el bucle")` en lugar de dar la vuelta.
- **Quitada:** diez funciones `song01()`…`song10()`, una por pista, sustituidas luego por `selectSong(i)`.

### Progreso

- Primera versión: barra fina (5 px) pegada al borde inferior, con un `input type="range"` invisible encima para buscar y un `div` que se rellenaba según el tiempo.
- Versión intermedia: el `range` con estilo propio (pista translúcida, sin control deslizante visible).
- Versión final: barra redondeada de 7 px (`#progressBarContainer`) con relleno blanco al 80 % y clic para saltar a un punto. Se actualizaba con `timeupdate` y además cada 250 ms.

### Lista de canciones

- Las 10 pistas de *Feels Like You* en orden.
- Primera versión: lista numerada grande a la derecha del álbum, en una cuadrícula de dos columnas.
- Versión final: barra lateral oculta a la izquierda (250 px, fondo negro al 90 %, sombra) que entra deslizándose al pulsar ☰; título «Song List»; cada canción como tarjeta translúcida centrada con efectos de `hover` y `active`.

### Portada y textos

- Portada del álbum al centro con esquinas redondeadas (10 %, 5 % en móvil), saturación aumentada y un halo blanco muy tenue.
- Títulos «Whirr» (en las primeras versiones) y «Feels Like You».
- «Now Playing»: nombre de la pista actual bajo el título del álbum.

### Fondo y animaciones

- Primera versión: portada a 500 % de ancho, opacidad 0,2, saturación 300 %, animación `pulse` (escala 1,5 ↔ 2,5 en 30 s) y una animación `shake` definida (quedaba anulada por la segunda declaración de `animation`), más una capa con `backdrop-filter: blur(50px)`.
- Versión final: portada fija a pantalla completa ampliada al 250 %, `blur(30px) brightness(0.2) saturate(5)` y animación `zoomAndMove` de 30 s alternada (escala 1 → 1,3 con desplazamiento diagonal).
- Transición global de 0,3 s en todos los elementos.

### Tipografía y estilo

- Montserrat en peso 200 (fina) para toda la interfaz, texto blanco sobre negro, desde un `@font-face` local (`Montserrat.ttf`).
- `OpenSans.ttf` versionado pero nunca usado en el CSS.
- Botones cuadrados translúcidos (blanco al 10 %), borde blanco al 50 % en `hover`, más claros al pulsar.
- Barra de desplazamiento oculta (`::-webkit-scrollbar`) y selección de texto desactivada (`user-select: none`).

### Diseño adaptable

- Tres puntos de corte: móvil (≤ 768 px), tableta (769–1024 px) y escritorio (≥ 1025 px), con tamaños propios de portada, títulos y botones.

### Otros

- `jsmediatags 3.9.5` cargado desde cdnjs con SRI (pensado para leer etiquetas ID3), sin llegar a usarse.
- Uso previsto: fondo de pantalla animado (Lively Wallpaper, Wallpaper Engine) o pestaña del navegador mientras se estudia o se duerme.

## Defectos conocidos de la versión original

- `main.js` referencia `#sliderDeRango`, que ya no existía en el HTML final: `actualizarBarra()` lanzaba `TypeError` en cada `timeupdate` y cada 250 ms. `coordinar()` quedó como código muerto.
- `toggleSidebar` estaba definido dos veces y enlazado tres veces al botón; cada clic alternaba tres veces y funcionaba por casualidad.
- Lista de canciones triplicada (HTML, `songs` y `songTitles`) y manejadores `onclick` en línea.
- Botones con texto `<<`, `<`, `P`, `>`, `>>` sin `aria-label`; sin navegación por teclado ni foco visible.
- `audio.duration` es `NaN` antes de cargar metadatos, por lo que adelantar podía asignar `NaN`.
- `play()` sin capturar la promesa: errores de reproducción automática sin manejar.
- Título de pestaña genérico («Reproductor»).

## Correspondencia en v1.0.0

| Original | Reescritura en React |
|---|---|
| Reproducir/pausa, anterior/siguiente, ±15 s | Mismos controles con iconos SVG, `aria-label` y atajos de teclado. |
| Casilla de bucle (quitada) | Modo repetir con tres estados: no, toda la lista, una pista. |
| Fin de pista → siguiente | Respeta repetir y aleatorio; sin `alert`. |
| Barra de progreso con clic | Barra arrastrable (puntero y teclado) con tiempos transcurrido y total. |
| Barra lateral con ☰ | Panel lateral accesible (cierra con Esc), pista actual resaltada y duración. |
| «Now Playing» | Título, artista y álbum; también en la pestaña y en los controles del sistema (Media Session). |
| Fondo difuminado animado | Mismo fondo `blur/brightness/saturate` con `zoomAndMove`, desactivado con `prefers-reduced-motion`. |
| Montserrat 200 | Montserrat 200 en WOFF2 con licencia OFL incluida. |
| jsmediatags sin usar | Archivos locales del usuario con su nombre como título (sin dependencias externas). |
| Tres puntos de corte | Diseño fluido de móvil a escritorio. |
