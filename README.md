# ASCII Vision

ASCII Vision is a browser-local image processing tool that turns portraits, landscapes, objects, logos, and screenshots into recognizable ASCII art. It is designed as a focused developer utility rather than a one-off image-to-text demo: every control updates the rendered output immediately, the original and generated views can be compared, and exports are created locally on the user's device.

## How the conversion works

1. The browser decodes the selected image into an `HTMLImageElement`.
2. The image is resized to the chosen ASCII width while preserving its aspect ratio. A `0.48` vertical correction compensates for the fact that monospace characters are taller than they are wide.
3. Each sampled cell is converted to perceptual luminance using `0.2126R + 0.7152G + 0.0722B`.
4. Brightness, contrast, inversion, and the selected rendering mode are applied.
5. Luminance is mapped across an ordered character-density ramp such as `@%#*+=-:. `.
6. The result is rendered in a true monospace viewer and can be copied or exported as TXT and PNG.

All image processing happens in the browser through the Canvas API. The source image is not sent to a server.

## Main features

- Drag-and-drop or keyboard-driven image upload with JPG, PNG, WEBP, GIF, BMP, and SVG support.
- Classic, Dense, Minimal, Blocks, Dots, Binary, and custom character ramps.
- Live width, contrast, brightness, inversion, rendering mode, font size, and line-height controls.
- Smooth, high-contrast, and edge-enhanced rendering modes.
- Side-by-side, original-only, ASCII-only, and draggable split comparison views.
- Copy ASCII, download TXT, and download PNG export actions.
- Fullscreen ASCII viewer, responsive mobile layout, local sample image, and human-readable error states.
- Keyboard shortcuts: `Ctrl/Cmd + O` to open, `Ctrl/Cmd + C` while the ASCII viewer is focused to copy, and `Escape` to exit fullscreen.

## Technologies

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Lucide React icons
- Browser-native File, Image, Canvas, Clipboard, Blob, and download APIs

## Run locally

```bash
pnpm install
pnpm dev
```

The production build can be checked with:

```bash
pnpm check
pnpm build
```

## Future improvements

Possible next steps include animated GIF frame playback, optional color ASCII, smart crop modes, adaptive contrast, webcam snapshots, and an OffscreenCanvas worker for extremely large images.
