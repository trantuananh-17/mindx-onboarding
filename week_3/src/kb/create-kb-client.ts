import type { KBClient } from "./kb-client.ts";
import { HttpKBClient } from "./http-kb-client.ts";
import { MockKBClient } from "./mock-kb-client.ts";

export interface KBClientFactoryOptions {
  mode?: string;
  apiBaseUrl?: string;
  fetchImpl?: typeof fetch;
}

export function createKBClient(options: KBClientFactoryOptions = {}): KBClient {
  const mode = (options.mode ?? process.env.KB_CLIENT ?? "mock").toLowerCase();

  if (mode === "http") {
    const baseUrl = options.apiBaseUrl ?? process.env.KB_API_URL;
    if (!baseUrl) {
      throw new Error("KB_API_URL is required when KB_CLIENT=http");
    }
    return new HttpKBClient(baseUrl, options.fetchImpl);
  }

  if (mode !== "mock") {
    throw new Error(`Unsupported KB_CLIENT value: ${mode}`);
  }

  return new MockKBClient();
}
