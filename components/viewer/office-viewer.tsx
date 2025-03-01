"use client";

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { FileIcon, FileTextIcon, FileSpreadsheetIcon, Presentation } from 'lucide-react';

interface OfficeViewerProps {
  url: string;
  fileType: string;
  zoom: number;
}

export function OfficeViewer({ url, fileType, zoom }: OfficeViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [url]);

  const getFileIcon = () => {
    switch (fileType) {
      case 'word':
        return <FileTextIcon className="h-16 w-16 text-blue-500" />;
      case 'excel':
        return <FileSpreadsheetIcon className="h-16 w-16 text-green-500" />;
      case 'powerpoint':
        return <Presentation className="h-16 w-16 text-orange-500" />;
      default:
        return <FileIcon className="h-16 w-16" />;
    }
  };

  const getViewerUrl = () => {
    // In a real implementation, you would use a service like Microsoft Office Online or Google Docs Viewer
    // For this demo, we'll use Google Docs Viewer
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  const handleViewInOffice = () => {
    window.open(url, '_blank');
    toast({
      title: "Opening document",
      description: "The document is opening in a new tab.",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[500px] bg-muted/20">
      {isLoading ? (
        <Skeleton className="h-[500px] w-full max-w-3xl rounded-lg" />
      ) : (
        <div className="w-full h-[500px] max-w-3xl">
          <iframe
            src={getViewerUrl()}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              toast({
                title: "Error loading document",
                description: "There was a problem loading the document. Try downloading it instead.",
                variant: "destructive",
              });
            }}
          />
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Having trouble viewing this document?
            </p>
            <button
              onClick={handleViewInOffice}
              className="text-sm text-primary hover:underline"
            >
              Download and open in {fileType === 'word' ? 'Word' : fileType === 'excel' ? 'Excel' : 'PowerPoint'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}