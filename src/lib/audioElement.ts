/**
 * Elemento <audio> único de la aplicación. Vive fuera de React porque es un
 * objeto externo y mutable (src, volume, currentTime…): los componentes lo
 * controlan desde manejadores y efectos, y reflejan su estado con eventos.
 */
export const audio: HTMLAudioElement = new Audio();
audio.preload = 'metadata';
