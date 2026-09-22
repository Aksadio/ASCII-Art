import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { CHARACTER_SET_LABELS, type CharacterSetKey } from '@/lib/characterSets';
import type { AsciiSettings, RenderingMode } from '@/lib/asciiConverter';

interface ControlPanelProps {
  settings: AsciiSettings;
  onChange: (next: Partial<AsciiSettings>) => void;
  fontSize: number;
  lineHeight: number;
  onFontSizeChange: (value: number) => void;
  onLineHeightChange: (value: number) => void;
  onReset: () => void;
}

function RangeField({ label, value, min, max, step = 1, suffix, onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
  return (
    <label className="range-field">
      <span className="field-label"><span>{label}</span><output>{value}{suffix}</output></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <span className="range-endpoints"><span>{min}{suffix}</span><span>{max}{suffix}</span></span>
    </label>
  );
}

export function ControlPanel({ settings, onChange, fontSize, lineHeight, onFontSizeChange, onLineHeightChange, onReset }: ControlPanelProps) {
  return (
    <aside className="control-panel">
      <div className="control-heading">
        <div><span className="eyebrow"><SlidersHorizontal size={12} /> Fine tune</span><h2>Render controls</h2></div>
        <button type="button" className="icon-button" title="Reset controls" aria-label="Reset controls" onClick={onReset}><RotateCcw size={15} /></button>
      </div>

      <div className="control-group">
        <RangeField label="ASCII width" value={settings.width} min={80} max={400} suffix=" chars" onChange={(width) => onChange({ width })} />
        <p className="field-help">Higher width keeps more visual detail.</p>
      </div>

      <div className="control-group control-grid">
        <label className="select-field"><span className="field-label"><span>Character set</span></span><select value={settings.characterSet} onChange={(event) => onChange({ characterSet: event.target.value as CharacterSetKey })}>{Object.entries(CHARACTER_SET_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="select-field"><span className="field-label"><span>Rendering mode</span></span><select value={settings.renderingMode} onChange={(event) => onChange({ renderingMode: event.target.value as RenderingMode })}><option value="smooth">Smooth</option><option value="high-contrast">High contrast</option><option value="edge-enhanced">Edge enhanced</option></select></label>
      </div>

      {settings.characterSet === 'custom' && <label className="text-field"><span className="field-label"><span>Custom density ramp</span><output>{settings.customCharacterSet.length} glyphs</output></span><textarea value={settings.customCharacterSet} maxLength={28} onChange={(event) => onChange({ customCharacterSet: event.target.value })} placeholder="@#*:.  " /></label>}

      <div className="control-group">
        <RangeField label="Contrast" value={settings.contrast} min={0} max={200} suffix="%" onChange={(contrast) => onChange({ contrast })} />
        <RangeField label="Brightness" value={settings.brightness} min={-100} max={100} onChange={(brightness) => onChange({ brightness })} />
      </div>

      <div className="control-group control-grid">
        <label className="select-field"><span className="field-label"><span>Background</span></span><select value={settings.background} onChange={(event) => onChange({ background: event.target.value as 'dark' | 'light' })}><option value="dark">Black</option><option value="light">White</option></select></label>
        <label className="select-field"><span className="field-label"><span>Foreground</span></span><select value={settings.foreground} onChange={(event) => onChange({ foreground: event.target.value as 'light' | 'dark' })}><option value="light">White</option><option value="dark">Black</option></select></label>
      </div>

      <div className="control-group toggle-row">
        <div><span className="field-label"><span>Invert luminance</span></span><span className="field-help">Flip the tonal map before glyph selection.</span></div>
        <button type="button" className={`toggle ${settings.invert ? 'is-on' : ''}`} role="switch" aria-checked={settings.invert} onClick={() => onChange({ invert: !settings.invert })}><span /></button>
      </div>

      <div className="control-divider" />
      <div className="control-subheading">Viewer</div>
      <div className="control-group control-grid">
        <RangeField label="Font size" value={fontSize} min={7} max={18} suffix="px" onChange={onFontSizeChange} />
        <RangeField label="Line height" value={lineHeight} min={0.8} max={1.6} step={0.05} onChange={onLineHeightChange} />
      </div>
    </aside>
  );
}
