import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { formatTime } from '../lib/playerLogic';

interface Props {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

/** Barra de progreso arrastrable con ratón, dedo y teclado (rol slider). */
export function ProgressBar({ currentTime, duration, onSeek }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragTime, setDragTime] = useState<number | null>(null);
  const known = Number.isFinite(duration) && duration > 0;
  const shown = dragTime ?? currentTime;
  const pct = known ? Math.min(100, (shown / duration) * 100) : 0;

  const timeAt = (clientX: number) => {
    const el = trackRef.current;
    if (!el || !known) return 0;
    const r = el.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * duration;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!known || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragTime(timeAt(e.clientX));
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragTime !== null) setDragTime(timeAt(e.clientX));
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragTime === null) return;
    onSeek(timeAt(e.clientX));
    setDragTime(null);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!known) return;
    const step = e.shiftKey ? 30 : 5;
    const map: Record<string, number> = {
      ArrowRight: currentTime + step,
      ArrowUp: currentTime + step,
      ArrowLeft: currentTime - step,
      ArrowDown: currentTime - step,
      PageUp: currentTime + 30,
      PageDown: currentTime - 30,
      Home: 0,
      End: duration - 1,
    };
    const t = map[e.key];
    if (t === undefined) return;
    e.preventDefault();
    onSeek(t);
  };

  return (
    <div className="progress">
      <span className="progress__time" aria-hidden="true">
        {formatTime(shown)}
      </span>
      <div
        ref={trackRef}
        className={`progress__track${dragTime !== null ? ' is-dragging' : ''}`}
        role="slider"
        tabIndex={known ? 0 : -1}
        aria-label="Posición de la pista"
        aria-valuemin={0}
        aria-valuemax={known ? Math.floor(duration) : 0}
        aria-valuenow={Math.floor(shown)}
        aria-valuetext={`${formatTime(shown)} de ${formatTime(duration)}`}
        aria-disabled={!known}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setDragTime(null)}
        onKeyDown={onKeyDown}
      >
        <div className="progress__rail">
          <div className="progress__fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress__thumb" style={{ left: `${pct}%` }} />
      </div>
      <span className="progress__time" aria-hidden="true">
        {known ? formatTime(duration) : '--:--'}
      </span>
    </div>
  );
}
