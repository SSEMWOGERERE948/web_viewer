"use client";

import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';

interface PdfViewerProps {
  url: string;
  zoom: number;
  rotation: number;
  onPageChange: (page: number) => void;
  onTotalPagesChange: (pages: number) => void;
}

export function PdfViewer({ url, zoom, rotation, onPageChange, onTotalPagesChange }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const pdfDocumentRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    let pdfInstance: any = null;
    let currentRenderTask: any = null;

    const loadPdf = async () => {
      if (!pdfJsLoaded || !containerRef.current) return;
      
      setIsLoading(true);
      
      try {
        // @ts-ignore - PDF.js is loaded via script tag
        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument(url);
        pdfDocumentRef.current = await loadingTask.promise;
        const pdfDocument = pdfDocumentRef.current;
        
        onTotalPagesChange(pdfDocument.numPages);
        
        // Render the first page
        renderPage(1, zoom, rotation);
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          title: "Error loading PDF",
          description: "There was a problem loading the PDF document.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    const renderPage = async (pageNumber: number, zoomLevel: number, rotationAngle: number) => {
      if (!pdfDocumentRef.current || !containerRef.current) return;
      
      try {
        // Cancel any ongoing render task
        if (currentRenderTask) {
          currentRenderTask.cancel();
        }
        
        const pdfDocument = pdfDocumentRef.current;
        const page = await pdfDocument.getPage(pageNumber);
        
        // Calculate scale based on zoom level
        const scale = zoomLevel / 100;
        
        // Apply rotation
        const viewport = page.getViewport({ scale, rotation: rotationAngle });
        
        // Prepare canvas for rendering
        const container = containerRef.current;
        container.innerHTML = '';
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        container.appendChild(canvas);
        
        // Render PDF page
        const renderContext = {
          canvasContext: context!,
          viewport: viewport,
        };
        
        currentRenderTask = page.render(renderContext);
        await currentRenderTask.promise;
        
        setIsLoading(false);
        onPageChange(pageNumber);
      } catch (error) {
        if (error instanceof Error && error.name === 'RenderingCancelled') {
          // Rendering was cancelled, which is expected when changing pages rapidly
          return;
        }
        
        console.error('Error rendering PDF page:', error);
        toast({
          title: "Error rendering PDF",
          description: "There was a problem rendering the PDF page.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    if (pdfJsLoaded && url) {
      loadPdf();
    }

    return () => {
      if (currentRenderTask) {
        currentRenderTask.cancel();
      }
    };
  }, [url, zoom, rotation, pdfJsLoaded, onPageChange, onTotalPagesChange, toast]);

  const handlePdfJsLoad = () => {
    setPdfJsLoaded(true);
  };

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"
        onLoad={handlePdfJsLoad}
        strategy="afterInteractive"
      />
      
      <div className="flex justify-center p-4 min-h-[500px] bg-muted/20">
        {isLoading ? (
          <Skeleton className="h-[500px] w-full max-w-3xl rounded-lg" />
        ) : (
          <div 
            ref={containerRef} 
            className="pdf-container overflow-auto"
            style={{
              maxWidth: '100%',
              margin: '0 auto',
            }}
          />
        )}
      </div>
    </>
  );
}