export interface Track {
  /** Identificador estable (se guarda en localStorage). */
  id: string;
  /** Número de pista dentro del álbum (0 para archivos locales). */
  number: number;
  title: string;
  artist: string;
  album: string;
  /** URL del audio. */
  src: string;
  /** URL de la portada. */
  cover: string;
  /** Duración de referencia en segundos (la real se lee del archivo). */
  duration?: number;
  /** true si es un archivo que el usuario añadió desde su equipo. */
  local?: boolean;
}

const base = import.meta.env.BASE_URL;

export const ALBUM = {
  title: 'Feels Like You',
  artist: 'Whirr',
  year: 2019,
  releaseDate: '2019-10-29',
  label: 'Free Whirl',
  cover: `${base}img/feels-like-you.png`,
} as const;

/** Enlaces oficiales verificados el 26-nov-2026. */
export const OFFICIAL_LINKS = [
  { label: 'Álbum en Bandcamp', href: 'https://whirrband.bandcamp.com/album/feels-like-you' },
  { label: 'Whirr en Bandcamp', href: 'https://whirrband.bandcamp.com/' },
  { label: 'Free Whirl (tienda oficial)', href: 'https://www.freewhirl.com/' },
  { label: 'Apple Music', href: 'https://music.apple.com/us/artist/whirr/463980313' },
  { label: 'Deezer', href: 'https://www.deezer.com/artist/1437839' },
  { label: 'Instagram', href: 'https://www.instagram.com/whirrband/' },
] as const;

const RAW: ReadonlyArray<[file: string, title: string, duration: number]> = [
  ['01Mellow.mp3', 'Mellow', 313.6],
  ['02Wavelength.mp3', 'Wavelength', 297.6],
  ['03YoungerThanYou.mp3', 'Younger Than You', 269.7],
  ['04RoseCold.mp3', 'Rose Cold', 325.0],
  ['05BeforeYouHeadOff.mp3', 'Before You Head Off', 247.6],
  ['06HowTimeStretches.mp3', 'How Time Stretches', 216.5],
  ['07Rental.mp3', 'Rental', 243.1],
  ['08Vividly.mp3', 'Vividly', 238.1],
  ['09PlayTheSlowOnes.mp3', 'Play The Slow Ones', 283.9],
  ['10UnderTheSameName.mp3', 'Under The Same Name', 279.5],
];

export const ALBUM_TRACKS: Track[] = RAW.map(([file, title, duration], i) => ({
  id: `whirr-fly-${String(i + 1).padStart(2, '0')}`,
  number: i + 1,
  title,
  artist: ALBUM.artist,
  album: ALBUM.title,
  src: `${base}music/${file}`,
  cover: ALBUM.cover,
  duration,
}));
