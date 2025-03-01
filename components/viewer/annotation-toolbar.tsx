"use client";

import { Button } from '@/components/ui/button';
import {
  Highlighter,
  Pencil,
  Square,
  Circle,
  Type,
  Stamp,
  Eraser,
  Save,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';

export function AnnotationToolbar() {
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  
  const handleAnnotationSelect = (type: string) => {
    setActiveAnnotation(type === activeAnnotation ? null : type);
  };
  
  const annotationTools = [
    { id: 'highlight', icon: <Highlighter className="h-4 w-4" />, label: 'Highlight Text' },
    { id: 'draw', icon: <Pencil className="h-4 w-4" />, label: 'Draw' },
    { id: 'rectangle', icon: <Square className="h-4 w-4" />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle className="h-4 w-4" />, label: 'Circle' },
    { id: 'text', icon: <Type className="h-4 w-4" />, label: 'Add Text' },
    { id: 'stamp', icon: <Stamp className="h-4 w-4" />, label: 'Add Stamp' },
    { id: 'erase', icon: <Eraser className="h-4 w-4" />, label: 'Erase' },
  ];
  
  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-1">
        <TooltipProvider>
          {annotationTools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeAnnotation === tool.id ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handleAnnotationSelect(tool.id)}
                >
                  {tool.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      
      <Button variant="outline" size="sm" className="gap-1">
        <Save className="h-4 w-4" />
        <span>Save Annotations</span>
      </Button>
    </div>
  );
}