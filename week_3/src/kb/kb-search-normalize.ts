import type { Document, SearchMatchType, SearchResult } from "../domain/document.ts";
import { KBClientError } from "../domain/errors.ts";

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

export function normalizeSearchResults(rawResults: unknown[]): SearchResult[] {
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
