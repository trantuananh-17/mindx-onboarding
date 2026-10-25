import type {
  AddDocumentInput,
  Document,
  SearchMatchType,
  SearchResult,
} from "../domain/document.ts";
import { KBClientError } from "../domain/errors.ts";
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

function isFullSearchResult(value: unknown): value is SearchResult {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.matchType === "string" &&
    typeof record.document === "object" &&
    record.document !== null
  );
}

function normalizeSearchResults(rawResults: unknown[]): SearchResult[] {
  return rawResults.map((entry) => {
    if (isFullSearchResult(entry)) {
      return entry;
    }

    if (typeof entry !== "object" || entry === null) {
      throw new KBClientError("KB API search result has an invalid shape");
    }

    const slim = entry as Record<string, unknown>;
    const id = slim.id;
    const title = slim.title;
    const nodePath = slim.nodePath;
    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof nodePath !== "string"
    ) {
      throw new KBClientError("KB API search result has an invalid shape");
    }

    const matchType = (slim.matchType as SearchMatchType | undefined) ?? "title";
    const document: Document = {
      id,
      title,
      nodePath,
      content: typeof slim.content === "string" ? slim.content : "",
      tags: Array.isArray(slim.tags)
        ? slim.tags.filter((tag): tag is string => typeof tag === "string")
        : [],
    };

    return { document, matchType };
  });
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
