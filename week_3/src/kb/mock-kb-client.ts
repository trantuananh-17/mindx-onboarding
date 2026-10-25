import type { Document, SearchResult } from "../domain/document.ts";
import { ValidationError } from "../domain/errors.ts";
import type { KBClient } from "./kb-client.ts";

const SEED: Document[] = [
  {
    id: "doc-001",
    title: "Customer Response Template",
    content:
      "Thank you for contacting support. We will respond within one business day.",
    nodePath: "/templates/email",
    tags: ["template", "email", "response"],
  },
  {
    id: "doc-002",
    title: "DevOps On-call Schedule",
    content: "Primary: Alice. Secondary: Bob. Escalation: Carol.",
    nodePath: "/team/devops",
    tags: ["team", "schedule"],
  },
  {
    id: "doc-003",
    title: "SMS Payment Reminder",
    content: "Your invoice is due tomorrow. Pay at https://example.com/pay",
    nodePath: "/templates/sms",
    tags: ["template", "sms"],
  },
];

export class MockKBClient implements KBClient {
  private readonly documents = SEED.map((document) => ({
    ...document,
    tags: [...document.tags],
  }));

  async search(query: string, topK: number): Promise<SearchResult[]> {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length === 0) {
      throw new ValidationError("Search query is required");
    }
    if (!Number.isInteger(topK) || topK < 1) {
      throw new ValidationError("topK must be a positive integer");
    }

    const results: SearchResult[] = [];
    for (const document of this.documents) {
      let matchType: SearchResult["matchType"] | null = null;
      if (document.title.toLowerCase().includes(normalizedQuery)) {
        matchType = "title";
      } else if (document.content.toLowerCase().includes(normalizedQuery)) {
        matchType = "content";
      } else if (document.tags.some((tag) => tag.includes(normalizedQuery))) {
        matchType = "tag";
      }
      if (matchType) {
        results.push({
          document: { ...document, tags: [...document.tags] },
          matchType,
        });
      }
    }

    return results.slice(0, topK);
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
