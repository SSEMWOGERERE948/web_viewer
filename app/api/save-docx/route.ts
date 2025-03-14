import { type NextRequest, NextResponse } from "next/server"
import * as htmlDocx from "html-docx-js"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { html, filename = "document.docx" } = body

    if (!html) {
      return NextResponse.json({ error: "No HTML content provided" }, { status: 400 })
    }

    // Convert HTML to DOCX
    const docx = htmlDocx.asBlob(html)

    // In a real application, you would likely save this to a cloud storage
    // For this example, we'll save it locally (this requires proper permissions)
    try {
      const buffer = Buffer.from(await docx.arrayBuffer())
      const savePath = path.join(process.cwd(), "public", "documents", filename)
      await writeFile(savePath, buffer)

      return NextResponse.json({
        success: true,
        url: `/documents/${filename}`,
      })
    } catch (saveError) {
      console.error("Error saving file:", saveError)

      // If we can't save to disk, return the file as a download
      return new NextResponse(docx, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      })
    }
  } catch (error) {
    console.error("Error processing HTML to DOCX:", error)
    return NextResponse.json(
      {
        error: "Failed to convert to DOCX",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

