// /app/api/wopi/files/[fileId]/[action]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// This is a very simplified WOPI implementation
const DOCUMENTS_DIR = path.join(process.cwd(), 'documents');

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string; action: string } }
) {
  const { fileId, action } = params;
  
  try {
    // Handle different WOPI actions
    switch (action) {
      case 'CheckFileInfo':
        // This endpoint provides metadata about the file
        const filePath = path.join(DOCUMENTS_DIR, fileId);
        const stat = await fs.stat(filePath);
        
        return NextResponse.json({
          BaseFileName: fileId,
          Size: stat.size,
          Version: stat.mtime.getTime().toString(),
          UserCanWrite: true,
          UserCanNotWriteRelative: false,
          UserFriendlyName: 'Next.js User',
          PostMessageOrigin: 'http://localhost:3000',
        });
        
      case 'GetFile':
        // This endpoint returns the file content
        const fileContent = await fs.readFile(path.join(DOCUMENTS_DIR, fileId));
        return new NextResponse(fileContent);
        
      default:
        return NextResponse.json({ error: 'Action not supported' }, { status: 400 });
    }
  } catch (error) {
    console.error('WOPI error:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { fileId: string; action: string } }
) {
  const { fileId, action } = params;
  
  try {
    // Handle different WOPI actions
    switch (action) {
      case 'PutFile':
        // This endpoint saves the file content
        const fileContent = await request.arrayBuffer();
        
        // Create directory if it doesn't exist
        try {
          await fs.access(DOCUMENTS_DIR);
        } catch (error) {
          await fs.mkdir(DOCUMENTS_DIR, { recursive: true });
        }
        
        // Convert ArrayBuffer to Uint8Array which is acceptable for fs.writeFile
        const uint8Array = new Uint8Array(fileContent);
        await fs.writeFile(path.join(DOCUMENTS_DIR, fileId), uint8Array);
        
        return NextResponse.json({ success: true });
        
      default:
        return NextResponse.json({ error: 'Action not supported' }, { status: 400 });
    }
  } catch (error) {
    console.error('WOPI error:', error);
    return NextResponse.json({ error: 'File operation failed' }, { status: 500 });
  }
}