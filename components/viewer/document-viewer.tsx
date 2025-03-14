"use client";

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { PdfViewer } from '@/components/viewer/pdf-viewer';
import { ImageViewer } from '@/components/viewer/image-viewer';
import { ViewerToolbar } from '@/components/viewer/viewer-toolbar';
import { AnnotationToolbar } from '@/components/viewer/annotation-toolbar';
import { useToast } from '@/hooks/use-toast';
import { ZoomIn, ZoomOut, RotateCw, Download, Share2, Printer } from 'lucide-react';
import { OfficeViewer } from './office-viewer';

interface DocumentViewerProps {
  documentUrl: string | null;
  documentType: string | null;
}

export function DocumentViewer({ documentUrl, documentType }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const viewerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (documentUrl) {
      setIsLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, [documentUrl]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = `document.${documentType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your document is being downloaded.",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && documentUrl) {
      navigator.share({
        title: 'Shared Document',
        url: documentUrl,
      }).catch(() => {
        toast({
          title: "Sharing failed",
          description: "Could not share the document.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(documentUrl || '');
      toast({
        title: "Link copied",
        description: "Document link copied to clipboard.",
      });
    }
  };

  const handlePrint = () => {
    if (viewerRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Document</title>
            </head>
            <body>
              <img src="${documentUrl}" style="max-width: 100%;" />
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const renderViewer = () => {
    if (!documentUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
          <div className="mb-4">
            <FileIcon className="h-16 w-16 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No document selected</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Upload or select a document from the list to view it here.
          </p>
        </div>
      );
    }
  
    if (isLoading) {
      return (
        <div className="flex flex-col space-y-4 p-4 h-full">
          <Skeleton className="flex-1 w-full rounded-lg" />
          <div className="flex justify-between">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      );
    }
  
    switch (documentType) {
      case "pdf":
        return <PdfViewer url={documentUrl} />;
      case "image":
        return <ImageViewer url={documentUrl} zoom={zoom} rotation={rotation} />;
      case "word":
      case "excel":
      case "powerpoint":
        return <OfficeViewer url={documentUrl} fileType={documentType} zoom={zoom} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <p>Unsupported document type</p>
          </div>
        );
    }
  };
  

  return (
    <Card className="flex flex-col h-full w-full">
      <Tabs defaultValue="view" className="flex flex-col h-full">
        <div className="flex justify-between items-center border-b px-4 shrink-0">
          <TabsList className="h-12">
            <TabsTrigger value="view">View</TabsTrigger>
            <TabsTrigger value="annotate">Annotate</TabsTrigger>
            <TabsTrigger value="form">Form Fill</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={!documentUrl}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs w-12 text-center">{zoom}%</span>
            <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={!documentUrl}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleRotate} disabled={!documentUrl}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload} disabled={!documentUrl}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare} disabled={!documentUrl}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrint} disabled={!documentUrl}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="view" className="flex flex-col flex-1 m-0">
          <ViewerToolbar 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
            documentUrl={documentUrl}
          />
          <CardContent ref={viewerRef} className="flex-1 p-0 overflow-auto">
            {renderViewer()}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="annotate" className="flex flex-col flex-1 m-0">
          <AnnotationToolbar/>
          <CardContent className="flex-1 p-0 overflow-auto">
            {renderViewer()}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="form" className="flex flex-col flex-1 m-0">
          <div className="p-2 border-b shrink-0">
            <p className="text-sm text-muted-foreground">Fill out form fields in the document</p>
          </div>
          <CardContent className="flex-1 p-0 overflow-auto">
            {renderViewer()}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// Placeholder for the FileIcon component
function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}