/**
 * Helper functions for preserving document styling when exporting to Word
 */

// Update the Word export helper to better handle Quill's HTML output

export function prepareHtmlForWordExport(htmlContent: string): string {
    // Create a full HTML document if the content is just a fragment
    let enhancedHtml = htmlContent
  
    if (!htmlContent.includes("<html>")) {
      enhancedHtml = `
        <!DOCTYPE html>
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word"
              xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>Document</title>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `
    }
  
    // Add Word-specific CSS
    const wordCss = `
      <style>
        /* Word-specific styles */
        @page WordSection1 {
          size: 8.5in 11.0in;
          margin: 1.0in 1.0in 1.0in 1.0in;
          mso-header-margin: .5in;
          mso-footer-margin: .5in;
          mso-paper-source: 0;
        }
        div.WordSection1 {page: WordSection1;}
        
        /* Quill specific mappings to Word styles */
        .ql-font-serif {
          font-family: Georgia, Times New Roman, serif;
        }
        .ql-font-monospace {
          font-family: Monaco, Courier New, monospace;
        }
        .ql-size-small {
          font-size: 0.75em;
        }
        .ql-size-large {
          font-size: 1.5em;
        }
        .ql-size-huge {
          font-size: 2.5em;
        }
        .ql-align-center {
          text-align: center;
        }
        .ql-align-right {
          text-align: right;
        }
        .ql-align-justify {
          text-align: justify;
        }
        
        /* Heading styles */
        h1 {
          mso-style-name: "Heading 1";
          mso-style-priority: 9;
          mso-style-qformat: yes;
          margin-top: 12.0pt;
          margin-bottom: 6.0pt;
          font-size: 16.0pt;
          font-weight: bold;
        }
        h2 {
          mso-style-name: "Heading 2";
          mso-style-priority: 9;
          margin-top: 10.0pt;
          margin-bottom: 6.0pt;
          font-size: 14.0pt;
          font-weight: bold;
        }
        h3 {
          mso-style-name: "Heading 3";
          mso-style-priority: 9;
          margin-top: 8.0pt;
          margin-bottom: 6.0pt;
          font-size: 12.0pt;
          font-weight: bold;
        }
        
        /* Table styles */
        table {
          border-collapse: collapse;
          mso-table-layout-alt: fixed;
          mso-padding-alt: 0in 5.4pt 0in 5.4pt;
        }
        td, th {
          padding: 0.1in;
          border: 1pt solid windowtext;
        }
        
        /* List styles */
        ul, ol {
          margin-left: 1em;
        }
      </style>
    `
  
    // Insert Word CSS into head
    enhancedHtml = enhancedHtml.replace("</head>", `${wordCss}</head>`)
  
    // Wrap body content in Word section if not already wrapped
    if (!enhancedHtml.includes('class="WordSection1"')) {
      enhancedHtml = enhancedHtml.replace("<body>", '<body><div class="WordSection1">')
      enhancedHtml = enhancedHtml.replace("</body>", "</div></body>")
    }
  
    // Convert Quill specific classes to Word compatible styles
    enhancedHtml = enhancedHtml
      // Fix list indentation
      .replace(/<li class="ql-indent-(\d+)/g, (match, level) => {
        const indentValue = Number.parseInt(level) * 1.5
        return `<li style="margin-left: ${indentValue}em`
      })
      // Add mso-list attributes for better list rendering in Word
      .replace(/<li/g, '<li style="mso-list:l0 level1 lfo1"')
      // Fix image dimensions
      .replace(/<img([^>]*)>/g, (match, attributes) => {
        if (!attributes.includes("width") && !attributes.includes("height")) {
          return match.replace(">", ' width="auto" height="auto">')
        }
        return match
      })
  
    return enhancedHtml
  }
  
  // Convert Excel data to a format that preserves styling
  export function prepareExcelDataForExport(data: any[][]): any[][] {
    // This function would handle any special formatting needed for Excel
    // For now, we're just returning the data as is
    return data
  }
  
  