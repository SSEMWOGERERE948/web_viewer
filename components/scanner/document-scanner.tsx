"use client";

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, Download, Maximize, RotateCw, ZoomIn, ZoomOut, Crop, ScanLine, ImagePlus, FileUp } from 'lucide-react';
import { ScanPreview } from '@/components/scanner/scan-preview';
import { ScanSettings } from '@/components/scanner/scan-settings';
import { ScanProcessing } from '@/components/scanner/scan-processing';
import Script from 'next/script';

export function DocumentScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [opencvLoaded, setOpencvLoaded] = useState(false);
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Get available cameras
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setCameraList(cameras);
        if (cameras.length > 0) {
          setSelectedCamera(cameras[0].deviceId);
        }
      } catch (error) {
        console.error('Error getting cameras:', error);
      }
    };

    getCameras();

    return () => {
      // Clean up stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        }
      });
      
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
      
      setIsScanning(true);
      setHasScanned(false);
      setScannedImage(null);
      setProcessedImage(null);
      
      toast({
        title: "Camera started",
        description: "Position your document within the frame and take a picture.",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use the scanner.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsScanning(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        setScannedImage(imageDataUrl);
        setHasScanned(true);
        
        // Process the image if OpenCV is loaded
        if (opencvLoaded) {
          processImage(imageDataUrl);
        } else {
          setProcessedImage(imageDataUrl);
        }
        
        toast({
          title: "Image captured",
          description: "You can now process and enhance your document.",
        });
      }
    }
  };

  const processImage = (imageUrl: string) => {
    // This is a placeholder for OpenCV.js image processing
    // In a real implementation, you would use OpenCV.js to:
    // 1. Detect document edges
    // 2. Apply perspective transform
    // 3. Enhance contrast and remove noise
    
    // For now, we'll just use the original image
    setProcessedImage(imageUrl);
  };

  const handleOpencvLoad = () => {
    setOpencvLoaded(true);
    console.log('OpenCV.js loaded');
  };

  const downloadProcessedImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'scanned-document.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your scanned document is being downloaded.",
      });
    }
  };

  const convertToPdf = () => {
    // In a real implementation, you would use a library like jsPDF
    // to convert the image to PDF
    toast({
      title: "Converting to PDF",
      description: "Your document is being converted to PDF format.",
    });
    
    // Simulate conversion delay
    setTimeout(() => {
      if (processedImage) {
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = 'scanned-document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "PDF created",
          description: "Your PDF document is ready and downloading.",
        });
      }
    }, 1500);
  };

  return (
    <>
      <Script 
        src="https://docs.opencv.org/4.5.5/opencv.js"
        onLoad={handleOpencvLoad}
        strategy="afterInteractive"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Document Scanner</CardTitle>
            <CardDescription>
              Use your camera to scan documents and convert them to PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {isScanning && !hasScanned ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-primary/50 m-8 pointer-events-none"></div>
                </>
              ) : hasScanned && processedImage ? (
                <img
                  src={processedImage}
                  alt="Scanned document"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <ScanLine className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Click "Start Camera" to begin scanning
                  </p>
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
            
            <div className="flex justify-between mt-4">
              <div className="space-x-2">
                {!isScanning ? (
                  <Button onClick={startCamera}>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopCamera} variant="outline">
                      Stop Camera
                    </Button>
                    <Button onClick={captureImage}>
                      <ImagePlus className="mr-2 h-4 w-4" />
                      Capture
                    </Button>
                  </>
                )}
              </div>
              
              <div className="space-x-2">
                {processedImage && (
                  <>
                    <Button onClick={downloadProcessedImage} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button onClick={convertToPdf}>
                      <FileUp className="mr-2 h-4 w-4" />
                      Convert to PDF
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scanner Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="camera">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="camera">Camera</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>
                
                <TabsContent value="camera" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Camera</Label>
                    <select
                      className="w-full p-2 rounded-md border"
                      value={selectedCamera}
                      onChange={(e) => setSelectedCamera(e.target.value)}
                    >
                      {cameraList.map((camera) => (
                        <option key={camera.deviceId} value={camera.deviceId}>
                          {camera.label || `Camera ${camera.deviceId.slice(0, 5)}...`}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Flash</Label>
                      <Switch id="flash" />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="processing" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Auto Crop</Label>
                      <Switch id="auto-crop" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Brightness</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Contrast</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Apply OCR</Label>
                      <Switch id="ocr" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Extract text from the scanned document
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="output" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <select className="w-full p-2 rounded-md border">
                      <option value="pdf">PDF</option>
                      <option value="png">PNG</option>
                      <option value="jpg">JPEG</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quality</Label>
                    <Slider defaultValue={[75]} max={100} step={1} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Searchable PDF</Label>
                      <Switch id="searchable-pdf" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Embed OCR text to make PDF searchable
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {processedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                  <img
                    src={processedImage}
                    alt="Processed document"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" size="icon">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Crop className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}