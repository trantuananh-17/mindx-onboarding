import type { SearchResult } from "../domain/document.ts";
import type { KBClient } from "./kb-client.ts";

export class MockKBClient implements KBClient {
  async search(_query: string, _topK: number): Promise<SearchResult[]> {
    return [];
  }

  async list(): Promise<never> {
    throw new Error("Not implemented");
  }

  async retrieve(): Promise<never> {
    throw new Error("Not implemented");
  }

  async add(): Promise<never> {
    throw new Error("Not implemented");
  }
}
