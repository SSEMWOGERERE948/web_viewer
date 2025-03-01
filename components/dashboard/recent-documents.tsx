"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileIcon, FileTextIcon, ImageIcon, FileSpreadsheetIcon, Presentation } from 'lucide-react';

interface RecentDocumentsProps {
  onDocumentSelect: (url: string, type: string) => void;
}

// Sample data for demonstration
const sampleDocuments = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    type: 'pdf',
    url: 'https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea%20Brochure.pdf',
    date: '2023-09-15',
  },
  {
    id: '2',
    name: 'Financial Report.xlsx',
    type: 'excel',
    url: 'https://file-examples.com/storage/fe8c7eef0c6364f6c9504cc/2017/02/file_example_XLSX_10.xlsx',
    date: '2023-09-10',
  },
  {
    id: '3',
    name: 'Presentation.pptx',
    type: 'powerpoint',
    url: 'https://file-examples.com/storage/fe8c7eef0c6364f6c9504cc/2017/08/file_example_PPT_250kB.ppt',
    date: '2023-09-05',
  },
  {
    id: '4',
    name: 'Contract.docx',
    type: 'word',
    url: 'https://file-examples.com/storage/fe8c7eef0c6364f6c9504cc/2017/02/file_example_DOCX_100kB.docx',
    date: '2023-09-01',
  },
  {
    id: '5',
    name: 'Scan.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    date: '2023-08-28',
  },
];

export function RecentDocuments({ onDocumentSelect }: RecentDocumentsProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileTextIcon className="h-4 w-4 text-red-500" />;
      case 'word':
        return <FileIcon className="h-4 w-4 text-blue-500" />;
      case 'excel':
        return <FileSpreadsheetIcon className="h-4 w-4 text-green-500" />;
      case 'powerpoint':
        return <Presentation className="h-4 w-4 text-orange-500" />;
      case 'image':
        return <ImageIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Documents</CardTitle>
        <CardDescription>
          Recently viewed or uploaded documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sampleDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
              onClick={() => onDocumentSelect(doc.url, doc.type)}
            >
              {getFileIcon(doc.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}