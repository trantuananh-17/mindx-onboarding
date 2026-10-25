import { afterEach, describe, expect, it, vi } from "vitest";

import { HttpKBClient } from "../../src/kb/http-kb-client";

describe("HttpKBClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("gọi POST /search và parse JSON", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        results: [
          {
            document: {
              id: "doc-001",
              title: "Remote",
              content: "Body",
              nodePath: "/templates/email",
              tags: [],
            },
            matchType: "title",
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new HttpKBClient("https://kb.example");
    const results = await client.search("remote", 3);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://kb.example/search",
      expect.objectContaining({ method: "POST" }),
    );
    expect(results[0]?.document.id).toBe("doc-001");
  });
});
