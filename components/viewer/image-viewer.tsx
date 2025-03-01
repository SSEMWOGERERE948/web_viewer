"use client";

import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageViewerProps {
  url: string;
  zoom: number;
  rotation: number;
}

export function ImageViewer({ url, zoom, rotation }: ImageViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIsLoading(true);
    
    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
    };
    img.src = url;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return (
    <div className="flex justify-center p-4 min-h-[500px] bg-muted/20">
      {isLoading ? (
        <Skeleton className="h-[500px] w-full max-w-3xl rounded-lg" />
      ) : (
        <div className="overflow-auto max-w-full">
          <img
            ref={imgRef}
            src={url}
            alt="Document"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease',
              maxWidth: '100%',
              margin: '0 auto',
            }}
            className="max-w-full"
          />
        </div>
      )}
    </div>
  );
}