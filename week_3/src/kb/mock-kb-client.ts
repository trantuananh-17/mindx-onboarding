import type {
  AddDocumentInput,
  Document,
  SearchMatchType,
  SearchResult,
} from "../domain/document.ts";
import { NotFoundError, ValidationError } from "../domain/errors.ts";
import type { KBClient } from "./kb-client.ts";

function cloneDocument(document: Document): Document {
  return { ...document, tags: [...document.tags] };
}

const SEED_DOCUMENTS: Document[] = [
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

function detectMatchType(document: Document, normalizedQuery: string): SearchMatchType | null {
  if (document.title.toLowerCase().includes(normalizedQuery)) {
    return "title";
  }
  if (document.content.toLowerCase().includes(normalizedQuery)) {
    return "content";
  }
  if (document.tags.some((tag) => tag.includes(normalizedQuery))) {
    return "tag";
  }
  return null;
}

export class MockKBClient implements KBClient {
  private readonly documents: Document[];
  private nextNumericId: number;

  constructor(initialDocuments: Document[] = SEED_DOCUMENTS) {
    this.documents = initialDocuments.map(cloneDocument);
    this.nextNumericId =
      initialDocuments.reduce((max, doc) => {
        const match = /^doc-(\d+)$/.exec(doc.id);
        return match ? Math.max(max, Number(match[1])) : max;
      }, 0) + 1;
  }

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
      const matchType = detectMatchType(document, normalizedQuery);
      if (matchType) {
        results.push({ document: cloneDocument(document), matchType });
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
