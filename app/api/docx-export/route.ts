import { NextResponse } from "next/server";
import htmlToDocx from "html-to-docx";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { htmlContent, documentTitle } = body;

    if (!htmlContent) {
      return NextResponse.json(
        { error: "No content provided for export" },
        { status: 400 }
      );
    }

    console.log("Converting HTML to DOCX...");

    // ✅ Fix: Define options with proper types
    const options = {
      orientation: "portrait" as "portrait" | "landscape",
      margins: { top: 1000, bottom: 1000, left: 1000, right: 1000 },
    };

    // Generate DOCX buffer
    const docxBuffer = await htmlToDocx(htmlContent, "Styled_Document.docx", options);

    if (!docxBuffer) {
      return NextResponse.json(
        { error: "Failed to generate DOCX" },
        { status: 500 }
      );
    }

    const fileName = `${documentTitle || "Exported_Document"}.docx`;

    return new Response(docxBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting document:", error);
    return NextResponse.json(
      { error: "Failed to export document" },
      { status: 500 }
    );
  }
}
