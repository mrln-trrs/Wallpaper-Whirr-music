import { useEffect } from 'react';
import type { Track } from '../data/tracks';

interface Handlers {
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  skip: (delta: number) => void;
}

const SKIP = 15;

/** Controles del sistema (teclas multimedia, pantalla de bloqueo, notificaciones). */
export function useMediaSession(
  track: Track | undefined,
  isPlaying: boolean,
  position: { currentTime: number; duration: number },
  handlers: Handlers,
) {
  const supported = typeof navigator !== 'undefined' && 'mediaSession' in navigator;

  useEffect(() => {
    if (!supported || !track) return;
    const artwork = new URL(track.cover, window.location.href).href;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: track.album,
      artwork: [{ src: artwork, sizes: '1080x1080', type: 'image/png' }],
    });
  }, [supported, track]);

  useEffect(() => {
    if (!supported) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [supported, isPlaying]);

  useEffect(() => {
    if (!supported) return;
    const { currentTime, duration } = position;
    if (!Number.isFinite(duration) || duration <= 0) return;
    try {
      navigator.mediaSession.setPositionState({
        duration,
        position: Math.min(currentTime, duration),
        playbackRate: 1,
      });
    } catch {
      // Algunos navegadores no implementan setPositionState.
    }
    // Actualizar cada segundo basta para la barra del sistema.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported, Math.floor(position.currentTime), position.duration]);

  useEffect(() => {
    if (!supported) return;
    const ms = navigator.mediaSession;
    const actions: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
      ['play', () => handlers.play()],
      ['pause', () => handlers.pause()],
      ['previoustrack', () => handlers.prev()],
      ['nexttrack', () => handlers.next()],
      ['seekbackward', (d) => handlers.skip(-(d.seekOffset ?? SKIP))],
      ['seekforward', (d) => handlers.skip(d.seekOffset ?? SKIP)],
      ['seekto', (d) => d.seekTime !== undefined && handlers.seek(d.seekTime)],
    ];
    for (const [action, handler] of actions) {
      try {
        ms.setActionHandler(action, handler);
      } catch {
        // Acción no soportada en este navegador.
      }
    }
    return () => {
      for (const [action] of actions) {
        try {
          ms.setActionHandler(action, null);
        } catch {
          /* idem */
        }
      }
    };
  }, [supported, handlers]);
}
