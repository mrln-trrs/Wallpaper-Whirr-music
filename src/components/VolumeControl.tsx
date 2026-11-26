import type { CSSProperties } from 'react';
import { Icon } from './Icon';

interface Props {
  volume: number;
  muted: boolean;
  onVolume: (v: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({ volume, muted, onVolume, onToggleMute }: Props) {
  const effective = muted ? 0 : volume;
  const icon = effective === 0 ? 'muted' : effective < 0.5 ? 'volumeLow' : 'volume';
  return (
    <div className="volume">
      <button
        type="button"
        className="btn btn--small"
        aria-label={muted ? 'Activar sonido' : 'Silenciar'}
        aria-pressed={muted}
        title={muted ? 'Activar sonido (M)' : 'Silenciar (M)'}
        onClick={onToggleMute}
      >
        <Icon name={icon} size={20} />
      </button>
      <input
        type="range"
        className="volume__range"
        min={0}
        max={100}
        step={1}
        value={Math.round(effective * 100)}
        aria-label="Volumen"
        aria-valuetext={`${Math.round(effective * 100)} %`}
        style={{ '--fill': `${effective * 100}%` } as CSSProperties}
        onChange={(e) => onVolume(Number(e.target.value) / 100)}
      />
    </div>
  );
}
