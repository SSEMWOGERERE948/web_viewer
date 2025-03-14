// app/api/jwt/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { headers } from 'next/headers';

const ONLYOFFICE_JWT_SECRET = process.env.ONLYOFFICE_JWT_SECRET || "eppCko824MLdfhkJzBN5noT20X6feodE";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  // Handle preflight requests
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { docKey, url, title, fileType } = body;
      
      if (!docKey) {
        return NextResponse.json({ error: "Missing document key" }, { status: 400 });
      }
      
      // Get base URL for callbacks
      const baseUrl = process.env.NEXTAUTH_URL ||
                    process.env.VERCEL_URL ? 
                    `https://${process.env.VERCEL_URL}` : 
                    "http://localhost:3000";
      
      // Generate JWT Token with the exact structure expected by OnlyOffice
      const token = jwt.sign({
        document: {
          key: docKey,
          url: url,
          fileType: fileType || "docx",
          title: title || "Document.docx"
        },
        editorConfig: {
          mode: "edit",
          callbackUrl: `${baseUrl}/api/onlyoffice/callback?key=${docKey}`
        }
      }, ONLYOFFICE_JWT_SECRET, { algorithm: "HS256" });
      
      // Make sure token is defined before using it
      if (!token) {
        throw new Error("Failed to generate JWT token");
      }
      
      return NextResponse.json({ token: token }); // Use explicit property assignment
    } catch (error) {
      console.error("Error generating JWT:", error);
      return NextResponse.json({ error: "Failed to generate JWT" }, { status: 500 });
    }
  }