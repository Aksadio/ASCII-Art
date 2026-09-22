import type { AsciiResult, AsciiSettings } from './asciiConverter';

const MONO_FONT = 'IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace';

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadAsciiText(result: AsciiResult, baseName = 'ascii-vision') {
  triggerDownload(new Blob([result.text], { type: 'text/plain;charset=utf-8' }), `${baseName}.txt`);
}

export function downloadAsciiPng(
  result: AsciiResult,
  options: { background: string; foreground: string; fontSize: number; lineHeight: number },
  baseName = 'ascii-vision',
) {
  const canvas = document.createElement('canvas');
  const measureContext = canvas.getContext('2d');
  if (!measureContext) return;

  measureContext.font = `${options.fontSize}px ${MONO_FONT}`;
  const charWidth = Math.ceil(measureContext.measureText('M').width);
  const lineHeight = Math.ceil(options.fontSize * options.lineHeight);
  const lines = result.text.split('\n');
  const padding = Math.max(24, Math.round(options.fontSize * 1.5));

  canvas.width = Math.max(1, result.width * charWidth + padding * 2);
  canvas.height = Math.max(1, lines.length * lineHeight + padding * 2);
  const context = canvas.getContext('2d');
  if (!context) return;

  context.fillStyle = options.background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = `${options.fontSize}px ${MONO_FONT}`;
  context.textBaseline = 'top';
  context.fillStyle = options.foreground;

  lines.forEach((line, index) => {
    context.fillText(line, padding, padding + index * lineHeight);
  });

  canvas.toBlob((blob) => {
    if (blob) triggerDownload(blob, `${baseName}.png`);
  }, 'image/png');
}
