import { resolveCharacterSet, type CharacterSetKey } from './characterSets';

export type RenderingMode = 'smooth' | 'high-contrast' | 'edge-enhanced';
export type SurfaceTone = 'dark' | 'light';
export type ForegroundTone = 'light' | 'dark';

export interface AsciiSettings {
  width: number;
  characterSet: CharacterSetKey;
  customCharacterSet: string;
  contrast: number;
  brightness: number;
  invert: boolean;
  renderingMode: RenderingMode;
  background: SurfaceTone;
  foreground: ForegroundTone;
}

export interface AsciiResult {
  text: string;
  width: number;
  height: number;
}

function clamp(value: number, min = 0, max = 255) {
  return Math.min(max, Math.max(min, value));
}

function applyContrast(value: number, contrast: number) {
  const factor = contrast / 100;
  return clamp((value - 128) * factor + 128);
}

function luminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Turns a decoded image into text. Character height is compensated with a
 * 0.48 factor so circles, faces, and silhouettes keep their proportions.
 */
export function convertImageToAscii(image: HTMLImageElement, settings: AsciiSettings): AsciiResult {
  const width = Math.max(24, Math.min(400, Math.round(settings.width)));
  const height = Math.max(1, Math.round((image.naturalHeight / image.naturalWidth) * width * 0.48));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas processing is not available in this browser.');

  context.drawImage(image, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height).data;
  const grayscale = new Float32Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      let value = luminance(pixels[index], pixels[index + 1], pixels[index + 2]);
      value = applyContrast(value, settings.contrast);
      value = clamp(value + settings.brightness * 2.55);
      if (settings.invert) value = 255 - value;
      grayscale[y * width + x] = value;
    }
  }

  const characters = resolveCharacterSet(settings.characterSet, settings.customCharacterSet);
  const maxIndex = Math.max(1, characters.length - 1);
  const rows: string[] = [];

  for (let y = 0; y < height; y += 1) {
    let row = '';
    for (let x = 0; x < width; x += 1) {
      let value = grayscale[y * width + x];

      if (settings.renderingMode === 'high-contrast') {
        value = value < 128 ? value * 0.45 : 128 + (value - 128) * 1.55;
      } else if (settings.renderingMode === 'edge-enhanced') {
        const left = grayscale[y * width + Math.max(0, x - 1)];
        const right = grayscale[y * width + Math.min(width - 1, x + 1)];
        const top = grayscale[Math.max(0, y - 1) * width + x];
        const bottom = grayscale[Math.min(height - 1, y + 1) * width + x];
        const edge = Math.min(255, Math.abs(right - left) + Math.abs(bottom - top));
        value = clamp(value * 0.72 + (255 - edge) * 0.28);
      }

      const index = Math.round((value / 255) * maxIndex);
      row += characters[index] ?? characters[characters.length - 1] ?? ' ';
    }
    rows.push(row);
  }

  return { text: rows.join('\n'), width, height };
}

export async function decodeImage(source: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.decoding = 'async';
  image.src = source;
  await image.decode();
  return image;
}
