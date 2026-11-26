import { useCallback, useEffect, useRef, useState } from 'react';
import type { Track } from '../data/tracks';
import {
  clampTime,
  clampVolume,
  createShuffleOrder,
  getNextIndex,
  getPrevIndex,
  nextRepeatMode,
  shouldRestart,
  type QueueState,
  type RepeatMode,
} from '../lib/playerLogic';
import { audio } from '../lib/audioElement';
import { loadSaved, saveState, type SavedState } from '../lib/storage';

export type PlayerStatus = 'idle' | 'loading' | 'ready' | 'error';

const SAVE_TIME_EVERY = 5; // segundos

function mediaErrorMessage(err: MediaError | null): string {
  switch (err?.code) {
    case MediaError.MEDIA_ERR_NETWORK:
      return 'Error de red al descargar la pista.';
    case MediaError.MEDIA_ERR_DECODE:
      return 'El archivo está dañado o no se puede decodificar.';
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return 'No se encontró el archivo o el formato no es compatible.';
    default:
      return 'No se pudo reproducir la pista.';
  }
}

function initialIndex(tracks: Track[], saved: SavedState): number {
  const i = tracks.findIndex((t) => t.id === saved.trackId);
  return i >= 0 ? i : 0;
}

export function useAudioPlayer(initialTracks: Track[]) {
  const [saved] = useState(loadSaved);

  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [current, setCurrent] = useState(() => initialIndex(initialTracks, saved));
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(Number.NaN);
  const [volume, setVolumeState] = useState(() => clampVolume(saved.volume ?? 0.8));
  const [muted, setMuted] = useState(saved.muted ?? false);
  const [shuffle, setShuffle] = useState(saved.shuffle ?? false);
  const [repeat, setRepeat] = useState<RepeatMode>(saved.repeat ?? 'all');
  const [order, setOrder] = useState<number[]>(() =>
    saved.shuffle ? createShuffleOrder(initialTracks.length, initialIndex(initialTracks, saved)) : [],
  );

  const track = tracks[current];

  // Copia del estado más reciente para los manejadores de eventos del <audio>.
  const latest = useRef({ tracks, current, shuffle, repeat, order });
  useEffect(() => {
    latest.current = { tracks, current, shuffle, repeat, order };
  }, [tracks, current, shuffle, repeat, order]);

  const play = useCallback(async () => {
    if (!audio.src) return;
    try {
      await audio.play();
    } catch (e) {
      const name = e instanceof DOMException ? e.name : '';
      // AbortError: se cambió de pista antes de empezar. NotAllowedError: el
      // navegador exige una interacción previa; no es un error de la pista.
      if (name !== 'AbortError' && name !== 'NotAllowedError') {
        setStatus('error');
        setError(mediaErrorMessage(audio.error));
      }
    }
  }, []);

  const pause = useCallback(() => audio.pause(), []);

  const togglePlay = useCallback(() => {
    if (audio.paused) void play();
    else pause();
  }, [play, pause]);

  /** Carga la pista `index` y, si se pide, la reproduce. */
  const loadTrack = useCallback(
    (index: number, opts: { autoplay: boolean; startAt?: number }) => {
      const t = latest.current.tracks[index];
      if (!t) return;
      setCurrent(index);
      setError(null);
      setStatus('loading');
      setCurrentTime(opts.startAt ?? 0);
      setDuration(t.duration ?? Number.NaN);
      audio.src = t.src;
      if (opts.startAt) {
        const startAt = opts.startAt;
        audio.addEventListener(
          'loadedmetadata',
          () => {
            audio.currentTime = clampTime(startAt, audio.duration);
          },
          { once: true },
        );
      }
      audio.load();
      saveState({ trackId: t.id, time: opts.startAt ?? 0 });
      if (opts.autoplay) void play();
    },
    [play],
  );

  const queue = useCallback(
    (): QueueState => ({
      current: latest.current.current,
      length: latest.current.tracks.length,
      shuffle: latest.current.shuffle,
      repeat: latest.current.repeat,
      order: latest.current.order,
    }),
    [],
  );

  const next = useCallback(() => {
    const i = getNextIndex(queue(), { auto: false });
    if (i !== null) loadTrack(i, { autoplay: true });
  }, [queue, loadTrack]);

  const prev = useCallback(() => {
    if (shouldRestart(audio.currentTime)) {
      audio.currentTime = 0;
      return;
    }
    const i = getPrevIndex(queue());
    if (i !== null) loadTrack(i, { autoplay: true });
  }, [queue, loadTrack]);

  const selectTrack = useCallback(
    (index: number) => {
      if (index === latest.current.current && audio.src) {
        togglePlay();
        return;
      }
      loadTrack(index, { autoplay: true });
    },
    [loadTrack, togglePlay],
  );

  const seek = useCallback(
    (time: number) => {
      const t = clampTime(time, audio.duration);
      audio.currentTime = t;
      setCurrentTime(t);
    },
    [],
  );

  const skip = useCallback((delta: number) => seek(audio.currentTime + delta), [seek]);

  const setVolume = useCallback((v: number) => {
    const nv = clampVolume(v);
    setVolumeState(nv);
    if (nv > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const toggleShuffle = useCallback(() => {
    const on = !latest.current.shuffle;
    if (on) setOrder(createShuffleOrder(latest.current.tracks.length, latest.current.current));
    setShuffle(on);
  }, []);

  const cycleRepeat = useCallback(() => setRepeat((r) => nextRepeatMode(r)), []);

  const retry = useCallback(() => {
    loadTrack(latest.current.current, { autoplay: true, startAt: audio.currentTime || undefined });
  }, [loadTrack]);

  /** Añade archivos de audio del equipo del usuario (no se suben a ningún sitio). */
  const addLocalFiles = useCallback((files: FileList | File[]) => {
    const audioFiles = Array.from(files).filter(
      (f) => f.type.startsWith('audio/') || /\.(mp3|m4a|aac|ogg|oga|opus|wav|flac|webm)$/i.test(f.name),
    );
    if (audioFiles.length === 0) return 0;
    const added: Track[] = audioFiles.map((f, i) => ({
      id: `local-${Date.now()}-${i}`,
      number: 0,
      title: f.name.replace(/\.[^.]+$/, ''),
      artist: 'Archivo local',
      album: 'Mis archivos',
      src: URL.createObjectURL(f),
      cover: latest.current.tracks[0]?.cover ?? '',
      local: true,
    }));
    const all = [...latest.current.tracks, ...added];
    latest.current = { ...latest.current, tracks: all };
    setTracks(all);
    if (latest.current.shuffle) setOrder(createShuffleOrder(all.length, latest.current.current));
    return added.length;
  }, []);

  const clearLocalFiles = useCallback(() => {
    const { tracks: all, current: cur } = latest.current;
    const kept = all.filter((t) => !t.local);
    all.filter((t) => t.local).forEach((t) => URL.revokeObjectURL(t.src));
    setTracks(kept);
    if (latest.current.shuffle) setOrder(createShuffleOrder(kept.length, 0));
    if (all[cur]?.local) {
      audio.pause();
      latest.current = { ...latest.current, tracks: kept };
      loadTrack(0, { autoplay: false });
    }
  }, [loadTrack]);

  // Eventos del elemento de audio.
  useEffect(() => {
    let lastSaved = 0;
    const onLoadStart = () => setStatus('loading');
    const onMeta = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
      if (audio.paused) setStatus((s) => (s === 'loading' ? 'ready' : s));
    };
    const onCanPlay = () => setStatus((s) => (s === 'error' ? s : 'ready'));
    const onWaiting = () => setStatus('loading');
    const onPlaying = () => setStatus('ready');
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (Math.abs(audio.currentTime - lastSaved) >= SAVE_TIME_EVERY) {
        lastSaved = audio.currentTime;
        saveState({ time: audio.currentTime });
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      setIsPlaying(false);
      saveState({ time: audio.currentTime });
    };
    const onError = () => {
      if (!audio.src) return;
      setIsPlaying(false);
      setStatus('error');
      setError(mediaErrorMessage(audio.error));
    };
    const onEnded = () => {
      const { current: cur, tracks: all, shuffle: sh, repeat: rp, order: ord } = latest.current;
      const i = getNextIndex({ current: cur, length: all.length, shuffle: sh, repeat: rp, order: ord }, { auto: true });
      if (i === null) {
        setIsPlaying(false);
        audio.currentTime = 0;
        return;
      }
      if (i === cur) {
        audio.currentTime = 0;
        void play();
      } else {
        loadTrack(i, { autoplay: true });
      }
    };
    const onPageHide = () => saveState({ time: audio.currentTime });

    const events: Array<[string, () => void]> = [
      ['loadstart', onLoadStart],
      ['loadedmetadata', onMeta],
      ['durationchange', onMeta],
      ['canplay', onCanPlay],
      ['waiting', onWaiting],
      ['playing', onPlaying],
      ['timeupdate', onTime],
      ['play', onPlay],
      ['pause', onPause],
      ['error', onError],
      ['ended', onEnded],
    ];
    events.forEach(([e, h]) => audio.addEventListener(e, h));
    window.addEventListener('pagehide', onPageHide);
    return () => {
      events.forEach(([e, h]) => audio.removeEventListener(e, h));
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [play, loadTrack]);

  // Primera carga: la pista y la posición recordadas, sin reproducir (los
  // navegadores bloquean la reproducción automática sin interacción).
  useEffect(() => {
    loadTrack(latest.current.current, { autoplay: false, startAt: saved.time });
    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
    // Solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Volumen y silencio.
  useEffect(() => {
    audio.volume = volume;
    audio.muted = muted;
    saveState({ volume, muted });
  }, [volume, muted]);

  useEffect(() => {
    saveState({ shuffle, repeat });
  }, [shuffle, repeat]);

  return {
    tracks,
    track,
    current,
    isPlaying,
    status,
    error,
    currentTime,
    duration,
    volume,
    muted,
    shuffle,
    repeat,
    play,
    pause,
    togglePlay,
    next,
    prev,
    selectTrack,
    seek,
    skip,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    retry,
    addLocalFiles,
    clearLocalFiles,
  };
}

export type AudioPlayer = ReturnType<typeof useAudioPlayer>;
