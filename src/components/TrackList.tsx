import { useEffect, useRef, type ChangeEvent } from 'react';
import type { Track } from '../data/tracks';
import { formatTime } from '../lib/playerLogic';
import { Icon } from './Icon';

interface Props {
  id: string;
  open: boolean;
  tracks: Track[];
  current: number;
  isPlaying: boolean;
  onSelect: (index: number) => void;
  onClose: () => void;
  onAddFiles: (files: FileList) => number;
  onClearLocal: () => void;
}

/** Panel lateral con la lista de pistas (la «Song List» original). */
export function TrackList({ id, open, tracks, current, isPlaying, onSelect, onClose, onAddFiles, onClearLocal }: Props) {
  const panelRef = useRef<HTMLElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const hasLocal = tracks.some((t) => t.local);

  // Al abrir, lleva el foco a la pista actual; Esc cierra.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const active = panel?.querySelector<HTMLButtonElement>('[aria-current="true"]');
    (active ?? panel?.querySelector<HTMLButtonElement>('button'))?.focus({ preventScroll: false });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const onFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onAddFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <>
      <div className={`scrim${open ? ' is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside
        ref={panelRef}
        id={id}
        className={`sidebar${open ? ' is-open' : ''}`}
        aria-label="Lista de canciones"
        inert={!open}
      >
        <header className="sidebar__header">
          <h2>Lista de canciones</h2>
          <button type="button" className="btn btn--small" aria-label="Cerrar lista" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </header>

        <ol className="tracklist">
          {tracks.map((t, i) => {
            const isCurrent = i === current;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  className={`track${isCurrent ? ' is-current' : ''}`}
                  aria-current={isCurrent ? 'true' : undefined}
                  onClick={() => onSelect(i)}
                >
                  <span className="track__num" aria-hidden="true">
                    {isCurrent && isPlaying ? <span className="eq"><i /><i /><i /></span> : t.local ? '·' : t.number}
                  </span>
                  <span className="track__title">
                    {t.title}
                    {t.local && <span className="track__meta">Archivo local</span>}
                  </span>
                  <span className="track__dur">{t.duration ? formatTime(t.duration) : ''}</span>
                  <span className="visually-hidden">{isCurrent ? (isPlaying ? ', sonando' : ', seleccionada') : ''}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="sidebar__footer">
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            multiple
            hidden
            onChange={onFiles}
          />
          <button type="button" className="btn btn--text" onClick={() => fileRef.current?.click()}>
            <Icon name="add" size={18} /> Añadir archivos de tu equipo
          </button>
          {hasLocal && (
            <button type="button" className="btn btn--text btn--quiet" onClick={onClearLocal}>
              Quitar archivos locales
            </button>
          )}
          <p className="sidebar__note">Los archivos se reproducen solo en tu navegador; no se suben a ningún sitio.</p>
        </div>
      </aside>
    </>
  );
}
