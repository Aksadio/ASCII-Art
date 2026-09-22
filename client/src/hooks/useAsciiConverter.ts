import { useEffect, useRef, useState } from 'react';
import { convertImageToAscii, decodeImage, type AsciiResult, type AsciiSettings } from '@/lib/asciiConverter';

export interface SourceImage {
  url: string;
  name: string;
  width: number;
  height: number;
}

export function useAsciiConverter(source: SourceImage | null, settings: AsciiSettings) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [result, setResult] = useState<AsciiResult | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    imageRef.current = null;
    setResult(null);

    if (!source) {
      setProcessing(false);
      return;
    }

    setProcessing(true);
    decodeImage(source.url)
      .then((image) => {
        if (!cancelled) {
          imageRef.current = image;
          setResult(convertImageToAscii(image, settings));
        }
      })
      .catch(() => {
        if (!cancelled) imageRef.current = null;
      })
      .finally(() => {
        if (!cancelled) setProcessing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [source]);

  useEffect(() => {
    if (!imageRef.current || !source) return;
    setProcessing(true);
    const frame = window.requestAnimationFrame(() => {
      try {
        setResult(convertImageToAscii(imageRef.current as HTMLImageElement, settings));
      } finally {
        setProcessing(false);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [settings, source]);

  return { result, processing };
}
