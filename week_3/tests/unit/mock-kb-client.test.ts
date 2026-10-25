import { describe, expect, it } from "vitest";

import { MockKBClient } from "../../src/kb/mock-kb-client";

describe("MockKBClient", () => {
  it("tìm kiếm theo title và giới hạn topK", async () => {
    const client = new MockKBClient();

    const results = await client.search("response", 1);

    expect(results).toHaveLength(1);
    expect(results[0]?.document.id).toBe("doc-001");
    expect(results[0]?.matchType).toBe("title");
  });

  it("liệt kê document theo nodePath", async () => {
    const client = new MockKBClient();

    const documents = await client.list("/templates/email", 10);

    expect(documents.map((document) => document.id)).toEqual(["doc-001"]);
  });

  it("retrieve trả document đầy đủ hoặc báo không tìm thấy", async () => {
    const client = new MockKBClient();

    const document = await client.retrieve("doc-002");
    expect(document.title).toBe("DevOps On-call Schedule");

    await expect(client.retrieve("missing")).rejects.toThrow(
      "Document missing not found",
    );
  });

  it("add tạo document mới với id tăng dần", async () => {
    const client = new MockKBClient();

    const created = await client.add({
      title: "New FAQ",
      content: "Answer here",
      nodePath: "/docs/guides",
      tags: ["faq", "Guide"],
    });

    expect(created.id).toBe("doc-004");
    expect(created.tags).toEqual(["faq", "guide"]);
    await expect(client.retrieve("doc-004")).resolves.toMatchObject({
      title: "New FAQ",
    });
  });

  it("từ chối query rỗng", async () => {
    const client = new MockKBClient();
    await expect(client.search("   ", 3)).rejects.toThrow(
      "Search query is required",
    );
  });
});
