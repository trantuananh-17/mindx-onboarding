import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { runKbCli } from "../../src/cli/run-kb-cli";
import { HttpKBClient } from "../../src/kb/http-kb-client";
import { MockKBClient } from "../../src/kb/mock-kb-client";
import {
  startKbApiStub,
  type KbApiStubHandle,
} from "../../src/stub/kb-api-stub";
import { createMockCliIO } from "../helpers/kb-test-doubles";

describe("KB CLI with HttpKBClient", () => {
  let stub: KbApiStubHandle;
  let temporaryDirectory: string;

  beforeEach(async () => {
    stub = await startKbApiStub({ client: new MockKBClient() });
    temporaryDirectory = mkdtempSync(join(tmpdir(), "kb-cli-http-"));
  });

  afterEach(async () => {
    rmSync(temporaryDirectory, { recursive: true, force: true });
    await stub.close();
  });

  async function executeHttp(args: string[]) {
    const io = createMockCliIO();
    const exitCode = await runKbCli(args, {
      client: new HttpKBClient(stub.baseUrl),
      io,
    });
    return { exitCode, io };
  }

  it("chạy search và retrieve qua HTTP stub", async () => {
    const searched = await executeHttp(["search", "devops", "--top-k", "3"]);
    expect(searched.exitCode).toBe(0);
    expect(searched.io.stdout).toHaveBeenCalledWith(
      expect.stringContaining("doc-002"),
    );

    const retrieved = await executeHttp(["retrieve", "doc-002"]);
    expect(retrieved.exitCode).toBe(0);
    expect(retrieved.io.stdout).toHaveBeenCalledWith(
      expect.stringContaining("DevOps On-call Schedule"),
    );
  });

  it("add qua HTTP stub rồi list node mới", async () => {
    const filePath = join(temporaryDirectory, "guide.md");
    writeFileSync(filePath, "# Runbook\n\nRestart service.\n", "utf8");

    const added = await executeHttp([
      "add",
      "--file",
      filePath,
      "--path",
      "/docs/guides",
      "--tags",
      "runbook",
    ]);
    expect(added.exitCode).toBe(0);
    expect(added.io.stdout).toHaveBeenCalledWith(
      expect.stringMatching(/Added document doc-\d+: Runbook/),
    );

    const listed = await executeHttp(["list", "--node", "/docs/guides", "--limit", "5"]);
    expect(listed.exitCode).toBe(0);
    expect(listed.io.stdout).toHaveBeenCalledWith(
      expect.stringContaining("Runbook"),
    );
  });
});
