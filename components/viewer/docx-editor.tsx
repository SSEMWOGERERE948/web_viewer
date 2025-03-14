"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Editor } from "@ckeditor/ckeditor5-core";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Define the CKEditor component's props type
interface CKEditorComponentProps {
  editor: typeof ClassicEditor;
  data: string;
  onReady?: (editor: Editor) => void;
  onChange?: (event: any, editor: Editor) => void;
}

// Dynamically import CKEditor with proper typing
const CKEditor = dynamic(
  () =>
    import("@ckeditor/ckeditor5-react").then(
      (mod) => mod.CKEditor as unknown as React.ComponentType<CKEditorComponentProps>
    ),
  { ssr: false }
);

interface DocxEditorProps {
  url: string;
  zoom: number;
  onSave?: (content: string) => void;
}

export function DocxEditor({ url, zoom, onSave }: DocxEditorProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editorData, setEditorData] = useState<string>("");
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    console.log("Fetching document:", url);

    const loadDocument = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        console.log("Document fetched successfully.");

        const reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onloadend = async () => {
          if (!isMounted) return;

          const base64data = reader.result?.toString().split(",")[1];
          if (!base64data) throw new Error("Failed to convert document to Base64");

          console.log("Sending document to API for parsing...");
          const apiResponse = await fetch("/api/docx-parser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentBase64: base64data }),
          });

          if (!apiResponse.ok) {
            throw new Error(`Failed to parse document: ${apiResponse.status}`);
          }

          const { html } = await apiResponse.json();
          if (!html) throw new Error("Parsed HTML is empty!");

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;
          const content = tempDiv.querySelector(".docx-viewer")?.innerHTML || html;

          setEditorData(content);
          setIsLoading(false);
        };
      } catch (error: any) {
        console.error("Document loading error:", error);
        toast({
          title: "Error loading document",
          description: error.message || "There was a problem loading the document. Try downloading it instead.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    loadDocument();

    return () => {
      isMounted = false;
    };
  }, [url, toast]);

  const handleSave = () => {
    if (editorInstance && onSave) {
      const content = editorInstance.getData();
      onSave(content);

      toast({
        title: "Document saved",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  const handleExport = () => {
    if (editorInstance) {
      const content = editorInstance.getData();
      const blob = new Blob([content], { type: "text/html" });
      const fileUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = "document.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(fileUrl);

      toast({
        title: "Document exported",
        description: "Your document has been exported successfully.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Document Editor</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        {isLoading ? (
          <Skeleton className="h-[500px] w-full rounded-lg" />
        ) : (
          <div style={{ zoom: `${zoom}%` }}>
            <CKEditor
              editor={ClassicEditor}
              data={editorData}
              onReady={(editor: Editor) => {
                setEditorInstance(editor);
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(_: any, editor: Editor) => {
                const data = editor.getData();
                setEditorData(data);
                console.log("Editor content changed:", data);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}