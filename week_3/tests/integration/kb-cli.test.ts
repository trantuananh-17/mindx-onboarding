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

  it("list theo node và add từ file", async () => {
    const listed = await execute(["list", "--node", "/team/devops", "--limit", "5"]);
    expect(listed.exitCode).toBe(0);
    expect(listed.io.stdout).toHaveBeenCalledWith(
      "doc-002 | DevOps On-call Schedule | /team/devops",
    );

    const filePath = join(temporaryDirectory, "new-template.md");
    writeFileSync(
      filePath,
      "# SMS Alert\n\nYour package has shipped.\n",
      "utf8",
    );

    const added = await execute([
      "add",
      "--file",
      filePath,
      "--path",
      "/templates/sms",
      "--tags",
      "sms,alert",
    ]);

    expect(added.exitCode).toBe(0);
    expect(added.io.stdout).toHaveBeenCalledWith(
      "Added document doc-004: SMS Alert",
    );
  });

  it("in lỗi ra stderr khi thiếu --node", async () => {
    const result = await execute(["list"]);
    expect(result.exitCode).toBe(1);
    expect(result.io.stderr).toHaveBeenCalledWith("node path is required");
  });
});
