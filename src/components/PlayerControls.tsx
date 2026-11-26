import type { RepeatMode } from '../lib/playerLogic';
import { Icon } from './Icon';

interface Props {
  isPlaying: boolean;
  loading: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSkip: (delta: number) => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
}

const REPEAT_LABEL: Record<RepeatMode, string> = {
  off: 'Repetir: desactivado',
  all: 'Repetir: toda la lista',
  one: 'Repetir: una pista',
};

export function PlayerControls(p: Props) {
  return (
    <div className="controls" role="group" aria-label="Controles de reproducción">
      <button
        type="button"
        className="btn btn--toggle"
        aria-pressed={p.shuffle}
        aria-label="Aleatorio"
        title="Aleatorio (S)"
        onClick={p.onToggleShuffle}
      >
        <Icon name="shuffle" size={20} />
      </button>
      <button type="button" className="btn" aria-label="Pista anterior" title="Anterior (Mayús + ←)" onClick={p.onPrev}>
        <Icon name="prev" />
      </button>
      <button
        type="button"
        className="btn btn--skip"
        aria-label="Retroceder 15 segundos"
        title="Retroceder 15 s (←)"
        onClick={() => p.onSkip(-15)}
      >
        <Icon name="back15" size={22} />
        <span className="btn__badge" aria-hidden="true">15</span>
      </button>
      <button
        type="button"
        className={`btn btn--play${p.loading ? ' is-loading' : ''}`}
        aria-label={p.isPlaying ? 'Pausar' : 'Reproducir'}
        title={p.isPlaying ? 'Pausar (Espacio)' : 'Reproducir (Espacio)'}
        onClick={p.onTogglePlay}
      >
        <Icon name={p.isPlaying ? 'pause' : 'play'} size={30} />
      </button>
      <button
        type="button"
        className="btn btn--skip"
        aria-label="Adelantar 15 segundos"
        title="Adelantar 15 s (→)"
        onClick={() => p.onSkip(15)}
      >
        <Icon name="fwd15" size={22} />
        <span className="btn__badge" aria-hidden="true">15</span>
      </button>
      <button type="button" className="btn" aria-label="Pista siguiente" title="Siguiente (Mayús + →)" onClick={p.onNext}>
        <Icon name="next" />
      </button>
      <button
        type="button"
        className="btn btn--toggle"
        aria-pressed={p.repeat !== 'off'}
        aria-label={REPEAT_LABEL[p.repeat]}
        title={`${REPEAT_LABEL[p.repeat]} (R)`}
        onClick={p.onCycleRepeat}
      >
        <Icon name="repeat" size={20} />
        {p.repeat === 'one' && (
          <span className="btn__badge btn__badge--dot" aria-hidden="true">
            1
          </span>
        )}
      </button>
    </div>
  );
}
