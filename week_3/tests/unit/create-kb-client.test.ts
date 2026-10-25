import { afterEach, describe, expect, it, vi } from "vitest";

import { createKBClient } from "../../src/kb/create-kb-client";
import { HttpKBClient } from "../../src/kb/http-kb-client";
import { MockKBClient } from "../../src/kb/mock-kb-client";

describe("createKBClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("mặc định trả MockKBClient", () => {
    const client = createKBClient({ mode: "mock" });
    expect(client).toBeInstanceOf(MockKBClient);
  });

  it("trả HttpKBClient khi mode=http và có base URL", () => {
    const client = createKBClient({
      mode: "http",
      apiBaseUrl: "http://127.0.0.1:3928",
    });
    expect(client).toBeInstanceOf(HttpKBClient);
  });
});
