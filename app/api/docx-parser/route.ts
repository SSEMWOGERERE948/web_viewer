import { type NextRequest, NextResponse } from "next/server"
import * as mammoth from "mammoth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentBase64 } = body

    if (!documentBase64) {
      return NextResponse.json({ error: "No document provided" }, { status: 400 })
    }

    console.log("Received document for parsing...")

    // Convert base64 to Buffer
    const buffer = Buffer.from(documentBase64, "base64")
    console.log("Converted Base64 to Buffer.")

    // Configure mammoth with options to preserve formatting
    const options = {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Heading 5'] => h5:fresh",
        "p[style-name='Heading 6'] => h6:fresh",
        "p[style-name='TOC Heading'] => h1.toc-heading:fresh",
        "p[style-name='TOC 1'] => div.toc1:fresh",
        "p[style-name='TOC 2'] => div.toc2:fresh",
        "p[style-name='TOC 3'] => div.toc3:fresh",
        "r[style-name='Strong'] => strong:fresh",
        "r[style-name='Emphasis'] => em:fresh",
        "r[style-name='Intense Emphasis'] => em.intense:fresh",
        "table => table.document-table:fresh",
        "tr => tr:fresh",
        "td => td:fresh"
      ],
      ignoreEmptyParagraphs: false,
      preserveStyles: true
    }

    // Use mammoth.js to convert DOCX to HTML with advanced options
    console.log("Converting DOCX to HTML with mammoth.js...")
    const result = await mammoth.convertToHtml({ buffer }, options)
    
    // Get the main HTML content
    let html = result.value
    
    // Extract document metadata for styling purposes (if needed)
    const documentMetadata = await extractDocumentMetadata(buffer)
    
    // Apply custom CSS for maintaining Word-like appearance
    const enrichedHtml = applyWordStyling(html, documentMetadata)
    
    console.log("Document parsing completed successfully.")
    
    // Include any warnings for debugging
    if (result.messages.length > 0) {
      console.log("Conversion messages:", result.messages)
    }

    console.log("Returning parsed HTML content...")
    return NextResponse.json({ 
      html: enrichedHtml,
      messages: result.messages 
    })
  } catch (error) {
    console.error("Error processing DOCX:", error)
    return NextResponse.json({ 
      error: "Failed to process document",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// Function to extract document metadata (theme colors, fonts, etc.)
async function extractDocumentMetadata(buffer: Buffer) {
  try {
    // This is a placeholder for more advanced metadata extraction
    // For a production implementation, you might use docx4js or another library
    // that can extract theme information, fonts, etc.
    return {
      theme: {
        primaryColor: "#0078D4",
        textColor: "#333333"
      },
      defaultFont: "Calibri",
      defaultFontSize: "11pt"
    }
  } catch (error) {
    console.warn("Could not extract document metadata:", error)
    return {}
  }
}

// Function to apply Word-like styling to the HTML
function applyWordStyling(html: string, metadata: any) {
  // Add a container with Word-like styling
  const styledHtml = `
    <div class="word-document">
      <style>
        .word-document {
          font-family: "${metadata.defaultFont || 'Calibri'}", "Segoe UI", Arial, sans-serif;
          font-size: ${metadata.defaultFontSize || '11pt'};
          line-height: 1.5;
          color: ${metadata.theme?.textColor || '#333333'};
          padding: 1em;
        }
        .word-document h1, .word-document h2, .word-document h3, 
        .word-document h4, .word-document h5, .word-document h6 {
          font-family: "${metadata.defaultFont || 'Calibri'}", "Segoe UI", Arial, sans-serif;
          color: ${metadata.theme?.primaryColor || '#0078D4'};
          margin-top: 16px;
          margin-bottom: 8px;
        }
        .word-document h1 { font-size: 20pt; }
        .word-document h2 { font-size: 16pt; }
        .word-document h3 { font-size: 14pt; }
        .word-document h4 { font-size: 12pt; }
        .word-document table.document-table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
        }
        .word-document table.document-table td, 
        .word-document table.document-table th {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .word-document .toc1 { margin-left: 0; }
        .word-document .toc2 { margin-left: 20px; }
        .word-document .toc3 { margin-left: 40px; }
        .word-document .toc-heading {
          font-size: 16pt;
          border-bottom: 1px solid #ddd;
          margin-bottom: 16px;
        }
      </style>
      ${html}
    </div>
  `
  return styledHtml
}
