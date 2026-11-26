import { useEffect, useRef } from 'react';

export interface Shortcut {
  /** Valores de `KeyboardEvent.key` (en minúscula para letras). */
  keys: string[];
  /** Exige Mayús pulsada (p. ej. Mayús + flecha = cambiar de pista). */
  shift?: boolean;
  /** Texto para la ayuda. */
  label: string;
  /** Texto de las teclas para la ayuda. */
  hint: string;
  run: () => void;
}

/** Elementos donde la tecla ya tiene un significado propio. */
function isInteractive(target: EventTarget | null, key: string): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag === 'INPUT') {
    const type = (target as HTMLInputElement).type;
    // Un deslizador usa las flechas; un texto usa todo.
    return type !== 'range' || key.startsWith('Arrow') || key === 'Home' || key === 'End';
  }
  if (target.getAttribute('role') === 'slider' && (key.startsWith('Arrow') || key === 'Home' || key === 'End')) {
    return true;
  }
  // En botones y enlaces, Espacio/Intro ya los activan.
  if ((tag === 'BUTTON' || tag === 'A' || target.getAttribute('role') === 'option') && (key === ' ' || key === 'Enter')) {
    return true;
  }
  return false;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled = true) {
  const ref = useRef(shortcuts);
  useEffect(() => {
    ref.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      if (isInteractive(e.target, e.key)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const match = ref.current.find((s) => s.keys.includes(key) && Boolean(s.shift) === e.shiftKey);
      if (!match) return;
      e.preventDefault();
      match.run();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
