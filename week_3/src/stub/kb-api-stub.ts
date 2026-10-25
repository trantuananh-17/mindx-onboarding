import { createServer, type IncomingMessage, type Server } from "node:http";

import { KBError, NotFoundError, ValidationError } from "../domain/errors.ts";
import type { KBClient } from "../kb/kb-client.ts";
import { MockKBClient } from "../kb/mock-kb-client.ts";

export interface KbApiStubHandle {
  baseUrl: string;
  close(): Promise<void>;
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new ValidationError("request body must be valid JSON");
  }
}

function statusForError(error: unknown): number {
  if (error instanceof NotFoundError) {
    return 404;
  }
  if (error instanceof ValidationError) {
    return 400;
  }
  if (error instanceof KBError) {
    return 400;
  }
  return 500;
}

function sendJson(
  response: import("node:http").ServerResponse,
  status: number,
  payload: unknown,
): void {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(`${JSON.stringify(payload)}\n`);
}

async function handleRequest(
  client: KBClient,
  path: string,
  body: unknown,
): Promise<{ status: number; payload: unknown }> {
  switch (path) {
    case "/search": {
      const record = body as { query?: string; topK?: number };
      const results = await client.search(record.query ?? "", record.topK ?? 5);
      return { status: 200, payload: { results } };
    }
    case "/list": {
      const record = body as { nodePath?: string; limit?: number };
      const documents = await client.list(record.nodePath ?? "", record.limit ?? 10);
      return { status: 200, payload: { documents } };
    }
    case "/retrieve": {
      const record = body as { docId?: string };
      const document = await client.retrieve(record.docId ?? "");
      return { status: 200, payload: { document } };
    }
    case "/add": {
      const record = body as {
        title?: string;
        content?: string;
        nodePath?: string;
        tags?: string[];
      };
      const document = await client.add({
        title: record.title ?? "",
        content: record.content ?? "",
        nodePath: record.nodePath ?? "",
        tags: record.tags ?? [],
      });
      return { status: 200, payload: { document } };
    }
    default:
      return { status: 404, payload: { error: `Unknown path: ${path}` } };
  }
}

export function startKbApiStub(options: {
  port?: number;
  host?: string;
  client?: KBClient;
} = {}): Promise<KbApiStubHandle> {
  const client = options.client ?? new MockKBClient();
  const host = options.host ?? "127.0.0.1";

  return new Promise((resolve, reject) => {
    const server: Server = createServer(async (request, response) => {
      if (request.method !== "POST") {
        sendJson(response, 405, { error: "Only POST is supported" });
        return;
      }

      const path = request.url?.split("?")[0] ?? "";

      try {
        const body = await readJsonBody(request);
        const result = await handleRequest(client, path, body);
        sendJson(response, result.status, result.payload);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        sendJson(response, statusForError(error), { error: message });
      }
    });

    server.on("error", reject);
    server.listen(options.port ?? 0, host, () => {
      const address = server.address();
      if (address === null || typeof address === "string") {
        reject(new Error("Cannot determine stub server port"));
        return;
      }

      resolve({
        baseUrl: `http://${host}:${address.port}`,
        close: () =>
          new Promise<void>((closeResolve, closeReject) => {
            server.close((closeError) => {
              if (closeError) {
                closeReject(closeError);
                return;
              }
              closeResolve();
            });
          }),
      });
    });
  });
}
