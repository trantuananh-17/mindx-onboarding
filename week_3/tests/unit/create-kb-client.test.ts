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

  it("đọc KB_CLIENT và KB_API_URL từ môi trường", () => {
    vi.stubEnv("KB_CLIENT", "http");
    vi.stubEnv("KB_API_URL", "http://kb.local");

    const client = createKBClient();
    expect(client).toBeInstanceOf(HttpKBClient);
  });

  it("ném lỗi khi http mà thiếu KB_API_URL", () => {
    vi.stubEnv("KB_API_URL", "");
    expect(() => createKBClient({ mode: "http" })).toThrow(
      "KB_API_URL is required",
    );
  });
});
