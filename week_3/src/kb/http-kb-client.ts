import type { AddDocumentInput, Document, SearchResult } from "../domain/document.ts";
import { KBClientError } from "../domain/errors.ts";
import { normalizeSearchResults } from "./kb-search-normalize.ts";
import type { KBClient } from "./kb-client.ts";

function joinBaseUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${path}`;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    throw new KBClientError("KB API returned invalid JSON", { cause: error });
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as { error: unknown }).error === "string"
        ? (payload as { error: string }).error
        : `KB API request failed with status ${response.status}`;
    throw new KBClientError(message);
  }

  return payload as T;
}

export class HttpKBClient implements KBClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(baseUrl: string, fetchImpl: typeof fetch = fetch) {
    this.baseUrl = baseUrl;
    this.fetchImpl = fetchImpl;
  }

  async search(query: string, topK: number): Promise<SearchResult[]> {
    const payload = await readJsonResponse<{ results: SearchResult[] }>(
      await this.post("/search", { query, topK }),
    );
    return normalizeSearchResults(payload.results ?? []);
  }

  async list(nodePath: string, limit: number): Promise<Document[]> {
    const payload = await readJsonResponse<{ documents: Document[] }>(
      await this.post("/list", { nodePath, limit }),
    );
    return payload.documents ?? [];
  }

  async retrieve(docId: string): Promise<Document> {
    const payload = await readJsonResponse<{ document: Document }>(
      await this.post("/retrieve", { docId }),
    );
    if (!payload.document) {
      throw new KBClientError("KB API retrieve response missing document");
    }
    return payload.document;
  }

  async add(input: AddDocumentInput): Promise<Document> {
    const payload = await readJsonResponse<{ document: Document }>(
      await this.post("/add", input),
    );
    if (!payload.document) {
      throw new KBClientError("KB API add response missing document");
    }
    return payload.document;
  }

  private async post(path: string, body: unknown): Promise<Response> {
    try {
      return await this.fetchImpl(joinBaseUrl(this.baseUrl, path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      throw new KBClientError("Cannot reach KB API", { cause: error });
    }
  }
}
