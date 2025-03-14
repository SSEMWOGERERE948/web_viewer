import { type NextRequest, NextResponse } from "next/server";
import { renderAsync } from "docx-preview";
import { JSDOM } from "jsdom";
import path from "path";
import fs from "fs/promises";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // For security, only allow local files from the public directory
    if (!url.startsWith("/")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Read the file from the public directory
    const filePath = path.join(process.cwd(), "public", url);
    const fileBuffer = await fs.readFile(filePath);

    // Create a virtual DOM to render the document
    const dom = new JSDOM(`<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Document Preview</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: 'Calibri', 'Arial', sans-serif;
            }
            .docx-viewer {
              font-family: 'Calibri', 'Arial', sans-serif;
              line-height: 1.5;
            }
            .docx-viewer table {
              border-collapse: collapse;
              width: 100%;
            }
            .docx-viewer td, .docx-viewer th {
              border: 1px solid #ddd;
              padding: 8px;
            }
            .docx-viewer p {
              margin: 0 0 10px 0;
            }
            .docx-viewer ul, .docx-viewer ol {
              margin: 10px 0;
              padding-left: 20px;
            }
          </style>
        </head>
        <body>
          <div id="container"></div>
        </body>
      </html>`);

    const container = dom.window.document.getElementById("container");

    // Ensure the container exists
    if (!container) {
      throw new Error("Container element not found in the DOM.");
    }

    // Render the document to HTML
    await renderAsync(fileBuffer, container, undefined, {
      className: "docx-viewer", // Ensure this matches the CSS class in your styles
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      debug: false,
    });

    // Return the complete HTML page
    return new NextResponse(dom.serialize(), {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error processing DOCX:", error);

    // Return an error page
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              text-align: center;
            }
            .error {
              color: #e53e3e;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Error Loading Document</h1>
          <p class="error">${error instanceof Error ? error.message : String(error)}</p>
        </body>
      </html>
    `,
      {
        headers: {
          "Content-Type": "text/html",
        },
        status: 500,
      }
    );
  }
}