import type { RepeatMode } from './playerLogic';

const KEY = 'wallpaper-whirr-music:v1';

export interface SavedState {
  trackId?: string;
  time?: number;
  volume?: number;
  muted?: boolean;
  shuffle?: boolean;
  repeat?: RepeatMode;
  visualizer?: boolean;
}

const REPEAT_VALUES: readonly RepeatMode[] = ['off', 'all', 'one'];

/** Lee el estado guardado validando cada campo (localStorage puede no existir o traer basura). */
export function loadSaved(): SavedState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const o: unknown = JSON.parse(raw);
    if (typeof o !== 'object' || o === null) return {};
    const r = o as Record<string, unknown>;
    const out: SavedState = {};
    if (typeof r.trackId === 'string') out.trackId = r.trackId;
    if (typeof r.time === 'number' && Number.isFinite(r.time) && r.time >= 0) out.time = r.time;
    if (typeof r.volume === 'number' && Number.isFinite(r.volume)) out.volume = r.volume;
    if (typeof r.muted === 'boolean') out.muted = r.muted;
    if (typeof r.shuffle === 'boolean') out.shuffle = r.shuffle;
    if (typeof r.visualizer === 'boolean') out.visualizer = r.visualizer;
    if (typeof r.repeat === 'string' && (REPEAT_VALUES as readonly string[]).includes(r.repeat)) {
      out.repeat = r.repeat as RepeatMode;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveState(patch: SavedState): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...loadSaved(), ...patch }));
  } catch {
    // Navegación privada o almacenamiento bloqueado: la app funciona igual.
  }
}
