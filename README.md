# Wallpaper Whirr Music

Reproductor de música y fondo animado para estudiar con el álbum *Feels Like You* (2019) de la banda Whirr.

[![Publicación](https://github.com/mrln-trrs/Wallpaper-Whirr-music/actions/workflows/pages.yml/badge.svg)](https://github.com/mrln-trrs/Wallpaper-Whirr-music/actions/workflows/pages.yml)
![Estado: Estable](https://img.shields.io/badge/estado-estable-brightgreen)
![Licencia del código: MIT](https://img.shields.io/badge/licencia%20del%20c%C3%B3digo-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-React-3178c6)

**Sitio publicado:** <https://mrln-trrs.github.io/Wallpaper-Whirr-music/>

> **Proyecto educativo y sin fines de lucro.** Los derechos del audio y de la portada pertenecen a sus titulares; se retirarán a petición de ellos. Detalles y enlaces oficiales en [CREDITS.md](CREDITS.md).

## Estado

**Estable** (v1.0.0). Es el primer proyecto web del autor, nacido como un fondo de pantalla en HTML, CSS y JavaScript (conservado en la etiqueta [`v0.1.0`](https://github.com/mrln-trrs/Wallpaper-Whirr-music/releases/tag/v0.1.0)) y rehecho en React como un reproductor completo que mantiene su identidad visual: portada difuminada y saturada en movimiento lento, Montserrat fina en blanco y controles translúcidos. El inventario de lo que tenía la versión original está en [`docs/funcionalidades-originales.md`](docs/funcionalidades-originales.md).

## Características

- Reproducir/pausa, pista anterior y siguiente, retroceder y adelantar 15 s.
- Aleatorio y repetir (no, toda la lista, una pista). «Anterior» reinicia la pista si ya pasaron más de 3 s.
- Barra de progreso arrastrable con ratón, dedo o teclado.
- Volumen y silencio.
- Lista lateral con la pista actual resaltada y la duración de cada una.
- Portada, título, artista y álbum; el título de la pestaña muestra lo que suena.
- Controles del sistema operativo y de la pantalla de bloqueo (Media Session API).
- Recuerda pista, posición, volumen y preferencias entre visitas (`localStorage`).
- Estados de carga y de error, con opciones para reintentar o saltar.
- Visualizador de frecuencias con Web Audio, desactivable.
- Añadir archivos de audio del propio equipo: se reproducen en el navegador y no se suben a ningún sitio.
- Adaptable de móvil a escritorio, accesible (roles ARIA, foco visible, etiquetas) y respetuoso con `prefers-reduced-motion` (sin animación de fondo ni visualizador).

### Atajos de teclado

| Tecla | Acción |
|---|---|
| Espacio / K | Reproducir o pausar |
| ← / → | Retroceder / adelantar 15 s |
| Mayús + ← / → (o P / N) | Pista anterior / siguiente |
| ↑ / ↓ | Subir / bajar volumen |
| M | Silenciar |
| S | Aleatorio |
| R | Repetir (no → lista → una) |
| L | Mostrar u ocultar la lista |
| V | Visualizador |
| I | Créditos y atajos |
| Esc | Cerrar la lista o el diálogo |

## Stack

| Herramienta | Versión |
|---|---|
| React | 19.3 |
| TypeScript | 6.0 |
| Vite | 8.4 |
| Vitest | 5.1 |
| ESLint (typescript-eslint, react-hooks) | 10.15 |
| Node.js (compilación) | 22 |

Sin dependencias de ejecución aparte de React. Audio, Web Audio y Media Session son API nativas del navegador.

## Requisitos

- Node.js 20 o superior y npm (o Docker con la imagen `node:22`).
- Un navegador actual (Chrome, Edge, Firefox o Safari).

## Instalación y uso

```bash
npm ci
npm run dev       # servidor de desarrollo en http://localhost:5173/Wallpaper-Whirr-music/
npm run build     # compila en dist/
npm run preview   # sirve dist/ para comprobar la compilación
npm run lint      # ESLint
npm test          # Vitest
```

Con Docker, sin Node instalado:

```bash
docker run --rm -it -p 5173:5173 -v "$PWD":/app -w /app node:22 sh -c "npm ci && npm run dev"
```

### Como fondo de pantalla

Abre la [URL publicada](https://mrln-trrs.github.io/Wallpaper-Whirr-music/) en una pestaña a pantalla completa (F11) o úsala como fondo web en programas como Lively Wallpaper o Wallpaper Engine. Los navegadores no permiten reproducir sonido sin una interacción previa: pulsa reproducir o la barra espaciadora una vez.

## Publicación

Cada `push` a `main` ejecuta [`.github/workflows/pages.yml`](.github/workflows/pages.yml): instala dependencias, pasa lint y pruebas, compila y publica `dist/` en GitHub Pages (origen configurado como «GitHub Actions»). La ruta base de Vite es `/Wallpaper-Whirr-music/` ([`vite.config.ts`](vite.config.ts)).

## Estructura del proyecto

```
├── index.html                 Página de entrada de Vite
├── public/
│   ├── music/                 Audio del álbum (ver CREDITS.md)
│   ├── img/                   Portada del álbum
│   └── fonts/                 Montserrat WOFF2 + OFL.txt
├── src/
│   ├── App.tsx                Composición de la interfaz y atajos
│   ├── components/            Controles, barra de progreso, volumen, lista, créditos, iconos
│   ├── hooks/                 useAudioPlayer, useMediaSession, useKeyboardShortcuts,
│   │                          useVisualizer, useReducedMotion
│   ├── data/tracks.ts         Pistas, datos del álbum y enlaces oficiales
│   ├── lib/                   Lógica pura (con pruebas), almacenamiento y elemento <audio>
│   └── styles.css             Estilos y tokens de color
├── docs/                      Inventario de la versión original
└── .github/                   Publicación en Pages y Dependabot
```

## Limitaciones conocidas

- El repositorio incluye el audio comercial del álbum (~50 MB) con fines educativos; no tiene licencia libre y se retirará si los titulares lo piden.
- Los archivos locales que se añaden no se guardan entre visitas (el navegador no permite recordar archivos sin volver a elegirlos).
- Los títulos de los archivos locales se toman del nombre del archivo; no se leen etiquetas ID3.
- La reproducción automática al abrir la página depende de las políticas del navegador; por eso la app espera a que el usuario pulse reproducir.

## Autor

Marlon Torres Espinoza ([@mrln-trrs](https://github.com/mrln-trrs)).

## Licencia

El **código** se distribuye bajo licencia [MIT](LICENSE). La licencia **no** cubre el audio (`public/music/`) ni la portada (`public/img/`), que pertenecen a sus titulares. La tipografía Montserrat se distribuye bajo la [SIL Open Font License 1.1](public/fonts/OFL.txt). Créditos completos en [CREDITS.md](CREDITS.md).
