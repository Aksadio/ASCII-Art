import { useRef, useState, type DragEvent, type RefObject } from 'react';
import { FileImage, FolderOpen, UploadCloud } from 'lucide-react';

interface ImageUploaderProps {
  onFile: (file: File) => void;
  onSample: () => void;
  inputRef?: RefObject<HTMLInputElement | null>;
  compact?: boolean;
}

export function ImageUploader({ onFile, onSample, inputRef, compact = false }: ImageUploaderProps) {
  const localRef = useRef<HTMLInputElement>(null);
  const fileInputRef = inputRef ?? localRef;
  const [dragging, setDragging] = useState(false);

  const acceptFile = (file?: File) => {
    if (file) onFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div
      className={`upload-zone ${dragging ? 'is-dragging' : ''} ${compact ? 'upload-zone-compact' : ''}`}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/svg+xml"
        onChange={(event) => {
          acceptFile(event.target.files?.[0]);
          event.currentTarget.value = '';
        }}
      />
      <div className="upload-glyph"><UploadCloud size={compact ? 20 : 25} strokeWidth={1.6} /></div>
      <div className="upload-copy">
        <strong>{compact ? 'Drop a new image' : 'Drop an image here'}</strong>
        <span>or click to browse</span>
      </div>
      {!compact && <span className="upload-formats"><FileImage size={13} /> JPG · PNG · WEBP · GIF</span>}
      <div className="upload-actions">
        <button type="button" className="button button-primary button-small" onClick={() => fileInputRef.current?.click()}>
          <FolderOpen size={14} /> Choose image
        </button>
        {!compact && <button type="button" className="button button-ghost button-small" onClick={onSample}>Try sample</button>}
      </div>
    </div>
  );
}
