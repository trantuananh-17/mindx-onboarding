import type {
  AddDocumentInput,
  Document,
  SearchResult,
} from "../domain/document.ts";

export interface KBClient {
  search(query: string, topK: number): Promise<SearchResult[]>;
  list(nodePath: string, limit: number): Promise<Document[]>;
  retrieve(docId: string): Promise<Document>;
  add(input: AddDocumentInput): Promise<Document>;
}
