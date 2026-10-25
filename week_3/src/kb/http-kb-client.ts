import type {
  AddDocumentInput,
  Document,
  SearchResult,
} from "../domain/document.ts";
import type { KBClient } from "./kb-client.ts";

export class HttpKBClient implements KBClient {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async search(_query: string, _topK: number): Promise<SearchResult[]> {
    throw new Error("HttpKBClient.search not implemented");
  }

  async list(_nodePath: string, _limit: number): Promise<Document[]> {
    throw new Error("HttpKBClient.list not implemented");
  }

  async retrieve(_docId: string): Promise<Document> {
    throw new Error("HttpKBClient.retrieve not implemented");
  }

  async add(_input: AddDocumentInput): Promise<Document> {
    throw new Error("HttpKBClient.add not implemented");
  }
}
