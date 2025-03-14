"use client"

import { useEffect, useRef, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { FileIcon, Save, FileDown, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface OfficeViewerProps {
  url?: string
  fileType?: string
  zoom: number
}

export function OfficeViewer({ url, fileType = "word", zoom }: OfficeViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [documentTitle, setDocumentTitle] = useState<string>("Untitled Document")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { toast } = useToast()
  
  useEffect(() => {
    // Initialize the Collabora iframe
    if (url) {
      initCollaboraDocument(url)
    } else {
      initNewCollaboraDocument()
    }
  }, [url])
  
  const initCollaboraDocument = async (documentUrl: string) => {
    try {
      // Get the document name from the URL
      const urlParts = documentUrl.split('/')
      const fileName = urlParts[urlParts.length - 1].split('.')[0]
      setDocumentTitle(fileName || "Document")
      
      // Create a URL for the Collabora iframe
      // This simplified example assumes Collabora is running in "discovery" mode
      // In a production environment, you would need to implement proper WOPI integration
      const collaboraUrl = `/api/collabora-proxy?url=/loleaflet/dist/loleaflet.html?file_path=${encodeURIComponent(documentUrl)}`
      
      if (iframeRef.current) {
        iframeRef.current.src = collaboraUrl
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing Collabora:", error)
      toast({
        title: "Error loading document",
        description: "Could not connect to Collabora Online server.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }
  
  const initNewCollaboraDocument = () => {
    try {
      // Create a URL for a new document in Collabora
      const collaboraUrl = `/api/collabora-proxy?url=/loleaflet/dist/loleaflet.html?new=true`
      
      if (iframeRef.current) {
        iframeRef.current.src = collaboraUrl
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error("Error creating new document:", error)
      toast({
        title: "Error creating document",
        description: "Could not connect to Collabora Online server.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[500px] bg-muted/20">
      {isLoading ? (
        <Skeleton className="h-[500px] w-full max-w-3xl rounded-lg" />
      ) : (
        <div className="w-full max-w-3xl">
          <div className="sticky top-0 z-20 bg-white border-b shadow-sm w-full max-w-3xl mb-2">
            <div className="flex justify-center items-center py-2">
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="border-0 text-center font-semibold text-lg bg-transparent focus:outline-none focus:border-b-2 focus:border-blue-500"
                placeholder="Document Title"
              />
            </div>
          </div>
          
          {/* Collabora iframe */}
          <div className="border rounded shadow bg-white">
            <iframe
              ref={iframeRef}
              className="w-full"
              style={{ height: '70vh', border: 'none' }}
              title="Collabora Online Editor"
              allowFullScreen={true}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  )
}