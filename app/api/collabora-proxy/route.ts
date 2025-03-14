// /app/api/collabora-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url') || '';
  
  try {
    const response = await fetch(`http://localhost:9980${targetUrl}`);
    const data = await response.text();
    
    // Create a new response with the data from Collabora
    const newResponse = new NextResponse(data);
    
    // Copy headers from the Collabora response
    response.headers.forEach((value, key) => {
      newResponse.headers.set(key, value);
    });
    
    return newResponse;
  } catch (error) {
    console.error('Error proxying to Collabora:', error);
    return NextResponse.json({ error: 'Failed to connect to Collabora' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url') || '';
  
  try {
    const body = await request.text();
    const response = await fetch(`http://localhost:9980${targetUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
      },
      body,
    });
    
    const data = await response.text();
    
    // Create a new response with the data from Collabora
    const newResponse = new NextResponse(data);
    
    // Copy headers from the Collabora response
    response.headers.forEach((value, key) => {
      newResponse.headers.set(key, value);
    });
    
    return newResponse;
  } catch (error) {
    console.error('Error proxying to Collabora:', error);
    return NextResponse.json({ error: 'Failed to connect to Collabora' }, { status: 500 });
  }
}