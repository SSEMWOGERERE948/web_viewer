"use client";

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

// Define CKEditor Wrapper Props
interface CKEditorWrapperProps {
  data: string;
  onChange?: (event: any, editor: Editor) => void;
  onReady?: (editor: Editor) => void;
}

const CKEditorWrapper = ({ data, onChange, onReady }: CKEditorWrapperProps) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      onReady={(editor: Editor) => {
        if (onReady) onReady(editor);
      }}
      onChange={(event: any, editor: Editor) => {
        if (onChange) onChange(event, editor);
      }}
    />
  );
};

export default CKEditorWrapper;