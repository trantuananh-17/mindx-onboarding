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
});
