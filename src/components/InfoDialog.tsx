import { useEffect, useRef } from 'react';
import { ALBUM, OFFICIAL_LINKS } from '../data/tracks';
import type { Shortcut } from '../hooks/useKeyboardShortcuts';
import { Icon } from './Icon';

interface Props {
  open: boolean;
  onClose: () => void;
  shortcuts: Shortcut[];
}

/** Créditos, enlaces oficiales y atajos de teclado (diálogo modal nativo). */
export function InfoDialog({ open, onClose, shortcuts }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="info-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog__body">
        <header className="dialog__header">
          <h2 id="info-title">Créditos</h2>
          <button type="button" className="btn btn--small" aria-label="Cerrar" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </header>

        <section aria-labelledby="cred-album">
          <h3 id="cred-album">Música</h3>
          <p>
            <strong>{ALBUM.title}</strong> ({ALBUM.year}) de <strong>{ALBUM.artist}</strong>, publicado el
            29 de octubre de 2019 por {ALBUM.label}, el sello de la banda. Si te gusta, apóyalos comprando el
            álbum en sus canales oficiales:
          </p>
          <ul className="links">
            {OFFICIAL_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                  <Icon name="external" size={14} />
                  <span className="visually-hidden"> (se abre en otra pestaña)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cred-note">
          <h3 id="cred-note">Aviso</h3>
          <p>
            Proyecto educativo y sin fines de lucro. Los derechos del audio y de la portada pertenecen a sus
            titulares; aquí se usan solo con fines de aprendizaje y se retirarán a petición de ellos.
          </p>
        </section>

        <section aria-labelledby="cred-code">
          <h3 id="cred-code">Código y tipografía</h3>
          <p>
            Código de Marlon Torres Espinoza bajo licencia MIT (no cubre el audio ni la portada).{' '}
            <a href="https://github.com/mrln-trrs/Wallpaper-Whirr-music" target="_blank" rel="noopener noreferrer">
              Repositorio
            </a>
            . Tipografía Montserrat (Julieta Ulanovsky y colaboradores) bajo{' '}
            <a href="https://openfontlicense.org/" target="_blank" rel="noopener noreferrer">
              SIL Open Font License 1.1
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="cred-keys">
          <h3 id="cred-keys">Atajos de teclado</h3>
          <dl className="keys">
            {shortcuts.map((s) => (
              <div key={s.label}>
                <dt>
                  <kbd>{s.hint}</kbd>
                </dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </dialog>
  );
}
