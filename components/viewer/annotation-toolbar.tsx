"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Highlighter, 
  Image, 
  Eraser, 
  Trash2, 
  PenTool,
  StickyNote,
  Stamp,
  Hand
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AnnotationToolbar() {
  const [currentTool, setCurrentTool] = useState("select");
  const [currentColor, setCurrentColor] = useState("#FF0000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const colors = [
    { name: "Red", value: "#FF0000" },
    { name: "Blue", value: "#0000FF" },
    { name: "Green", value: "#00FF00" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Black", value: "#000000" },
  ];

  const handleToolChange = (value: string) => {
    if (value) {
      setCurrentTool(value);
    }
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
  };

  const handleSizeChange = (value: number[]) => {
    setStrokeWidth(value[0]);
  };

  const handleClearAnnotations = () => {
    console.log("Annotations cleared!");
    // Logic to clear annotations (update your PDF annotations state)
  };

  return (
    <div className="p-2 border-b flex items-center justify-between gap-2 flex-wrap">
      <TooltipProvider>
        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToolChange("select")}
                className={currentTool === "select" ? "bg-muted" : ""}
              >
                <Hand className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select Tool</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <ToggleGroup type="single" value={currentTool} onValueChange={handleToolChange}>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="pen" size="sm">
                  <Pencil className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Pen</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="highlighter" size="sm">
                  <Highlighter className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Highlighter</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="rectangle" size="sm">
                  <Square className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Rectangle</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="circle" size="sm">
                  <Circle className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Circle</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="text" size="sm">
                  <Type className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Text</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="signature" size="sm">
                  <PenTool className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Signature</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="note" size="sm">
                  <StickyNote className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Sticky Note</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="stamp" size="sm">
                  <Stamp className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Stamp</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="image" size="sm">
                  <Image className="h-4 w-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>Image</TooltipContent>
            </Tooltip>
          </ToggleGroup>

          <Separator orientation="vertical" className="h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToolChange("eraser")}
                className={currentTool === "eraser" ? "bg-muted" : ""}
              >
                <Eraser className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Eraser</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-20 p-0 h-8">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: currentColor }}
                />
                <span className="text-xs">Color</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                  <Tooltip key={color.value}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() => handleColorChange(color.value)}
                      >
                        <div
                          className="h-6 w-6 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{color.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-40 flex items-center space-x-2">
            <span className="text-xs">Size:</span>
            <Slider
              value={[strokeWidth]}
              min={1}
              max={10}
              step={1}
              onValueChange={handleSizeChange}
              className="w-24"
            />
            <span className="text-xs w-4">{strokeWidth}</span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleClearAnnotations}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear All Annotations</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
