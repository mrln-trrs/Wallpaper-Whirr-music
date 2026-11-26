/** Lógica pura del reproductor (sin DOM), para poder probarla con Vitest. */

export type RepeatMode = 'off' | 'all' | 'one';

export interface QueueState {
  /** Índice de la pista actual dentro de la lista. */
  current: number;
  /** Número de pistas en la lista. */
  length: number;
  shuffle: boolean;
  repeat: RepeatMode;
  /** Orden aleatorio (permutación de 0..length-1); solo se usa con shuffle. */
  order: readonly number[];
}

/** Segundos tras los que «anterior» reinicia la pista en vez de retroceder. */
export const RESTART_THRESHOLD = 3;

const REPEAT_CYCLE: readonly RepeatMode[] = ['off', 'all', 'one'];

export function nextRepeatMode(mode: RepeatMode): RepeatMode {
  const i = REPEAT_CYCLE.indexOf(mode);
  return REPEAT_CYCLE[(i + 1) % REPEAT_CYCLE.length] ?? 'off';
}

/** Secuencia de reproducción efectiva: el orden aleatorio o el natural. */
function sequence(state: QueueState): readonly number[] {
  if (state.shuffle && state.order.length === state.length) return state.order;
  return Array.from({ length: state.length }, (_, i) => i);
}

/**
 * Siguiente pista.
 * - `auto: true` cuando termina la pista: respeta «repetir una» y, con
 *   repetir desactivado, devuelve `null` al final de la lista (se detiene).
 * - `auto: false` cuando lo pide el usuario: siempre avanza y da la vuelta.
 */
export function getNextIndex(state: QueueState, opts: { auto: boolean }): number | null {
  if (state.length === 0) return null;
  if (opts.auto && state.repeat === 'one') return state.current;
  const seq = sequence(state);
  const pos = seq.indexOf(state.current);
  const nextPos = pos + 1;
  if (nextPos >= seq.length) {
    if (opts.auto && state.repeat === 'off') return null;
    return seq[0] ?? null;
  }
  return seq[nextPos] ?? null;
}

/** Pista anterior; siempre da la vuelta al principio de la lista. */
export function getPrevIndex(state: QueueState): number | null {
  if (state.length === 0) return null;
  const seq = sequence(state);
  const pos = seq.indexOf(state.current);
  const prevPos = pos <= 0 ? seq.length - 1 : pos - 1;
  return seq[prevPos] ?? null;
}

/** «Anterior» reinicia la pista si ya avanzó más de unos segundos. */
export function shouldRestart(currentTime: number): boolean {
  return Number.isFinite(currentTime) && currentTime > RESTART_THRESHOLD;
}

/**
 * Orden aleatorio (Fisher–Yates) que empieza por la pista actual, para que
 * activar el modo aleatorio no corte lo que está sonando.
 */
export function createShuffleOrder(
  length: number,
  current: number,
  random: () => number = Math.random,
): number[] {
  const rest = Array.from({ length }, (_, i) => i).filter((i) => i !== current);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [rest[i], rest[j]] = [rest[j]!, rest[i]!];
  }
  return current >= 0 && current < length ? [current, ...rest] : rest;
}

/** Limita un tiempo a [0, duración]; tolera NaN/Infinity (metadatos sin cargar). */
export function clampTime(time: number, duration: number): number {
  if (!Number.isFinite(time) || time < 0) return 0;
  if (!Number.isFinite(duration) || duration <= 0) return time;
  return Math.min(time, duration);
}

export function clampVolume(v: number): number {
  if (!Number.isFinite(v)) return 1;
  return Math.min(1, Math.max(0, v));
}

/** 75 → «1:15»; 3725 → «1:02:05»; valores no válidos → «0:00». */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}
