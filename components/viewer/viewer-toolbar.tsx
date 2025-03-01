"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

interface ViewerToolbarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  documentUrl: string | null;
}

export function ViewerToolbar({ currentPage, totalPages, onPageChange, documentUrl }: ViewerToolbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      onPageChange(value);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would search the document
    console.log('Searching for:', searchQuery);
  };
  
  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousPage}
          disabled={!documentUrl || currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center">
          <Input
            type="number"
            value={currentPage}
            onChange={handlePageInputChange}
            className="w-12 h-8 text-center"
            min={1}
            max={totalPages}
            disabled={!documentUrl}
          />
          <span className="mx-1 text-sm text-muted-foreground">of {totalPages}</span>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={!documentUrl || currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSearch} className="relative w-64">
        <Input
          type="text"
          placeholder="Search in document..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-8"
          disabled={!documentUrl}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          disabled={!documentUrl || !searchQuery}
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}