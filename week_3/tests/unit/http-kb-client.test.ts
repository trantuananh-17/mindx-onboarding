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

  it("chuẩn hóa kết quả search rút gọn từ API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          results: [
            {
              id: "doc-001",
              title: "Customer Response Template",
              nodePath: "/templates/email",
            },
          ],
        }),
      ),
    );

    const client = new HttpKBClient("https://kb.example");
    const results = await client.search("response", 1);

    expect(results[0]?.matchType).toBe("title");
    expect(results[0]?.document).toMatchObject({
      id: "doc-001",
      title: "Customer Response Template",
      nodePath: "/templates/email",
      content: "",
    });
  });

  it("báo lỗi khi API trả status không thành công", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ error: "bad request" }, { status: 400 })),
    );

    const client = new HttpKBClient("https://kb.example");
    await expect(client.retrieve("doc-001")).rejects.toThrow("bad request");
  });
});
