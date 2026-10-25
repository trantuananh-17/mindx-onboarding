import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { HttpKBClient } from "../../src/kb/http-kb-client";
import { MockKBClient } from "../../src/kb/mock-kb-client";
import {
  startKbApiStub,
  type KbApiStubHandle,
} from "../../src/stub/kb-api-stub";

describe("HttpKBClient against KB API stub", () => {
  let stub: KbApiStubHandle;

  beforeEach(async () => {
    stub = await startKbApiStub({ client: new MockKBClient() });
  });

  afterEach(async () => {
    await stub.close();
  });

  it("search, list, retrieve và add qua HTTP giống mock client", async () => {
    const httpClient = new HttpKBClient(stub.baseUrl);
    const mockClient = new MockKBClient();

    const httpSearch = await httpClient.search("response", 2);
    const mockSearch = await mockClient.search("response", 2);
    expect(httpSearch).toEqual(mockSearch);

    const httpList = await httpClient.list("/team/devops", 5);
    const mockList = await mockClient.list("/team/devops", 5);
    expect(httpList).toEqual(mockList);

    const httpDoc = await httpClient.retrieve("doc-001");
    const mockDoc = await mockClient.retrieve("doc-001");
    expect(httpDoc).toEqual(mockDoc);

    const created = await httpClient.add({
      title: "HTTP FAQ",
      content: "Answer",
      nodePath: "/docs/guides",
      tags: ["faq"],
    });
    expect(created.id).toBe("doc-004");
    await expect(httpClient.retrieve("doc-004")).resolves.toMatchObject({
      title: "HTTP FAQ",
    });
  });

  it("trả lỗi JSON khi request không hợp lệ", async () => {
    const response = await fetch(`${stub.baseUrl}/retrieve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docId: "missing" }),
    });

    expect(response.status).toBe(404);
    const payload = (await response.json()) as { error: string };
    expect(payload.error).toContain("not found");
  });
});
