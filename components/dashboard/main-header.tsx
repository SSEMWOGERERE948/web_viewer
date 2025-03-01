"use client";

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { FileTextIcon, ScanIcon, UserIcon } from 'lucide-react';

export function MainHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FileTextIcon className="h-6 w-6" />
          <span className="text-lg font-bold">EDMS WebViewer</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            <ScanIcon className="h-4 w-4" />
            <span>Scan Document</span>
          </Button>
          <Button variant="outline" size="icon" className="md:hidden">
            <ScanIcon className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <UserIcon className="h-4 w-4" />
          </Button>
          
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}