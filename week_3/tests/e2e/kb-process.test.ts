import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const cliEntry = resolve(projectRoot, "src/cli/main.ts");
const SPAWN_TIMEOUT_MS = 15_000;

function execute(args: string[], env: Record<string, string> = {}) {
  return spawnSync(process.execPath, [cliEntry, ...args], {
    cwd: projectRoot,
    env: { ...process.env, ...env },
    encoding: "utf8",
    timeout: SPAWN_TIMEOUT_MS,
  });
}

describe("kb process", () => {
  it("chạy search với mock client qua tiến trình thật", () => {
    const result = execute(["search", "response", "--top-k", "1"], {
      KB_CLIENT: "mock",
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain("doc-001");
    expect(result.stdout).toContain("Customer Response Template");
  });

  it("trả exit code 1 khi thiếu KB_API_URL ở chế độ http", () => {
    const result = execute(["list", "--node", "/team/devops"], {
      KB_CLIENT: "http",
      KB_API_URL: "",
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("KB_API_URL is required");
  });
});
