import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

describe("tickets process", () => {
  let temporaryDirectory: string;
  let dataFile: string;

  beforeEach(() => {
    temporaryDirectory = mkdtempSync(join(tmpdir(), "ticket-e2e-"));
    dataFile = join(temporaryDirectory, "tickets.json");
  });

  afterEach(() => {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  function execute(args: string[]) {
    return spawnSync(
      process.execPath,
      [resolve("src/cli/main.ts"), ...args],
      {
        cwd: resolve("."),
        env: { ...process.env, TICKETS_DATA_FILE: dataFile },
        encoding: "utf8",
      },
    );
  }

  it("chạy luồng create → update → show qua tiến trình thật", () => {
    const created = execute(["create", "--title", "Lỗi đăng nhập"]);
    expect(created.status).toBe(0);
    expect(created.stdout.trim()).toBe("Created ticket #1: Lỗi đăng nhập");
    expect(created.stderr).toBe("");

    const updated = execute(["update", "1", "--status", "closed"]);
    expect(updated.status).toBe(0);
    expect(updated.stdout.trim()).toBe("Updated ticket #1 to closed");

    const shown = execute(["show", "1"]);
    expect(shown.status).toBe(0);
    expect(shown.stdout).toContain("Title: Lỗi đăng nhập");
    expect(shown.stdout).toContain("Status: closed");
  });

  it("trả exit code khác 0 và stderr khi ticket không tồn tại", () => {
    const result = execute(["show", "999"]);

    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr.trim()).toBe("Ticket #999 not found");
  });
});
