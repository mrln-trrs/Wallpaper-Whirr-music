const PATHS = {
  play: 'M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z',
  pause: 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z',
  next: 'M6 6.5v11a.8.8 0 0 0 1.2.7L15 12.7a.8.8 0 0 0 0-1.4L7.2 5.8A.8.8 0 0 0 6 6.5ZM16.5 6h2v12h-2z',
  prev: 'M18 6.5v11a.8.8 0 0 1-1.2.7L9 12.7a.8.8 0 0 1 0-1.4l7.8-5.5a.8.8 0 0 1 1.2.7ZM5.5 6h2v12h-2z',
  back15: 'M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8Z',
  fwd15: 'M12 5V2l5 4-5 4V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8Z',
  shuffle:
    'M17 3l4 4-4 4V8h-2.6a3 3 0 0 0-2.5 1.3l-1 1.5-1.2-1.8 1-1.4A5 5 0 0 1 14.4 6H17V3ZM3 6h3.6a5 5 0 0 1 4.1 2.1l5.6 7.6a3 3 0 0 0 2.5 1.3H17v-3l4 4-4 4v-3h-2.4a5 5 0 0 1-4.1-2.1L5 9.3A3 3 0 0 0 2.6 8H3V6Zm0 10h-.4a3 3 0 0 0 2.5-1.3l1-1.4 1.2 1.7-1 1.4A5 5 0 0 1 2.6 18H3v-2Z',
  repeat: 'M7 7h10v3l4-4-4-4v3H5v6h2V7Zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4Z',
  volume:
    'M4 9v6h4l5 5V4L8 9H4Zm12.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4ZM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6Z',
  volumeLow: 'M5 9v6h4l5 5V4L9 9H5Zm11.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4Z',
  muted:
    'M4 9v6h4l5 5V4L8 9H4Zm12.6 3 2.7-2.7-1.4-1.4-2.7 2.7-2.7-2.7-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4-2.7-2.7Z',
  menu: 'M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z',
  close: 'M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4 17.6 5 12 10.6 6.4 5Z',
  info: 'M11 10h2v7h-2zM11 7h2v2h-2zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z',
  add: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z',
  bars: 'M4 14h3v6H4zM10.5 8h3v12h-3zM17 4h3v16h-3z',
  external: 'M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d={PATHS[name]} />
    </svg>
  );
}
