import { Check, Clipboard, Download, FileText, ImageDown } from 'lucide-react';

interface ExportButtonsProps {
  hasResult: boolean;
  copied: boolean;
  onCopy: () => void;
  onDownloadTxt: () => void;
  onDownloadPng: () => void;
}

export function ExportButtons({ hasResult, copied, onCopy, onDownloadTxt, onDownloadPng }: ExportButtonsProps) {
  return (
    <div className="export-row">
      <button type="button" className="button button-primary" disabled={!hasResult} onClick={onCopy}>{copied ? <Check size={15} /> : <Clipboard size={15} />}{copied ? 'Copied' : 'Copy ASCII'}</button>
      <button type="button" className="button button-secondary" disabled={!hasResult} onClick={onDownloadTxt}><FileText size={15} /> Download TXT</button>
      <button type="button" className="button button-secondary" disabled={!hasResult} onClick={onDownloadPng}><ImageDown size={15} /> Download PNG</button>
      <span className="export-note"><Download size={13} /> Exports stay on your device</span>
    </div>
  );
}
