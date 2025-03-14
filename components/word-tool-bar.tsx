import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, ChevronDown, Type, Palette, Table, Image, Check,
  FileText, Save, Printer, Undo, Redo, Copy, Scissors, ClipboardPaste,
  Link, FileUp, Heading1, Heading2, Heading3, PilcrowSquare, Indent, Outdent,
  Superscript, Subscript, Strikethrough, LayoutGrid, Search, ChevronsDownUp,
  CornerDownLeft, ListTree, MoreHorizontal
} from 'lucide-react';

// Define types for the props
interface WordToolbarProps {
  onStyleChange?: (styleType: string, value: string) => void;
  onActionTrigger?: (action: string) => void;
}

const WordToolbar: React.FC<WordToolbarProps> = ({ onStyleChange, onActionTrigger }) => {
  const [fontSize, setFontSize] = useState('11pt');
  const [fontFamily, setFontFamily] = useState('Calibri');
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('transparent');
  const [showTableSelector, setShowTableSelector] = useState(false);
  
  // Extended font list (50+ fonts)
  const fonts = [
    'Calibri', 'Arial', 'Times New Roman', 'Verdana', 'Georgia', 'Tahoma', 
    'Cambria', 'Helvetica', 'Trebuchet MS', 'Garamond', 'Palatino', 'Bookman',
    'Avant Garde', 'Courier New', 'Geneva', 'Copperplate', 'Monaco', 'Optima',
    'Didot', 'American Typewriter', 'Baskerville', 'Century Gothic', 'Futura',
    'Lucida Grande', 'Lucida Sans', 'Gill Sans', 'Franklin Gothic', 'Haettenschweiler',
    'Impact', 'Arial Narrow', 'Arial Black', 'Rockwell', 'Segoe UI', 'Consolas',
    'Comic Sans MS', 'Candara', 'Constantia', 'Corbel', 'Ebrima', 'MS Gothic',
    'MS PGothic', 'MS UI Gothic', 'SimSun', 'NSimSun', 'SimHei', 'KaiTi',
    'MingLiU', 'PMingLiU', 'Gulim', 'Dotum', 'Batang', 'Gungsuh',
    'Open Sans', 'Roboto', 'Lato', 'Montserrat', 'Oswald', 'Raleway'
  ];
  
  const fontSizes = [
    '8pt', '9pt', '10pt', '11pt', '12pt', '14pt', '16pt', '18pt', 
    '20pt', '22pt', '24pt', '26pt', '28pt', '36pt', '48pt', '72pt'
  ];
  
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#800000', '#008000', '#000080', '#808000', 
    '#800080', '#008080', '#C0C0C0', '#808080', '#8B0000', '#006400',
    '#00008B', '#B8860B', '#A9A9A9', '#BDB76B', '#556B2F', '#FF8C00',
    '#9932CC', '#8B008B', '#2F4F4F', '#D2691E', '#DC143C', '#00CED1',
    '#696969', '#FF1493', '#1E90FF', '#FFD700'
  ];
  
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontFamily(e.target.value);
    onStyleChange?.('fontFamily', e.target.value);
  };
  
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSize(e.target.value);
    onStyleChange?.('fontSize', e.target.value);
  };
  
  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    onStyleChange?.('textColor', color);
  };
  
  const handleHighlightChange = (color: string) => {
    setHighlightColor(color);
    onStyleChange?.('highlightColor', color);
  };

  const handleTableSelect = (rows: number, cols: number) => {
    setShowTableSelector(false);
    onActionTrigger?.('insertTable:' + rows + 'x' + cols);
  };

  return (
    <div className="w-full bg-gray-100 border-b border-gray-300">
      {/* File Menu */}
      <div className="flex items-center p-1 border-b border-gray-300">
        <div className="flex items-center space-x-4 px-2">
          <button 
            className="px-3 py-1 rounded hover:bg-gray-200 flex items-center"
            onClick={() => onActionTrigger?.('menuFile')}
          >
            <FileText size={16} className="mr-1" /> File <ChevronDown size={14} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Save"
            onClick={() => onActionTrigger?.('save')}
          >
            <Save size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Print"
            onClick={() => onActionTrigger?.('print')}
          >
            <Printer size={16} />
          </button>
          <div className="h-4 border-r border-gray-300 mx-1"></div>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Undo"
            onClick={() => onActionTrigger?.('undo')}
          >
            <Undo size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Redo"
            onClick={() => onActionTrigger?.('redo')}
          >
            <Redo size={16} />
          </button>
          <div className="h-4 border-r border-gray-300 mx-1"></div>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Copy"
            onClick={() => onActionTrigger?.('copy')}
          >
            <Copy size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Cut"
            onClick={() => onActionTrigger?.('cut')}
          >
            <Scissors size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Paste"
            onClick={() => onActionTrigger?.('paste')}
          >
            <ClipboardPaste size={16} />
          </button>
        </div>
      </div>
      
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center p-1">
        {/* Font Family Dropdown */}
        <div className="relative mx-1">
          <select 
            value={fontFamily}
            onChange={handleFontChange}
            className="bg-white border border-gray-300 rounded px-2 py-1 pr-8 appearance-none focus:outline-none focus:border-blue-500 text-sm"
            style={{ width: '120px' }}
          >
            {fonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown size={14} />
          </div>
        </div>
        
        {/* Font Size Dropdown */}
        <div className="relative mx-1">
          <select 
            value={fontSize}
            onChange={handleFontSizeChange}
            className="bg-white border border-gray-300 rounded px-2 py-1 pr-6 appearance-none focus:outline-none focus:border-blue-500 text-sm"
            style={{ width: '60px' }}
          >
            {fontSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown size={14} />
          </div>
        </div>
        
        <div className="h-4 border-r border-gray-300 mx-2"></div>
        
        {/* Text Formatting */}
        <div className="flex space-x-1 mx-1">
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Bold"
            onClick={() => onActionTrigger?.('bold')}
          >
            <Bold size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Italic"
            onClick={() => onActionTrigger?.('italic')}
          >
            <Italic size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Underline"
            onClick={() => onActionTrigger?.('underline')}
          >
            <Underline size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Strikethrough"
            onClick={() => onActionTrigger?.('strikethrough')}
          >
            <Strikethrough size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Superscript"
            onClick={() => onActionTrigger?.('superscript')}
          >
            <Superscript size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Subscript"
            onClick={() => onActionTrigger?.('subscript')}
          >
            <Subscript size={16} />
          </button>
        </div>
        
        <div className="h-4 border-r border-gray-300 mx-2"></div>
        
        {/* Text Color Dropdown */}
        <div className="relative mx-1 group">
          <button 
            className="flex items-center p-1 rounded hover:bg-gray-200" 
            title="Text Color"
          >
            <div className="flex items-center">
              <Palette size={16} />
              <div 
                className="w-2 h-2 ml-1"
                style={{ backgroundColor: textColor }}
              ></div>
              <ChevronDown size={14} className="ml-1" />
            </div>
          </button>
          <div className="absolute left-0 mt-1 p-1 bg-white border border-gray-300 rounded shadow-lg z-10 hidden group-hover:block">
            <div className="grid grid-cols-8 gap-1" style={{ width: '192px' }}>
              {colors.map(color => (
                <div
                  key={color}
                  className="w-5 h-5 cursor-pointer border border-gray-300"
                  style={{ backgroundColor: color }}
                  onClick={() => handleTextColorChange(color)}
                  title={color}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Highlight Color Dropdown */}
        <div className="relative mx-1 group">
          <button 
            className="flex items-center p-1 rounded hover:bg-gray-200" 
            title="Highlight Color"
          >
            <div className="flex items-center">
              <Type size={16} />
              <div 
                className="w-2 h-2 ml-1"
                style={{ backgroundColor: highlightColor !== 'transparent' ? highlightColor : '#FFFF00' }}
              ></div>
              <ChevronDown size={14} className="ml-1" />
            </div>
          </button>
          <div className="absolute left-0 mt-1 p-1 bg-white border border-gray-300 rounded shadow-lg z-10 hidden group-hover:block">
            <div className="grid grid-cols-8 gap-1" style={{ width: '192px' }}>
              <div
                className="w-5 h-5 cursor-pointer border border-gray-300 flex items-center justify-center"
                style={{ backgroundColor: 'white' }}
                onClick={() => handleHighlightChange('transparent')}
                title="No Highlight"
              >
                <Check size={14} className={highlightColor === 'transparent' ? 'visible' : 'invisible'} />
              </div>
              {colors.slice(0, 31).map(color => (
                <div
                  key={color}
                  className="w-5 h-5 cursor-pointer border border-gray-300"
                  style={{ backgroundColor: color }}
                  onClick={() => handleHighlightChange(color)}
                  title={color}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="h-4 border-r border-gray-300 mx-2"></div>
        
        {/* Heading and Paragraph Styles */}
        <div className="flex space-x-1 mx-1">
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Heading 1"
            onClick={() => onActionTrigger?.('h1')}
          >
            <Heading1 size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Heading 2"
            onClick={() => onActionTrigger?.('h2')}
          >
            <Heading2 size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Heading 3"
            onClick={() => onActionTrigger?.('h3')}
          >
            <Heading3 size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Paragraph"
            onClick={() => onActionTrigger?.('paragraph')}
          >
            <PilcrowSquare size={16} />
          </button>
        </div>
        
        <div className="h-4 border-r border-gray-300 mx-2"></div>
        
        {/* Alignment */}
        <div className="flex space-x-1 mx-1">
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Align Left"
            onClick={() => onActionTrigger?.('alignLeft')}
          >
            <AlignLeft size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Align Center"
            onClick={() => onActionTrigger?.('alignCenter')}
          >
            <AlignCenter size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Align Right"
            onClick={() => onActionTrigger?.('alignRight')}
          >
            <AlignRight size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Justify"
            onClick={() => onActionTrigger?.('alignJustify')}
          >
            <AlignJustify size={16} />
          </button>
        </div>
        
        <div className="h-4 border-r border-gray-300 mx-2"></div>
        
        {/* Indentation */}
        <div className="flex space-x-1 mx-1">
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Increase Indent"
            onClick={() => onActionTrigger?.('indent')}
          >
            <Indent size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Decrease Indent"
            onClick={() => onActionTrigger?.('outdent')}
          >
            <Outdent size={16} />
          </button>
        </div>
        
        <div className="h-4 border-r border-gray-300 mx-2"></div>
        
        {/* Lists */}
        <div className="flex space-x-1 mx-1">
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Bullet List"
            onClick={() => onActionTrigger?.('bulletList')}
          >
            <List size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Numbered List"
            onClick={() => onActionTrigger?.('numberedList')}
          >
            <ListOrdered size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Multilevel List"
            onClick={() => onActionTrigger?.('multilevelList')}
          >
            <ListTree size={16} />
          </button>
        </div>
        
        <div className="h-4 border-r border-gray-300 mx-2"></div>
        
        {/* Insert Menu */}
        <div className="flex space-x-1 mx-1">
          <div className="relative">
            <button 
              className="p-1 rounded hover:bg-gray-200" 
              title="Insert Table"
              onClick={() => setShowTableSelector(!showTableSelector)}
            >
              <Table size={16} />
            </button>
            {showTableSelector && (
              <div className="absolute top-full left-0 z-20 mt-1">
                <TableSelector onSelect={handleTableSelect} />
              </div>
            )}
          </div>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Insert Image"
            onClick={() => onActionTrigger?.('insertImage')}
          >
            <Image size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Insert Link"
            onClick={() => onActionTrigger?.('insertLink')}
          >
            <Link size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Table of Contents"
            onClick={() => onActionTrigger?.('insertTOC')}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
        
        <div className="h-4 border-r border-gray-300 mx-2"></div>
        
        {/* Additional Tools */}
        <div className="flex space-x-1 mx-1">
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Find and Replace"
            onClick={() => onActionTrigger?.('findReplace')}
          >
            <Search size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Line Spacing"
            onClick={() => onActionTrigger?.('lineSpacing')}
          >
            <ChevronsDownUp size={16} />
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="More Options"
            onClick={() => onActionTrigger?.('moreOptions')}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Table Selector Component for inserting tables
const TableSelector: React.FC<{onSelect: (rows: number, cols: number) => void}> = ({ onSelect }) => {
  const [selectedRows, setSelectedRows] = useState(1);
  const [selectedCols, setSelectedCols] = useState(1);
  
  return (
    <div className="bg-white border border-gray-300 shadow-md p-2 rounded">
      <div className="text-xs mb-1">{selectedRows} x {selectedCols} Table</div>
      <div className="grid grid-cols-6 gap-[2px]">
        {[...Array(6)].map((_, row) => (
          <div key={row} className="flex">
            {[...Array(6)].map((_, col) => (
              <div
                key={col}
                className={`w-5 h-5 border ${
                  row < selectedRows && col < selectedCols 
                    ? 'bg-blue-500' 
                    : 'bg-gray-200'
                } cursor-pointer`}
                onMouseEnter={() => {
                  setSelectedRows(row + 1);
                  setSelectedCols(col + 1);
                }}
                onClick={() => onSelect(row + 1, col + 1)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordToolbar;