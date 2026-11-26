import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ALBUM, ALBUM_TRACKS } from './data/tracks';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useKeyboardShortcuts, type Shortcut } from './hooks/useKeyboardShortcuts';
import { useMediaSession } from './hooks/useMediaSession';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useVisualizer } from './hooks/useVisualizer';
import { loadSaved, saveState } from './lib/storage';
import { Icon } from './components/Icon';
import { InfoDialog } from './components/InfoDialog';
import { PlayerControls } from './components/PlayerControls';
import { ProgressBar } from './components/ProgressBar';
import { TrackList } from './components/TrackList';
import { VolumeControl } from './components/VolumeControl';

const SIDEBAR_ID = 'lista-canciones';

export default function App() {
  const p = useAudioPlayer(ALBUM_TRACKS);
  const reducedMotion = useReducedMotion();
  const [listOpen, setListOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [vizEnabled, setVizEnabled] = useState(() => loadSaved().visualizer ?? true);
  const [notice, setNotice] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const track = p.track;
  const cover = track?.cover ?? ALBUM.cover;

  useVisualizer(canvasRef, vizEnabled && !reducedMotion && p.isPlaying);

  const { play, pause, next, prev, seek, skip } = p;
  const mediaHandlers = useMemo(() => ({ play: () => void play(), pause, next, prev, seek, skip }), [
    play,
    pause,
    next,
    prev,
    seek,
    skip,
  ]);
  useMediaSession(track, p.isPlaying, { currentTime: p.currentTime, duration: p.duration }, mediaHandlers);

  useEffect(() => {
    document.title = track && p.isPlaying ? `${track.title} · ${track.artist}` : `${ALBUM.artist} · ${ALBUM.title}`;
  }, [track, p.isPlaying]);

  useEffect(() => saveState({ visualizer: vizEnabled }), [vizEnabled]);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(t);
  }, [notice]);

  const closeList = useCallback(() => {
    setListOpen(false);
    menuBtnRef.current?.focus();
  }, []);

  const { volume, setVolume, toggleMute, togglePlay, toggleShuffle, cycleRepeat } = p;
  const shortcuts: Shortcut[] = useMemo(
    () => [
      { keys: [' ', 'k'], label: 'Reproducir o pausar', hint: 'Espacio / K', run: togglePlay },
      { keys: ['ArrowRight'], label: 'Adelantar 15 s', hint: '→', run: () => skip(15) },
      { keys: ['ArrowLeft'], label: 'Retroceder 15 s', hint: '←', run: () => skip(-15) },
      { keys: ['ArrowRight'], shift: true, label: 'Pista siguiente', hint: 'Mayús + →', run: next },
      { keys: ['ArrowLeft'], shift: true, label: 'Pista anterior', hint: 'Mayús + ←', run: prev },
      { keys: ['n'], label: 'Pista siguiente', hint: 'N', run: next },
      { keys: ['p'], label: 'Pista anterior', hint: 'P', run: prev },
      { keys: ['ArrowUp'], label: 'Subir volumen', hint: '↑', run: () => setVolume(volume + 0.05) },
      { keys: ['ArrowDown'], label: 'Bajar volumen', hint: '↓', run: () => setVolume(volume - 0.05) },
      { keys: ['m'], label: 'Silenciar', hint: 'M', run: toggleMute },
      { keys: ['s'], label: 'Aleatorio', hint: 'S', run: toggleShuffle },
      { keys: ['r'], label: 'Repetir (no / lista / una)', hint: 'R', run: cycleRepeat },
      { keys: ['l'], label: 'Mostrar u ocultar la lista', hint: 'L', run: () => setListOpen((o) => !o) },
      { keys: ['v'], label: 'Visualizador', hint: 'V', run: () => setVizEnabled((v) => !v) },
      { keys: ['i', '?'], label: 'Créditos y atajos', hint: 'I', run: () => setInfoOpen(true) },
    ],
    [togglePlay, skip, next, prev, volume, setVolume, toggleMute, toggleShuffle, cycleRepeat],
  );
  useKeyboardShortcuts(shortcuts, !infoOpen);

  const onAddFiles = useCallback(
    (files: FileList) => {
      const n = p.addLocalFiles(files);
      setNotice(n > 0 ? `Se añadieron ${n} archivo${n === 1 ? '' : 's'} al final de la lista.` : 'Ningún archivo era de audio.');
      return n;
    },
    [p],
  );

  return (
    <div className={`app${reducedMotion ? ' reduce-motion' : ''}`}>
      <div className="background" aria-hidden="true">
        <img src={cover} alt="" className="background__img" />
      </div>

      <header className="topbar">
        <button
          ref={menuBtnRef}
          type="button"
          className="btn btn--small"
          aria-label={listOpen ? 'Ocultar lista de canciones' : 'Mostrar lista de canciones'}
          aria-expanded={listOpen}
          aria-controls={SIDEBAR_ID}
          title="Lista de canciones (L)"
          onClick={() => setListOpen((o) => !o)}
        >
          <Icon name="menu" size={22} />
        </button>
        <button
          type="button"
          className="btn btn--small"
          aria-label="Créditos y atajos de teclado"
          title="Créditos y atajos (I)"
          onClick={() => setInfoOpen(true)}
        >
          <Icon name="info" size={22} />
        </button>
      </header>

      <TrackList
        id={SIDEBAR_ID}
        open={listOpen}
        tracks={p.tracks}
        current={p.current}
        isPlaying={p.isPlaying}
        onSelect={p.selectTrack}
        onClose={closeList}
        onAddFiles={onAddFiles}
        onClearLocal={p.clearLocalFiles}
      />

      <main className="player" aria-label="Reproductor">
        <figure className={`cover${p.isPlaying ? ' is-playing' : ''}`}>
          <img
            src={cover}
            alt={`Portada del álbum ${ALBUM.title} de ${ALBUM.artist}`}
            width={1080}
            height={1080}
          />
        </figure>

        <div className="meta">
          <p className="meta__album">
            {track?.local ? 'Archivo local' : `${ALBUM.artist} — ${ALBUM.title}`}
          </p>
          <h1 className="meta__title" aria-live="polite">
            {track?.title ?? 'Sin pistas'}
          </h1>
        </div>

        <canvas
          ref={canvasRef}
          className={`visualizer${vizEnabled && !reducedMotion ? '' : ' is-off'}`}
          aria-hidden="true"
        />

        <ProgressBar currentTime={p.currentTime} duration={p.duration} onSeek={p.seek} />

        <PlayerControls
          isPlaying={p.isPlaying}
          loading={p.status === 'loading' && p.isPlaying}
          shuffle={p.shuffle}
          repeat={p.repeat}
          onTogglePlay={p.togglePlay}
          onPrev={p.prev}
          onNext={p.next}
          onSkip={p.skip}
          onToggleShuffle={p.toggleShuffle}
          onCycleRepeat={p.cycleRepeat}
        />

        <div className="secondary">
          <VolumeControl volume={p.volume} muted={p.muted} onVolume={p.setVolume} onToggleMute={p.toggleMute} />
          {!reducedMotion && (
            <button
              type="button"
              className="btn btn--small btn--toggle"
              aria-pressed={vizEnabled}
              aria-label="Visualizador"
              title="Visualizador (V)"
              onClick={() => setVizEnabled((v) => !v)}
            >
              <Icon name="bars" size={20} />
            </button>
          )}
        </div>

        <div className="status" role="status" aria-live="polite">
          {p.status === 'error' && p.error ? (
            <span className="status__error">
              {p.error}{' '}
              <button type="button" className="btn btn--text" onClick={p.retry}>
                Reintentar
              </button>
              <button type="button" className="btn btn--text" onClick={p.next}>
                Saltar
              </button>
            </span>
          ) : p.status === 'loading' && p.isPlaying ? (
            'Cargando…'
          ) : (
            notice ?? ''
          )}
        </div>
      </main>

      <footer className="footer">
        Proyecto educativo sin fines de lucro · Música y portada © {ALBUM.artist} ·{' '}
        <button type="button" className="link" onClick={() => setInfoOpen(true)}>
          Créditos y enlaces oficiales
        </button>
      </footer>

      <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} shortcuts={shortcuts} />
    </div>
  );
}
