"use client";

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2 } from 'lucide-react';

interface ScanSettingsProps {
  onApplySettings: (settings: any) => void;
}

export function ScanSettings({ onApplySettings }: ScanSettingsProps) {
  const handleApplySettings = () => {
    // Collect all settings and pass them to the parent component
    const settings = {
      brightness: 50,
      contrast: 50,
      autoCrop: true,
      applyOcr: true,
      outputFormat: 'pdf',
      quality: 75,
      searchablePdf: true,
    };
    
    onApplySettings(settings);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="enhance">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enhance">Enhance</TabsTrigger>
          <TabsTrigger value="crop">Crop</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enhance" className="space-y-4">
          <div className="space-y-2">
            <Label>Brightness</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          
          <div className="space-y-2">
            <Label>Contrast</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          
          <div className="space-y-2">
            <Label>Sharpness</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Auto Enhance</Label>
              <Switch id="auto-enhance" />
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically adjust image settings for optimal quality
            </p>
          </div>
          
          <Button className="w-full" onClick={handleApplySettings}>
            <Wand2 className="mr-2 h-4 w-4" />
            Apply Enhancements
          </Button>
        </TabsContent>
        
        <TabsContent value="crop" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Auto Crop</Label>
              <Switch id="auto-crop" defaultChecked />
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically detect and crop document edges
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Rotation</Label>
            <Slider defaultValue={[0]} min={-180} max={180} step={1} />
          </div>
          
          <Button className="w-full" onClick={handleApplySettings}>
            Apply Crop Settings
          </Button>
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
              <Label>Apply OCR</Label>
              <Switch id="ocr" defaultChecked />
            </div>
            <p className="text-xs text-muted-foreground">
              Extract text from the scanned document
            </p>
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
          
          <Button className="w-full" onClick={handleApplySettings}>
            Apply Output Settings
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}