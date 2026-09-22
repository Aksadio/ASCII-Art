import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Check, Command, Cpu, FileCode2, Gauge, LockKeyhole, MousePointer2, Sparkles, Upload, Zap } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { ControlPanel } from '@/components/ControlPanel';
import { ExportButtons } from '@/components/ExportButtons';
import { ImageComparison, type ViewMode } from '@/components/ImageComparison';
import { useAsciiConverter, type SourceImage } from '@/hooks/useAsciiConverter';
import { downloadAsciiPng, downloadAsciiText } from '@/lib/exportAscii';
import type { AsciiSettings } from '@/lib/asciiConverter';

const DEFAULT_SETTINGS: AsciiSettings = {
  width: 160,
  characterSet: 'classic',
  customCharacterSet: '@%#*+=-:. ',
  contrast: 100,
  brightness: 0,
  invert: false,
  renderingMode: 'smooth',
  background: 'dark',
  foreground: 'light',
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function createSampleSource(): SourceImage {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#16343b"/><stop offset="1" stop-color="#c7a26a"/></linearGradient></defs><rect width="1200" height="800" fill="url(#sky)"/><circle cx="825" cy="222" r="92" fill="#f5d18b" opacity=".85"/><path d="M0 530 L260 250 510 530 680 330 1010 610 1200 390V800H0Z" fill="#102525"/><path d="M0 650 L220 420 410 620 625 405 860 660 1025 500 1200 675V800H0Z" fill="#071617"/><path d="M150 800 Q190 590 235 450 Q278 590 318 800Z" fill="#193c39"/><path d="M955 800 Q990 605 1040 460 Q1080 610 1128 800Z" fill="#193c39"/><g fill="none" stroke="#e8d29b" opacity=".8"><path d="M60 130H410"/><path d="M60 160H310"/><path d="M60 190H245"/></g></svg>`;
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return { url, name: 'mountain-signal.svg', width: 1200, height: 800 };
}

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<SourceImage | null>(null);
  const [settings, setSettings] = useState<AsciiSettings>(DEFAULT_SETTINGS);
  const [fontSize, setFontSize] = useState(10);
  const [lineHeight, setLineHeight] = useState(1.05);
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [splitPosition, setSplitPosition] = useState(50);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const { result, processing } = useAsciiConverter(source, settings);

  const updateSettings = (next: Partial<AsciiSettings>) => setSettings((current) => ({ ...current, ...next }));

  const loadFile = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('That file is not a supported image. Try JPG, PNG, WEBP, or GIF.');
      return;
    }
    if (file.size === 0) {
      setError('This file is empty. Choose another image to continue.');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setError('That image is over 30 MB. Choose a smaller file so your browser stays responsive.');
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        URL.revokeObjectURL(url);
        setError('We could not decode that image. Try exporting it as PNG or JPG first.');
        return;
      }
      setSource((previous) => {
        if (previous?.url.startsWith('blob:')) URL.revokeObjectURL(previous.url);
        return { url, name: file.name, width: image.naturalWidth, height: image.naturalHeight };
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError('We could not decode that image. Try exporting it as PNG or JPG first.');
    };
    image.src = url;
  };

  const loadSample = () => {
    setError('');
    setSource((previous) => {
      if (previous?.url.startsWith('blob:')) URL.revokeObjectURL(previous.url);
      return createSampleSource();
    });
  };

  useEffect(() => () => {
    if (source?.url.startsWith('blob:')) URL.revokeObjectURL(source.url);
  }, [source]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'o') {
        event.preventDefault();
        fileInputRef.current?.click();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'c' && result && document.activeElement?.classList.contains('ascii-pre')) {
        event.preventDefault();
        void handleCopy();
      }
      if (event.key === 'Escape' && fullscreen) setFullscreen(false);
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const reset = () => {
    setSettings(DEFAULT_SETTINGS);
    setFontSize(10);
    setLineHeight(1.05);
  };

  const processedMeta = result ? `${result.width} × ${result.height} chars` : 'Waiting for image';

  return (
    <div className="app-shell">
      <header className="topbar container">
        <a className="brand" href="#top" aria-label="ASCII Vision home"><span className="brand-mark"><span>░</span><span>▓</span><span>█</span></span><span>ASCII <b>Vision</b></span></a>
        <div className="topbar-meta"><span className="status-dot" /> <span>100% local processing</span><span className="topbar-divider" /><span className="shortcut"><Command size={12} /> O to open</span></div>
      </header>

      <main id="top" className="container main-content">
        <section className="hero-section">
          <div className="hero-copy"><div className="eyebrow eyebrow-accent"><span className="eyebrow-line" /> Browser-native image tool</div><h1>Turn pixels into<br /><em>characters.</em></h1><p>Translate the shape, shadow, and signal of any image into expressive ASCII art — instantly, privately, and with control.</p><div className="hero-actions"><a className="button button-primary" href="#workspace">Start rendering <ArrowDown size={15} /></a><span className="hero-caption"><LockKeyhole size={14} /> Your image never leaves this tab</span></div></div>
          <div className="hero-signal"><div className="signal-header"><span>RENDER ENGINE / 01</span><span className="signal-pulse"><span /> READY</span></div><div className="signal-art">{`   ·  .  ░░░░░░░░░░░░░░░░░  .  ·\n  .   ░░░▒▒▓▓██████▓▓▒▒░░░  .\n      ░▒▓████████████████▓▒░\n   · ░▓███████▓▒▒▒▒▓███████▓░\n     ▒█████▓▒░      ░▒▓█████▒\n  .  ▓████▓░   ·  ·   ░▓████▓\n     ████▓░    ···     ░▓████\n     ████▓░  ·······   ░▓████\n  ·  ▓████▓░   ·  ·   ░▓████▓\n     ▒█████▓▒░      ░▒▓█████▒\n     ░▓███████▓▒▒▒▒▓███████▓░\n      ░▒▓████████████████▓▒░\n   .   ░░▒▓▓██████████▓▓▒░░  .\n       ·  ░░░░░░░░░░░░░░  ·`}</div><div className="signal-footer"><span>Y = 0.2126R + 0.7152G + 0.0722B</span><span>ASPECT / 0.48</span></div></div>
        </section>

        <section id="workspace" className="workspace-section">
          <div className="section-kicker"><span className="section-number">01</span><span>Input / output workspace</span><span className="kicker-rule" /><span className="section-status"><span className="status-dot" /> {source ? 'SOURCE LOADED' : 'AWAITING SOURCE'}</span></div>

          {!source && <div className="empty-workspace"><div className="empty-copy"><div className="empty-icon"><Upload size={20} /></div><h2>Start with an image</h2><p>Portraits, landscapes, objects, logos — ASCII Vision keeps the structure intact.</p><div className="empty-specs"><span><Zap size={13} /> Real-time rendering</span><span><LockKeyhole size={13} /> No uploads</span><span><Gauge size={13} /> Up to 400 cols</span></div></div><ImageUploader onFile={loadFile} onSample={loadSample} inputRef={fileInputRef} /></div>}

          {source && <div className="active-workspace"><div className="workspace-topline"><div className="file-pill"><span className="file-pill-icon"><FileCode2 size={14} /></span><div><strong>{source.name}</strong><span>{source.width} × {source.height} px · {processedMeta}</span></div></div><div className="workspace-top-actions"><span className={processing ? 'processing-state is-processing' : 'processing-state'}><span /> {processing ? 'Rendering…' : 'Rendered locally'}</span><button type="button" className="button button-ghost button-small" onClick={() => fileInputRef.current?.click()}>Replace image</button></div></div><div className="active-grid"><div className="left-rail"><ControlPanel settings={settings} onChange={updateSettings} fontSize={fontSize} lineHeight={lineHeight} onFontSizeChange={setFontSize} onLineHeightChange={setLineHeight} onReset={reset} /><div className="drop-again"><ImageUploader onFile={loadFile} onSample={loadSample} inputRef={fileInputRef} compact /></div></div><div className="preview-column"><ImageComparison imageUrl={source.url} imageName={source.name} result={result} viewMode={viewMode} onViewModeChange={setViewMode} splitPosition={splitPosition} onSplitPositionChange={setSplitPosition} background={settings.background} foreground={settings.foreground} fontSize={fontSize} lineHeight={lineHeight} fullscreen={fullscreen} onToggleFullscreen={() => setFullscreen((value) => !value)} /><ExportButtons hasResult={Boolean(result)} copied={copied} onCopy={handleCopy} onDownloadTxt={() => result && downloadAsciiText(result, source.name.replace(/\.[^.]+$/, ''))} onDownloadPng={() => result && downloadAsciiPng(result, { background: settings.background === 'dark' ? '#080b0a' : '#f5f6f1', foreground: settings.foreground === 'light' ? '#e9f4e9' : '#101512', fontSize, lineHeight }, source.name.replace(/\.[^.]+$/, ''))} /></div></div></div>}
          {error && <div className="error-banner" role="alert">{error}</div>}
        </section>

        <section className="process-strip"><div className="process-label"><span className="eyebrow">Under the hood</span><strong>One image. Five quiet steps.</strong></div><div className="process-steps"><div><span>01</span><strong>Normalize</strong><small>Preserve proportions</small></div><div><span>02</span><strong>Read light</strong><small>Perceptual luminance</small></div><div><span>03</span><strong>Shape glyphs</strong><small>Density mapping</small></div><div><span>04</span><strong>Refine</strong><small>Contrast + edges</small></div><div><span>05</span><strong>Render</strong><small>True monospace output</small></div></div></section>

        <section className="closing-note"><div className="closing-mark"><Sparkles size={17} /></div><div><span className="eyebrow">Built for recognizable output</span><h2>Good ASCII is a composition problem.</h2></div><p>Aspect correction, density ramps, and local contrast work together so the result reads like the source — not a noisy wall of symbols.</p></section>
      </main>

      <footer className="footer container"><span>ASCII VISION / 2026</span><span>Made for the curious eye.</span><span className="footer-shortcuts"><MousePointer2 size={12} /> <kbd>ESC</kbd> fullscreen <kbd>⌘</kbd><kbd>O</kbd> open</span></footer>
    </div>
  );
}
