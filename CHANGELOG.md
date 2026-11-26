# Registro de cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); el proyecto sigue [Versionado Semántico](https://semver.org/lang/es/).

## [1.0.0] - 2026-11-26

Reescritura completa en React, Vite y TypeScript que conserva la identidad visual de la versión original. Inventario de lo que había antes en [`docs/funcionalidades-originales.md`](docs/funcionalidades-originales.md).

### Añadido

- Reproductor completo: reproducir/pausa, anterior/siguiente, retroceder/adelantar 15 s, aleatorio y repetir (no, toda la lista, una pista).
- Barra de progreso arrastrable con ratón, dedo y teclado, con tiempo transcurrido y total.
- Volumen con deslizador y botón de silencio.
- Lista lateral con la pista actual resaltada, indicador de reproducción y duración de cada pista.
- Atajos de teclado (Espacio, flechas, Mayús + flechas, M, S, R, L, V, I) y ayuda en el diálogo de créditos.
- Media Session API: título, artista, portada y controles en el sistema operativo y la pantalla de bloqueo.
- Se recuerdan pista, posición, volumen, silencio, aleatorio, repetir y visualizador en `localStorage`.
- Estados de carga y de error con opciones para reintentar o saltar la pista.
- Visualizador de frecuencias con Web Audio (desactivable).
- Archivos de audio del propio equipo, que se añaden a la lista sin subirse a ningún sitio.
- Créditos en la app, `CREDITS.md` con enlaces oficiales verificados y aviso de uso educativo.
- Diseño adaptable, roles ARIA, foco visible y respeto de `prefers-reduced-motion`.
- Publicación automática en GitHub Pages con GitHub Actions (lint, pruebas y compilación).
- Pruebas con Vitest de la lógica del reproductor.
- Licencia MIT para el código (excluye audio y portada), `SECURITY.md` y Dependabot.

### Cambiado

- Montserrat pasa de TTF a WOFF2 (subconjunto latino) con `font-display: swap` y su licencia OFL.
- Audio y portada se sirven desde `public/`.
- Interfaz en español.

### Eliminado

- `OpenSans.ttf` (nunca se usó), `jsmediatags` (cargado sin usarse) y `Whirr.code-workspace`.

### Corregido

- `TypeError` continuo por la referencia a `#sliderDeRango`, que no existía.
- Botón de la lista enlazado tres veces (funcionaba por casualidad).
- Lista de canciones triplicada y manejadores `onclick` en línea.
- `NaN` al adelantar antes de cargar los metadatos.
- Errores de `play()` sin capturar.
- Botones sin nombre accesible.

## [0.1.0] - 2025-05-14

Versión original en HTML, CSS y JavaScript plano: portada difuminada y animada de fondo, portada al centro, título de la pista, barra de progreso con clic, botones de anterior, -15 s, reproducir/pausa, +15 s y siguiente, y barra lateral con las 10 pistas.

[1.0.0]: https://github.com/mrln-trrs/Wallpaper-Whirr-music/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/mrln-trrs/Wallpaper-Whirr-music/releases/tag/v0.1.0
