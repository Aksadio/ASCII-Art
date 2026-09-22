import { Columns2, Image as ImageIcon, ScanLine, SplitSquareHorizontal, WandSparkles } from 'lucide-react';
import type { AsciiResult } from '@/lib/asciiConverter';
import { AsciiViewer } from './AsciiViewer';

type ViewMode = 'side-by-side' | 'original' | 'ascii' | 'split';

interface ImageComparisonProps {
  imageUrl: string | null;
  imageName?: string;
  result: AsciiResult | null;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  splitPosition: number;
  onSplitPositionChange: (position: number) => void;
  background: 'dark' | 'light';
  foreground: 'light' | 'dark';
  fontSize: number;
  lineHeight: number;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}

const viewModes: { key: ViewMode; label: string; icon: typeof Columns2 }[] = [
  { key: 'side-by-side', label: 'Side by side', icon: Columns2 },
  { key: 'original', label: 'Original', icon: ImageIcon },
  { key: 'ascii', label: 'ASCII only', icon: ScanLine },
  { key: 'split', label: 'Split', icon: SplitSquareHorizontal },
];

export function ImageComparison({ imageUrl, imageName, result, viewMode, onViewModeChange, splitPosition, onSplitPositionChange, background, foreground, fontSize, lineHeight, fullscreen, onToggleFullscreen }: ImageComparisonProps) {
  const original = imageUrl ? <div className="image-preview panel"><div className="panel-header"><div className="panel-title"><span className="panel-icon"><ImageIcon size={15} /></span><div><span className="eyebrow">Source image</span><h3>Original</h3></div></div><span className="image-name" title={imageName}>{imageName || 'Untitled image'}</span></div><div className="image-stage"><img src={imageUrl} alt="Uploaded source" /></div></div> : null;
  const ascii = <AsciiViewer result={result} background={background} foreground={foreground} fontSize={fontSize} lineHeight={lineHeight} fullscreen={fullscreen} onToggleFullscreen={onToggleFullscreen} />;

  return (
    <section className="comparison-section">
      <div className="comparison-toolbar">
        <div><span className="eyebrow"><WandSparkles size={12} /> Compare</span><h2>See the structure hold</h2></div>
        <div className="view-mode-tabs" role="tablist" aria-label="Preview mode">{viewModes.map(({ key, label, icon: Icon }) => <button type="button" key={key} className={viewMode === key ? 'is-active' : ''} onClick={() => onViewModeChange(key)} role="tab" aria-selected={viewMode === key}><Icon size={14} /> {label}</button>)}</div>
      </div>
      {viewMode === 'side-by-side' && <div className="comparison-grid">{original}{ascii}</div>}
      {viewMode === 'original' && <div className="comparison-single">{original}</div>}
      {viewMode === 'ascii' && <div className="comparison-single">{ascii}</div>}
      {viewMode === 'split' && <div className="split-comparison"><div className="split-base">{original}</div><div className="split-overlay" style={{ width: `${splitPosition}%` }}>{ascii}</div><input className="split-slider" type="range" min={0} max={100} value={splitPosition} onChange={(event) => onSplitPositionChange(Number(event.target.value))} aria-label="Comparison split position" /><span className="split-handle" style={{ left: `${splitPosition}%` }} /></div>}
    </section>
  );
}

export type { ViewMode };
