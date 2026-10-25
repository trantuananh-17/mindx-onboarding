export interface Document {
  id: string;
  title: string;
  content: string;
  nodePath: string;
  tags: string[];
}

export type SearchMatchType = "title" | "content" | "tag";

export interface SearchResult {
  document: Document;
  matchType: SearchMatchType;
}

export interface AddDocumentInput {
  title: string;
  content: string;
  nodePath: string;
  tags: string[];
}
