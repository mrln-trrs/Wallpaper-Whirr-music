import { describe, expect, it } from 'vitest';
import {
  clampTime,
  createShuffleOrder,
  formatTime,
  getNextIndex,
  getPrevIndex,
  nextRepeatMode,
  shouldRestart,
  type QueueState,
} from './playerLogic';

const base: QueueState = { current: 0, length: 4, shuffle: false, repeat: 'off', order: [] };

describe('siguiente', () => {
  it('avanza en orden', () => {
    expect(getNextIndex({ ...base, current: 1 }, { auto: false })).toBe(2);
  });

  it('el usuario da la vuelta al final aunque repetir esté desactivado', () => {
    expect(getNextIndex({ ...base, current: 3 }, { auto: false })).toBe(0);
  });

  it('al terminar la última pista se detiene si repetir está desactivado', () => {
    expect(getNextIndex({ ...base, current: 3 }, { auto: true })).toBeNull();
  });

  it('con repetir toda la lista vuelve al principio', () => {
    expect(getNextIndex({ ...base, current: 3, repeat: 'all' }, { auto: true })).toBe(0);
  });

  it('con repetir una pista la repite al terminar, pero el usuario puede avanzar', () => {
    const s: QueueState = { ...base, current: 2, repeat: 'one' };
    expect(getNextIndex(s, { auto: true })).toBe(2);
    expect(getNextIndex(s, { auto: false })).toBe(3);
  });

  it('lista vacía', () => {
    expect(getNextIndex({ ...base, length: 0 }, { auto: false })).toBeNull();
    expect(getPrevIndex({ ...base, length: 0 })).toBeNull();
  });
});

describe('anterior', () => {
  it('retrocede y da la vuelta desde la primera', () => {
    expect(getPrevIndex({ ...base, current: 2 })).toBe(1);
    expect(getPrevIndex({ ...base, current: 0 })).toBe(3);
  });

  it('reinicia la pista si ya pasaron más de 3 segundos', () => {
    expect(shouldRestart(10)).toBe(true);
    expect(shouldRestart(1)).toBe(false);
    expect(shouldRestart(Number.NaN)).toBe(false);
  });
});

describe('aleatorio', () => {
  it('el orden es una permutación que empieza por la pista actual', () => {
    const order = createShuffleOrder(10, 4);
    expect(order[0]).toBe(4);
    expect([...order].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('siguiente y anterior siguen el orden aleatorio', () => {
    const s: QueueState = { ...base, current: 2, shuffle: true, order: [2, 0, 3, 1] };
    expect(getNextIndex(s, { auto: false })).toBe(0);
    expect(getNextIndex({ ...s, current: 1 }, { auto: true })).toBeNull();
    expect(getNextIndex({ ...s, current: 1, repeat: 'all' }, { auto: true })).toBe(2);
    expect(getPrevIndex(s)).toBe(1);
    expect(getPrevIndex({ ...s, current: 3 })).toBe(0);
  });

  it('es determinista con un generador fijo', () => {
    const rnd = () => 0;
    expect(createShuffleOrder(4, 0, rnd)).toEqual(createShuffleOrder(4, 0, rnd));
  });
});

describe('utilidades', () => {
  it('ciclo de repetir: no → toda la lista → una pista → no', () => {
    expect(nextRepeatMode('off')).toBe('all');
    expect(nextRepeatMode('all')).toBe('one');
    expect(nextRepeatMode('one')).toBe('off');
  });

  it('clampTime tolera duración desconocida (NaN)', () => {
    expect(clampTime(20, Number.NaN)).toBe(20);
    expect(clampTime(500, 300)).toBe(300);
    expect(clampTime(-5, 300)).toBe(0);
    expect(clampTime(Number.NaN, 300)).toBe(0);
  });

  it('formatTime', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(75.9)).toBe('1:15');
    expect(formatTime(3725)).toBe('1:02:05');
    expect(formatTime(Number.NaN)).toBe('0:00');
  });
});
