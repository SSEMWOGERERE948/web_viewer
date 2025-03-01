"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentViewer } from '@/components/viewer/document-viewer';
import { DocumentScanner } from '@/components/scanner/document-scanner';
import { MainHeader } from '@/components/dashboard/main-header';
import { FileUploader } from '@/components/dashboard/file-uploader';
import { RecentDocuments } from '@/components/dashboard/recent-documents';

export function MainDashboard() {
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string | null>(null);
  
  const handleDocumentSelect = (documentUrl: string, type: string) => {
    setCurrentDocument(documentUrl);
    setDocumentType(type);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader />
      <main className="flex-1 container mx-auto p-4">
        <Tabs defaultValue="viewer" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="viewer">Document Viewer</TabsTrigger>
            <TabsTrigger value="scanner">Document Scanner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="viewer" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 space-y-6">
                <FileUploader onFileUploaded={handleDocumentSelect} />
                <RecentDocuments onDocumentSelect={handleDocumentSelect} />
              </div>
              <div className="md:col-span-3">
                <DocumentViewer 
                  documentUrl={currentDocument} 
                  documentType={documentType} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="scanner">
            <DocumentScanner />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}