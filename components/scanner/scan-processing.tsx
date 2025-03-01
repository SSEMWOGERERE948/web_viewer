"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Check, AlertCircle } from 'lucide-react';

interface ScanProcessingProps {
  imageUrl: string;
  onProcessingComplete: (processedImageUrl: string) => void;
}

export function ScanProcessing({ imageUrl, onProcessingComplete }: ScanProcessingProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('Ready to process');

  const startProcessing = () => {
    setStatus('processing');
    setStatusMessage('Processing document...');
    setProgress(0);
    
    // Simulate processing steps
    const steps = [
      { progress: 20, message: 'Detecting document edges...' },
      { progress: 40, message: 'Applying perspective transform...' },
      { progress: 60, message: 'Enhancing image quality...' },
      { progress: 80, message: 'Applying OCR...' },
      { progress: 100, message: 'Processing complete!' },
    ];
    
    let currentStep = 0;
    
    const processInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress);
        setStatusMessage(steps[currentStep].message);
        currentStep++;
      } else {
        clearInterval(processInterval);
        setStatus('complete');
        // In a real implementation, this would be the URL of the processed image
        onProcessingComplete(imageUrl);
      }
    }, 1000);
    
    // Simulate a random error (10% chance)
    if (Math.random() < 0.1) {
      clearInterval(processInterval);
      setTimeout(() => {
        setStatus('error');
        setStatusMessage('Error processing document. Please try again.');
      }, 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Processing</CardTitle>
        <CardDescription>
          Enhance and optimize your scanned document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {status === 'idle' && (
            <FileText className="h-8 w-8 text-muted-foreground" />
          )}
          {status === 'processing' && (
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          )}
          {status === 'complete' && (
            <Check className="h-8 w-8 text-green-500" />
          )}
          {status === 'error' && (
            <AlertCircle className="h-8 w-8 text-destructive" />
          )}
          
          <div className="flex-1">
            <p className="text-sm font-medium">{statusMessage}</p>
            {status === 'processing' && (
              <Progress value={progress} className="h-2 mt-2" />
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          {status === 'idle' && (
            <Button onClick={startProcessing}>
              Process Document
            </Button>
          )}
          {status === 'error' && (
            <Button onClick={startProcessing}>
              Try Again
            </Button>
          )}
          {status === 'complete' && (
            <Button variant="outline">
              View Result
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}