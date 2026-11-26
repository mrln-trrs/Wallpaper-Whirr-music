import { useEffect, type RefObject } from 'react';
import { audio } from '../lib/audioElement';

const BARS = 48;

// Un solo grafo por elemento <audio>: createMediaElementSource solo se puede llamar una vez.
let graph: { ctx: AudioContext; analyser: AnalyserNode } | null = null;

/**
 * Visualizador de barras con Web Audio. El grafo (fuente → analizador →
 * salida) se crea la primera vez que se activa con audio sonando, porque los
 * navegadores exigen una interacción para iniciar un AudioContext. Una vez
 * conectado el elemento no puede desconectarse, así que al desactivarlo solo
 * se deja de dibujar.
 */
export function useVisualizer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  active: boolean,
) {
  // Reanuda el contexto cuando vuelve a sonar (se suspende en segundo plano).
  useEffect(() => {
    const onPlay = () => {
      if (graph?.ctx.state === 'suspended') void graph.ctx.resume();
    };
    audio.addEventListener('play', onPlay);
    return () => audio.removeEventListener('play', onPlay);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!active || !canvas) return;

    if (!graph) {
      try {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.82;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        graph = { ctx, analyser };
      } catch {
        return; // Sin Web Audio: la música sigue sonando sin visualizador.
      }
    }
    const { ctx, analyser } = graph;
    if (ctx.state === 'suspended') void ctx.resume();

    const g = canvas.getContext('2d');
    if (!g) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      analyser.getByteFrequencyData(data);
      const gap = 3;
      const barW = (w - gap * (BARS - 1)) / BARS;
      // Se usan las frecuencias bajas y medias, donde está casi toda la energía.
      const usable = Math.floor(data.length * 0.7);
      for (let i = 0; i < BARS; i++) {
        // Reparto logarítmico: más barras para graves y medios, como se oye.
        const idx = Math.min(usable - 1, Math.floor(2 + (usable - 2) * ((Math.pow(10, i / (BARS - 1)) - 1) / 9)));
        const v = (data[idx] ?? 0) / 255;
        const bh = Math.max(2, v * v * h);
        g.fillStyle = `rgba(255,255,255,${0.12 + v * 0.45})`;
        const x = i * (barW + gap);
        g.beginPath();
        g.roundRect(x, h - bh, barW, bh, Math.min(barW / 2, 3));
        g.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      g.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [canvasRef, active]);
}
