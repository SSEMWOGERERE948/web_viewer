import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import WordToolbar from './word-tool-bar';

interface WordEditorProps {
  initialHtml: string;
  onSave?: (content: string) => void;
  onChange?: () => void;
}

const WordEditor: React.FC<WordEditorProps> = ({ 
  initialHtml, 
  onSave,
  onChange
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorContent, setEditorContent] = useState(initialHtml);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  // Initialize editor with initial HTML content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml;
      setupContentObserver();
      editorRef.current.focus();
    }
  }, [initialHtml]);

  // Set up mutation observer to track changes to the editor content
  const setupContentObserver = () => {
    if (!editorRef.current) return;

    const observer = new MutationObserver((mutations) => {
      setHasChanges(true);
      if (onChange) onChange();
    });

    observer.observe(editorRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  };

  // Save the current selection for later use
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0).cloneRange());
    }
  };

  // Restore the saved selection
  const restoreSelection = () => {
    if (savedSelection) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelection);
      }
    }
  };

  // Handle style changes from the toolbar
  const handleStyleChange = (styleType: string, value: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Apply the style to the selected text
    const range = selection.getRangeAt(0);
    
    switch (styleType) {
      case 'fontFamily':
        document.execCommand('fontName', false, value);
        break;
      case 'fontSize':
        // Save selection, wrap with span, restore selection
        const span = document.createElement('span');
        span.style.fontSize = value;
        
        const selectedContent = range.extractContents();
        span.appendChild(selectedContent);
        range.insertNode(span);
        break;
      case 'textColor':
        document.execCommand('foreColor', false, value);
        break;
      case 'highlightColor':
        if (value === 'transparent') {
          // Remove highlight - need to replace with same content without the background
          const selectedContent = range.extractContents();
          range.insertNode(selectedContent);
        } else {
          document.execCommand('hiliteColor', false, value);
        }
        break;
    }
    
    setHasChanges(true);
    if (onChange) onChange();
  };

  // Handle action triggers from the toolbar
  const handleActionTrigger = (action: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    // Check if it's a table insertion with dimensions
    if (action.startsWith('insertTable:')) {
      const [rows, cols] = action.split(':')[1].split('x').map(num => parseInt(num));
      insertCustomTable(rows, cols);
      return;
    }
    
    switch (action) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'strikethrough':
        document.execCommand('strikeThrough', false);
        break;
      case 'superscript':
        document.execCommand('superscript', false);
        break;
      case 'subscript':
        document.execCommand('subscript', false);
        break;
      case 'h1':
        document.execCommand('formatBlock', false, '<h1>');
        break;
      case 'h2':
        document.execCommand('formatBlock', false, '<h2>');
        break;
      case 'h3':
        document.execCommand('formatBlock', false, '<h3>');
        break;
      case 'paragraph':
        document.execCommand('formatBlock', false, '<p>');
        break;
      case 'alignLeft':
        document.execCommand('justifyLeft', false);
        break;
      case 'alignCenter':
        document.execCommand('justifyCenter', false);
        break;
      case 'alignRight':
        document.execCommand('justifyRight', false);
        break;
      case 'alignJustify':
        document.execCommand('justifyFull', false);
        break;
      case 'indent':
        document.execCommand('indent', false);
        break;
      case 'outdent':
        document.execCommand('outdent', false);
        break;
      case 'bulletList':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'numberedList':
        document.execCommand('insertOrderedList', false);
        break;
      case 'multilevelList':
        // This is a more complex operation, we'll use a placeholder
        handleMultilevelList();
        break;
      case 'insertTable':
        insertTable();
        break;
      case 'insertImage':
        insertImage();
        break;
      case 'insertLink':
        insertLink();
        break;
      case 'insertTOC':
        insertTableOfContents();
        break;
      case 'findReplace':
        openFindReplaceDialog();
        break;
      case 'lineSpacing':
        changeLineSpacing();
        break;
      case 'moreOptions':
        showMoreOptions();
        break;
      case 'undo':
        document.execCommand('undo', false);
        break;
      case 'redo':
        document.execCommand('redo', false);
        break;
      case 'copy':
        document.execCommand('copy', false);
        break;
      case 'cut':
        document.execCommand('cut', false);
        break;
      case 'paste':
        document.execCommand('paste', false);
        break;
      case 'save':
        handleSave();
        break;
      case 'print':
        window.print();
        break;
    }
    
    setHasChanges(true);
    if (onChange) onChange();
  };

  // Handle multilevel list insertion
  const handleMultilevelList = () => {
    saveSelection();
    
    // First create a regular list
    document.execCommand('insertUnorderedList', false);
    
    // Then we would add the nested structure
    // For now, we'll just insert a sample nested list
    restoreSelection();
    
    const nestedListHtml = `
      <ul>
        <li>Main Item 1
          <ul>
            <li>Sub Item 1.1</li>
            <li>Sub Item 1.2</li>
          </ul>
        </li>
        <li>Main Item 2
          <ul>
            <li>Sub Item 2.1</li>
            <li>Sub Item 2.2</li>
          </ul>
        </li>
      </ul>
    `;
    
    // In a real implementation, we'd apply this more intelligently
    // based on the current selection and context
    document.execCommand('insertHTML', false, nestedListHtml);
  };

  // Insert a custom table with the specified dimensions
  const insertCustomTable = (rows: number, cols: number) => {
    let tableHtml = '<table border="1" style="width:100%; border-collapse: collapse;">';
    
    // Create header row
    tableHtml += '<tr>';
    for (let j = 0; j < cols; j++) {
      tableHtml += `<th style="border: 1px solid #ddd; padding: 8px;">Header ${j + 1}</th>`;
    }
    tableHtml += '</tr>';
    
    // Create data rows
    for (let i = 1; i < rows; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHtml += `<td style="border: 1px solid #ddd; padding: 8px;">Row ${i}, Cell ${j + 1}</td>`;
      }
      tableHtml += '</tr>';
    }
    
    tableHtml += '</table><p></p>';
    
    // Insert the table at the current selection
    document.execCommand('insertHTML', false, tableHtml);
  };

  // Insert a default 3x3 table
  const insertTable = () => {
    insertCustomTable(3, 3);
  };

  // Insert an image
  const insertImage = () => {
    saveSelection();
    
    // In a real implementation, you would show a file picker or URL input dialog
    const imageUrl = prompt('Enter image URL:', 'https://via.placeholder.com/150');
    
    if (imageUrl) {
      restoreSelection();
      const imgHtml = `<img src="${imageUrl}" alt="Inserted image" style="max-width: 100%;" />`;
      document.execCommand('insertHTML', false, imgHtml);
    }
  };

  // Insert a hyperlink
  const insertLink = () => {
    saveSelection();
    
    // Get the URL and optional link text
    const url = prompt('Enter URL:', 'https://');
    
    if (url) {
      restoreSelection();
      
      const selection = window.getSelection();
      let linkText = '';
      
      if (selection && selection.toString().trim() !== '') {
        // Use selected text as link text
        document.execCommand('createLink', false, url);
      } else {
        // No selection, prompt for link text
        linkText = prompt('Enter link text:', url) || url;
        const linkHtml = `<a href="${url}" target="_blank">${linkText}</a>`;
        document.execCommand('insertHTML', false, linkHtml);
      }
    }
  };

  // Insert a table of contents
  const insertTableOfContents = () => {
    // This would typically scan the document for headings and create a TOC
    // For this example, we'll insert a placeholder
    const tocHtml = `
      <div class="table-of-contents" style="border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
        <h3>Table of Contents</h3>
        <ul>
          <li><a href="#section1">Section 1</a></li>
          <li><a href="#section2">Section 2</a></li>
          <li><a href="#section3">Section 3</a>
            <ul>
              <li><a href="#section3-1">Section 3.1</a></li>
              <li><a href="#section3-2">Section 3.2</a></li>
            </ul>
          </li>
        </ul>
      </div>
    `;
    
    document.execCommand('insertHTML', false, tocHtml);
  };

  // Open find and replace dialog
  const openFindReplaceDialog = () => {
    saveSelection();
    
    // In a real implementation, you would show a proper dialog
    // For this example, we'll use simple prompts
    const findText = prompt('Find:', '');
    
    if (findText && findText.trim() !== '') {
      const replaceText = prompt('Replace with:', '');
      
      if (replaceText !== null) {
        restoreSelection();
        
        // Simple find and replace in the editor content
        if (editorRef.current) {
          const content = editorRef.current.innerHTML;
          const newContent = content.replace(new RegExp(findText, 'g'), replaceText);
          editorRef.current.innerHTML = newContent;
        }
      }
    }
  };

  // Change line spacing
  const changeLineSpacing = () => {
    saveSelection();
    
    // In a real implementation, you would show a proper dialog
    // For this example, we'll use a simple prompt
    const spacing = prompt('Enter line spacing (1.0, 1.5, 2.0, etc.):', '1.5');
    
    if (spacing && !isNaN(parseFloat(spacing))) {
      restoreSelection();
      
      // Apply line spacing to the selected block
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Get the common ancestor element of the selection
        let container = range.commonAncestorContainer;
        if (container.nodeType === Node.TEXT_NODE) {
        }
        
        // Apply line spacing
        if (container instanceof HTMLElement) {
          container.style.lineHeight = spacing;
        }
      }
    }
  };

  // Show more formatting options
  const showMoreOptions = () => {
    alert('Additional formatting options would be shown here.');
    // In a real implementation, this would display a dialog or dropdown
    // with advanced formatting options
  };

  // Handle save action
  const handleSave = () => {
    if (editorRef.current && onSave) {
      const content = editorRef.current.innerHTML;
      setEditorContent(content);
      onSave(content);
      setHasChanges(false);
    }
  };

  return (
    <div className="border rounded-md">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-md p-2">
        <WordToolbar 
          onStyleChange={handleStyleChange} 
          onActionTrigger={handleActionTrigger}
        />
      </div>
      
      {/* Scrollable Document Editor */}
      <div 
        className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto focus:outline-none" 
        ref={editorRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={() => setHasChanges(true)}
        onBlur={() => {
          if (editorRef.current) {
            setEditorContent(editorRef.current.innerHTML);
          }
        }}
      />
      
      {/* Save Button */}
      <div className="flex justify-end p-2 border-t bg-white">
        <Button 
          disabled={!hasChanges} 
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save
        </Button>
      </div>
    </div>
  );
};

export default WordEditor;