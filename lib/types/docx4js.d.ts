// types/docx4js.d.ts
declare module 'docx4js' {
    export interface DocxNode {
      type: string;
      children?: DocxNode[];
      text?: string;
      href?: string;
      ordered?: boolean;
      items?: DocxNode[];
      rows?: {
        cells?: {
          content?: DocxNode[];
        }[];
      }[];
      content?: DocxNode[];
    }
  
    export interface DocxDocument {
      parse(callback: (type: string, node: DocxNode, parent?: DocxNode) => void): Promise<void>;
    }
  
    function load(buffer: ArrayBuffer): Promise<DocxDocument>;
    
    export { load };
  }