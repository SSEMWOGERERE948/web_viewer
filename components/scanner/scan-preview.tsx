"use client";

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, Crop, Download } from 'lucide-react';

interface ScanPreviewProps {
  imageUrl: string;
  onDownload: () => void;
}

export function ScanPreview({ imageUrl, onDownload }: ScanPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto bg-muted/20 rounded-lg p-4">
        <div className="flex items-center justify-center h-full">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Scanned document"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="flex items-center text-sm">{zoom}%</span>
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Crop className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
}