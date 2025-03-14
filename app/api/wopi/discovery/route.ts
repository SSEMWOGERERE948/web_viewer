// /app/api/wopi/discovery/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // This is a simplified WOPI discovery XML
  // In a real application, you would generate this dynamically based on your Collabora instance
  const discoveryXml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <wopi-discovery>
      <net-zone name="external-http">
        <app name="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
          <action name="edit" ext="docx" urlsrc="http://localhost:9980/loleaflet/dist/loleaflet.html?"/>
          <action name="view" ext="docx" urlsrc="http://localhost:9980/loleaflet/dist/loleaflet.html?"/>
        </app>
        <app name="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          <action name="edit" ext="xlsx" urlsrc="http://localhost:9980/loleaflet/dist/loleaflet.html?"/>
          <action name="view" ext="xlsx" urlsrc="http://localhost:9980/loleaflet/dist/loleaflet.html?"/>
        </app>
        <app name="application/vnd.openxmlformats-officedocument.presentationml.presentation">
          <action name="edit" ext="pptx" urlsrc="http://localhost:9980/loleaflet/dist/loleaflet.html?"/>
          <action name="view" ext="pptx" urlsrc="http://localhost:9980/loleaflet/dist/loleaflet.html?"/>
        </app>
      </net-zone>
    </wopi-discovery>
  `;
  
  return new NextResponse(discoveryXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}