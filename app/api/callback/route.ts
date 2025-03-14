import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const ONLYOFFICE_JWT_SECRET = process.env.ONLYOFFICE_JWT_SECRET || "eppCko824MLdfhkJzBN5noT20X6feodE";

// Ensure this API route is dynamic (not statically generated)
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      console.error("Missing document key in request.");
      return NextResponse.json({ error: 1, message: "Missing document key" }, { status: 400 });
    }

    // Extract JWT token from headers
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (token) {
      try {
        jwt.verify(token, ONLYOFFICE_JWT_SECRET);
      } catch (err) {
        console.error("JWT verification failed:", err);
        return NextResponse.json({ error: 1, message: "Invalid token" }, { status: 401 });
      }
    }

    // Parse request body
    const body = await req.json();
    console.log("OnlyOffice callback received:", JSON.stringify(body, null, 2));

    // Check if document is ready to be saved (status 2)
    if (body.status === 2) {
      try {
        if (!body.url) {
          throw new Error("Missing document URL in callback");
        }

        console.log("Downloading document from:", body.url);

        // Fetch document data from OnlyOffice server
        const response = await fetch(body.url, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to download document: ${response.status} ${response.statusText}`);
        }

        const fileData = await response.arrayBuffer();
        console.log("File data downloaded, size:", fileData.byteLength);

        // 📌 Define storage directory inside callback/uploads dynamically
        const uploadsDir = path.resolve(__dirname, "uploads");

        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
          console.log(`Creating uploads directory at: ${uploadsDir}`);
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Generate file path
        const fileExtension = body.filetype || "docx";
        const filename = `${key}.${fileExtension}`;
        const filePath = path.join(uploadsDir, filename);

        console.log("Saving file to:", filePath);

        // Convert ArrayBuffer to Uint8Array for Windows compatibility
        fs.writeFileSync(filePath, new Uint8Array(fileData));

        console.log(`✅ Document ${key} saved successfully to ${filePath}`);

        return NextResponse.json({ error: 0, message: "Document saved successfully" });
      } catch (error) {
        console.error("❌ Error saving document:", error);
        return NextResponse.json(
          { error: 1, message: `Failed to save document: ${error instanceof Error ? error.message : "Unknown error"}` },
          { status: 500 }
        );
      }
    } 
    // Handle OnlyOffice error status
    else if (body.status === 3 || body.status === 7) {
      console.error("OnlyOffice reported an error:", body);
      return NextResponse.json({ error: 1, message: `Document server error: ${body.error || "Unknown error"}` }, { status: 500 });
    } 
    // Handle other statuses
    else {
      console.log(`Document ${key} received status ${body.status}`);
      return NextResponse.json({ error: 0 });
    }
  } catch (error) {
    console.error("❌ Error processing callback:", error);
    return NextResponse.json({ error: 1, message: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}` }, { status: 500 });
  }
}
