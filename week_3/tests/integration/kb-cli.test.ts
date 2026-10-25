import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { runKbCli } from "../../src/cli/run-kb-cli";
import { MockKBClient } from "../../src/kb/mock-kb-client";
import { createMockCliIO } from "../helpers/kb-test-doubles";

describe("KB CLI", () => {
  let temporaryDirectory: string;

  beforeEach(() => {
    temporaryDirectory = mkdtempSync(join(tmpdir(), "kb-cli-"));
  });

  afterEach(() => {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  async function execute(args: string[], client = new MockKBClient()) {
    const io = createMockCliIO();
    const exitCode = await runKbCli(args, { client, io });
    return { exitCode, io, client };
  }

  it("search và retrieve document mẫu", async () => {
    const searched = await execute(["search", "response", "--top-k", "2"]);

    expect(searched.exitCode).toBe(0);
    expect(searched.io.stdout).toHaveBeenCalledWith(
      "doc-001 | title | Customer Response Template | /templates/email",
    );

    const retrieved = await execute(["retrieve", "doc-001"]);
    expect(retrieved.exitCode).toBe(0);
    expect(retrieved.io.stdout).toHaveBeenCalledWith(
      expect.stringContaining("Title: Customer Response Template"),
    );
  });
});
