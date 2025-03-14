import { type NextRequest, NextResponse } from "next/server"
import docx4js from "docx4js"

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

    // Convert Buffer to ArrayBuffer
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
    console.log("Converted Buffer to ArrayBuffer.")

    // Load DOCX file
    console.log("Attempting to load DOCX with docx4js...")
    const doc = await docx4js.load(arrayBuffer)
    console.log("DOCX file loaded successfully.")

    let htmlContent = ""

    try {
      await doc.parse((type: string, node: any) => {
        if (type === "paragraph") {
          htmlContent += "<p>"
          if (node.children) {
            node.children.forEach((child: any) => {
              if (child.type === "text") {
                htmlContent += child.text
              } else if (child.type === "break") {
                htmlContent += "<br/>"
              } else if (child.type === "hyperlink") {
                htmlContent += `<a href="${child.href}">${child.text}</a>`
              }
            })
          }
          htmlContent += "</p>"
        } else if (type === "table") {
          htmlContent += "<table border='1' style='border-collapse: collapse; width: 100%;'>"
          if (node.rows) {
            node.rows.forEach((row: any) => {
              htmlContent += "<tr>"
              if (row.cells) {
                row.cells.forEach((cell: any) => {
                  htmlContent += "<td style='padding: 8px;'>"
                  if (cell.content) {
                    cell.content.forEach((content: any) => {
                      if (content.type === "paragraph") {
                        htmlContent += "<p>"
                        if (content.children) {
                          content.children.forEach((child: any) => {
                            if (child.type === "text") {
                              htmlContent += child.text
                            }
                          })
                        }
                        htmlContent += "</p>"
                      }
                    })
                  }
                  htmlContent += "</td>"
                })
              }
              htmlContent += "</tr>"
            })
          }
          htmlContent += "</table>"
        } else if (type === "list") {
          const listType = node.ordered ? "ol" : "ul"
          htmlContent += `<${listType}>`
          if (node.items) {
            node.items.forEach((item: any) => {
              htmlContent += "<li>"
              if (item.content) {
                item.content.forEach((content: any) => {
                  if (content.type === "paragraph") {
                    if (content.children) {
                      content.children.forEach((child: any) => {
                        if (child.type === "text") {
                          htmlContent += child.text
                        }
                      })
                    }
                  }
                })
              }
              htmlContent += "</li>"
            })
          }
          htmlContent += `</${listType}>`
        }
      })

      console.log("Document parsing completed successfully.")
    } catch (parseError) {
      console.error("Error parsing document:", parseError)
      return NextResponse.json({ error: "Error parsing document" }, { status: 500 })
    }

    console.log("Returning parsed HTML content...")
    return NextResponse.json({ html: htmlContent })
  } catch (error) {
    console.error("Error processing DOCX:", error)
    return NextResponse.json({ error: "Failed to process document" }, { status: 500 })
  }
}

