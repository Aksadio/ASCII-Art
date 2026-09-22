import { Maximize2, Minimize2, Terminal } from 'lucide-react';
import type { AsciiResult } from '@/lib/asciiConverter';

interface AsciiViewerProps {
  result: AsciiResult | null;
  background: 'dark' | 'light';
  foreground: 'light' | 'dark';
  fontSize: number;
  lineHeight: number;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function AsciiViewer({ result, background, foreground, fontSize, lineHeight, fullscreen, onToggleFullscreen }: AsciiViewerProps) {
  const surfaceStyle = {
    '--ascii-bg': background === 'dark' ? '#080b0a' : '#f5f6f1',
    '--ascii-fg': foreground === 'light' ? '#e9f4e9' : '#101512',
    '--ascii-size': `${fontSize}px`,
    '--ascii-leading': lineHeight,
  } as React.CSSProperties;

  return (
    <section className={`ascii-viewer panel ${fullscreen ? 'is-fullscreen' : ''}`} style={surfaceStyle}>
      <div className="panel-header">
        <div className="panel-title"><span className="panel-icon panel-icon-accent"><Terminal size={15} /></span><div><span className="eyebrow">Output stream</span><h3>ASCII preview</h3></div></div>
        <div className="panel-header-actions"><span className="live-dot">LIVE</span><button type="button" className="icon-button" title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={onToggleFullscreen}>{fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button></div>
      </div>
      <div className="ascii-window">
        <div className="window-bar"><span /><span /><span /><small>{result ? `${result.width} × ${result.height} glyphs` : 'Awaiting source image'}</small></div>
        {result ? <pre className="ascii-pre" tabIndex={0} aria-label="Generated ASCII art">{result.text}</pre> : <div className="ascii-empty"><span className="ascii-empty-mark">+&nbsp; +&nbsp; +</span><span>Your output will appear here</span><small>Drop an image to begin rendering</small></div>}
      </div>
    </section>
  );
}
